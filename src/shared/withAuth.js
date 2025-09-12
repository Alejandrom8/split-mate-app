import nookies from 'nookies';

export function withAuth(gssp) {
  return async (ctx) => {
    const { at } = nookies.get(ctx);

    if (!at) {
      return {
        redirect: { destination: '/login', permanent: false },
      };
    }

    const next = typeof gssp === 'function' ? await gssp(ctx) : { props: {} };
    return {
      ...next,
      props: { ...(next.props || {}) },
    };
  };
}