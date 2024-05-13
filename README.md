# Logto Account Dashboard

A personal "My Account" dashboard built specially for use with the Logto Authentication Platform. Built with nothing but Vue3 and shadcn-vue.  

Designed to run hand in hand with:
 - [mxs-account-cf-worker](https://github.com/t2vee/logto-account-cf-worker), A Cloudflare worker designed to interact with the Logto Admin API
 - [mxs-avatar-service](https://github.com/t2vee/mxs-avatar-service), A custom NodeJS server for basic avatar management and image manipulation

## Running your own instance
Pretty damn easy.  
1. Edit the environment variables laid out in `.env.sample`, you may omit the optional values.
2. Deploy to any platform;
   3. Run via `npm run build` and expose the static files.
   4. Run via `wrangler deploy` via the Cloudflare Workers platform

## Keep in mind
This project is still in active development and not yet designed for production.  