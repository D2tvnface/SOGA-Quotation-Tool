import React, { useState, useEffect } from 'react';
import QuotationPreview from './components/QuotationPreview';
import QuotationEditor from './components/QuotationEditor';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { INITIAL_DATA } from './constants';
import { QuotationData, DBQuotation, DBUser } from './types';
import { saveQuotation, initDatabase, setConnectionString } from './db';
import { GoogleGenAI } from "@google/genai";
import { 
    configureAuth, 
    handleAuthCallback, 
    getStoredToken, 
    getUserFromToken 
} from './auth';

// Configuration Screen for Keys
const ConfigScreen: React.FC<{ onSave: (clientId: string, neonUrl: string) => void }> = ({ onSave }) => {
    const [clientId, setClientId] = useState('');
    const [neonUrl, setNeonUrl] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-brand">Cấu hình hệ thống (Neon Auth)</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Neon Client ID (OIDC)</label>
                        <input 
                            value={clientId} onChange={e => setClientId(e.target.value)}
                            placeholder="Neon OAuth Client ID"
                            className="w-full border p-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Found in Neon Console > Auth</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Neon Database Connection String</label>
                        <input 
                            value={neonUrl} onChange={e => setNeonUrl(e.target.value)}
                            placeholder="postgresql://neondb_owner:..."
                            type="password"
                            className="w-full border p-2 rounded"
                        />
                         <p className="text-xs text-gray-500 mt-1">Must be the authenticated role connection string</p>
                    </div>
                    <button 
                        onClick={() => onSave(clientId, neonUrl)}
                        className="w-full bg-brand text-white font-bold py-3 rounded mt-4 hover:bg-red-800"
                    >
                        Lưu & Khởi động
                    </button>
                    
                    <div className="text-xs bg-gray-100 p-3 rounded mt-4 text-gray-500">
                        <strong>Redirect URI:</strong> {window.location.origin}<br/>
                        Hãy thêm URL này vào "Allowed Redirect URIs" trong Neon Console.
                    </div>
                </div>
            </div>
        </div>
    );
}

