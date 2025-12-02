import React, { useMemo } from 'react';
import { QuotationData } from '../types';
import { formatCurrency, readNumberToWords, readNumberToWordsEn } from '../utils';

interface Props {
  data: QuotationData;
}

const DICTIONARY = {
  vi: {
    title: 'Báo Giá',
    number: 'Số',
    date: 'Ngày',
    validity: 'Hiệu lực',
    days: 'ngày',
    customer: 'Khách hàng',
    contact: 'Người liên hệ',
    project: 'Dự án',
    stt: 'STT',
    itemDesc: 'Hạng mục / Mô tả',
    unit: 'ĐVT',
    qty: 'SL',
    price: 'Đơn giá',
    amount: 'Thành tiền',
    subtotal: 'Cộng tiền hàng',
    vat: 'Thuế VAT',
    total: 'TỔNG CỘNG',
    inWords: 'Bằng chữ',
    paymentTerms: 'Điều khoản thanh toán',
    notes: 'Ghi chú',
    clientRep: 'ĐẠI DIỆN KHÁCH HÀNG',
    signName: '(Ký, ghi rõ họ tên)',
    companyRep: 'ĐẠI DIỆN',
    signSeal: 'Chữ ký / Dấu',
    director: 'GIÁM ĐỐC',
    mission: '"Sứ mệnh của chúng tôi là đánh thức tiềm năng ẩn giấu trong mỗi website. Với kinh nghiệm và công nghệ, chúng tôi biến tài sản số thành cỗ máy sinh lời."'
  },
  en: {
    title: 'Quotation',
    number: 'No.',
    date: 'Date',
    validity: 'Validity',
    days: 'days',
    customer: 'Customer',
    contact: 'Contact Person',
    project: 'Project',
    stt: 'No.',
    itemDesc: 'Item / Description',
    unit: 'Unit',
    qty: 'Qty',
    price: 'Unit Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    vat: 'VAT',
    total: 'TOTAL',
    inWords: 'In words',
    paymentTerms: 'Payment Terms',
    notes: 'Notes',
    clientRep: 'CLIENT REPRESENTATIVE',
    signName: '(Sign & Full Name)',
    companyRep: 'REPRESENTATIVE',
    signSeal: 'Signature / Seal',
    director: 'DIRECTOR',
    mission: '"Our mission is to awaken the hidden potential in every website. With experience and technology, we turn digital assets into profit-generating machines."'
  }
};

