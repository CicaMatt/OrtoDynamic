export type Client = {
  idClient: string;
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

export type ClientListItem = Pick<
  Client,
  | 'idClient'
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

export type ClientOrthopedic = {
  idClient: string;
  name: string;
  surname: string;
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
  braceType: string;
  shoulderStraps: string;
  upToArmpit: string;
  frontFabricHeight: string;
  totalFrameHeight: string;
  axillaryDistance: string;
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
  clientNote: string;
  other: string;
};
