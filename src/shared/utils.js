import nookies from "nookies";

export function createAuthHeader(req) {
  const cookies = nookies.get({ req });
  const at = cookies.at;
  if (!at) return null;
  return {
    headers: {
      Authorization: `Bearer ${at}`,
    }
  };
}