const QuotationPreview: React.FC<Props> = ({ data }) => {
  const { company, customer, meta, sections, vatRate, terms, language } = data;
  const t = DICTIONARY[language];

  const totals = useMemo(() => {
    let subtotal = 0;
    sections.forEach(section => {
      section.items.forEach(item => {
        subtotal += item.quantity * item.price;
      });
    });
    const vatAmount = Math.round(subtotal * (vatRate / 100));
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  }, [sections, vatRate]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg relative overflow-hidden print:overflow-visible print:shadow-none print:rounded-none print-container print:p-0 print:px-[15mm] print:pb-[10mm]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row print:flex-row justify-between items-start mb-8 border-b-2 border-gray-200 pb-6">
        <div className="w-full md:w-1/2 print:w-1/2 mb-4 md:mb-0">
          <img src={company.logoUrl} alt="Company Logo" className="h-16 mb-4 object-contain" />
          <h1 className="text-xl font-bold text-gray-800 uppercase">{company.name}</h1>
          <p className="text-xs text-gray-500 mt-2 italic pr-4">
            {t.mission}
          </p>
          
          <div className="mt-4 text-xs text-gray-600 space-y-1">
            <p><i className="fas fa-map-marker-alt w-5 text-center inline-block"></i> {company.address}</p>
            {company.officeAddress && (
                 <p><i className="fas fa-building w-5 text-center inline-block"></i> {company.officeAddress}</p>
            )}
            <p><i className="fas fa-phone w-5 text-center inline-block"></i> {company.phone}</p>
            <p><i className="fas fa-envelope w-5 text-center inline-block"></i> {company.email}</p>
            <p><i className="fas fa-id-card w-5 text-center inline-block"></i> MST: {company.taxId}</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 print:w-1/2 text-right">
          <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-widest mb-2">{t.title}</h2>
          <div className="text-sm">
            <p className="mb-1"><span className="font-bold text-gray-700">{t.number}:</span> {meta.quoteNumber}</p>
            <p className="mb-1"><span className="font-bold text-gray-700">{t.date}:</span> {meta.date}</p>
            <p className="mb-1"><span className="font-bold text-gray-700">{t.validity}:</span> {meta.validityDays} {t.days}</p>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded text-left border-l-4 border-brand">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.customer}</p>
            <h3 className="text-lg font-bold text-brand">{customer.companyName}</h3>
            <p className="text-gray-700 text-sm">{t.contact}: <span className="font-medium">{customer.contactPerson}</span></p>
            <p className="text-gray-700 text-sm">{t.project}: <span className="font-medium">{customer.projectName}</span></p>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white text-sm uppercase">
              <th className="py-3 px-2 text-center rounded-tl-lg w-12">{t.stt}</th>
              <th className="py-3 px-4 text-left">{t.itemDesc}</th>
              <th className="py-3 px-2 text-center w-20">{t.unit}</th>
              <th className="py-3 px-2 text-center w-16">{t.qty}</th>
              <th className="py-3 px-4 text-right w-32">{t.price}</th>
              <th className="py-3 px-4 text-right rounded-tr-lg w-32">{t.amount}</th>
            </tr>
          </thead>
          {sections.map((section, sIndex) => {
              let sectionTotal = 0;
              return (
                  <tbody key={section.id} className="text-gray-700 text-sm break-inside-avoid">
                      <tr className="bg-gray-100 font-bold">
                          <td className="py-2 px-2 text-center">{section.romanIndex}</td>
                          <td className="py-2 px-4" colSpan={5}>{section.title}</td>
                      </tr>
                      {section.items.map((item, iIndex) => {
                          const lineTotal = item.quantity * item.price;
                          sectionTotal += lineTotal;
                          return (
                              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-2 text-center align-top pt-4">
                                      {sIndex + 1}.{iIndex + 1}
                                  </td>
                                  <td className="py-3 px-4 align-top">
                                      <p className="font-bold">{item.name}</p>
                                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-relaxed">{item.description}</p>
                                  </td>
                                  <td className="py-3 px-2 text-center align-top pt-4">{item.unit}</td>
                                  <td className="py-3 px-2 text-center align-top pt-4">{item.quantity}</td>
                                  <td className="py-3 px-4 text-right align-top pt-4">{formatCurrency(item.price)}</td>
                                  <td className="py-3 px-4 text-right font-medium align-top pt-4">{formatCurrency(lineTotal)}</td>
                              </tr>
                          );
                      })}
                  </tbody>
              );
          })}
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-10 break-inside-avoid">
        <div className="w-full md:w-2/3 lg:w-1/2 print:w-1/2">
          <div className="flex justify-between mb-2 text-gray-600 text-sm">
            <span>{t.subtotal}:</span>
            <span className="font-medium">{formatCurrency(totals.subtotal)} VNĐ</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-600 text-sm">
            <span>{t.vat} ({vatRate}%):</span>
            <span className="font-medium">{formatCurrency(totals.vatAmount)} VNĐ</span>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">{t.total}:</span>
            <span className="text-2xl font-bold text-brand">{formatCurrency(totals.total)} VNĐ</span>
          </div>
          <div className="text-right text-xs italic text-gray-500 mt-1">
            ({t.inWords}: {language === 'vi' ? readNumberToWords(totals.total) : readNumberToWordsEn(totals.total)})
          </div>
        </div>
      </div>

      {/* Group Terms and Signature to avoid split page break */}
      <div className="break-inside-avoid">
          {/* Terms & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                  <h4 className="font-bold text-gray-800 mb-2 uppercase text-sm border-b pb-1 border-gray-300">{t.paymentTerms}</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{terms.payment}</p>
              </div>
              <div>
                  <h4 className="font-bold text-gray-800 mb-2 uppercase text-sm border-b pb-1 border-gray-300">{t.notes}</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{terms.notes}</p>
              </div>
          </div>

          {/* Signature */}
          <div className="flex justify-between items-start mt-12 px-8">
              <div className="text-center w-1/2">
                  <p className="font-bold text-gray-800 mb-20">{t.clientRep}</p>
                  <p className="text-sm text-gray-500">{t.signName}</p>
              </div>
              <div className="text-center w-1/2">
                  <p className="font-bold text-gray-800 mb-4">{t.companyRep}</p>
                  {/* Placeholder for Signature Image if needed */}
                  <div className="h-16 w-32 mx-auto mb-2 flex items-center justify-center text-gray-300 border border-dashed rounded">
                      {t.signSeal}
                  </div>
                  <p className="font-bold text-brand">{t.director}</p>
                  <p className="font-bold text-brand uppercase">{company.name}</p>
              </div>
          </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-900 via-red-600 to-red-400 print:fixed print:bottom-0"></div>
    </div>
  );
};

export default QuotationPreview;
