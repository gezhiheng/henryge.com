Henry's blog built with Next.js App Router, Markdown content, and Tailwind CSS.

## Requirements

- Node.js 20+
- pnpm 10.33.2 via Corepack

## Local development

Install dependencies and start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
pnpm dev    # start dev server
pnpm build  # build for production
pnpm start  # start production server
pnpm lint   # run ESLint
```

## Content workflow

- Add posts as Markdown files in `content/`.
- Post rendering is handled by `src/lib/posts.ts`.
- Shared formatting utilities live in `src/lib/`.

## Project structure

- `src/app/` Next.js routes, layouts, and route handlers
- `src/components/` shared UI and layout components
- `src/lib/` content helpers and formatting
- `content/` Markdown posts
- `public/` static assets

## Docker

Build and run locally:

```bash
docker build -t henrys-blog-next .
docker run --rm -p 3000:3000 henrys-blog-next
```

## Production deployment (Docker + Nginx)

This project is deployed with Docker and optionally reverse-proxied by Nginx.

1) Build and push images via GitHub Actions (see CI/CD below).
2) Server pulls `ghcr.io/<owner>/<repo>:latest`.
3) Container runs on port 3000.
4) Nginx proxies `henryge.com` to `127.0.0.1:3000`.

Example Nginx server block:

```nginx
server {
    listen 80;
    server_name henryge.com www.henryge.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name henryge.com www.henryge.com;

    ssl_certificate /etc/letsencrypt/live/henryge.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/henryge.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## CI/CD

- CI runs on pull requests and `main` (lint + build).
- CD builds and pushes a Docker image to GHCR, then deploys over SSH if secrets are set.

Required secrets for deployment:

- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, optional `DEPLOY_PORT`
- `GHCR_USERNAME`, `GHCR_TOKEN`

Deploy steps (high level):

1) Build Docker image from `Dockerfile`.
2) Push to `ghcr.io/<owner>/<repo>`.
3) SSH to the server and run:
   - `docker pull ghcr.io/<owner>/<repo>:latest`
   - restart container `henrys-blog-next` on port `3000:3000`

## Notes

- Production runs via Docker on port 3000; Nginx can reverse proxy to it.
- TypeScript build errors are ignored for deployment (`next.config.ts`).
- Next.js output mode is `standalone` to reduce image size and speed up pulls.
