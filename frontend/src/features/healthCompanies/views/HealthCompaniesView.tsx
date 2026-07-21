import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { entityCreateRoute, entityDetailRoute } from '../../../app/navigation/routes';
import { fetchHealthCompanies } from '../api/healthCompanies';
import type { HealthCompanyListItem } from '../types';

const healthCompanyColumns: ReadonlyArray<EntityColumn<HealthCompanyListItem>> = [
  { key: 'idHealthCompany', label: 'ID Azienda', primary: true, filterable: false },
  { key: 'municipalityCode', label: 'Codice Comune', muted: true },
  { key: 'municipality', label: 'Comune' },
  { key: 'regionCode', label: 'Codice Regione', muted: true },
  { key: 'regionName', label: 'Denominazione Regione', muted: true },
  { key: 'companyCode', label: 'Codice Azienda', muted: true },
  { key: 'companyName', label: 'Denominazione Azienda' },
  { key: 'year', label: 'Anno', muted: true },
];

export function HealthCompaniesView() {
  const { navigate } = useNavigation();

  return (
    <EntityListView
      title="Aziende Sanitarie"
      columns={healthCompanyColumns}
      fetchItems={fetchHealthCompanies}
      rowKey={(company) => company.idHealthCompany}
      onRowClick={(company) =>
        navigate(entityDetailRoute('healthCompany', company.idHealthCompany))
      }
      onCreate={() => navigate(entityCreateRoute('healthCompany'))}
      loadingLabel="Caricamento aziende sanitarie..."
      emptyLabel="Nessuna azienda sanitaria trovata."
    />
  );
}
