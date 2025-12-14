export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const token = body?.token
  if (!token || typeof token !== 'string') {
    return Response.json({ ok: false, error: 'invalid_token' }, { status: 400 })
  }

  // Mock user info and temporary login token
  return Response.json({
    ok: true,
    user: {
      id: 'u_123',
      name: 'Mock User',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    loginToken: 'mock-login-token',
    expiresIn: 24 * 60 * 60,
  })
}
