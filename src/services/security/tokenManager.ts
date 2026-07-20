/**
 * Access tokens intentionally live only in module memory. A production API must
 * issue refresh tokens through Secure, HttpOnly, SameSite cookies; the browser
 * never reads or persists those credentials.
 */
let accessToken: string | null = null;

export const tokenManager = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
