export async function hackathonRequest(action, { body, signal } = {}) {
  const response = await fetch(`/api/hackathon${body === undefined ? `?action=${encodeURIComponent(action)}` : ''}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify({ ...body, action }),
    credentials: 'same-origin', signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) throw Object.assign(new Error(data?.message || 'The hackathon API is not available.'), { status: response.status, requestId: data?.requestId })
  return data
}
