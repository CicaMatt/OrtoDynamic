export type View =
  | 'dashboard'
  | 'clients'
  | 'doctors'
  | 'health-companies'
  | 'products'
  | 'quotes'
  | 'settings'
  | 'employees'
  | 'work-orders'
  | 'client-detail'
  | 'work-detail';

export type WorkOrderStatus = 'IN LAVORAZIONE' | 'TERMINATO' | 'IN ATTESA';

export type WorkOrder = {
  id: string;
  patient: string;
  technician: string;
  device: string;
  deadline: string;
  status: WorkOrderStatus;
};

export type ClientStatus = 'ATTIVO' | 'INATTIVO';

export type Client = {
  code: string;
  name: string;
  surname: string;
  fiscalCode: string;
  phone: string;
  email: string;
  birthDate: string;
  municipality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  district: string;
  gender: string;
};

export type Employee = {
  username: string;
  userType: string;
  assignment: string;
  name: string;
  surname: string;
  email: string;
};

export type Stat = {
  icon: string;
  label: string;
  value: string;
  accent: string;
};

export type ActivityItem = {
  icon: string;
  title: string;
  subtitle: string;
  time: string;
};
