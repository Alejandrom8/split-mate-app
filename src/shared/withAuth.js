import nookies from 'nookies';
import {createAuthHeader} from "@/shared/utils";

export function withAuth(gssp) {
  return async (ctx) => {
    const authHeader = createAuthHeader(ctx.req);
    if (!authHeader) {
      const nextUrl = encodeURIComponent(ctx.resolvedUrl || '/');
      return {
        redirect: {
          destination: '/login?next=' + nextUrl,
          permanent: false,
        },
      };
    }

    const next = typeof gssp === 'function' ? await gssp({ ...ctx, authHeader }) : { props: {} };
    return {
      ...next,
      props: { ...(next.props || {}) },
    };
  };
}