export type Doctor = {
  idDoctor: string;
  surname: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  note: string;
};

export type DoctorListItem = Omit<Doctor, 'note'>;
