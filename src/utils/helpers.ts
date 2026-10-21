import { ReligiousPerson } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const LOCAL_STORAGE_KEY = 'rel_data';

export const INITIAL_SAMPLE_DATA: ReligiousPerson[] = [
  {
    p_ar: 'محمد العلمي الإدريسي',
    p_fr: 'Mohammed El Alami Idrissi',
    p_cin: 'AB123456',
    p_phone: '0661234567',
    p_dob: '1975-04-12',
    p_pob: 'فاس',
    p_personal_addr: 'حي الأندلس، زنقة 14، رقم 8',
    p_status: 'متزوج',
    p_wives: '1',
    p_kids: '4',
    p_males: '2',
    p_females: '2',
    p_ins: 'CNOPS',
    p_education: 'شهادة العالمية في العلوم الشرعية',
    m_name: 'مسجد النور الكبير',
    m_code: 'MS-2023-01',
    m_addr: 'شارع الحسن الثاني، المركز',
    m_city: 'فاس المدينة',
    m_join_date: '2012-09-01',
    salary: 4300,
    sal_details: {
      imam: 2200,
      khatib: 1500,
      moaden: 0,
      cleaner: 0,
      hizb: 600,
      hadith: 0,
      insp: 0
    }
  },
  {
    p_ar: 'عبد الرحيم بنعمر',
    p_fr: 'Abderrahim Benomar',
    p_cin: 'CD789012',
    p_phone: '0662987654',
    p_dob: '1982-11-25',
    p_pob: 'سلا',
    p_personal_addr: 'حي السلام، عمارة 5، شقة 3',
    p_status: 'متزوج',
    p_wives: '1',
    p_kids: '2',
    p_males: '1',
    p_females: '1',
    p_ins: 'CNSS',
    p_education: 'الإجازة في الدراسات الإسلامية وحفظ القرآن كاملاً',
    m_name: 'مسجد بدر',
    m_code: 'MS-2018-44',
    m_addr: 'طريق القنيطرة، باب شعفة',
    m_city: 'سلا',
    m_join_date: '2016-03-15',
    salary: 2600,
    sal_details: {
      imam: 0,
      khatib: 0,
      moaden: 1800,
      cleaner: 0,
      hizb: 500,
      hadith: 300,
      insp: 0
    }
  },
  {
    p_ar: 'الحسن المرابط',
    p_fr: 'El Hassan Lemrabet',
    p_cin: 'EF345678',
    p_phone: '0663456789',
    p_dob: '1968-07-03',
    p_pob: 'تزنيت',
    p_personal_addr: 'درب الحمام، رقم 22',
    p_status: 'متزوج',
    p_wives: '1',
    p_kids: '5',
    p_males: '3',
    p_females: '2',
    p_ins: 'AMO',
    p_education: 'التعليم العتيق (الطور النهائي)',
    m_name: 'مسجد التوبة',
    m_code: 'MS-2015-12',
    m_addr: 'حي المسيرة، قرب السوق المركزي',
    m_city: 'تمارة',
    m_join_date: '2010-01-10',
    salary: 3100,
    sal_details: {
      imam: 1800,
      khatib: 0,
      moaden: 0,
      cleaner: 0,
      hizb: 700,
      hadith: 600,
      insp: 0
    }
  },
  {
    p_ar: 'عمر بوعزة',
    p_fr: 'Omar Bouazza',
    p_cin: 'GH901234',
    p_phone: '0664567890',
    p_dob: '1989-02-18',
    p_pob: 'الرباط',
    p_personal_addr: 'حي النهضة، تجزئة الياسمين 19',
    p_status: 'عازب',
    p_wives: '0',
    p_kids: '0',
    p_males: '0',
    p_females: '0',
    p_ins: 'لا يوجد',
    p_education: 'مستوى البكالوريا',
    m_name: 'مسجد النور الكبير',
    m_code: 'MS-2023-01',
    m_addr: 'شارع الحسن الثاني، المركز',
    m_city: 'فاس المدينة',
    m_join_date: '2021-06-01',
    salary: 1600,
    sal_details: {
      imam: 0,
      khatib: 0,
      moaden: 0,
      cleaner: 1600,
      hizb: 0,
      hadith: 0,
      insp: 0
    }
  }
];

