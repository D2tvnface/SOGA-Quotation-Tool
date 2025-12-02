import React, { useState } from 'react';
import QuotationPreview from './components/QuotationPreview';
import QuotationEditor from './components/QuotationEditor';
import { INITIAL_DATA } from './constants';
import { QuotationData } from './types';

function App() {
  const [data, setData] = useState<QuotationData>(INITIAL_DATA);
  const [showEditor, setShowEditor] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 shadow-md no-print z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <i className="fas fa-file-invoice text-xl text-red-500"></i>
             <h1 className="font-bold text-lg hidden sm:block">SOGA Quotation Tool</h1>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={() => setShowEditor(!showEditor)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition flex items-center gap-2"
            >
                <i className={`fas fa-${showEditor ? 'columns' : 'edit'}`}></i> 
                {showEditor ? 'Ẩn Trình Sửa' : 'Sửa Báo Giá'}
            </button>
            <button 
                onClick={() => window.print()} 
                className="bg-brand hover:bg-red-800 px-4 py-2 rounded text-sm font-bold shadow transition flex items-center gap-2"
            >
                <i className="fas fa-print"></i> In / Lưu PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* Editor Sidebar */}
        <div className={`${showEditor ? 'w-full md:w-[400px] lg:w-[450px]' : 'w-0 hidden'} transition-all duration-300 ease-in-out no-print h-[calc(100vh-64px)] overflow-hidden`}>
             <QuotationEditor data={data} onChange={setData} />
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-200 overflow-y-auto h-[calc(100vh-64px)] p-4 md:p-8 print:p-0 print:h-auto print:overflow-visible flex justify-center">
            <div className="w-full max-w-[210mm] print:w-full print:max-w-none">
                <QuotationPreview data={data} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;