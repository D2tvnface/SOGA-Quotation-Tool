import React from 'react';
import { loginWithNeon } from '../auth';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-8 text-center">
                    <img src="https://vuottroi.vn/public/images/logo-new.png" alt="SOGA" className="h-16 mx-auto mb-4 object-contain" />
                    <h1 className="text-2xl font-bold text-brand uppercase">SOGA QUOTATION TOOL</h1>
                    <p className="text-gray-600 mt-2">Đăng nhập để quản lý báo giá</p>
                </div>
                
                <button 
                    onClick={loginWithNeon}
                    className="w-full bg-black text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-lg"
                >
                    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm-1.5 0c0-4.971-4.029-9-9-9s-9 4.029-9 9 4.029 9 9 9 9-4.029 9-9z" fillOpacity=".2"/>
                        <path d="M12 4.5c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5z"/>
                    </svg>
                    Sign in with Neon
                </button>
                
                <div className="mt-8 text-xs text-gray-500 text-center">
                    Hệ thống sử dụng bảo mật Neon Auth.<br/>
                    Vui lòng đảm bảo bạn đã cấu hình Neon OAuth.
                </div>
            </div>
        </div>
    );
};

export default Login;