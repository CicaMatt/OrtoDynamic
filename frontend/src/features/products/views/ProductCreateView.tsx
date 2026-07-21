import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { productCreateFields } from '../components/productFields';
import { useProductEditor } from '../useProductEditor';

export function ProductCreateView() {
  const { navigate } = useNavigation();
  const { draft, invalidFields, change } = useProductEditor();
  if (!draft) throw new Error('Product create route requires an active create session.');

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai prodotti"
          listLabel="Prodotti"
          title="Nuovo Prodotto"
          onBack={() => navigate({ name: 'products' })}
        />
      }
    >
      <FieldSectionCard
        icon="inventory_2"
        title="Dati Prodotto"
        data={draft}
        fields={productCreateFields}
        editing
        onChange={change}
        invalidKeys={invalidFields}
      />
    </EntityDetailLayout>
  );
}
