import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { PRODUCT_CREATE_REQUIRED, productCreateFields } from '../components/productFields';
import type { Product } from '../types';

export function ProductCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, productDraft, invalidFields, startProductCreate, setProductField } =
    useEntityEdit();

  const isCreating = editing && mode === 'create' && editTarget?.type === 'product';

  useEffect(() => {
    if (!isCreating) startProductCreate(PRODUCT_CREATE_REQUIRED);
  }, [isCreating, startProductCreate]);

  if (!isCreating || !productDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Product>;

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna ai prodotti', onClick: () => navigate('products') }}
          crumbs={[{ label: 'Prodotti', onClick: () => navigate('products') }, { label: 'Nuovo' }]}
          title="Nuovo Prodotto"
          subtitle={<>I campi contrassegnati con * sono obbligatori.</>}
        />
      }
    >
      <FieldSectionCard
        icon="inventory_2"
        title="Dati Prodotto"
        data={productDraft}
        fields={productCreateFields}
        editing
        onChange={setProductField}
        invalidKeys={invalidKeys}
      />
    </EntityDetailLayout>
  );
}
