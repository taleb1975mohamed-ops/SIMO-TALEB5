import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  User, 
  Coins, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Download, 
  Upload, 
  Share2, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  Layers, 
  Calendar, 
  ShieldAlert, 
  Eye, 
  Award, 
  Filter,
  FileDown 
} from 'lucide-react';
import { ReligiousPerson, SalaryDetails, TaskType } from './types';
import { 
  loadData, 
  saveData, 
  formatCurrency, 
  formatToEnNumbers, 
  formatInputDateStr, 
  INITIAL_SAMPLE_DATA,
  generateAppointeesListPdf,
  generateComprehensiveStatisticsPdf
} from './utils/helpers';
import { AppointeeCardModal } from './components/AppointeeCardModal';

const EMPTY_FORM: ReligiousPerson = {
  p_ar: '',
  p_fr: '',
  p_cin: '',
  p_phone: '',
  p_dob: '',
  p_pob: '',
  p_personal_addr: '',
  p_status: 'متزوج',
  p_wives: '',
  p_kids: '',
  p_males: '',
  p_females: '',
  p_ins: 'لا يوجد',
  p_education: '',
  m_name: '',
  m_code: '',
  m_addr: '',
  m_city: '',
  m_join_date: '',
  salary: 0,
  sal_details: {
    imam: '',
    khatib: '',
    moaden: '',
    cleaner: '',
    hizb: '',
    hadith: '',
    insp: ''
  }
};

