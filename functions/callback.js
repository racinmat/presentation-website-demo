// Cloudflare Pages Function: GET /callback
// Completes the GitHub OAuth flow and hands the token back to Decap CMS via postMessage.
// Required environment variables (set in CF Pages dashboard):
//   GITHUB_CLIENT_ID     — from your GitHub OAuth App
//   GITHUB_CLIENT_SECRET — from your GitHub OAuth App
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const { access_token, error } = await tokenRes.json();

  if (error || !access_token) {
    const html = buildMessage('error', { message: error || 'No token returned' });
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  const html = buildMessage('success', { token: access_token, provider: 'github' });
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

function buildMessage(status, content) {
  const msg = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!DOCTYPE html><html><body><script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(${JSON.stringify(msg)}, e.origin);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;
}
