export default (error) => Response.json(error, { status: error.status || 401, headers: { 'Content-Type': 'application/json' } })
