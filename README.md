# contrib-api
Github Contribution API (GraphQL)


Usage:


Edit the file `.env.local` with your [Github token](https://github.com/settings/tokens). You only need user: `read:user`.
#### Docker (easiest)

<details>
  <summary>Expand</summary>
  
`docker build -t githubcontribapi .`

`docker run -d --restart unless-stopped -p 3000:3000 githubcontribapi`

`http://yourip:3000/api/contrib?userName=yourusername`

</details>

#### Node.js

<details>
  <summary>Expand</summary>
  Requires Node.js 16

  `npm i`
  
  `npm run dev --host`

  `http://yourip:3000/api/contrib?userName=yourusername`
  </details>

This just prints out a JSON format, [which can be used with SvelteKit for example](https://github.com/cnoid/svelte-github-contrib).

![image](https://github.com/cnoid/svelte-github-contrib/blob/abcc48695215c51e0b95e378c383155a17a474b3/contrib-api-customizable.png)



If you're wanting to put this behind say, nginx - you can do a normal reverse proxy. If you're putting it in a subfolder however, you'll need a rewrite rule as expected.
