import { IncomingMessage, ServerResponse } from 'http';

export async function loginRedirectSSR(
  req: IncomingMessage,
  res: ServerResponse
) {
  const cookie = req?.headers?.cookie;

  const response = await fetch('http://localhost:4000/refresh_token', {
    method: 'POST',
    credentials: 'include',
    headers: cookie ? { cookie } : undefined,
  });

  const data = await response.json();

  if (!data.ok) {
    res.writeHead(302, { Location: '/login?next=' + req.url });
    res.end();
  }
}
