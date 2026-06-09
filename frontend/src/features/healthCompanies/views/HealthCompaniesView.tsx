import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { fetchHealthCompanies } from '../api/healthCompanies';
import type { HealthCompanyListItem } from '../types';

const healthCompanyColumns: ReadonlyArray<EntityColumn<HealthCompanyListItem>> = [
  { key: 'id', label: 'ID', primary: true },
  { key: 'municipalityCode', label: 'Codice Comune', muted: true },
  { key: 'municipality', label: 'Comune' },
  { key: 'regionCode', label: 'Codice Regione', muted: true },
  { key: 'regionName', label: 'Denominazione Regione', muted: true },
  { key: 'companyCode', label: 'Codice Azienda', muted: true },
  { key: 'companyName', label: 'Denominazione Azienda' },
  { key: 'year', label: 'Anno', muted: true },
];

export function HealthCompaniesView() {
  const { openHealthCompanyDetail } = useNavigation();

  return (
    <EntityListView
      title="Aziende Sanitarie"
      columns={healthCompanyColumns}
      fetchItems={fetchHealthCompanies}
      rowKey={(company) => company.id}
      onRowClick={(company) => openHealthCompanyDetail(company.id)}
      loadingLabel="Caricamento aziende sanitarie..."
      emptyLabel="Nessuna azienda sanitaria trovata."
    />
  );
}
