import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Edit3, 
  Phone, 
  User, 
  Building2, 
  Coins, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  GraduationCap, 
  Users 
} from 'lucide-react';
import { ReligiousPerson } from '../types';
import { formatCurrency, formatInputDateStr, formatToEnNumbers, saveAndDownloadPdf } from '../utils/helpers';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AppointeeCardModalProps {
  person: ReligiousPerson | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (person: ReligiousPerson) => void;
}

export const AppointeeCardModal: React.FC<AppointeeCardModalProps> = ({
  person,
  isOpen,
  onClose,
  onEdit
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !person) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 5, pdfWidth, Math.min(pdfHeight, 285));
      await saveAndDownloadPdf(pdf, `بطاقة_${person.p_ar.replace(/\s+/g, '_')}_CIN_${person.p_cin}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const textInfo = `📋 بطاقة القيم الديني: ${person.p_ar}\n🕌 المسجد: ${person.m_name} (${person.m_city})\n💳 بطاقة التعريف: ${person.p_cin}\n📞 الهاتف: ${person.p_phone}\n💰 التعويض الشهري الإجمالي: ${formatCurrency(person.salary)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `بطاقة القيم الديني - ${person.p_ar}`,
          text: textInfo
        });
      } catch {
        // Fallback or user cancelled
      }
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textInfo)}`;
      window.open(waUrl, '_blank');
    }
  };

  const tasksList = [
    { key: 'imam', label: 'إمامة', value: Number(person.sal_details.imam) || 0 },
    { key: 'khatib', label: 'خطابة الجمعة', value: Number(person.sal_details.khatib) || 0 },
    { key: 'moaden', label: 'الأذان', value: Number(person.sal_details.moaden) || 0 },
    { key: 'cleaner', label: 'العناية والنظافة', value: Number(person.sal_details.cleaner) || 0 },
    { key: 'hizb', label: 'قراءة الحزب الراتب', value: Number(person.sal_details.hizb) || 0 },
    { key: 'hadith', label: 'قراءة وسرد الحديث', value: Number(person.sal_details.hadith) || 0 },
    { key: 'insp', label: 'التفقد والتأطير', value: Number(person.sal_details.insp) || 0 },
  ].filter(t => t.value > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white print:static print:backdrop-none">
      <div 
        className="bg-[#e0e5ec] w-full max-w-4xl rounded-3xl p-5 sm:p-8 shadow-[9px_9px_16px_rgba(163,177,198,0.7),-9px_-9px_16px_rgba(255,255,255,0.8)] border border-white/40 max-h-[92vh] overflow-y-auto relative print:shadow-none print:border-none print:max-h-none print:overflow-visible print:p-0 print:bg-white"
        dir="rtl"
      >
        {/* Top Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">البطاقة الكاملة للقيم الديني</h3>
              <p className="text-xs text-slate-500 font-mono">CIN: {person.p_cin} · {person.p_ar}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="طباعة البطاقة الإدارية"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="تحميل البطاقة بصيغة PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isExporting ? 'جاري التحميل...' : 'تحميل PDF'}</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="مشاركة المعلومات"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">مشاركة</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(person);
              }}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="تعديل البيانات"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">تعديل</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div ref={cardRef} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-6 print:border-none print:shadow-none text-slate-800">
          {/* Official Moroccan Administrative Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
              <span>المملكة المغربية</span>
              <span>وزارة الأوقاف والشؤون الإسلامية</span>
              <span>مندوبية الشؤون الإسلامية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide mt-2">
              بطاقة المعطيات الفردية للقيم الديني
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fiche Individuelle des Renseignements du Préposé Religieux
            </p>
          </div>

          {/* Identity & Basic Header Banner */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">الاسم الكامل</span>
              <h3 className="text-2xl font-bold text-slate-900">{person.p_ar}</h3>
              <p className="text-sm font-semibold text-slate-600 font-sans">{person.p_fr}</p>
            </div>
            <div className="flex flex-wrap sm:flex-col gap-2 sm:text-left text-xs text-slate-600">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-bold">
                CIN: <span className="text-slate-900">{person.p_cin}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-900">{person.p_phone}</span>
              </div>
            </div>
          </div>

          {/* Grid: Personal Info & Family */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>1. المعطيات الشخصية والعائلية</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">تاريخ الإزدياد</span>
                <span className="font-bold text-slate-800 font-mono">{formatInputDateStr(person.p_dob)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">مكان الإزدياد</span>
                <span className="font-bold text-slate-800">{person.p_pob || 'غير محدد'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">الحالة العائلية</span>
                <span className="font-bold text-slate-800">{person.p_status || 'متزوج'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">عدد الزوجات</span>
                <span className="font-bold text-slate-800 font-mono">{person.p_wives || '0'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">إجمالي الأبناء</span>
                <span className="font-bold text-slate-800 font-mono">{person.p_kids || '0'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">الذكور</span>
                <span className="font-bold text-slate-800 font-mono">{person.p_males || '0'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">الإناث</span>
                <span className="font-bold text-slate-800 font-mono">{person.p_females || '0'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">التغطية الصحية</span>
                <span className="font-bold text-emerald-700">{person.p_ins || 'لا يوجد'}</span>
              </div>

              <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">المستوى الدراسي / التكوين</span>
                <span className="font-bold text-slate-800">{person.p_education || 'غير مسجل'}</span>
              </div>
              <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">العنوان الشخصي</span>
                <span className="font-bold text-slate-800">{person.p_personal_addr || 'غير مسجل'}</span>
              </div>
            </div>
          </div>

          {/* Grid: Mosque & Administrative Info */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>2. معلومات المسجد ومكان التعيين</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">اسم المسجد</span>
                <span className="font-bold text-slate-900">{person.m_name}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">رمز المسجد</span>
                <span className="font-bold text-slate-800 font-mono">{person.m_code || 'غير مسجل'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">الجماعة / الدائرة</span>
                <span className="font-bold text-slate-800">{person.m_city || 'غير مسجل'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">تاريخ الالتحاق</span>
                <span className="font-bold text-slate-800 font-mono">{formatInputDateStr(person.m_join_date)}</span>
              </div>

              <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">عنوان المسجد</span>
                <span className="font-bold text-slate-800">{person.m_addr || 'غير مسجل'}</span>
              </div>
              <div className="col-span-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-700 block mb-0.5">مدة الأقدمية بالمسجد</span>
                  <span className="font-bold text-emerald-900">{formatToEnNumbers(person.m_join_date)}</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Tasks & Salary Breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-4 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-700" />
              <span>3. المهام المسندة والمكافآت الشهرية</span>
            </h4>

            {tasksList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                {tasksList.map(t => (
                  <div key={t.key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{t.label}:</span>
                    <span className="font-mono font-bold text-emerald-700">{t.value.toLocaleString('en-US')} درهم</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mb-4">لم يتم تحديد مهام أو تعويضات لهذا القيم الديني بعد.</p>
            )}

            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-xs text-slate-400 block">إجمالي التعويض الشهري المستحق</span>
                <span className="text-xs text-emerald-400">يشمل جميع المهام المزاولة أعلاه</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {formatCurrency(person.salary)}
              </div>
            </div>
          </div>

          {/* Official Signatures footer for print */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-8">توقيع القيم الديني المعني</p>
              <div className="border-b border-dashed border-slate-300 w-36 mx-auto"></div>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-8">خاتم وتأشيرة المندوبية الإقليمية</p>
              <div className="border-b border-dashed border-slate-300 w-36 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Bottom Close Button (Hidden in print) */}
        <div className="mt-6 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            إغلاق البطاقة
          </button>
        </div>
      </div>
    </div>
  );
};
