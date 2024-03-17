export default (error) => new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } })
