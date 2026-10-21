import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Save, 
  Check, 
  FileText,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '../utils/storage';

interface HeaderProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  onSave: () => void;
  onOpenPdfReport: () => void;
  onResetMonth: () => void;
  onDeleteAllAppData: () => void;
  savedIndicator: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalIncome,
  totalExpenses,
  netBalance,
  onSave,
  onOpenPdfReport,
  onResetMonth,
  onDeleteAllAppData,
  savedIndicator
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Zone 1: Brand & User Identity */}
        <div className="flex items-center justify-between md:justify-start gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0 font-bold text-base sm:text-lg ring-2 ring-sky-100">
              م.ط
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  النظام المحاسبي الذكي
                </h1>
                <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md">
                  محمد طالب
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                إدارة المصاريف، المشتريات العائلية والميزانية بالدرهم
              </p>
            </div>
          </div>

          {/* Quick PDF button for mobile view in header */}
          <button
            onClick={onOpenPdfReport}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-rose-600 active:bg-rose-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer ring-2 ring-rose-400/30"
            title="تحميل كشف حساب شامل بتنسيق PDF"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>تقرير PDF</span>
          </button>
        </div>

        {/* Zone 2: Real-time Snapshot KPIs */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-right">
            <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">إجمالي الدخل</span>
              <span className="text-xs font-bold text-emerald-700 tabular-nums">
                {formatCurrency(totalIncome)}
              </span>
            </div>
          </div>

          <div className="w-px h-7 bg-slate-200" />

          <div className="flex items-center gap-2 text-right">
            <div className="p-1.5 rounded-lg bg-rose-100/80 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">المصروفات</span>
              <span className="text-xs font-bold text-rose-700 tabular-nums">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>

          <div className="w-px h-7 bg-slate-200" />

          <div className="flex items-center gap-2 text-right">
            <div className={`p-1.5 rounded-lg ${netBalance >= 0 ? 'bg-sky-100/80 text-sky-700' : 'bg-red-100 text-red-700'}`}>
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">الرصيد الصافي</span>
              <span className={`text-xs font-black tabular-nums ${netBalance >= 0 ? 'text-sky-700' : 'text-red-600'}`}>
                {formatCurrency(netBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 3: Global Action Tools (Cleaned - No CSV, No JSON, No APK, No Install) */}
        <div className="flex items-center gap-2.5 self-end md:self-center flex-wrap">
          {/* Main PDF Report Button - Desktop & Tablet */}
          <button
            onClick={onOpenPdfReport}
            title="تحميل كشف حساب شامل بتنسيق PDF"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-rose-600/30 transition-all active:scale-95 cursor-pointer ring-2 ring-rose-400/30"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>تحميل تقرير PDF شامل</span>
          </button>

          {/* Save Changes Button */}
          <button
            onClick={onSave}
            title="حفظ كافة البيانات الآن"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              savedIndicator 
                ? 'bg-emerald-600 text-white' 
                : 'bg-sky-600 hover:bg-sky-700 text-white hover:shadow-sky-600/20 active:scale-95'
            }`}
          >
            {savedIndicator ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم الحفظ</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>

          {/* Reset Month Button */}
          <button
            onClick={onResetMonth}
            title="تصفير القوائم لبدء شهر محاسبي جديد"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>شهر جديد</span>
          </button>

          {/* Delete All Data Button */}
          <button
            onClick={onDeleteAllAppData}
            title="حذف وحرق كافة بيانات التطبيق بالكامل وتصفير كل الجداول"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
            <span>حذف الكل</span>
          </button>
        </div>

      </div>
    </header>
  );
};
