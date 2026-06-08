import { useMemo, useState } from 'react';
import { FieldValue } from '../components/common/FieldValue';
import { Icon } from '../components/common/Icon';
import { Pagination } from '../components/common/Pagination';
import { WorkOrderBadge } from '../components/common/StatusBadge';
import { ViewToolbar, type ToolbarFilters } from '../components/common/ViewToolbar';
import { useNavigation } from '../contexts/NavigationContext';
import { usePagination } from '../hooks/usePagination';
import { workOrders } from '../data/workOrders';
import type { WorkOrder } from '../types';

const columns = ['ID Lavoro', 'Paziente', 'Tecnico', 'Dispositivo', 'Scadenza', 'Stato'] as const;
const workOrderFilterColumns = [
  { key: 'id', label: 'ID Lavoro' },
  { key: 'patient', label: 'Paziente' },
  { key: 'technician', label: 'Tecnico' },
  { key: 'device', label: 'Dispositivo' },
  { key: 'deadline', label: 'Scadenza' },
  { key: 'status', label: 'Stato' },
] as const;

const quickFilterGroups = [
  {
    title: 'STATO',
    options: [
      { key: 'status', value: 'IN LAVORAZIONE', label: 'In lavorazione', dotColor: 'bg-[#FFD085]' },
      { key: 'status', value: 'TERMINATO', label: 'Terminati', dotColor: 'bg-[#A1D7A8]' },
      { key: 'status', value: 'IN ATTESA', label: 'In attesa', dotColor: 'bg-[#F6C2C0]' },
    ],
  },
];

export function WorkOrdersView() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ToolbarFilters>({});

  const filterOptions = useMemo(
    () =>
      workOrderFilterColumns.map((column) => ({
        ...column,
        options: getUniqueValues(workOrders.map((order) => String(order[column.key]))),
      })),
    [],
  );

  const filteredOrders = useMemo(
    () => filterWorkOrders(workOrders, searchValue, activeFilters),
    [searchValue, activeFilters],
  );

  const { pageItems, page, totalPages, totalItems, rangeStart, rangeEnd, setPage } =
    usePagination(filteredOrders);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Lavorazioni</h2>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={(key, value) => setActiveFilters((current) => ({ ...current, [key]: value }))}
          onClearFilters={() => setActiveFilters({})}
          quickFilterGroups={quickFilterGroups}
        />
      </header>

      <WorkOrdersTable orders={pageItems} />
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onPageChange={setPage}
      />
    </div>
  );
}

function WorkOrdersTable({ orders }: { orders: WorkOrder[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/50">
            {columns.map((col) => (
              <th
                key={col}
                className="font-label-caps text-label-caps text-on-surface-variant uppercase p-4"
              >
                {col}
              </th>
            ))}
            <th className="p-4 w-10" />
          </tr>
        </thead>
        <tbody className="text-body-md">
          {orders.length > 0 ? (
            orders.map((order, idx) => (
              <WorkOrderRow key={order.id} order={order} isLast={idx === orders.length - 1} />
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-6 text-center text-on-surface-variant">
                Nessuna lavorazione trovata.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function WorkOrderRow({ order, isLast }: { order: WorkOrder; isLast: boolean }) {
  const { openWorkDetail } = useNavigation();
  const borderClass = isLast ? '' : 'border-b border-outline-variant/30';

  return (
    <tr
      onClick={() => openWorkDetail(order.id)}
      className={`${borderClass} hover:bg-surface-container-low/50 transition-colors h-row-height cursor-pointer`}
    >
      <td className="p-4 font-medium text-primary hover:underline"><FieldValue value={order.id} /></td>
      <td className="p-4"><FieldValue value={order.patient} /></td>
      <td className="p-4"><FieldValue value={order.technician} /></td>
      <td className="p-4"><FieldValue value={order.device} /></td>
      <td className="p-4"><FieldValue value={order.deadline} /></td>
      <td className="p-4">
        <WorkOrderBadge status={order.status} />
      </td>
      <td className="p-4 text-center">
        <button
          onClick={(event) => event.stopPropagation()}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="more_vert" />
        </button>
      </td>
    </tr>
  );
}

function filterWorkOrders(orders: WorkOrder[], searchValue: string, activeFilters: ToolbarFilters) {
  const searchTerm = normalize(searchValue);

  return orders.filter((order) => {
    const searchableValues = [
      order.id,
      order.patient,
      order.technician,
      order.device,
      order.deadline,
      order.status,
    ];
    const matchesSearch =
      searchTerm.length === 0 || searchableValues.some((value) => normalize(value).includes(searchTerm));
    const matchesFilters = workOrderFilterColumns.every((column) => {
      const activeValue = activeFilters[column.key];
      return !activeValue || String(order[column.key]) === activeValue;
    });

    return matchesSearch && matchesFilters;
  });
}

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
