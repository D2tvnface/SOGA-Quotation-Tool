import React, { useEffect, useState } from 'react';
import { getQuotations, deleteQuotation } from '../db';
import { DBQuotation, QuotationData, DBUser } from '../types';
import { formatCurrency } from '../utils';
import { logout } from '../auth';

interface Props {
    onSelectQuotation: (q: DBQuotation | null) => void;
    user: DBUser;
    token: string;
}

const Dashboard: React.FC<Props> = ({ onSelectQuotation, user, token }) => {
    const [quotations, setQuotations] = useState<DBQuotation[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getQuotations(user.id, token);
            setQuotations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa báo giá này không?")) {
            await deleteQuotation(id, user.id, token);
            loadData();
        }
    };

    const calculateTotal = (data: QuotationData) => {
        let subtotal = 0;
        data.sections.forEach(s => s.items.forEach(i => subtotal += i.price * i.quantity));
        return subtotal + (subtotal * data.vatRate / 100);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý Báo Giá</h1>
                        <p className="text-gray-600">Xin chào, <span className="font-bold">{user.name || user.email}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onSelectQuotation(null)}
                            className="bg-brand hover:bg-red-800 text-white px-4 py-2 rounded shadow transition"
                        >
                            <i className="fas fa-plus mr-2"></i> Tạo báo giá mới
                        </button>
                        <div className="flex items-center gap-2 bg-white p-1 pr-3 rounded-full shadow border">
                             {user.picture ? (
                                <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full" />
                             ) : (
                                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                                    {user.email[0].toUpperCase()}
                                </div>
                             )}
                             <button onClick={logout} className="text-xs text-red-600 hover:underline font-medium">
                                Đăng xuất
                             </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        <i className="fas fa-spinner fa-spin fa-2x text-brand"></i>
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Mã số
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        Dự án
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tổng tiền (VNĐ)
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        Ngày cập nhật
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                                            <i className="fas fa-folder-open text-4xl mb-3 text-gray-300"></i>
                                            <p>Bạn chưa có báo giá nào.</p>
                                        </td>
                                    </tr>
                                ) : quotations.map((q) => (
                                    <tr key={q.id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{q.title}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{q.customer_name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm hidden md:table-cell">
                                            <p className="text-gray-500 whitespace-no-wrap truncate max-w-xs">{q.data.customer.projectName}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-brand font-bold whitespace-no-wrap">
                                                {formatCurrency(calculateTotal(q.data))}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm hidden md:table-cell">
                                            <p className="text-gray-900 whitespace-no-wrap">
                                                {new Date(q.updated_at).toLocaleDateString('vi-VN')}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                                            <button 
                                                onClick={() => onSelectQuotation(q)}
                                                className="text-blue-600 hover:text-blue-900 mr-4 p-2"
                                                title="Sửa"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(q.id)}
                                                className="text-red-600 hover:text-red-900 p-2"
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;