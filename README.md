# Logto Account Dashboard

A personal "My Account" dashboard built specially for use with the Logto Authentication Platform.

It is made up of 2 core components.  
- The vue3 web client
- The M2M api on cloudflare workers

Why not use page functions instead of 2 separate applications?
- this is so this application stack can be run on platforms other than cloudflare. 
  - like for example using the cloudflare workerd runtime to run locally with docker