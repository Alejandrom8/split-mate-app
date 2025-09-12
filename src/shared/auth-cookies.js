import { setCookie, destroyCookie } from 'nookies';

export function setAuthCookies(ctx, { accessToken, refreshToken, accessMaxAge = 60 * 10, refreshMaxAge = 60 * 60 * 24 * 7 }) {
  // Access token (corto)
  if (accessToken) {
    setCookie(ctx, 'at', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  // Refresh token (largo)
  if (refreshToken) {
    setCookie(ctx, 'rt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: refreshMaxAge,
    });
  }
}

export function clearAuthCookies(ctx) {
  destroyCookie(ctx, 'at', { path: '/' });
  destroyCookie(ctx, 'rt', { path: '/' });
}