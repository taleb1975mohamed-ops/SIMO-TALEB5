/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Carrot, 
  Beef, 
  ShoppingBag 
} from 'lucide-react';
import { 
  AccountingData, 
  SectionType, 
  IncomeItem, 
  PurchaseItem, 
  ExpenseItem,
  WafirItem
} from './types';
import { 
  loadAccountingData, 
  saveAccountingData, 
  formatCurrency,
  DEFAULT_VEG_LIST,
  DEFAULT_MEAT_TYPES,
  DEFAULT_GROC_LIST
} from './utils/storage';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { IncomeSection } from './components/IncomeSection';
import { PurchaseSection } from './components/PurchaseSection';
import { WafirSection } from './components/WafirSection';
import { ExpenseSection } from './components/ExpenseSection';
import { SummarySection } from './components/SummarySection';
import { ConfirmModal } from './components/ConfirmModal';
import { AddItemModal } from './components/AddItemModal';
import { PdfReportModal } from './components/PdfReportModal';
import { Toast } from './components/Toast';

export default function App() {
  const [data, setData] = useState<AccountingData>(() => loadAccountingData());
  const [currentSection, setCurrentSection] = useState<SectionType>('summary');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Modals state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const confirmActionRef = useRef<() => void>(() => {});

  const [addCatalogModalState, setAddCatalogModalState] = useState<{
    isOpen: boolean;
    categoryTitle: string;
    targetCategory: 'vegList' | 'meatTypes' | 'grocList';
  }>({
    isOpen: false,
    categoryTitle: '',
    targetCategory: 'vegList'
  });

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Persist whenever data updates
  useEffect(() => {
    saveAccountingData(data);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleManualSave = () => {
    saveAccountingData(data);
    setSavedIndicator(true);
    showToast('تم حفظ كافة البيانات بنجاح في ذاكرة المتصفح!');
    setTimeout(() => setSavedIndicator(false), 2500);
  };

  // Calculations
  const totalIncome = data.incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalVeg = data.vegetables.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalMeat = data.meats.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalGroc = data.groceries.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalWafir = (data.wafir || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExp = data.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalPurchases = totalVeg + totalMeat + totalGroc + totalExp;
  const netBalance = totalIncome - totalPurchases - totalWafir;

  // Generic confirmation helper
  const openConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    confirmActionRef.current = onConfirm;
    setConfirmModalOpen(true);
  };

  // --- Incomes Handlers ---
  const handleAddIncome = (item: IncomeItem) => {
    setData(prev => ({ ...prev, incomes: [...prev.incomes, item] }));
    showToast('تم تسجيل الدخل بنجاح');
  };

  const handleUpdateIncome = (updated: IncomeItem) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.map(item => item.id === updated.id ? updated : item)
    }));
  };

  const handleDeleteIncome = (id: string) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(item => item.id !== id)
    }));
    showToast('تم حذف مصدر الدخل');
  };

  const handleDeleteAllIncomes = () => {
    setData(prev => ({ ...prev, incomes: [] }));
    showToast('تم مسح جميع بنود الدخل بنجاح');
  };

  // --- Purchase Handlers (Veg, Meat, Groc) ---
  const handleAddPurchase = (category: 'vegetables' | 'meats' | 'groceries', item: PurchaseItem) => {
    setData(prev => ({ ...prev, [category]: [...prev[category], item] }));
    showToast('تمت إضافة المشتريات إلى الجدول');
  };

  const handleUpdatePurchase = (category: 'vegetables' | 'meats' | 'groceries', updated: PurchaseItem) => {
    setData(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === updated.id ? updated : item)
    }));
  };

  const handleDeletePurchase = (category: 'vegetables' | 'meats' | 'groceries', id: string) => {
    setData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
    showToast('تم حذف العنصر بنجاح');
  };

  const handleDeleteAllPurchases = (category: 'vegetables' | 'meats' | 'groceries', nameLabel: string) => {
    setData(prev => ({ ...prev, [category]: [] }));
    showToast(`تم مسح قائمة ${nameLabel} بنجاح`);
  };

  // --- Wafir Handlers ---
  const handleAddWafir = (item: WafirItem) => {
    setData(prev => ({ ...prev, wafir: [...(prev.wafir || []), item] }));
    showToast('تمت إضافة بند الوفير بنجاح');
  };

  const handleUpdateWafir = (updated: WafirItem) => {
    setData(prev => ({
      ...prev,
      wafir: (prev.wafir || []).map(item => item.id === updated.id ? updated : item)
    }));
    showToast('تم تحديث بند الوفير بنجاح');
  };

  const handleDeleteWafir = (id: string) => {
    setData(prev => ({
      ...prev,
      wafir: (prev.wafir || []).filter(item => item.id !== id)
    }));
    showToast('تم حذف بند الوفير');
  };

  const handleDeleteAllWafir = () => {
    setData(prev => ({ ...prev, wafir: [] }));
    showToast('تم تفريغ جدول الوفير بنجاح');
  };

  // --- Expenses Handlers ---
  const handleAddExpense = (item: ExpenseItem) => {
    setData(prev => ({ ...prev, expenses: [...prev.expenses, item] }));
    showToast('تمت إضافة المصروف بنجاح');
  };

  const handleUpdateExpense = (updated: ExpenseItem) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(item => item.id === updated.id ? updated : item)
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(item => item.id !== id)
    }));
    showToast('تم حذف المصروف');
  };

  const handleDeleteAllExpenses = () => {
    setData(prev => ({ ...prev, expenses: [] }));
    showToast('تم تفريغ جدول المصاريف بنجاح');
  };

  // --- Catalog (Suggestions) Add Handler ---
  const handleOpenAddCatalogModal = (target: 'vegList' | 'meatTypes' | 'grocList', title: string) => {
    setAddCatalogModalState({
      isOpen: true,
      categoryTitle: title,
      targetCategory: target
    });
  };

  const handleAddCatalogItem = (name: string) => {
    const target = addCatalogModalState.targetCategory;
    if (!data[target].includes(name)) {
      setData(prev => ({
        ...prev,
        [target]: [...prev[target], name]
      }));
      showToast(`تمت إضافة "${name}" إلى القائمة بنجاح`);
    } else {
      showToast(`الصنف "${name}" موجود مسبقاً في القائمة`);
    }
  };

  // --- New Month Reset ---
  const handleResetMonth = () => {
    openConfirmModal(
      'بدء شهر محاسبي جديد',
      'هل ترغب في تفريغ مشتريات الخضار، اللحوم، الهري، والمصاريف للشهر الجديد؟ (سيتم الاحتفاظ بالراتب، قسم الوفير، وقوائم الأصناف). ننصحك بتحميل تقرير PDF أولاً.',
      () => {
        setData(prev => ({
          ...prev,
          vegetables: [],
          meats: [],
          groceries: [],
          expenses: []
        }));
        showToast('تم بدء شهر جديد وتصفير جداول المشتريات!');
      }
    );
  };

  // --- Delete All App Data ---
  const handleDeleteAllAppData = () => {
    openConfirmModal(
      'تحذير: حذف كافة بيانات التطبيق بالكامل',
      'هل أنت متأكد تماماً من رغبتك في حذف وحرق جميع البيانات (الدخل، الخضار، اللحوم، الهري، الوفير، والفواتير) وتصفير التطبيق بالكامل؟ لا يمكن التراجع عن هذا الإجراء.',
      () => {
        setData({
          incomes: [],
          vegetables: [],
          meats: [],
          groceries: [],
          wafir: [],
          expenses: [],
          vegList: DEFAULT_VEG_LIST,
          meatTypes: DEFAULT_MEAT_TYPES,
          grocList: DEFAULT_GROC_LIST,
          monthlyBudgetLimit: undefined
        });
        localStorage.removeItem('data');
        showToast('تم حذف كافة بيانات التطبيق وتصفيره بنجاح!');
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-16 sm:pb-0" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Top Header */}
      <Header
        totalIncome={totalIncome}
        totalExpenses={totalPurchases + totalWafir}
        netBalance={netBalance}
        onSave={handleManualSave}
        onOpenPdfReport={() => setIsPdfModalOpen(true)}
        onResetMonth={handleResetMonth}
        onDeleteAllAppData={handleDeleteAllAppData}
        savedIndicator={savedIndicator}
      />

      {/* Desktop / Tablet Section Navigation */}
      <Navigation
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        counts={{
          income: data.incomes.length,
          vegetables: data.vegetables.length,
          meats: data.meats.length,
          groceries: data.groceries.length,
          wafir: (data.wafir || []).length,
          expenses: data.expenses.length
        }}
        totals={{
          income: totalIncome,
          vegetables: totalVeg,
          meats: totalMeat,
          groceries: totalGroc,
          wafir: totalWafir,
          expenses: totalExp
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {currentSection === 'income' && (
          <IncomeSection
            incomes={data.incomes}
            onAdd={handleAddIncome}
            onUpdate={handleUpdateIncome}
            onDelete={handleDeleteIncome}
            onDeleteAll={handleDeleteAllIncomes}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'vegetables' && (
          <PurchaseSection
            title="مشتريات الخضار والفواكه"
            subtitle="تسجيل مشتريات الخضروات، الفواكه ومستلزمات السوق الأسبوعي"
            accentColor="amber"
            icon={Carrot}
            items={data.vegetables}
            catalog={data.vegList}
            onAddItem={(item) => handleAddPurchase('vegetables', item)}
            onUpdateItem={(item) => handleUpdatePurchase('vegetables', item)}
            onDeleteItem={(id) => handleDeletePurchase('vegetables', id)}
            onDeleteAll={() => handleDeleteAllPurchases('vegetables', 'الخضار')}
            onOpenAddCatalogItem={() => handleOpenAddCatalogModal('vegList', 'الخضار والفواكه')}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'meats' && (
          <PurchaseSection
            title="مشتريات اللحوم والأسماك"
            subtitle="حساب مصاريف اللحوم الحمراء، الدواجن، والأسماك الطازجة"
            accentColor="rose"
            icon={Beef}
            items={data.meats}
            catalog={data.meatTypes}
            onAddItem={(item) => handleAddPurchase('meats', item)}
            onUpdateItem={(item) => handleUpdatePurchase('meats', item)}
            onDeleteItem={(id) => handleDeletePurchase('meats', id)}
            onDeleteAll={() => handleDeleteAllPurchases('meats', 'اللحوم')}
            onOpenAddCatalogItem={() => handleOpenAddCatalogModal('meatTypes', 'اللحوم والأسماك')}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'groceries' && (
          <PurchaseSection
            title="مشتريات الهري والمؤن"
            subtitle="المواد الغذائية، الزيوت، السكر، ومستلزمات التنظيف والمنزل"
            accentColor="sky"
            icon={ShoppingBag}
            items={data.groceries}
            catalog={data.grocList}
            onAddItem={(item) => handleAddPurchase('groceries', item)}
            onUpdateItem={(item) => handleUpdatePurchase('groceries', item)}
            onDeleteItem={(id) => handleDeletePurchase('groceries', id)}
            onDeleteAll={() => handleDeleteAllPurchases('groceries', 'الهري والمؤن')}
            onOpenAddCatalogItem={() => handleOpenAddCatalogModal('grocList', 'الهري والمؤن')}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'wafir' && (
          <WafirSection
            wafir={data.wafir || []}
            totalIncome={totalIncome}
            onAdd={handleAddWafir}
            onUpdate={handleUpdateWafir}
            onDelete={handleDeleteWafir}
            onDeleteAll={handleDeleteAllWafir}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'expenses' && (
          <ExpenseSection
            expenses={data.expenses}
            onAdd={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
            onDeleteAll={handleDeleteAllExpenses}
            onConfirmModal={openConfirmModal}
          />
        )}

        {currentSection === 'summary' && (
          <SummarySection
            data={data}
            onUpdateBudgetLimit={(limit) => {
              setData(prev => ({ ...prev, monthlyBudgetLimit: limit }));
              showToast('تم تحديث سقف الميزانية');
            }}
            onOpenPdfReport={() => setIsPdfModalOpen(true)}
          />
        )}
      </main>

      {/* Footer Branding & Copyright */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <p>© {new Date().getFullYear()} النظام المحاسبي وإدارة المصاريف - محمد طالب</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="text-rose-700 hover:text-rose-900 font-bold hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              📄 تحميل تقرير PDF شامل
            </button>
            <span>·</span>
            <span>العملة: درهم مغربي (MAD)</span>
            <span>·</span>
            <span>حفظ محلي آمن في الذاكرة</span>
          </div>
        </div>
      </footer>

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={confirmModalTitle}
        message={confirmModalMessage}
        onConfirm={() => {
          confirmActionRef.current();
          setConfirmModalOpen(false);
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />

      {/* Add New Catalog Item Modal */}
      <AddItemModal
        isOpen={addCatalogModalState.isOpen}
        categoryTitle={addCatalogModalState.categoryTitle}
        onAdd={handleAddCatalogItem}
        onClose={() => setAddCatalogModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Full PDF Report Modal */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={data}
      />
    </div>
  );
}
