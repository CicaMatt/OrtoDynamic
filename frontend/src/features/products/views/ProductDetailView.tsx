import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { fetchProduct } from '../api/products';
import { productFields } from '../components/productFields';

const productActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Prodotto' },
];

export function ProductDetailView() {
  const { selectedProductId, navigate, goBack } = useNavigation();
  const { productDraft, startProductEdit, seedProduct, setProductField } = useEntityEdit();

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'product',
    selectedId: selectedProductId,
    fetcher: fetchProduct,
    missingMessage: 'Nessun prodotto selezionato.',
    draft: productDraft,
    seed: seedProduct,
  });

  if (loading) {
    return (
      <StatusMessage onBack={() => goBack('products')} backLabel="Torna ai prodotti">
        Caricamento prodotto...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => goBack('products')} backLabel="Torna ai prodotti" tone="error">
        {error ?? 'Nessun prodotto selezionato.'}
      </StatusMessage>
    );
  }

  const title = data.description || data.code || `Prodotto ${data.idProduct}`;
  const actions = productActions.map((action) => ({
    ...action,
    active: isEditing,
    onClick: !isEditing ? () => startProductEdit(data.idProduct) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => goBack('products') }}
          crumbs={[
            { label: 'Prodotti', onClick: () => navigate('products') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID: <span className="font-semibold text-on-surface">{data.idProduct}</span>
            </>
          }
        />
      }
      actionsTitle="Azioni prodotto"
      actions={actions}
    >
      <FieldSectionCard
        icon="inventory_2"
        title="Dati Prodotto"
        data={data}
        fields={productFields}
        editing={isEditing}
        onChange={setProductField}
      />
    </EntityDetailLayout>
  );
}
