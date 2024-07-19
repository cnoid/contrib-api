# Github Contributions APII

This lil' server reformats GraphQL from Github into a bit more commonly usable JSON format. Example with SvelteKit at the bottom.

## Usage:

Edit the file `.env.local` with your [Github token](https://github.com/settings/tokens). You only need user: `read:user`.

## FastAPI/Python

FastAPI version uses about 65-80% less RAM than a NodeJS server. I've tested multiple ways and images to build with and here are the results:

- Python:3.9-slim (RAM / CPU)
  - Idle: 33MB / 0.0-0.1%
  - Load: 47.3MB / 0.2-0.4%
  - Image Size: 141.3MB
- Alpine 3.14 Custom (RAM / CPU)
  - Idle: 
  - Load: 47.2 / 0.2-0.3%
  - Image Size: 280.7MB

Using Alpine brings a lot of positives, but it does bring you the big negative of increased image size and build time.

The Dockerfile in the repository is Python 3.9-slim. However:

<details><summary>Alpine Dockerfile</summary>

```
FROM alpine:latest AS builder-image
RUN apk update && apk add --no-cache \
    python3 \
    python3-dev \
    py3-pip \
    build-base \
    linux-headers \
    libffi-dev \
    openssl-dev

RUN python3 -m venv /home/apiusr/venv
ENV PATH="/home/apiusr/venv/bin:$PATH"
RUN /home/apiusr/venv/bin/pip install --no-cache --upgrade pip setuptools wheel
COPY requirements.txt .
RUN /home/apiusr/venv/bin/pip install --no-cache-dir -r requirements.txt
FROM alpine:latest AS runner-image

RUN apk update && apk add --no-cache \
    python3 \
    py3-pip
RUN adduser -D apiusr

COPY --from=builder-image /home/apiusr/venv /home/apiusr/venv
USER apiusr
RUN mkdir /home/apiusr/code
WORKDIR /home/apiusr/code
COPY . .

EXPOSE 80

ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/home/apiusr/venv
ENV PATH="/home/apiusr/venv/bin:$PATH"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--workers", "4"]



```
</details>


## React/NodeJS

It should be noted that this is not updated due to migration to FastAPI.

#### Docker

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
  
  `npm run build`

  `node serve`

  `http://yourip/api/contrib?userName=yourusername`
</details>

## Actually using the data:

The API server prints out rather standard JSON, [which can be used with SvelteKit for example](https://github.com/cnoid/svelte-github-contrib).

![image](https://github.com/cnoid/svelte-github-contrib/blob/abcc48695215c51e0b95e378c383155a17a474b3/contrib-api-customizable.png)

For reverse proxies, it's a very standard setup with no extra thought required. 
