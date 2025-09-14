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

export const fmtMoney = (n, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n);

export const fmtDate = (d) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" })
    .format(typeof d === "string" ? new Date(d) : d);