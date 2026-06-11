import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { fetchProduct } from '../api/products';
import { productFields } from '../components/productFields';

const productActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Prodotto' },
];

export function ProductDetailView() {
  const { selectedProductId, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    productDraft,
    dataVersion,
    startProductEdit,
    seedProduct,
    setProductField,
  } = useEntityEdit();

  const isEditingProduct =
    editing && editTarget?.type === 'product' && editTarget.id === selectedProductId;

  const { data: product, loading, error } = useApiData(
    () =>
      selectedProductId
        ? fetchProduct(selectedProductId)
        : Promise.reject(new Error('Nessun prodotto selezionato.')),
    [selectedProductId, dataVersion],
  );

  useEffect(() => {
    if (isEditingProduct && product) seedProduct(product);
  }, [isEditingProduct, product, seedProduct]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('products')} backLabel="Torna ai prodotti">
        Caricamento prodotto...
      </StatusMessage>
    );
  }
  if (error || !product) {
    return (
      <StatusMessage onBack={() => navigate('products')} backLabel="Torna ai prodotti" tone="error">
        {error ?? 'Nessun prodotto selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingProduct && productDraft ? productDraft : product;
  const title = data.description || data.code || `Prodotto ${data.id}`;
  const actions = productActions.map((action) => ({
    ...action,
    active: isEditingProduct,
    onClick: !isEditingProduct ? () => startProductEdit(data.id) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('products') }}
          crumbs={[
            { label: 'Prodotti', onClick: () => navigate('products') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID: <span className="font-semibold text-[#343942]">{data.id}</span>
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
        editing={isEditingProduct}
        onChange={setProductField}
      />
    </EntityDetailLayout>
  );
}