export default function App() {
  const [dataList, setDataList] = useState<ReligiousPerson[]>(() => loadData());
  const [formData, setFormData] = useState<ReligiousPerson>(EMPTY_FORM);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<TaskType>('all');
  
  // Modals & Popups
  const [selectedPerson, setSelectedPerson] = useState<ReligiousPerson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    isAll: boolean;
    targetIndex: number;
    targetName: string;
  }>({
    isOpen: false,
    isAll: false,
    targetIndex: -1,
    targetName: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingListPdf, setIsExportingListPdf] = useState(false);
  const [isExportingStatsPdf, setIsExportingStatsPdf] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with LocalStorage
  useEffect(() => {
    saveData(dataList);
  }, [dataList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Live total salary calculation
  const calculatedSalary = useMemo(() => {
    const s = formData.sal_details;
    return (
      (Number(s.imam) || 0) +
      (Number(s.khatib) || 0) +
      (Number(s.moaden) || 0) +
      (Number(s.cleaner) || 0) +
      (Number(s.hizb) || 0) +
      (Number(s.hadith) || 0) +
      (Number(s.insp) || 0)
    );
  }, [formData.sal_details]);

  // Overall Statistics Dashboard
  const stats = useMemo(() => {
    let imam = 0;
    let khatib = 0;
    let moaden = 0;
    let cleaner = 0;
    let hizb = 0;
    let hadith = 0;
    const mosquesSet = new Set<string>();

    dataList.forEach(item => {
      if (item.m_name && item.m_name.trim()) {
        mosquesSet.add(item.m_name.trim());
      }
      if (Number(item.sal_details.imam) > 0) imam++;
      if (Number(item.sal_details.khatib) > 0) khatib++;
      if (Number(item.sal_details.moaden) > 0) moaden++;
      if (Number(item.sal_details.cleaner) > 0) cleaner++;
      if (Number(item.sal_details.hizb) > 0) hizb++;
      if (Number(item.sal_details.hadith) > 0) hadith++;
    });

    const totalTasksCount = imam + khatib + moaden + cleaner + hizb;

    return {
      imam,
      khatib,
      moaden,
      cleaner,
      hizb,
      hadith,
      mosques: mosquesSet.size,
      total: totalTasksCount,
      peopleCount: dataList.length
    };
  }, [dataList]);

  // Filtered List
  const filteredList = useMemo(() => {
    let list = dataList;

    // Filter by task
    if (taskFilter !== 'all') {
      list = list.filter(item => {
        const val = Number(item.sal_details[taskFilter as keyof SalaryDetails]) || 0;
        return val > 0;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        return (
          (item.p_ar && item.p_ar.toLowerCase().includes(q)) ||
          (item.p_fr && item.p_fr.toLowerCase().includes(q)) ||
          (item.p_cin && item.p_cin.toLowerCase().includes(q)) ||
          (item.p_phone && item.p_phone.toLowerCase().includes(q)) ||
          (item.m_name && item.m_name.toLowerCase().includes(q)) ||
          (item.m_city && item.m_city.toLowerCase().includes(q)) ||
          (item.m_code && item.m_code.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [dataList, searchQuery, taskFilter]);

  // Handle Form Input Change
  const handleTextChange = (field: keyof ReligiousPerson, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalaryChange = (task: keyof SalaryDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      sal_details: {
        ...prev.sal_details,
        [task]: value
      }
    }));
  };

  // Save / Update Handler
  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.p_ar.trim()) {
      showToast('يرجى إدخال الاسم الكامل بالعربية');
      return;
    }

    if (!formData.m_name.trim()) {
      showToast('يرجى إدخال اسم المسجد');
      return;
    }

    const entryToSave: ReligiousPerson = {
      ...formData,
      salary: calculatedSalary
    };

    if (editIndex === -1) {
      setDataList(prev => [entryToSave, ...prev]);
      showToast(`تمت إضافة "${formData.p_ar}" بنجاح!`);
    } else {
      setDataList(prev => {
        const updated = [...prev];
        updated[editIndex] = entryToSave;
        return updated;
      });
      setEditIndex(-1);
      showToast(`تم تحديث بيانات "${formData.p_ar}" بنجاح!`);
    }

    setFormData(EMPTY_FORM);
  };

  // Edit Action
  const handleEdit = (person: ReligiousPerson, index?: number) => {
    const idx = index !== undefined ? index : dataList.findIndex(p => p.p_cin === person.p_cin && p.p_ar === person.p_ar);
    if (idx !== -1) {
      setEditIndex(idx);
      setFormData(dataList[idx]);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      showToast(`جاري تعديل بيانات: ${person.p_ar}`);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditIndex(-1);
    setFormData(EMPTY_FORM);
  };

  // Delete Confirm Dialog Handlers
  const openDeleteModal = (index: number, name: string) => {
    setDeleteModalState({
      isOpen: true,
      isAll: false,
      targetIndex: index,
      targetName: name
    });
  };

  const openDeleteAllModal = () => {
    setDeleteModalState({
      isOpen: true,
      isAll: true,
      targetIndex: -1,
      targetName: 'جميع السجلات'
    });
  };

  const handleExecuteDelete = () => {
    if (deleteModalState.isAll) {
      setDataList([]);
      localStorage.removeItem('rel_data');
      showToast('تم حذف وتفريغ جميع السجلات بنجاح!');
    } else {
      const idx = deleteModalState.targetIndex;
      if (idx >= 0 && idx < dataList.length) {
        const deletedName = dataList[idx].p_ar;
        setDataList(prev => prev.filter((_, i) => i !== idx));
        if (editIndex === idx) {
          handleCancelEdit();
        }
        showToast(`تم حذف "${deletedName}" بنجاح`);
      }
    }
    setDeleteModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Export & Import Backup JSON
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(dataList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نسخة_احتياطية_القيمين_الدينيين_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('تم تحميل النسخة الاحتياطية بنجاح!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setDataList(parsed);
          showToast(`تم استرجاع ${parsed.length} سجل بنجاح!`);
        } else {
          showToast('صيغة الملف غير متوافقة');
        }
      } catch {
        showToast('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSampleData = () => {
    setDataList(INITIAL_SAMPLE_DATA);
    showToast('تم تحميل البيانات النموذجية بنجاح!');
  };

  const handleDownloadListPdf = async () => {
    if (filteredList.length === 0) {
      showToast('لا توجد بيانات لتحميلها في ملف PDF');
      return;
    }
    try {
      setIsExportingListPdf(true);
      showToast('جاري إعداد وتحميل ملف PDF...');
      
      const tabLabels: Record<string, string> = {
        all: 'جميع القيمين الدينيين',
        imam: 'الأئمة',
        khatib: 'الخطباء',
        moaden: 'المؤذنين',
        cleaner: 'المنظفين',
        hizb: 'قراء الحزب',
        hadith: 'رواة الحديث',
      };
      const filterTitle = tabLabels[taskFilter] || 'الكل';

      const success = await generateAppointeesListPdf(filteredList, filterTitle);
      if (success) {
        showToast('تم تحميل لائحة القيمين الدينيين بصيغة PDF بنجاح!');
      } else {
        showToast('حدث خطأ أثناء استخراج ملف PDF');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('تعذر استخراج ملف PDF');
    } finally {
      setIsExportingListPdf(false);
    }
  };

  const handleDownloadStatsPdf = async () => {
    if (dataList.length === 0) {
      showToast('لا توجد بيانات لاستخراج تقرير الإحصائيات');
      return;
    }
    try {
      setIsExportingStatsPdf(true);
      showToast('جاري إعداد وتحميل تقرير الإحصائيات الشاملة PDF...');
      const success = await generateComprehensiveStatisticsPdf(dataList);
      if (success) {
        showToast('تم تحميل تقرير الإحصائيات الشاملة بصيغة PDF بنجاح!');
      } else {
        showToast('حدث خطأ أثناء استخراج تقرير الإحصائيات');
      }
    } catch (err) {
      console.error('Stats PDF export error:', err);
      showToast('تعذر استخراج تقرير الإحصائيات');
    } finally {
      setIsExportingStatsPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#444] font-sans p-3 sm:p-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2c3e50] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold border border-white/20 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto">
        {/* Top Header Bar */}
        <header className="bg-[#e0e5ec] rounded-3xl p-5 sm:p-6 mb-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.7)] border border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#27ae60] text-white flex items-center justify-center shadow-[4px_4px_10px_rgba(39,174,96,0.4)]">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2c3e50]">
                منظومة إدارة القيمين الدينيين
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                تدبير شؤون الأئمة، الخطباء، المؤذنين، المنظفين والتعويضات الشهرية بالمساجد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 bg-[#e0e5ec] hover:bg-[#d6dbe3] text-slate-700 text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all flex items-center gap-1.5 cursor-pointer"
              title="تصدير نسخة احتياطية"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>نسخة احتياطية</span>
            </button>

            <label className="px-3.5 py-2 bg-[#e0e5ec] hover:bg-[#d6dbe3] text-slate-700 text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>استرجاع</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            {dataList.length === 0 && (
              <button
                onClick={handleLoadSampleData}
                className="px-3.5 py-2 bg-[#27ae60] hover:bg-[#219653] text-white text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(39,174,96,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تحميل بيانات نموذجية</span>
              </button>
            )}
          </div>
        </header>

        {/* 1. Statistics Cards (لوحة الإحصائيات الشاملة) */}
        <div className="bg-[#e0e5ec] rounded-3xl p-5 sm:p-6 mb-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.7)] border border-white/40">
          <div className="border-b-2 border-slate-300/40 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg font-bold text-[#2c3e50] flex items-center gap-2 m-0">
              <span>📊</span>
              <span>لوحة الإحصائيات الشاملة</span>
            </h3>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-normal text-slate-500 hidden sm:inline">
                إجمالي السجلات: <b className="font-mono text-slate-800">{stats.peopleCount}</b> قيم ديني
              </span>

              <button
                type="button"
                onClick={handleDownloadStatsPdf}
                disabled={dataList.length === 0 || isExportingStatsPdf}
                className="px-3.5 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs font-bold rounded-xl shadow-[3px_3px_8px_rgba(44,62,80,0.35)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 active:scale-95"
                title="تحميل تقرير الإحصائيات الشاملة بصيغة PDF"
              >
                {isExportingStatsPdf ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{isExportingStatsPdf ? 'جاري التحميل...' : 'تحميل الإحصائيات PDF'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">الأئمة</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.imam.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">الخطباء</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.khatib.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">المؤذنين</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.moaden.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">المنظفين</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.cleaner.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">قراء الحزب</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.hizb.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#27ae60]">
              <span className="text-xs text-slate-600 font-bold block mb-1">رواة الحديث</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.hadith.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#3498db]">
              <span className="text-xs text-slate-600 font-bold block mb-1">إجمالي المساجد</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.mosques.toLocaleString('en-US')}
              </b>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] border-t-4 border-[#2c3e50]">
              <span className="text-xs text-slate-600 font-bold block mb-1">إجمالي المهام</span>
              <b className="text-xl sm:text-2xl text-[#2c3e50] font-mono block">
                {stats.total.toLocaleString('en-US')}
              </b>
            </div>
          </div>
        </div>

        {/* 2. Main Entry Form (نموذج إدخال وتعديل البيانات) */}
        <form onSubmit={handleSaveData} ref={formRef} className="print:hidden">
          {/* Mosque Info Card */}
          <div className="bg-[#e0e5ec] rounded-3xl p-5 sm:p-6 mb-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.7)] border border-white/40">
            <h3 className="text-base sm:text-lg font-bold text-[#2c3e50] border-b-2 border-slate-300/40 pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🕌</span>
                <span>معلومات المسجد</span>
              </span>
              {formData.m_join_date && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  الأقدمية المحتسبة: {formatToEnNumbers(formData.m_join_date)}
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">
                  اسم المسجد <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مسجد النور"
                  value={formData.m_name}
                  onChange={(e) => handleTextChange('m_name', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">رمز المسجد</label>
                <input
                  type="text"
                  placeholder="مثال: MS-102"
                  value={formData.m_code}
                  onChange={(e) => handleTextChange('m_code', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">عنوان المسجد</label>
                <input
                  type="text"
                  placeholder="شارع / حي"
                  value={formData.m_addr}
                  onChange={(e) => handleTextChange('m_addr', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">الجماعة</label>
                <input
                  type="text"
                  placeholder="اسم الجماعة أو الملحقة"
                  value={formData.m_city}
                  onChange={(e) => handleTextChange('m_city', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">تاريخ الالتحاق</label>
                <input
                  type="date"
                  lang="en"
                  value={formData.m_join_date}
                  onChange={(e) => handleTextChange('m_join_date', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Personal & Family Info Card */}
          <div className="bg-[#e0e5ec] rounded-3xl p-5 sm:p-6 mb-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.7)] border border-white/40">
            <h3 className="text-base sm:text-lg font-bold text-[#2c3e50] border-b-2 border-slate-300/40 pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>👤</span>
                <span>المعطيات الشخصية والعائلية</span>
              </span>
              {editIndex !== -1 && (
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل السجل رقم {editIndex + 1}</span>
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
              <div className="lg:col-span-2">
                <label className="block mb-1.5 font-bold text-xs text-[#555]">
                  الاسم الكامل (Ar) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="محمد العلوي"
                  value={formData.p_ar}
                  onChange={(e) => handleTextChange('p_ar', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40 font-bold text-slate-800"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block mb-1.5 font-bold text-xs text-[#555]">Nom Complet (Fr)</label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Mohammed Alaoui"
                  value={formData.p_fr}
                  onChange={(e) => handleTextChange('p_fr', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">رقم البطاقة (CIN)</label>
                <input
                  type="text"
                  placeholder="A123456"
                  value={formData.p_cin}
                  onChange={(e) => handleTextChange('p_cin', e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 uppercase font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">رقم الهاتف</label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="06XXXXXXXX"
                  value={formData.p_phone}
                  onChange={(e) => handleTextChange('p_phone', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">تاريخ الإزدياد</label>
                <input
                  type="date"
                  lang="en"
                  value={formData.p_dob}
                  onChange={(e) => handleTextChange('p_dob', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">مكان الإزدياد</label>
                <input
                  type="text"
                  placeholder="المدينة / الإقليم"
                  value={formData.p_pob}
                  onChange={(e) => handleTextChange('p_pob', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block mb-1.5 font-bold text-xs text-[#555]">العنوان الشخصي</label>
                <input
                  type="text"
                  placeholder="مقر السكن العائلي"
                  value={formData.p_personal_addr}
                  onChange={(e) => handleTextChange('p_personal_addr', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">الحالة العائلية</label>
                <select
                  value={formData.p_status}
                  onChange={(e) => handleTextChange('p_status', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40 cursor-pointer"
                >
                  <option value="متزوج">متزوج</option>
                  <option value="عازب">عازب</option>
                  <option value="أرمل">أرمل</option>
                  <option value="مطلق">مطلق</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">عدد الزوجات</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.p_wives}
                  onChange={(e) => handleTextChange('p_wives', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">إجمالي الأبناء</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.p_kids}
                  onChange={(e) => handleTextChange('p_kids', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">عدد الذكور</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.p_males}
                  onChange={(e) => handleTextChange('p_males', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">عدد الإناث</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.p_females}
                  onChange={(e) => handleTextChange('p_females', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-[#555]">التغطية الصحية</label>
                <select
                  value={formData.p_ins}
                  onChange={(e) => handleTextChange('p_ins', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40 cursor-pointer font-bold"
                >
                  <option value="لا يوجد">لا يوجد</option>
                  <option value="CNOPS">CNOPS</option>
                  <option value="CNSS">CNSS</option>
                  <option value="AMO">AMO</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block mb-1.5 font-bold text-xs text-[#555]">المستوى الدراسي والتكوين</label>
                <input
                  type="text"
                  placeholder="شهادة البكالوريا / التعليم العتيق / إجازة"
                  value={formData.p_education}
                  onChange={(e) => handleTextChange('p_education', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
                />
              </div>
            </div>

            {/* Tasks & Salaries */}
            <div className="mt-8 border-t border-slate-300/40 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h4 className="text-sm font-bold text-[#27ae60] flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span>💰 المهام والرواتب (التعويضات الشهرية بالدرهم)</span>
                </h4>
                <div className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl font-bold border border-emerald-200">
                  مجموع التعويض الشهري: <span className="font-mono text-base">{calculatedSalary.toLocaleString('en-US')}</span> درهم
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">إمامة</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.imam}
                    onChange={(e) => handleSalaryChange('imam', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">خطابة</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.khatib}
                    onChange={(e) => handleSalaryChange('khatib', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">أذان</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.moaden}
                    onChange={(e) => handleSalaryChange('moaden', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">نظافة</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.cleaner}
                    onChange={(e) => handleSalaryChange('cleaner', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">حزب</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.hizb}
                    onChange={(e) => handleSalaryChange('hizb', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">حديث</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.hadith}
                    onChange={(e) => handleSalaryChange('hadith', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-[#555]">تفقد</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sal_details.insp}
                    onChange={(e) => handleSalaryChange('insp', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none font-mono focus:ring-2 focus:ring-[#27ae60]/40 text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#27ae60] hover:bg-[#219653] text-white font-bold text-sm shadow-[6px_6px_14px_rgba(39,174,96,0.35),-6px_-6px_14px_rgba(255,255,255,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>{editIndex === -1 ? 'حفظ البيانات وإظهار الجدول' : 'تحديث البيانات وحفظ التعديلات'}</span>
              </button>

              {editIndex !== -1 && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold text-sm shadow-[4px_4px_10px_rgba(163,177,198,0.5)] transition-all cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </div>
        </form>

        {/* 3. Directory Table Section (سجل وجدول القيمين الدينيين) */}
        <div className="bg-[#e0e5ec] rounded-3xl p-5 sm:p-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.7)] border border-white/40 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2c3e50] flex items-center gap-2">
                <span>📋</span>
                <span>سجل القيمين الدينيين بالمساجد</span>
              </h3>
              <p className="text-xs text-slate-500">
                انقر على اسم القيم الديني لعرض أو طباعة بطاقته الإدارية الكاملة
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadListPdf}
                disabled={filteredList.length === 0 || isExportingListPdf}
                className="px-4 py-2 bg-[#27ae60] hover:bg-[#219653] text-white text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(39,174,96,0.35)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 active:scale-95"
                title="تحميل لائحة وسجل القيمين الدينيين بصيغة PDF"
              >
                {isExportingListPdf ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                <span>{isExportingListPdf ? 'جاري التحميل...' : 'تحميل PDF'}</span>
              </button>

              {dataList.length > 0 && (
                <button
                  type="button"
                  onClick={openDeleteAllModal}
                  className="px-3.5 py-2 bg-[#e74c3c] hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(231,76,60,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف جميع البيانات</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 ابحث بالاسم، رقم البطاقة CIN، اسم المسجد، الجماعة، أو رقم الهاتف..."
              className="w-full pr-11 pl-4 py-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] outline-none text-sm border-none focus:ring-2 focus:ring-[#27ae60]/40"
            />
          </div>

          {/* Quick Task Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
            <span className="text-xs font-bold text-slate-500 ml-2 whitespace-nowrap">تصفية حسب:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'imam', label: 'الأئمة' },
              { id: 'khatib', label: 'الخطباء' },
              { id: 'moaden', label: 'المؤذنين' },
              { id: 'cleaner', label: 'المنظفين' },
              { id: 'hizb', label: 'قراء الحزب' },
              { id: 'hadith', label: 'رواة الحديث' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTaskFilter(tab.id as TaskType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  taskFilter === tab.id
                    ? 'bg-[#27ae60] text-white shadow-md'
                    : 'bg-[#e0e5ec] text-slate-600 hover:text-slate-900 shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.7)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Responsive Table */}
          {filteredList.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full border-separate border-spacing-y-3 min-w-[950px] text-sm">
                <thead>
                  <tr className="text-xs font-bold text-[#2c3e50]">
                    <th className="p-3 text-right">الاسم الكامل</th>
                    <th className="p-3 text-center">رقم الهاتف</th>
                    <th className="p-3 text-center">المسجد والجماعة</th>
                    <th className="p-3 text-center">رقم CIN</th>
                    <th className="p-3 text-center">الأقدمية</th>
                    <th className="p-3 text-center">الراتب الإجمالي</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item, index) => {
                    const originalIndex = dataList.indexOf(item);
                    return (
                      <tr key={index} className="group transition-transform hover:scale-[1.003]">
                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] rounded-r-2xl border-r-4 border-r-[#27ae60]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPerson(item);
                              setIsModalOpen(true);
                            }}
                            className="font-bold text-[#27ae60] hover:text-[#219653] hover:underline cursor-pointer text-right flex flex-col items-start"
                            title="عرض البطاقة الكاملة للقيم الديني"
                          >
                            <span className="text-sm font-bold">{item.p_ar}</span>
                            <span className="text-[11px] text-slate-500 font-sans font-normal">{item.p_fr}</span>
                          </button>
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] text-center font-mono text-xs font-bold text-slate-700" dir="ltr">
                          {item.p_phone || '—'}
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] text-center">
                          <span className="font-bold text-slate-800 block text-xs">{item.m_name}</span>
                          {item.m_city && (
                            <span className="text-[11px] text-slate-500 block">{item.m_city}</span>
                          )}
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] text-center font-mono text-xs font-bold uppercase text-slate-800">
                          {item.p_cin || '—'}
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] text-center font-bold text-xs text-slate-700">
                          {formatToEnNumbers(item.m_join_date)}
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] text-center font-mono font-bold text-[#27ae60]">
                          {(item.salary || 0).toLocaleString('en-US')} درهم
                        </td>

                        <td className="p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] rounded-l-2xl text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedPerson(item);
                                setIsModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                              title="عرض البطاقة"
                            >
                              البطاقة
                            </button>

                            <button
                              onClick={() => handleEdit(item, originalIndex)}
                              className="px-2.5 py-1.5 bg-[#f39c12] hover:bg-[#d68910] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                              title="تعديل السجل"
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() => openDeleteModal(originalIndex, item.p_ar)}
                              className="px-2.5 py-1.5 bg-[#e74c3c] hover:bg-[#c0392b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                              title="حذف"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500 bg-[#e0e5ec] rounded-2xl shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]">
              <p className="text-base font-bold text-slate-600 mb-2">لا توجد سجلات مطابقة للبحث</p>
              <p className="text-xs text-slate-400 mb-4">
                قم بإدخال بيانات قيم ديني جديد من خلال النموذج أعلاه أو قم بتحميل نماذج جاهزة
              </p>
              {dataList.length === 0 && (
                <button
                  onClick={handleLoadSampleData}
                  className="px-4 py-2 bg-[#27ae60] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحميل نماذج مساجد وقيمين دينيين</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Full Appointee Card Modal (البطاقة الكاملة للقيم الديني) */}
      <AppointeeCardModal
        person={selectedPerson}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
        }}
        onEdit={(person) => handleEdit(person)}
      />

      {/* 5. Custom Safe Confirmation Modal for Deletions */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#e0e5ec] max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/50 text-slate-800 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-[#2c3e50] mb-2">
              {deleteModalState.isAll ? 'تأكيد حذف جميع البيانات' : 'تأكيد حذف القيم الديني'}
            </h3>

            <p className="text-xs text-center text-slate-600 mb-6 leading-relaxed">
              {deleteModalState.isAll ? (
                <>
                  تحذير: هل أنت متأكد تماماً من رغبتك في حذف وحرق <b>جميع البيانات والسجلات</b> وتصفير النظام نهائياً؟
                  <br />
                  <span className="text-rose-600 font-bold block mt-1">لا يمكن التراجع عن هذا الإجراء.</span>
                </>
              ) : (
                <>
                  هل أنت متأكد من رغبتك في حذف سجل القيم الديني: <b>"{deleteModalState.targetName}"</b>؟
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#e74c3c] hover:bg-[#c0392b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                نعم، تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
