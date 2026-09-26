# SpaedrNG Cloudflare v1

Files:
- `index.html` — setup page
- `worker-template.js` — first Worker template

The setup page uses the Cloudflare API directly from the browser to create a D1 database, KV namespace, and upload the Worker script.

Important:
1. Do not commit an API token.
2. Use a dedicated Cloudflare API Token with minimum permissions.
3. This v1 creates the resources but does not yet attach the D1/KV bindings to the Worker.
4. v2 should upload Worker metadata with the actual D1/KV binding IDs and add config generation.
