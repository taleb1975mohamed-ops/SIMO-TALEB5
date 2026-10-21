export interface SalaryDetails {
  imam: string | number;
  khatib: string | number;
  moaden: string | number;
  cleaner: string | number;
  hizb: string | number;
  hadith: string | number;
  insp: string | number;
}

export interface ReligiousPerson {
  id?: string;
  p_ar: string;
  p_fr: string;
  p_cin: string;
  p_phone: string;
  p_dob: string;
  p_pob: string;
  p_personal_addr: string;
  p_status: 'متزوج' | 'عازب' | 'أرمل' | 'مطلق' | string;
  p_wives: string | number;
  p_kids: string | number;
  p_males: string | number;
  p_females: string | number;
  p_ins: 'لا يوجد' | 'CNOPS' | 'CNSS' | 'AMO' | string;
  p_education: string;
  
  // Mosque info
  m_name: string;
  m_code: string;
  m_addr: string;
  m_city: string;
  m_join_date: string;
  
  // Salary
  salary: number;
  sal_details: SalaryDetails;
}

export type TaskType = 'all' | 'imam' | 'khatib' | 'moaden' | 'cleaner' | 'hizb' | 'hadith' | 'insp';
