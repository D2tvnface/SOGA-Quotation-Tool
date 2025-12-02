import React, { useState } from 'react';
import { QuotationData, Section, LineItem } from '../types';
import { generateId, toRoman } from '../utils';

interface Props {
  data: QuotationData;
  onChange: (newData: QuotationData) => void;
}

const QuotationEditor: React.FC<Props> = ({ data, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCustomerChange = (field: string, value: string) => {
    onChange({
      ...data,
      customer: { ...data.customer, [field]: value }
    });
  };

  const handleMetaChange = (field: string, value: any) => {
    onChange({
      ...data,
      meta: { ...data.meta, [field]: value }
    });
  };

  const handleItemChange = (sectionId: string, itemId: string, field: keyof LineItem, value: any) => {
    const newSections = data.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, [field]: value };
        })
      };
    });
    onChange({ ...data, sections: newSections });
  };

  const handleSectionTitleChange = (sectionId: string, value: string) => {
    const newSections = data.sections.map(sec => 
      sec.id === sectionId ? { ...sec, title: value } : sec
    );
    onChange({ ...data, sections: newSections });
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      romanIndex: toRoman(data.sections.length + 1),
      title: 'HẠNG MỤC MỚI',
      items: []
    };
    onChange({ ...data, sections: [...data.sections, newSection] });
  };

  const deleteSection = (id: string) => {
    if(confirm('Xóa mục này?')) {
        const remainingSections = data.sections.filter(s => s.id !== id);
        // Re-index remaining sections
        const reindexedSections = remainingSections.map((sec, index) => ({
            ...sec,
            romanIndex: toRoman(index + 1)
        }));
        onChange({ ...data, sections: reindexedSections });
    }
  };

  const addItem = (sectionId: string) => {
    const newItem: LineItem = {
      id: generateId(),
      name: 'Hạng mục mới',
      description: '',
      unit: 'Gói',
      quantity: 1,
      price: 0
    };
    const newSections = data.sections.map(sec => 
      sec.id === sectionId ? { ...sec, items: [...sec.items, newItem] } : sec
    );
    onChange({ ...data, sections: newSections });
  };

  const deleteItem = (sectionId: string, itemId: string) => {
     const newSections = data.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.filter(item => item.id !== itemId)
      };
    });
    onChange({ ...data, sections: newSections });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Set a custom drag image if needed, but default is usually fine
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newSections = [...data.sections];
    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, draggedItem);

    // Auto update Roman Indices based on new position
    const reindexedSections = newSections.map((sec, idx) => ({
        ...sec,
        romanIndex: toRoman(idx + 1)
    }));

    onChange({ ...data, sections: reindexedSections });
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-y-auto border-r border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-brand">Chỉnh sửa thông tin</h2>

      {/* General Info */}
      <div className="mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700 border-b pb-1">Thông tin chung</h3>
        <input 
          className="w-full border p-2 rounded text-sm bg-white text-gray-900" 
          placeholder="Số báo giá" 
          value={data.meta.quoteNumber} 
          onChange={e => handleMetaChange('quoteNumber', e.target.value)}
        />
        <input 
          className="w-full border p-2 rounded text-sm bg-white text-gray-900" 
          placeholder="Ngày báo giá" 
          value={data.meta.date} 
          onChange={e => handleMetaChange('date', e.target.value)}
        />
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">VAT (%):</label>
            <input 
            type="number"
            className="w-20 border p-2 rounded text-sm bg-white text-gray-900" 
            value={data.vatRate} 
            onChange={e => onChange({...data, vatRate: Number(e.target.value)})}
            />
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700 border-b pb-1">Khách hàng</h3>
        <input 
          className="w-full border p-2 rounded text-sm bg-white text-gray-900" 
          placeholder="Tên công ty" 
          value={data.customer.companyName} 
          onChange={e => handleCustomerChange('companyName', e.target.value)}
        />
        <input 
          className="w-full border p-2 rounded text-sm bg-white text-gray-900" 
          placeholder="Người liên hệ" 
          value={data.customer.contactPerson} 
          onChange={e => handleCustomerChange('contactPerson', e.target.value)}
        />
         <input 
          className="w-full border p-2 rounded text-sm bg-white text-gray-900" 
          placeholder="Dự án" 
          value={data.customer.projectName} 
          onChange={e => handleCustomerChange('projectName', e.target.value)}
        />
      </div>

      {/* Sections & Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center border-b pb-1 mb-3">
            <h3 className="font-semibold text-gray-700">Chi tiết báo giá</h3>
            <button onClick={addSection} className="text-xs bg-brand text-white px-2 py-1 rounded hover:bg-red-800">+ Mục lớn</button>
        </div>
        
        {data.sections.map((section, idx) => (
          <div 
            key={section.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`mb-6 bg-gray-50 p-3 rounded border border-gray-200 transition-opacity ${draggedIndex === idx ? 'opacity-50 border-dashed border-brand' : ''}`}
          >
            <div className="flex gap-2 mb-2 items-center">
                 {/* Drag Handle */}
                 <div className="cursor-grab text-gray-400 hover:text-gray-600 px-1" title="Kéo để sắp xếp">
                    <i className="fas fa-grip-vertical"></i>
                 </div>

                 <input 
                    className="w-10 border p-1 rounded text-sm font-bold text-center bg-white text-gray-900" 
                    value={section.romanIndex} 
                    onChange={e => {
                        const newSections = [...data.sections];
                        newSections[idx].romanIndex = e.target.value;
                        onChange({ ...data, sections: newSections });
                    }}
                />
                <input 
                    className="flex-1 border p-1 rounded text-sm font-bold bg-white text-gray-900" 
                    value={section.title} 
                    onChange={e => handleSectionTitleChange(section.id, e.target.value)}
                />
                <button onClick={() => deleteSection(section.id)} className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                </button>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-gray-300">
                {section.items.map(item => (
                    <div key={item.id} className="relative group bg-white p-2 rounded shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                             <input 
                                className="w-full border-b border-dashed p-1 text-sm font-medium focus:outline-none focus:border-brand bg-white text-gray-900" 
                                placeholder="Tên hạng mục"
                                value={item.name} 
                                onChange={e => handleItemChange(section.id, item.id, 'name', e.target.value)}
                            />
                            <textarea 
                                className="w-full border p-1 text-xs text-gray-900 bg-white rounded" 
                                rows={2}
                                placeholder="Mô tả..."
                                value={item.description}
                                onChange={e => handleItemChange(section.id, item.id, 'description', e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <input 
                                    className="border p-1 text-xs rounded bg-white text-gray-900" 
                                    placeholder="ĐVT"
                                    value={item.unit} 
                                    onChange={e => handleItemChange(section.id, item.id, 'unit', e.target.value)}
                                />
                                <input 
                                    type="number"
                                    className="border p-1 text-xs rounded bg-white text-gray-900" 
                                    placeholder="SL"
                                    value={item.quantity} 
                                    onChange={e => handleItemChange(section.id, item.id, 'quantity', Number(e.target.value))}
                                />
                                <input 
                                    type="number"
                                    className="border p-1 text-xs rounded bg-white text-gray-900" 
                                    placeholder="Đơn giá"
                                    value={item.price} 
                                    onChange={e => handleItemChange(section.id, item.id, 'price', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteItem(section.id, item.id)}
                            className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <i className="fas fa-times-circle"></i>
                        </button>
                    </div>
                ))}
                 <button onClick={() => addItem(section.id)} className="text-xs text-brand hover:underline mt-2">
                    + Thêm hàng
                </button>
            </div>
          </div>
        ))}
      </div>

       {/* Terms */}
       <div className="mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700 border-b pb-1">Điều khoản & Ghi chú</h3>
        <div className="space-y-1">
             <label className="text-xs font-bold text-gray-500">Thanh toán</label>
            <textarea 
            className="w-full border p-2 rounded text-sm h-24 bg-white text-gray-900" 
            value={data.terms.payment} 
            onChange={e => onChange({...data, terms: {...data.terms, payment: e.target.value}})}
            />
        </div>
        <div className="space-y-1">
             <label className="text-xs font-bold text-gray-500">Ghi chú</label>
            <textarea 
            className="w-full border p-2 rounded text-sm h-24 bg-white text-gray-900" 
            value={data.terms.notes} 
            onChange={e => onChange({...data, terms: {...data.terms, notes: e.target.value}})}
            />
        </div>
      </div>

    </div>
  );
};

export default QuotationEditor;