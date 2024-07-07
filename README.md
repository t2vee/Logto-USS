# Logto Account Dashboard

A personal "My Account" dashboard built specially for use with the Logto Authentication Platform.  

~~Why not use page functions instead of 2 separate applications?~~
- ~~this is so this application stack can be run on platforms other than cloudflare.~~
  - ~~like for example using the cloudflare workerd runtime to run locally with docker~~
    
have now migrated the 2 projects together for easier development, project management and app deployment.

## demo
You can access the demo at [logto-demo-account-dashboard.pages.dev](https://logto-demo-account-dashboard.pages.dev/account/aboutme).  
and can login with 
- Username: demo@example.org
- Password: demopassword

## design
my design inspiration came from a few different account management dashboards but prodominiently
- [My Apple Id](https://appleid.apple.com/)
- [EA Account Management](https://myaccount.ea.com/cp-ui/aboutme/index)

with a few others like wargaming, github, reddit and spotify

## quick screenshot
![img.png](.github/images/img.png)


## OUTDATED. deployment via github actions will be avaliable soon
### ~~install via cloudflare~~
1. [Fork this repository](https://github.com/t2vee/Logto-Account-Dashboard/fork)
2. Setup the web client first by [creating a pages project in cloudflare](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages)
3. Connect it to your aforementioned forked repository
4. Once in your project on the cloudflare dashboard:
   - Go to Settings >> Builds and Deployments >> Build Configuration >> Edit configurations
     - Change the `Root directory (advanced)` to `web`
   - Go to Settings >> Environment Variables >> Production >> Edit variables
     - Add all variables according to the [.env.sample file](https://github.com/t2vee/Logto-Account-Dashboard/blob/main/web/.env.sample)
5. Redeploy Site
6. Now we setup the API. [Create a worker in cloudflare](https://dash.cloudflare.com/4edbc7ce6fccfcee64ffa1d9508d6aee/workers-and-pages/create)
   - **Take note of the name you give the worker**
7. Now we need to configure the worker:
   - In the forked repository navigate to
     - `worker/src/index.js` and on line `#17`
     - Edit the CORS origin of url of your web client.
       - [example](https://github.com/t2vee/Logto-Account-Dashboard/blob/main/worker/src/index.js#L17)
       - i know this is a very jank system and im working on making it easier i promise
   - Via Dashboard:
      - Go to Settings >> Triggers >> Custom Domain >> Add Custom Domain
        - Set a custom api domain for your worker. Remember this value!!
      - Go to Settings >> Variables >> Environment Variables >> Add Variable
        - Put any secret values in here and once done press 'encrypt'.
        - THIS IS INCREDIBLY IMPORTANT as it keeps the apis configuration secure!
   - Via Wrangler:
     - The rest of the configuration will need to be done via the CLI tool: [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
     - Clone the forked repo to your local machine `git clone <repo>`
     - Navigate into the project then worker directory `cd <repo>/worker`
     - Install and run wrangler: `npx wranger -v`
     - Configure the `wrangler.toml`, you can edit the [sample file](https://github.com/t2vee/Logto-Account-Dashboard/blob/main/worker/wrangler.toml.sample)
       - You can either use [wrangler](https://developers.cloudflare.com/workers/wrangler/commands/#kvnamespace) or the cloudflare dashboard in the Settings >> KV Namespace Bindings >> Add binding, to create the necessary KV bindings
       - If you decide to enable NSFW avatar checking please see [This repository for more information](https://github.com/t2vee/nsfwjs-avatar-service). Otherwise, you can omit both of these values
     - Once you have configured wrangler you can deploy it!. Run: `npx wrangler deploy`.
8. And your dashboard will be ready!

## install via docker (not yet ready)
1. Fork and clone repository
2. Fill out variables in `docker/.env` following the .env.sample
3. Deploy using docker compose `docker compose up -d` in the `docker` directory
4. Thats it!
5. You will need to configure a reverse proxy for the containers. Here is a [example nginx config file](https://github.com/t2vee/Logto-Account-Dashboard/tree/feature/docker/docker) 
