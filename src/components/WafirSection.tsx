import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  ShieldCheck, 
  Landmark, 
  Users, 
  Target, 
  Sparkles,
  TrendingUp,
  Tag
} from 'lucide-react';
import { WafirItem } from '../types';
import { formatCurrency, generateId } from '../utils/storage';

interface WafirSectionProps {
  wafir: WafirItem[];
  totalIncome?: number;
  onAdd: (item: WafirItem) => void;
  onUpdate: (item: WafirItem) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onConfirmModal: (title: string, message: string, onConfirm: () => void) => void;
}

const WAFIR_CATEGORIES = [
  { id: 'طوارئ', label: 'صندوق الطوارئ', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'ادخار بنكي', label: 'ادخار بنكي', icon: Landmark, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'دارت/قرعة', label: 'دارت / قرعة عائلية', icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'صندوق المنزل', label: 'حصالة المنزل', icon: PiggyBank, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'هدف مستقبلي', label: 'هدف مستقبلي', icon: Target, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'مشتريات توفير', label: 'عروض وتوفير سلع', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'عام', label: 'توفير عام', icon: Tag, color: 'text-slate-600 bg-slate-50 border-slate-200' }
];

const PRESETS = [
  { name: 'صندوق الطوارئ والاحتياط', category: 'طوارئ', defaultAmount: 500 },
  { name: 'ادخار شهري في الحساب البنكي', category: 'ادخار بنكي', defaultAmount: 1000 },
  { name: 'مساهمة دارت (القرعة الشهرية)', category: 'دارت/قرعة', defaultAmount: 500 },
  { name: 'حصالة التوفير المنزلية', category: 'صندوق المنزل', defaultAmount: 200 },
  { name: 'ادخار لشراء تجهيزات أو أثاث', category: 'هدف مستقبلي', defaultAmount: 800 },
  { name: 'توفير ميزانية عروض الجملة', category: 'مشتريات توفير', defaultAmount: 400 }
];

