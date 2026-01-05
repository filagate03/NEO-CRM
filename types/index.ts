// Типы для пациентов
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  insuranceNumber?: string;
  balance: number;
  status: 'active' | 'inactive' | 'new';
  lastVisit?: string;
  nextAppointment?: string;
  assignedDoctor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для записей на приём
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number; // в минутах
  type: AppointmentType;
  status: AppointmentStatus;
  procedureIds: string[];
  notes?: string;
  price: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 
  | 'consultation' 
  | 'treatment' 
  | 'procedure' 
  | 'surgery' 
  | 'checkup' 
  | 'cleaning'
  | 'imaging'
  | 'emergency';

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

// Типы для процедур/лечения
export interface Procedure {
  id: string;
  name: string;
  category: ProcedureCategory;
  price: number;
  duration: number; // в минутах
  description?: string;
  code?: string; // код по классификатору
}

export type ProcedureCategory = 
  | 'diagnostics' 
  | 'therapeutic' 
  | 'surgical' 
  | 'orthodontic' 
  | 'prosthetic' 
  | 'esthetic' 
  | 'hygiene'
  | 'implant';

// Типы для плана лечения
export interface TreatmentPlan {
  id: string;
  patientId: string;
  name: string;
  description?: string;
  stages: TreatmentStage[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  status: TreatmentPlanStatus;
  progress: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentStage {
  id: string;
  name: string;
  procedures: string[];
  price: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  order: number;
  date?: string;
  notes?: string;
}

export type TreatmentPlanStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

// Типы для зубной формулы
export interface Tooth {
  id: string;
  number: number;
  name: string;
  quadrant: 'upper_right' | 'upper_left' | 'lower_left' | 'lower_right';
  status: ToothStatus;
  condition?: string;
  treatment?: string;
}

export type ToothStatus = 
  | 'healthy' 
  | 'caries' 
  | 'pulpitis' 
  | 'periodontitis' 
  | 'extraction' 
  | 'implant' 
  | 'crown' 
  | 'filling' 
  | 'absent'
  | 'braces';

// Типы для финансов
export interface Transaction {
  id: string;
  patientId?: string;
  patientName?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  method: PaymentMethod;
  description?: string;
  appointmentId?: string;
  date: string;
  createdAt: string;
}

export type PaymentMethod = 
  | 'cash' 
  | 'card' 
  | 'transfer' 
  | 'insurance' 
  | 'installment'
  | 'online';

// Типы для команды
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phone: string;
  email?: string;
  photo?: string;
  status: 'online' | 'offline' | 'busy' | 'on_break';
  loadPercent: number;
  rating: number;
  appointmentsToday: number;
  experience: number; // в годах
  education?: string;
  category?: string;
}

// Типы для аналитики
export interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  patients: {
    total: number;
    new: number;
    returning: number;
  };
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  procedures: {
    top: { name: string; count: number; revenue: number }[];
    byCategory: { category: string; count: number }[];
  };
  doctors: {
    performance: { name: string; revenue: number; count: number }[];
  };
}

// Типы для настроек
export interface ClinicSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  inn: string;
  ogrn?: string;
  directorName: string;
  workSchedule: WorkSchedule[];
  appointmentDuration: number;
  reminderHours: number;
  theme: 'light' | 'dark' | 'system';
  currency: string;
}

export interface WorkSchedule {
  day: number; // 0 - воскресенье, 1 - понедельник
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks?: { start: string; end: string }[];
}

// Типы для уведомлений
export interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'task' | 'system';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  actionUrl?: string;
}

// Типы для форм
export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  procedureIds: string[];
  notes?: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  insuranceNumber?: string;
  notes?: string;
}
