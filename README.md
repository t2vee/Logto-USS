# Logto-USS (User Self Service)

A personal "My Account" dashboard built specially for use with the Logto Authentication Platform.  
Uses cloudflare pages + pages functions for a performant application with no server required!

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


### Installing and Configuring your dashboard
1. [Fork this repository](https://github.com/t2vee/Logto-USS/fork)
2. Read through the `wrangler.sample.toml` and modify the values accordingly
   - You may need to use the wrangler CLI to add some values like secrets and KV bindings. These can also be added through the cloudflare dashboard
   - Read more about using wrangler in the [WRANGLER.md](https://github.com/t2vee/Logto-USS/blob/main/WRANGLER.md)
3. Once filled out remove the old `wrangler.toml` and rename `wrangler.sample.toml` to `wrangler.toml`
4. Time to deploy the dashboard! Head over the the [Cloudflare Pages Deploy Page](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)
   - Follow the instructions to connecting your github account and selecting your forked repository.

## install via docker (not yet ready)
1. Fork and clone repository
2. Fill out variables in `docker/.env` following the .env.sample
3. Deploy using docker compose `docker compose up -d` in the `docker` directory
4. Thats it!
5. You will need to configure a reverse proxy for the containers. Here is a [example nginx config file](https://github.com/t2vee/Logto-Account-Dashboard/tree/feature/docker/docker) 
