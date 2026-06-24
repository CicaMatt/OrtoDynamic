export type HealthCompany = {
  idHealthCompany: string;
  municipalityCode: string;
  municipality: string;
  regionCode: string;
  regionName: string;
  companyCode: string;
  companyName: string;
  year: string;
  males: string;
  females: string;
  total: string;
  district: string;
};

export type HealthCompanyListItem = Pick<
  HealthCompany,
  | 'idHealthCompany'
  | 'municipalityCode'
  | 'municipality'
  | 'regionCode'
  | 'regionName'
  | 'companyCode'
  | 'companyName'
  | 'year'
>;
