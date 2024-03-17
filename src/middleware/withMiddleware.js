const withMiddleware = (middleware) => {
	return (request, env, ctx) => middleware(request, env, ctx);
};

export default withMiddleware