export function loadData(): ReligiousPerson[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
      return INITIAL_SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_DATA;
  } catch (err) {
    console.error('Failed to load storage data:', err);
    return INITIAL_SAMPLE_DATA;
  }
}

export function saveData(data: ReligiousPerson[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
}

export function formatToEnNumbers(dateString?: string): string {
  if (!dateString) return '0 سنة';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return '0 سنة';
  
  const currentYear = new Date().getFullYear();
  const joinYear = dateObj.getFullYear();
  const years = currentYear - joinYear;
  const finalYears = years < 0 ? 0 : years;
  return `${finalYears} سنة`;
}

export function formatInputDateStr(dateString?: string): string {
  if (!dateString) return 'غير مسجل';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return dateString;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatCurrency(amount: number): string {
  return `${(amount || 0).toLocaleString('en-US')} درهم`;
}

export function exportToCSV(data: ReligiousPerson[]) {
  if (!data || data.length === 0) return;

  const headers = [
    'الاسم الكامل بالعربية',
    'Nom Français',
    'رقم CIN',
    'الهاتف',
    'المسجد',
    'رمز المسجد',
    'الجماعة',
    'العنوان الشخصي',
    'الحالة العائلية',
    'عدد الأبناء',
    'التغطية الصحية',
    'المستوى الدراسي',
    'تاريخ الالتحاق',
    'الأقدمية',
    'إمامة',
    'خطابة',
    'أذان',
    'نظافة',
    'حزب',
    'حديث',
    'تفقد',
    'الراتب الإجمالي'
  ];

  const rows = data.map(item => [
    `"${item.p_ar || ''}"`,
    `"${item.p_fr || ''}"`,
    `"${item.p_cin || ''}"`,
    `"${item.p_phone || ''}"`,
    `"${item.m_name || ''}"`,
    `"${item.m_code || ''}"`,
    `"${item.m_city || ''}"`,
    `"${item.p_personal_addr || ''}"`,
    `"${item.p_status || ''}"`,
    `"${item.p_kids || 0}"`,
    `"${item.p_ins || ''}"`,
    `"${item.p_education || ''}"`,
    `"${item.m_join_date || ''}"`,
    `"${formatToEnNumbers(item.m_join_date)}"`,
    `"${item.sal_details.imam || 0}"`,
    `"${item.sal_details.khatib || 0}"`,
    `"${item.sal_details.moaden || 0}"`,
    `"${item.sal_details.cleaner || 0}"`,
    `"${item.sal_details.hizb || 0}"`,
    `"${item.sal_details.hadith || 0}"`,
    `"${item.sal_details.insp || 0}"`,
    `"${item.salary || 0}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `قائمة_القيمين_الدينيين_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Universally save and download a jsPDF document across:
 * 1. Mobile Capacitor native apps (writes to device Documents + native share to Downloads/Drive/WhatsApp)
 * 2. Mobile web browsers (Android Chrome, iOS Safari)
 * 3. Desktop browsers
 */
export async function saveAndDownloadPdf(pdf: jsPDF, filename: string): Promise<boolean> {
  // 1. Try Capacitor Native Filesystem & Share first (for Android/iOS App build)
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: pdfBase64,
        directory: Directory.Documents,
        recursive: true
      });

      // Prompt native sheet so file can be saved to Downloads, Files, WhatsApp, etc.
      await Share.share({
        title: filename,
        text: 'تحميل ملف PDF للقيمين الدينيين',
        url: savedFile.uri,
        dialogTitle: 'حفظ أو مشاركة ملف PDF'
      });
      return true;
    }
  } catch (err) {
    console.warn('Native download not available or failed:', err);
  }

  // 2. Standard Web Download via Blob
  try {
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    return true;
  } catch (err) {
    console.warn('Blob download fallback to pdf.save:', err);
    pdf.save(filename);
    return true;
  }
}

/**
 * Generate a high-resolution, Moroccan administrative PDF document for the list of appointees
 */
export async function generateAppointeesListPdf(
  list: ReligiousPerson[],
  filterTitle: string = 'الكل'
): Promise<boolean> {
  if (!list || list.length === 0) return false;

  const totalSalaries = list.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  // Compute live stats for this list
  let imamCount = 0;
  let khatibCount = 0;
  let moadenCount = 0;
  let cleanerCount = 0;
  let hizbCount = 0;
  let hadithCount = 0;
  const mosquesSet = new Set<string>();

  list.forEach(p => {
    if (p.m_name && p.m_name.trim()) mosquesSet.add(p.m_name.trim());
    if (Number(p.sal_details.imam) > 0) imamCount++;
    if (Number(p.sal_details.khatib) > 0) khatibCount++;
    if (Number(p.sal_details.moaden) > 0) moadenCount++;
    if (Number(p.sal_details.cleaner) > 0) cleanerCount++;
    if (Number(p.sal_details.hizb) > 0) hizbCount++;
    if (Number(p.sal_details.hadith) > 0) hadithCount++;
  });

  // Helper for task labels
  const getTasksSummary = (item: ReligiousPerson) => {
    const tasks: string[] = [];
    if (Number(item.sal_details.imam) > 0) tasks.push('إمامة');
    if (Number(item.sal_details.khatib) > 0) tasks.push('خطابة');
    if (Number(item.sal_details.moaden) > 0) tasks.push('أذان');
    if (Number(item.sal_details.cleaner) > 0) tasks.push('نظافة');
    if (Number(item.sal_details.hizb) > 0) tasks.push('حزب');
    if (Number(item.sal_details.hadith) > 0) tasks.push('حديث');
    if (Number(item.sal_details.insp) > 0) tasks.push('تفقد');
    return tasks.length > 0 ? tasks.join(' - ') : '—';
  };

  // Create temporary printable DOM container
  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1120px';
  container.style.padding = '30px 35px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Segoe UI', Tahoma, Arial, sans-serif";
  container.style.direction = 'rtl';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #27ae60; padding-bottom: 14px; margin-bottom: 16px;">
      <div style="text-align: right; line-height: 1.5;">
        <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #2c3e50;">المملكة المغربية</h4>
        <p style="margin: 2px 0 0; font-size: 12px; color: #475569; font-weight: 600;">وزارة الأوقاف والشؤون الإسلامية</p>
        <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">المندوبية الإقليمية للشؤون الإسلامية</p>
      </div>

      <div style="text-align: center; flex: 1; padding: 0 15px;">
        <div style="display: inline-block; padding: 4px 14px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 6px;">
          <span style="font-size: 11px; font-weight: bold; color: #15803d;">منظومة تدبير القيمين الدينيين</span>
        </div>
        <h2 style="margin: 0; font-size: 19px; font-weight: 800; color: #1e293b;">سجل ولائحة القيمين الدينيين بالمساجد</h2>
        <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">
          التصنيف: <b>${filterTitle}</b> · تاريخ الاستخراج: <span style="font-family: monospace; font-weight: bold;">${dateFormatted}</span>
        </p>
      </div>

      <div style="text-align: left; line-height: 1.6; font-size: 11px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px;">
        <div><b>إجمالي السجلات:</b> <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #27ae60;">${list.length}</span> قيم ديني</div>
        <div><b>مجموع التعويضات:</b> <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #2c3e50;">${totalSalaries.toLocaleString('en-US')}</span> درهم</div>
      </div>
    </div>

    <!-- Executive Quick Stats Bar -->
    <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-bottom: 16px; text-align: center;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">الأئمة</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${imamCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">الخطباء</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${khatibCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">المؤذنين</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${moadenCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">المنظفين</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${cleanerCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">قراء الحزب</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${hizbCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #27ae60; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">رواة الحديث</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${hadithCount}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #3498db; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">المساجد</div>
        <div style="font-size: 14px; font-weight: bold; color: #1e293b; font-family: monospace;">${mosquesSet.size}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #2c3e50; padding: 6px 4px; border-radius: 8px;">
        <div style="font-size: 10px; color: #64748b; font-weight: bold;">إجمالي القيمين</div>
        <div style="font-size: 14px; font-weight: bold; color: #15803d; font-family: monospace;">${list.length}</div>
      </div>
    </div>

    <!-- Appointees Table -->
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; margin-bottom: 25px;">
      <thead>
        <tr style="background-color: #2c3e50; color: #ffffff;">
          <th style="padding: 10px 6px; border: 1px solid #1a252f; width: 35px; font-weight: bold;">#</th>
          <th style="padding: 10px 10px; border: 1px solid #1a252f; text-align: right; font-weight: bold;">الاسم الكامل</th>
          <th style="padding: 10px 8px; border: 1px solid #1a252f; width: 85px; font-weight: bold;">CIN</th>
          <th style="padding: 10px 8px; border: 1px solid #1a252f; width: 95px; font-weight: bold;">الهاتف</th>
          <th style="padding: 10px 10px; border: 1px solid #1a252f; text-align: right; font-weight: bold;">المسجد والجماعة</th>
          <th style="padding: 10px 8px; border: 1px solid #1a252f; width: 75px; font-weight: bold;">الأقدمية</th>
          <th style="padding: 10px 8px; border: 1px solid #1a252f; font-weight: bold;">المهام المسندة</th>
          <th style="padding: 10px 8px; border: 1px solid #1a252f; width: 95px; font-weight: bold;">التعويض الشهري</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((item, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px 4px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #64748b;">${idx + 1}</td>
            <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: right;">
              <div style="font-weight: bold; color: #1e293b; font-size: 11.5px;">${item.p_ar || '—'}</div>
              ${item.p_fr ? `<div style="font-size: 10px; color: #64748b; font-family: sans-serif; direction: ltr; text-align: right;">${item.p_fr}</div>` : ''}
            </td>
            <td style="padding: 8px 6px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #334155; text-transform: uppercase;">
              ${item.p_cin || '—'}
            </td>
            <td style="padding: 8px 6px; border: 1px solid #e2e8f0; font-family: monospace; direction: ltr; color: #475569;">
              ${item.p_phone || '—'}
            </td>
            <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: right;">
              <span style="font-weight: bold; color: #0f172a;">${item.m_name || '—'}</span>
              ${item.m_city ? `<span style="font-size: 10px; color: #64748b; display: block;">${item.m_city}</span>` : ''}
            </td>
            <td style="padding: 8px 6px; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">
              ${formatToEnNumbers(item.m_join_date)}
            </td>
            <td style="padding: 8px 8px; border: 1px solid #e2e8f0; color: #0f766e; font-weight: 600;">
              ${getTasksSummary(item)}
            </td>
            <td style="padding: 8px 6px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #15803d; font-size: 11.5px;">
              ${(item.salary || 0).toLocaleString('en-US')} درهم
            </td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #27ae60;">
          <td colspan="7" style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right; color: #1e293b; font-size: 12px;">
            المجموع الإجمالي للتعويضات الشهرية (${list.length} قيم ديني):
          </td>
          <td style="padding: 10px 6px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 13px; color: #15803d;">
            ${totalSalaries.toLocaleString('en-US')} درهم
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Administrative Sign-off Footer -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569;">
      <div>
        <p style="margin: 0 0 4px;">حرر في: <span style="font-family: monospace; font-weight: bold;">${dateFormatted}</span></p>
        <p style="margin: 0; color: #94a3b8; font-size: 10px;">وثيقة رسمية صادرة عن منظومة تدبير شؤون القيمين الدينيين بالمساجد</p>
      </div>

      <div style="text-align: center; width: 220px;">
        <p style="margin: 0 0 45px; font-weight: bold; color: #1e293b;">توقيع وخاتم المندوبية الإقليمية</p>
        <div style="border-bottom: 1px dotted #94a3b8; width: 160px; margin: 0 auto;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 297 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    const imgWidth = pageWidth - 16; // 8mm margin each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeight;
    let position = 8; // Top margin

    pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 16);

    while (heightLeft > 0) {
      position = position - (pageHeight - 16);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 16);
    }

    const filename = `لائحة_القيمين_الدينيين_${now.toISOString().slice(0, 10)}.pdf`;
    await saveAndDownloadPdf(pdf, filename);
    return true;
  } catch (err) {
    console.error('Failed to export list PDF:', err);
    return false;
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

/**
 * Generate a dedicated comprehensive statistics report PDF (تقرير الإحصائيات الشاملة)
 */
export async function generateComprehensiveStatisticsPdf(
  dataList: ReligiousPerson[]
): Promise<boolean> {
  if (!dataList || dataList.length === 0) return false;

  const totalAppointees = dataList.length;
  const totalSalaries = dataList.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const avgSalary = totalAppointees > 0 ? Math.round(totalSalaries / totalAppointees) : 0;
  
  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  // Task statistics
  const taskStats = [
    { key: 'imam', label: 'الإمامة', count: 0, totalAmount: 0 },
    { key: 'khatib', label: 'الخطابة', count: 0, totalAmount: 0 },
    { key: 'moaden', label: 'الأذان', count: 0, totalAmount: 0 },
    { key: 'cleaner', label: 'النظافة والحراسة', count: 0, totalAmount: 0 },
    { key: 'hizb', label: 'قراءة الحزب الراتب', count: 0, totalAmount: 0 },
    { key: 'hadith', label: 'سرد الحديث الشريف', count: 0, totalAmount: 0 },
    { key: 'insp', label: 'التفقد والتأطير', count: 0, totalAmount: 0 },
  ];

  // Mosques & Cities distribution
  const mosquesMap = new Map<string, { mosqueName: string; city: string; count: number }>();
  const citiesMap = new Map<string, { city: string; mosques: Set<string>; appointees: number; totalSalary: number }>();

  // Social & Demographic stats
  let married = 0;
  let single = 0;
  let widowed = 0;
  let divorced = 0;
  let totalWives = 0;
  let totalKids = 0;
  let totalMales = 0;
  let totalFemales = 0;

  // Insurance stats
  let insCnops = 0;
  let insCnss = 0;
  let insAmo = 0;
  let insNone = 0;

  // Seniority bands
  let seniorUnder5 = 0;
  let senior5to10 = 0;
  let senior10to20 = 0;
  let seniorOver20 = 0;

  const currentYear = now.getFullYear();

  dataList.forEach(item => {
    // Tasks
    taskStats.forEach(ts => {
      const val = Number(item.sal_details[ts.key as keyof typeof item.sal_details]) || 0;
      if (val > 0) {
        ts.count++;
        ts.totalAmount += val;
      }
    });

    // Mosque
    const mosqueKey = (item.m_name || '').trim();
    if (mosqueKey) {
      if (!mosquesMap.has(mosqueKey)) {
        mosquesMap.set(mosqueKey, {
          mosqueName: mosqueKey,
          city: item.m_city || 'غير محدد',
          count: 0
        });
      }
      mosquesMap.get(mosqueKey)!.count++;
    }

    // City / Commune
    const cityName = (item.m_city || 'غير محدد').trim();
    if (!citiesMap.has(cityName)) {
      citiesMap.set(cityName, {
        city: cityName,
        mosques: new Set(),
        appointees: 0,
        totalSalary: 0
      });
    }
    const cEntry = citiesMap.get(cityName)!;
    cEntry.appointees++;
    cEntry.totalSalary += Number(item.salary) || 0;
    if (mosqueKey) cEntry.mosques.add(mosqueKey);

    // Marital
    if (item.p_status === 'متزوج') married++;
    else if (item.p_status === 'عازب') single++;
    else if (item.p_status === 'أرمل') widowed++;
    else if (item.p_status === 'مطلق') divorced++;
    else married++;

    totalWives += Number(item.p_wives) || 0;
    totalKids += Number(item.p_kids) || 0;
    totalMales += Number(item.p_males) || 0;
    totalFemales += Number(item.p_females) || 0;

    // Insurance
    const ins = item.p_ins || '';
    if (ins === 'CNOPS') insCnops++;
    else if (ins === 'CNSS') insCnss++;
    else if (ins === 'AMO') insAmo++;
    else insNone++;

    // Seniority
    if (item.m_join_date) {
      const joinYear = new Date(item.m_join_date).getFullYear();
      if (!isNaN(joinYear)) {
        const years = currentYear - joinYear;
        if (years < 5) seniorUnder5++;
        else if (years <= 10) senior5to10++;
        else if (years <= 20) senior10to20++;
        else seniorOver20++;
      }
    }
  });

  const totalTasksSum = taskStats.reduce((acc, t) => acc + t.count, 0);
  const citiesArray = Array.from(citiesMap.values()).sort((a, b) => b.appointees - a.appointees);

  // Create temporary container
  const container = document.createElement('div');
  container.id = 'pdf-stats-export-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px';
  container.style.padding = '35px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Segoe UI', Tahoma, Arial, sans-serif";
  container.style.direction = 'rtl';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #27ae60; padding-bottom: 14px; margin-bottom: 22px;">
      <div style="text-align: right; line-height: 1.5;">
        <h4 style="margin: 0; font-size: 13px; font-weight: bold; color: #2c3e50;">المملكة المغربية</h4>
        <p style="margin: 2px 0 0; font-size: 11.5px; color: #475569; font-weight: 600;">وزارة الأوقاف والشؤون الإسلامية</p>
        <p style="margin: 2px 0 0; font-size: 10.5px; color: #64748b;">المندوبية الإقليمية للشؤون الإسلامية</p>
      </div>

      <div style="text-align: center; flex: 1; padding: 0 15px;">
        <div style="display: inline-block; padding: 4px 14px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 6px;">
          <span style="font-size: 11px; font-weight: bold; color: #15803d;">لوحة القيادة والمؤشرات الإحصائية</span>
        </div>
        <h2 style="margin: 0; font-size: 19px; font-weight: 800; color: #1e293b;">تقرير الإحصائيات الشاملة للقيمين الدينيين والمساجد</h2>
        <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">
          تاريخ التقرير: <span style="font-family: monospace; font-weight: bold;">${dateFormatted}</span> · المنظومة المركزية
        </p>
      </div>

      <div style="text-align: left; line-height: 1.5; font-size: 11px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px;">
        <div><b>الحالة:</b> <span style="color: #15803d; font-weight: bold;">محيّن ومعتمد</span></div>
        <div><b>الجهة:</b> <span style="color: #2c3e50;">الشؤون الإسلامية</span></div>
      </div>
    </div>

    <!-- Executive Primary Metric Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #27ae60; border-radius: 12px; padding: 14px; text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: bold; display: block; margin-bottom: 4px;">إجمالي القيمين الدينيين</span>
        <b style="font-size: 24px; color: #1e293b; font-family: monospace;">${totalAppointees}</b>
        <span style="font-size: 10px; color: #27ae60; display: block; margin-top: 2px;">قيم ديني مسجل</span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #3498db; border-radius: 12px; padding: 14px; text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: bold; display: block; margin-bottom: 4px;">إجمالي المساجد</span>
        <b style="font-size: 24px; color: #1e293b; font-family: monospace;">${mosquesMap.size}</b>
        <span style="font-size: 10px; color: #3498db; display: block; margin-top: 2px;">مسجد ومصلى معتمد</span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #f39c12; border-radius: 12px; padding: 14px; text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: bold; display: block; margin-bottom: 4px;">مجموع المهام المزاولة</span>
        <b style="font-size: 24px; color: #1e293b; font-family: monospace;">${totalTasksSum}</b>
        <span style="font-size: 10px; color: #f39c12; display: block; margin-top: 2px;">مهمة دينية نشطة</span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #2c3e50; border-radius: 12px; padding: 14px; text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: bold; display: block; margin-bottom: 4px;">الكتلة المالية الشهرية</span>
        <b style="font-size: 20px; color: #15803d; font-family: monospace;">${totalSalaries.toLocaleString('en-US')}</b>
        <span style="font-size: 10px; color: #64748b; display: block; margin-top: 2px;">درهم مغربي شهرياً</span>
      </div>
    </div>

    <!-- Section 1: Detailed Task Distribution & Financial Allocation -->
    <div style="margin-bottom: 22px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 13.5px; font-weight: bold; color: #2c3e50; display: flex; align-items: center; gap: 6px;">
          <span style="color: #27ae60;">●</span> جدول توزيع المهام الدينية والاعتمادات المالية المخصصة
        </h3>
        <span style="font-size: 10.5px; color: #64748b;">متوسط التعويض: <b>${avgSalary.toLocaleString('en-US')} درهم</b> / قيم ديني</span>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
        <thead>
          <tr style="background-color: #2c3e50; color: #ffffff;">
            <th style="padding: 8px 10px; border: 1px solid #1a252f; text-align: right;">المهمة الدينية</th>
            <th style="padding: 8px 10px; border: 1px solid #1a252f; width: 100px;">عدد القيمين المزاولين</th>
            <th style="padding: 8px 10px; border: 1px solid #1a252f; width: 90px;">نسبة المزاولة (%)</th>
            <th style="padding: 8px 10px; border: 1px solid #1a252f; width: 140px;">مجموع التعويضات (درهم)</th>
            <th style="padding: 8px 10px; border: 1px solid #1a252f; width: 120px;">متوسط التعويض الفردي</th>
          </tr>
        </thead>
        <tbody>
          ${taskStats.map((ts, idx) => {
            const pct = totalAppointees > 0 ? ((ts.count / totalAppointees) * 100).toFixed(1) : '0';
            const avg = ts.count > 0 ? Math.round(ts.totalAmount / ts.count) : 0;
            return `
              <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 7px 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #1e293b;">
                  ${ts.label}
                </td>
                <td style="padding: 7px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #2c3e50; font-size: 12px;">
                  ${ts.count}
                </td>
                <td style="padding: 7px 10px; border: 1px solid #e2e8f0; font-family: monospace; color: #475569;">
                  ${pct} %
                </td>
                <td style="padding: 7px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #15803d;">
                  ${ts.totalAmount.toLocaleString('en-US')} درهم
                </td>
                <td style="padding: 7px 10px; border: 1px solid #e2e8f0; font-family: monospace; color: #334155;">
                  ${avg.toLocaleString('en-US')} درهم
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #27ae60;">
            <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: right; color: #1e293b;">المجموع العام التراكمي:</td>
            <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 12.5px; color: #2c3e50;">${totalTasksSum}</td>
            <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: monospace; color: #475569;">—</td>
            <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 12.5px; color: #15803d;">${totalSalaries.toLocaleString('en-US')} درهم</td>
            <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: monospace; color: #334155;">${avgSalary.toLocaleString('en-US')} درهم</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Section 2: Two Columns: Social Status & Health Insurance -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px;">
      <!-- Social / Family Box -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px;">
        <h4 style="margin: 0 0 10px; font-size: 12px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          👨‍👩‍👦 المؤشرات الاجتماعية والعائلية
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div style="background-color: #f8fafc; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #64748b;">المتزوجون:</span> 
            <b style="float: left; font-family: monospace; color: #1e293b;">${married} (${totalAppointees > 0 ? Math.round((married/totalAppointees)*100) : 0}%)</b>
          </div>
          <div style="background-color: #f8fafc; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #64748b;">العزاب:</span> 
            <b style="float: left; font-family: monospace; color: #1e293b;">${single}</b>
          </div>
          <div style="background-color: #f8fafc; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #64748b;">الأرامل والمطلقون:</span> 
            <b style="float: left; font-family: monospace; color: #1e293b;">${widowed + divorced}</b>
          </div>
          <div style="background-color: #f8fafc; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #64748b;">إجمالي الأبناء:</span> 
            <b style="float: left; font-family: monospace; color: #27ae60;">${totalKids}</b>
          </div>
        </div>
        <div style="margin-top: 8px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
          <span>الذكور: <b style="font-family: monospace; color: #334155;">${totalMales}</b> | الإناث: <b style="font-family: monospace; color: #334155;">${totalFemales}</b></span>
          <span>معدل الأبناء لكل أسرة: <b style="font-family: monospace; color: #334155;">${married > 0 ? (totalKids / married).toFixed(1) : 0}</b></span>
        </div>
      </div>

      <!-- Health Insurance Box -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px;">
        <h4 style="margin: 0 0 10px; font-size: 12px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          🏥 نظام التغطية الصحية والتأمين الإجباري
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #15803d; font-weight: bold;">CNOPS:</span> 
            <b style="float: left; font-family: monospace; color: #15803d;">${insCnops} (${totalAppointees > 0 ? Math.round((insCnops/totalAppointees)*100) : 0}%)</b>
          </div>
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #1d4ed8; font-weight: bold;">CNSS:</span> 
            <b style="float: left; font-family: monospace; color: #1d4ed8;">${insCnss}</b>
          </div>
          <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #7e22ce; font-weight: bold;">AMO:</span> 
            <b style="float: left; font-family: monospace; color: #7e22ce;">${insAmo}</b>
          </div>
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 6px 8px; border-radius: 6px;">
            <span style="color: #b91c1c;">لا يوجد / غير مصرح:</span> 
            <b style="float: left; font-family: monospace; color: #b91c1c;">${insNone}</b>
          </div>
        </div>
        <div style="margin-top: 8px; font-size: 10px; color: #64748b;">
          نسبة المشمولين بالتغطية الصحية: <b style="font-family: monospace; color: #15803d;">${totalAppointees > 0 ? (((totalAppointees - insNone) / totalAppointees) * 100).toFixed(1) : 0}%</b>
        </div>
      </div>
    </div>

    <!-- Section 3: Geographical Distribution by Commune -->
    ${citiesArray.length > 0 ? `
      <div style="margin-bottom: 22px;">
        <h3 style="margin: 0 0 8px; font-size: 13px; font-weight: bold; color: #2c3e50; display: flex; align-items: center; gap: 6px;">
          <span style="color: #3498db;">●</span> التوزيع الجغرافي حسب الجماعات الترابية والمساجد
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
          <thead>
            <tr style="background-color: #34495e; color: #ffffff;">
              <th style="padding: 7px 10px; border: 1px solid #2c3e50; text-align: right;">الجماعة الترابية</th>
              <th style="padding: 7px 10px; border: 1px solid #2c3e50; width: 120px;">عدد المساجد التابعة</th>
              <th style="padding: 7px 10px; border: 1px solid #2c3e50; width: 120px;">عدد القيمين الدينيين</th>
              <th style="padding: 7px 10px; border: 1px solid #2c3e50; width: 150px;">إجمالي التعويضات الشهرية</th>
            </tr>
          </thead>
          <tbody>
            ${citiesArray.map((c, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #1e293b;">
                  ${c.city}
                </td>
                <td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-family: monospace; color: #334155;">
                  ${c.mosques.size}
                </td>
                <td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #27ae60;">
                  ${c.appointees}
                </td>
                <td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #15803d;">
                  ${c.totalSalary.toLocaleString('en-US')} درهم
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Administrative Footer & Sign-off -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 18px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569;">
      <div>
        <p style="margin: 0 0 3px;">تاريخ الاستخراج والإعداد: <span style="font-family: monospace; font-weight: bold;">${dateFormatted}</span></p>
        <p style="margin: 0; color: #94a3b8; font-size: 9.5px;">وثيقة إدارية وإحصائية رسمية صادرة عن منظومة تدبير القيمين الدينيين بالمساجد</p>
      </div>

      <div style="text-align: center; width: 220px;">
        <p style="margin: 0 0 45px; font-weight: bold; color: #1e293b;">توقيع وخاتم المندوبية الإقليمية</p>
        <div style="border-bottom: 1px dotted #94a3b8; width: 160px; margin: 0 auto;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgWidth = pageWidth - 16; // 8mm margin each side = 194mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeight;
    let position = 8; // Top margin

    pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 16);

    while (heightLeft > 0) {
      position = position - (pageHeight - 16);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 16);
    }

    const filename = `تقرير_الإحصائيات_الشاملة_${now.toISOString().slice(0, 10)}.pdf`;
    await saveAndDownloadPdf(pdf, filename);
    return true;
  } catch (err) {
    console.error('Failed to export statistics PDF:', err);
    return false;
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

