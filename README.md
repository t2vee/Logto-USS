# Logto Account Dashboard

A personal "My Account" dashboard built specially for use with the Logto Authentication Platform.

It is made up of 2 core components.  
- The vue3 web client
- The M2M api on cloudflare workers

Why not use page functions instead of 2 separate applications?
- this is so this application stack can be run on platforms other than cloudflare. 
  - like for example using the cloudflare workerd runtime to run locally with docker

## demo
because of the way verification works i dont have a demo setup yet.  
however you are welcome to make a account for the build i have at [myid.mxs.app](https://myid.mxs.app), then delete your account from the "Account Actions" then "Terminate Account".

## design
my design inspiration came from a few different account management dashboards but prodominiently
- [My Apple Id](https://appleid.apple.com/)
- [EA Account Management](https://myaccount.ea.com/cp-ui/aboutme/index)

with a few others like wargaming, github, reddit and spotify

## quick screenshot
![img.png](.github/images/img.png)