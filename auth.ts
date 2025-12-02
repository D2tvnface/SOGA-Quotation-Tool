import { DBUser } from './types';
import { jwtDecode } from 'jwt-decode';

const AUTH_URL = 'https://oauth2.neon.tech/oauth2/auth';
const STORAGE_KEY = 'neon_auth_token';

let neonClientId = '';
let neonRedirectUri = '';

export const configureAuth = (clientId: string, redirectUri: string) => {
    neonClientId = clientId;
    neonRedirectUri = redirectUri;
};

export const loginWithNeon = () => {
    if (!neonClientId || !neonRedirectUri) {
        alert("Chưa cấu hình Client ID hoặc Redirect URI");
        return;
    }

    // OIDC Implicit Flow to get ID Token directly
    const params = new URLSearchParams({
        client_id: neonClientId,
        redirect_uri: neonRedirectUri,
        response_type: 'id_token', // We need the id_token to use as password
        scope: 'openid email profile',
        nonce: Math.random().toString(36).substring(7)
    });

    window.location.href = `${AUTH_URL}?${params.toString()}`;
};

export const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
};

export const handleAuthCallback = (): string | null => {
    // Neon returns token in the hash: #id_token=...
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (idToken) {
        localStorage.setItem(STORAGE_KEY, idToken);
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
        return idToken;
    }
    return null;
};

export const getStoredToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
};

export const getUserFromToken = (token: string): DBUser | null => {
    try {
        const decoded: any = jwtDecode(token);
        return {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
        };
    } catch (e) {
        console.error("Invalid Token", e);
        return null;
    }
};