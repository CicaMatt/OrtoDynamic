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
  | 'client-orthopedic'
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
  mobile: string;
  email: string;
  birthDate: string;
  birthMunicipality: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  district: string;
  doctorId: string;
  gender: string;
  note: string;
};

/** Subset of {@link Client} returned by the clients list endpoint. */
export type ClientListItem = Pick<
  Client,
  | 'code'
  | 'name'
  | 'surname'
  | 'fiscalCode'
  | 'birthDate'
  | 'birthMunicipality'
  | 'address'
  | 'city'
  | 'province'
  | 'phone'
>;

/** Orthopedic measurements and specifications for a client. */
export type ClientOrthopedic = {
  code: string;
  name: string;
  surname: string;
  // Footwear / insole
  shoeSize: string;
  shoeModel: string;
  width: string;
  collar: string;
  ankle: string;
  spur: string;
  lift: string;
  inclinedPlane: string;
  insoleType: string;
  collarPassage: string;
  anklePassage: string;
  // Brace / frame
  braceType: string;
  shoulderStraps: string;
  upToArmpit: string;
  frontFabricHeight: string;
  totalFrameHeight: string;
  axillaryDistance: string;
  // Body measurements
  waist: string;
  pelvisSize: string;
  measure24: string;
  neck: string;
  humerus: string;
  arm: string;
  wrist: string;
  pelvis: string;
  thigh: string;
  leg: string;
  // Notes
  clientNote: string;
  other: string;
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
