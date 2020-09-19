import decode from 'jwt-decode';

interface myToken {
  type?: string;
  alg?: string;
  userId: string;
  isAdmin: boolean;
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

export function isAccessTokenExpired(): boolean {
  if (!accessToken) return true;

  const decoded: myToken = decode(accessToken);
  return decoded.exp * 1000 <= Date.now();
}

export function clearAccessToken() {
  accessToken = '';
}

export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST',
      // headers: {
      //   Authorization: accessToken ? `Bearer ${accessToken}` : '',
      // },
    });

    const data: myResponse = await response.json();
    if (data.ok) {
      setAccessToken(data.accessToken);
    } else {
      clearAccessToken();
    }
  } catch (err) {
    console.error(err);
  }
  return accessToken;
}
