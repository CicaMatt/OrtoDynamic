/** A workflow state from the `stato` table (scoped to a domain, e.g. Preventivi). */
export type Status = {
  id: number;
  name: string;
};

/** A permitted state change from the `stato_check` table. */
export type StatusTransition = {
  id: number;
  fromStatus: string;
  toStatus: string;
};
