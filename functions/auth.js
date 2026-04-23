// Cloudflare Pages Function: GET /auth
// Starts the GitHub OAuth flow for Decap CMS.
// Required environment variables (set in CF Pages dashboard):
//   GITHUB_CLIENT_ID — from your GitHub OAuth App
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    scope: 'repo',
    state,
    redirect_uri: `${url.origin}/callback`,
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
