# contrib-api
Node.js Github Contribution API


Usage:
Edit the file `.env.local` with your [https://github.com/settings/tokens](Github token). You only need user: `read:user`.
`docker build -t githubcontribapi .`
`docker run -d --restart unless-stopped -p 3000:3000 githubcontribapi`
`http://yourip:3000/api/contrib?userName=yourusername`

This just prints out a JSON format, [https://github.com/cnoid/svelte-github-contrib](which can be used with SvelteKit for example).

If you're wanting to put this behind say, nginx - you can do a normal reverse proxy. If you're putting it in a subfolder however, you'll need a rewrite rule as expected.
