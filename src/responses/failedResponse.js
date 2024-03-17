export default () => new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
