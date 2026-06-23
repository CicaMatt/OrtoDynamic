import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { formatEuro } from '../../../shared/format/format';
import { fetchProducts } from '../api/products';
import type { Product } from '../types';

const productColumns: ReadonlyArray<EntityColumn<Product>> = [
  { key: 'id', label: 'ID', primary: true },
  { key: 'code', label: 'Codice' },
  { key: 'price', label: 'Prezzo', muted: true, render: (value) => formatEuro(value) },
  { key: 'year', label: 'Anno', muted: true },
  { key: 'description', label: 'Descrizione' },
];

export function ProductsView() {
  const { openProductDetail, openProductCreate } = useNavigation();

  return (
    <EntityListView
      title="Prodotti"
      columns={productColumns}
      fetchItems={fetchProducts}
      rowKey={(product) => product.id}
      onRowClick={(product) => openProductDetail(product.id)}
      onCreate={openProductCreate}
      loadingLabel="Caricamento prodotti..."
      emptyLabel="Nessun prodotto trovato."
    />
  );
}
