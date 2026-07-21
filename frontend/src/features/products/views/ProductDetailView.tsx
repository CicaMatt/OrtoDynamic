import { useState } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { deleteProduct, fetchProduct } from '../api/products';
import { productFields } from '../components/productFields';

const productActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Prodotto' },
  { id: 'delete', icon: 'delete', label: 'Elimina Prodotto', tone: 'danger' as const },
];

export function ProductDetailView() {
  const { productId } = useRoute('product-detail');
  const { navigate, back } = useNavigation();
  const { productDraft, startProductEdit, seedProduct, setProductField } = useEntityEdit();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'product',
    selectedId: productId,
    fetcher: fetchProduct,
    missingMessage: 'Nessun prodotto selezionato.',
    draft: productDraft,
    seed: seedProduct,
  });

  if (loading) {
    return (
      <StatusMessage onBack={() => back({ name: 'products' })} backLabel="Torna ai prodotti">
        Caricamento prodotto...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'products' })}
        backLabel="Torna ai prodotti"
        tone="error"
      >
        {error ?? 'Nessun prodotto selezionato.'}
      </StatusMessage>
    );
  }

  const title = data.description || data.code || `Prodotto ${data.idProduct}`;
  const actions = productActions.map((action) => {
    if (action.id === 'edit') {
      return {
        ...action,
        active: isEditing,
        onClick: !isEditing ? () => startProductEdit(data.idProduct) : undefined,
      };
    }
    return {
      ...action,
      onClick: !isEditing ? () => setDeleteDialogOpen(true) : undefined,
    };
  });

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => back({ name: 'products' }) }}
            crumbs={[
              { label: 'Prodotti', onClick: () => navigate({ name: 'products' }) },
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

      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Prodotto"
          message={`Confermi l'eliminazione del prodotto ${title}?`}
          confirmLabel="Elimina Prodotto"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteProduct(data.idProduct);
            navigate({ name: 'products' });
          }}
        />
      )}
    </>
  );
}
