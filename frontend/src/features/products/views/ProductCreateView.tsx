import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
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
        <EntityCreatePageHeader
          backLabel="Torna ai prodotti"
          listLabel="Prodotti"
          title="Nuovo Prodotto"
          onBack={() => navigate('products')}
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
