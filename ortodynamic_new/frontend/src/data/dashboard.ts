import type { ActivityItem, Stat } from '../types';

export const stats: Stat[] = [
  { icon: 'patient_list', label: 'Pazienti totali', value: '1.248', accent: 'text-secondary' },
  { icon: 'receipt_long', label: 'Preventivi attivi', value: '42', accent: 'text-amber-600' },
  { icon: 'build', label: 'Lavorazioni in corso', value: '156', accent: 'text-blue-600' },
  { icon: 'payments', label: 'Fatturato mensile', value: '€45,2k', accent: 'text-emerald-600' },
];

export const recentActivity: ActivityItem[] = [
  {
    icon: 'check_circle',
    title: 'Lavorazione #4920 completata',
    subtitle: 'Paziente: Mario Rossi',
    time: '2 ore fa',
  },
  {
    icon: 'add_circle',
    title: 'Nuovo cliente registrato',
    subtitle: 'Clinica San Giuseppe',
    time: '5 ore fa',
  },
];