const MainApp: React.FC<{ user: DBUser, token: string }> = ({ user, token }) => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [data, setData] = useState<QuotationData>(INITIAL_DATA);
  const [currentDbId, setCurrentDbId] = useState<number | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize DB on mount
  useEffect(() => {
     const init = async () => {
        try {
            await initDatabase(token);
        } catch (e) {
            console.error("DB Init failed:", e);
        }
     };
     init();
  }, [token]);

  const handleSelectQuotation = (q: DBQuotation | null) => {
    if (q) {
        setData(q.data);
        setCurrentDbId(q.id);
    } else {
        // Create new
        setData(INITIAL_DATA);
        setCurrentDbId(undefined);
    }
    setView('editor');
  };

  const handleBackToDashboard = () => {
      if(confirm("Bạn có chắc muốn quay lại danh sách? Các thay đổi chưa lưu sẽ bị mất.")) {
          setView('dashboard');
      }
  };

  const handleSaveToDb = async () => {
      setIsSaving(true);
      try {
          await saveQuotation(data, user.id, currentDbId, token);
          alert("Lưu báo giá thành công!");
      } catch (e: any) {
          console.error(e);
          alert("Lỗi khi lưu: " + e.message);
      } finally {
          setIsSaving(false);
      }
  };

  const handleAiTranslate = async () => {
    if (!process.env.API_KEY) {
        alert("API Key not configured in environment!");
        return;
    }
    
    if (data.language === 'en') {
        alert("Already in English mode / Đã ở chế độ tiếng Anh.");
        return;
    }

    setIsTranslating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
        You are a professional business translator. Translate the values of the following JSON object from Vietnamese to English.
        
        Strict Rules:
        1. Translate values for these keys ONLY: "name", "description", "unit", "title", "payment", "notes", "projectName".
        2. DO NOT translate keys, IDs, prices, quantities, dates, or company names/addresses.
        3. Keep the JSON structure EXACTLY the same.
        4. Set the "language" field to "en".
        5. Return ONLY the valid JSON string. No markdown formatting.

        JSON Input:
        ${JSON.stringify(data)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const text = response.text;
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const translatedData = JSON.parse(jsonStr);
        
        setData(translatedData);
        alert("Translated successfully to English!");
    } catch (error: any) {
        console.error("Translation error", error);
        alert("AI Translation Failed: " + error.message);
    } finally {
        setIsTranslating(false);
    }
  };

  // View Routing
  if (view === 'dashboard') {
      return <Dashboard onSelectQuotation={handleSelectQuotation} user={user} token={token} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 shadow-md no-print z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button onClick={handleBackToDashboard} className="text-gray-300 hover:text-white mr-2">
                <i className="fas fa-arrow-left"></i>
             </button>
             <i className="fas fa-file-invoice text-xl text-red-500"></i>
             <h1 className="font-bold text-lg hidden sm:block">SOGA Editor</h1>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={handleSaveToDb}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm transition flex items-center gap-2"
            >
                {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                Lưu
            </button>
            <button 
                onClick={handleAiTranslate}
                disabled={isTranslating}
                className={`bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition flex items-center gap-2 ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isTranslating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-language"></i>}
                {isTranslating ? 'Đang dịch...' : 'Dịch AI'}
            </button>
            <button 
                onClick={() => setShowEditor(!showEditor)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition flex items-center gap-2"
            >
                <i className={`fas fa-${showEditor ? 'columns' : 'edit'}`}></i> 
                {showEditor ? 'Ẩn Trình Sửa' : 'Sửa'}
            </button>
            <button 
                onClick={() => window.print()} 
                className="bg-brand hover:bg-red-800 px-4 py-2 rounded text-sm font-bold shadow transition flex items-center gap-2"
            >
                <i className="fas fa-print"></i> In / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden max-w-[1920px] mx-auto w-full">
        <div className={`${showEditor ? 'w-full md:w-[400px] lg:w-[450px]' : 'w-0 hidden'} transition-all duration-300 ease-in-out no-print h-[calc(100vh-64px)] overflow-hidden`}>
             <QuotationEditor data={data} onChange={setData} />
        </div>
        <div className="flex-1 bg-gray-200 overflow-y-auto h-[calc(100vh-64px)] p-4 md:p-8 print:bg-white print:p-0 print:h-auto print:overflow-visible flex justify-center">
            <div className="w-full max-w-[210mm] print:w-full print:max-w-none">
                <QuotationPreview data={data} />
            </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [clientId, setClientId] = useState<string | null>(localStorage.getItem('NEON_CLIENT_ID'));
  const [neonUrl, setNeonUrl] = useState<string | null>(localStorage.getItem('NEON_DATABASE_URL'));
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<DBUser | null>(null);

  useEffect(() => {
      // 1. Handle Config Logic
      if (neonUrl && clientId) {
          setConnectionString(neonUrl);
          configureAuth(clientId, window.location.origin);
      }

      // 2. Handle Auth Callback
      const callbackToken = handleAuthCallback();
      if (callbackToken) {
          setToken(callbackToken);
      }

      // 3. Decode User if Token exists
      const currentToken = callbackToken || token;
      if (currentToken) {
          const u = getUserFromToken(currentToken);
          if (u) setUser(u);
          else {
              // Token invalid
              setToken(null);
              localStorage.removeItem('neon_auth_token');
          }
      }
  }, [token, neonUrl, clientId]);

  const handleConfigSave = (cid: string, nu: string) => {
      if (!cid || !nu) return alert("Vui lòng nhập đủ thông tin");
      localStorage.setItem('NEON_CLIENT_ID', cid);
      localStorage.setItem('NEON_DATABASE_URL', nu);
      setClientId(cid);
      setNeonUrl(nu);
      // Reload to apply config
      window.location.reload();
  };

  if (!clientId || !neonUrl) {
      return <ConfigScreen onSave={handleConfigSave} />;
  }

  if (!user || !token) {
      return <Login />;
  }

  return <MainApp user={user} token={token} />;
}

export default App;