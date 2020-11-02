import decode from 'jwt-decode';

interface myToken {
  type?: string;
  alg?: string;
  userId: string;
  isAdmin: boolean;
  bannedUntil: string;
  tokenVersion: number;
  exp: number;
  iat: number;
}

interface myResponse {
  ok: boolean;
  accessToken: string;
}

let accessToken = '';

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken(): string {
  return accessToken;
}

export function isAccessTokenExpired(token: string): boolean {
  if (!token) {
    return true;
  }

  const decoded: myToken = decode(token);
  const hasExpired = decoded.exp * 1000 <= Date.now();

  return hasExpired;
}

export function clearAccessToken() {
  accessToken = '';
}

export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST',
    });

    const data: myResponse = await response.json();
    if (data.ok) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      clearAccessToken();
    }
  } catch (err) {
    console.error(err);
    clearAccessToken();
  }
  return '';
}
