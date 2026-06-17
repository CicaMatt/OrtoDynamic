import { apiGet } from '../../../shared/api/http';
import type { Employee } from '../types';

/** The list of employee accounts, ordered by username. */
export function fetchEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>('/employees/');
}
