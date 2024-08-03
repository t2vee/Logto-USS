# Using the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

1. Clone the forked repo to your local machine `git clone <repo>`
2. Navigate into the project `cd <repo>`
3. Install and run wrangler: `npx wranger -v`, Male sure you have node and npm installed!
4. To create the KV Bindings needed you can use the `npx wrangler kv namespace create <NAMESPACE>`, [Info](https://developers.cloudflare.com/workers/wrangler/commands/#kv-namespace)
    - This will return a namespace id which you can place in the wrangler.toml.
    - Make sure the the namespace names you input are the same as listed in the wrangler.toml!
5. To create Var Secrets you can use the `npx wrangler secret put <KEY>`, [Info](https://developers.cloudflare.com/workers/wrangler/commands/#secret)
    - This will prompt you to provide a value for the secret and it will become avaliable to your application
    - Make sure the secret names you input are the same as listed in the wrangler.toml!
6. Commit the changes of the wrangler.toml to your forked repository    
