import { Client } from '@neondatabase/serverless';
import { QuotationData, DBQuotation } from './types';

let connectionString = '';

export const setConnectionString = (str: string) => {
    connectionString = str;
};

export const getConnectionString = () => connectionString;

// Helper to get client with Auth Token (Neon Authorize)
const getClient = async (authToken?: string | null) => {
    if (!connectionString) throw new Error("Database configuration missing.");
    
    const config: any = {
        connectionString: connectionString,
    };

    if (authToken) {
        // Neon Auth: The authToken (id_token) is the password
        // We inject it into the connection string parameters
        const url = new URL(connectionString);
        url.password = authToken;
        config.connectionString = url.toString();
    }

    const client = new Client(config);
    await client.connect();
    return client;
};

export const initDatabase = async (authToken?: string | null) => {
    const client = await getClient(authToken);
    try {
        // Create Quotations Table with user_id support
        await client.query(`
            CREATE TABLE IF NOT EXISTS quotations (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL, 
                title TEXT,
                customer_name TEXT,
                data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Add user_id column if it doesn't exist (migration for existing users)
        try {
            await client.query(`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS user_id TEXT;`);
        } catch (e) {
            // Ignore if column exists
        }

    } finally {
        await client.end();
    }
};

export const getQuotations = async (userId: string, authToken?: string | null): Promise<DBQuotation[]> => {
    const client = await getClient(authToken);
    try {
        // Filter by user_id manually (Application-side security)
        // Note: For true RLS, you would configure Policies in Postgres and just SELECT *
        const res = await client.query(
            "SELECT * FROM quotations WHERE user_id = $1 ORDER BY updated_at DESC", 
            [userId]
        );
        return res.rows as DBQuotation[];
    } finally {
        await client.end();
    }
};

export const saveQuotation = async (data: QuotationData, userId: string, id?: number, authToken?: string | null) => {
    const client = await getClient(authToken);
    try {
        const title = data.meta.quoteNumber;
        const customerName = data.customer.companyName;
        
        if (id) {
            // Security: Ensure user owns the record they are updating
            await client.query(
                "UPDATE quotations SET title = $1, customer_name = $2, data = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5",
                [title, customerName, JSON.stringify(data), id, userId]
            );
        } else {
            await client.query(
                "INSERT INTO quotations (title, customer_name, data, user_id) VALUES ($1, $2, $3, $4)",
                [title, customerName, JSON.stringify(data), userId]
            );
        }
    } finally {
        await client.end();
    }
};

export const deleteQuotation = async (id: number, userId: string, authToken?: string | null) => {
    const client = await getClient(authToken);
    try {
        // Security: Ensure user owns the record they are deleting
        await client.query("DELETE FROM quotations WHERE id = $1 AND user_id = $2", [id, userId]);
    } finally {
        await client.end();
    }
};