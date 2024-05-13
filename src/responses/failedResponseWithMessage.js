export default (error) => Response.json(error, { status: error.status || 400, headers: { 'Content-Type': 'application/json' } })
