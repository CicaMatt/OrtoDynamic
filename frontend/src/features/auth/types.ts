/** The authenticated user, mirrored from `/auth/session/` and `/auth/login/`. */
export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};
