import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { fetchProducts } from '../api/products';
import type { Product } from '../types';

const productColumns: ReadonlyArray<EntityColumn<Product>> = [
  { key: 'id', label: 'ID', primary: true },
  { key: 'code', label: 'Codice' },
  { key: 'description', label: 'Descrizione' },
  { key: 'price', label: 'Prezzo', muted: true },
  { key: 'year', label: 'Anno', muted: true },
];

export function ProductsView() {
  const { openProductDetail } = useNavigation();

  return (
    <EntityListView
      title="Prodotti"
      columns={productColumns}
      fetchItems={fetchProducts}
      rowKey={(product) => product.id}
      onRowClick={(product) => openProductDetail(product.id)}
      loadingLabel="Caricamento prodotti..."
      emptyLabel="Nessun prodotto trovato."
    />
  );
}
