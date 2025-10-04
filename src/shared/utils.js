import nookies from "nookies";
import { useEffect, useState } from "react";

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
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" })
    .format(typeof d === "string" ? new Date(d) : d);

export const fmtDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Opciones de formato similares al ticket
  const options = {
    day: "2-digit",
    month: "short", // "ago", "sep", etc.
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  // Formatea en español (México)
  let formatted = new Intl.DateTimeFormat("es-MX", options).format(date);

  // Ajustes: Intl devuelve "28 ago 2025 2:14 p. m." (con espacio raro en "p. m.")
  // Reemplazamos para dejarlo más limpio → "28 ago 2025, 2:14 p.m."
  formatted = formatted.replace(" a. m.", " a.m.").replace(" p. m.", " p.m.");
  formatted = formatted.replace(" ", ", ");

  return formatted;
}

/**
 * 
 * @param {String} query 
 * @param {Number} delay 
 * @returns 
 */
export const useDebouce = (query, delay) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  return debouncedQuery;
}

export const fullName = (u) => {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || u.username || u.email;
};