export const WafirSection: React.FC<WafirSectionProps> = ({
  wafir = [],
  totalIncome = 0,
  onAdd,
  onUpdate,
  onDelete,
  onDeleteAll,
  onConfirmModal
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('طوارئ');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const totalWafir = wafir.reduce((sum, item) => sum + (item.amount || 0), 0);
  const wafirRate = totalIncome > 0 ? (totalWafir / totalIncome) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const numAmount = parseFloat(amount);

    if (!cleanName) {
      alert('يرجى إدخال اسم بند الوفير أو التوفير');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (editingId) {
      onUpdate({
        id: editingId,
        name: cleanName,
        amount: numAmount,
        category,
        notes: notes.trim(),
        date: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
    } else {
      onAdd({
        id: generateId(),
        name: cleanName,
        amount: numAmount,
        category,
        notes: notes.trim(),
        date: new Date().toISOString().split('T')[0]
      });
    }

    setName('');
    setAmount('');
    setNotes('');
  };

  const handleEdit = (item: WafirItem) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount.toString());
    setCategory(item.category || 'طوارئ');
    setNotes(item.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setNotes('');
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    if (!amount) {
      setAmount(preset.defaultAmount.toString());
    }
  };

  const filteredItems = wafir.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedFilterCategory === 'all' || item.category === selectedFilterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">قسم الوفير (التوفير والادخار)</h2>
            <p className="text-xs text-slate-500">إدارة المبالغ الموفرة، صندوق الطوارئ، القرعة الشهرية وخطة الادخار العائلية</p>
          </div>
        </div>

        {wafir.length > 0 && (
          <button
            onClick={() => {
              onConfirmModal(
                'تأكيد مسح كافة بنود الوفير',
                'هل أنت متأكد من رغبتك في حذف جميع عناصر التوفير والادخار المسجلة؟',
                onDeleteAll
              );
            }}
            className="self-end md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح سجل الوفير</span>
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-emerald-100 font-medium">مجموع الوفير والادخار</span>
            <PiggyBank className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="text-xl sm:text-2xl font-black">{formatCurrency(totalWafir)}</div>
          <p className="text-[11px] text-emerald-100 mt-1 font-medium">محفوظ ومقتطع بأمان</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">نسبة الوفير من الراتب</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{wafirRate.toFixed(1)}%</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {wafirRate >= 20 ? '🌟 نسبة ادخار ممتازة (أعلى من 20%)' : wafirRate >= 10 ? '👍 نسبة جيدة وقابلة للزيادة' : '💡 يُفضل تخصيص 10-20% للادخار'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">عدد بنود الوفير</span>
            <Target className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{wafir.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">أهداف ومخصصات مسجلة</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">صندوق الطوارئ</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {formatCurrency(
              wafir
                .filter(i => i.category === 'طوارئ')
                .reduce((s, i) => s + (i.amount || 0), 0)
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">لحالات الطوارئ غير المتوقعة</p>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">اقتراحات شائعة لقسم الوفير (اضغط للتعبئة التلقائية):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>{p.name}</span>
              <span className="text-[10px] text-emerald-600/80">({p.defaultAmount} درهم)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>تعديل بند الوفير</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>إضافة مبلغ توفير جديد إلى قسم الوفير</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم بند الوفير / التوفير <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: صندوق الطوارئ، دارت، ادخار بنكي..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المبلغ بالدرهم (MAD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-left font-mono"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع الوفير / التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {WAFIR_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ملاحظات أو الهدف (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: هدف 5000 درهم بحلول الصيف"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء التعديل
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
            >
              {editingId ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تحديث بند الوفير</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>إضافة إلى الوفير</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل ({wafir.length})
          </button>
          {WAFIR_CATEGORIES.map(cat => {
            const count = wafir.filter(i => i.category === cat.id).length;
            if (count === 0 && selectedFilterCategory !== cat.id) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilterCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedFilterCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في بنود الوفير..."
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            {searchQuery || selectedFilterCategory !== 'all' ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد مبالغ مسجلة في قسم الوفير بعد'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedFilterCategory !== 'all'
              ? 'جرّب تغيير عبارة البحث أو اختيار تصنيف آخر'
              : 'ابدأ بتسجيل أول بند في قسم الوفير (مثل صندوق الطوارئ أو الادخار البنكي) لبناء أمانك المالي.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">اسم بند الوفير</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">ملاحظات</th>
                  <th className="py-3 px-4 text-left">المبلغ الموفر</th>
                  <th className="py-3 px-4 w-24 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, index) => {
                  const catMeta = WAFIR_CATEGORIES.find(c => c.id === item.category) || WAFIR_CATEGORIES[0];
                  const Icon = catMeta.icon;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${catMeta.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{catMeta.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{item.date || '-'}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{item.notes || '-'}</td>
                      <td className="py-3 px-4 text-left font-black font-mono text-emerald-600 text-sm">
                        +{formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            title="تعديل"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onConfirmModal(
                                'تأكيد الحذف',
                                `هل ترغب في حذف بند "${item.name}" من قسم الوفير؟`,
                                () => onDelete(item.id)
                              );
                            }}
                            title="حذف"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredItems.map((item, index) => {
              const catMeta = WAFIR_CATEGORIES.find(c => c.id === item.category) || WAFIR_CATEGORIES[0];
              const Icon = catMeta.icon;
              return (
                <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-400 font-mono">#{index + 1}</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catMeta.color}`}>
                        <Icon className="w-2.5 h-2.5" />
                        <span>{catMeta.label}</span>
                      </span>

                      {item.notes && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-left font-black font-mono text-emerald-600 text-xs whitespace-nowrap">
                      +{formatCurrency(item.amount)}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onConfirmModal(
                            'تأكيد الحذف',
                            `هل ترغب في حذف بند "${item.name}"؟`,
                            () => onDelete(item.id)
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer Total */}
          <div className="bg-emerald-50/50 p-4 border-t border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950">
              إجمالي المبالغ في قسم الوفير ({filteredItems.length} عنصر):
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-700">
              +{formatCurrency(filteredItems.reduce((sum, item) => sum + (item.amount || 0), 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
