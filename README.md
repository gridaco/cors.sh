# cors.sh

![cors.sh](./branding/artwork_cors.sh.jpg)

The only cors proxy service all you'll ever need.

| [Website](https://cors.sh) | [Proxy (proxy.cors.sh)](https://proxy.cors.sh) | [Playground](https://cors.sh/playground) | [Docs](https://cors.sh/docs) |

## Usage

**Quick testing**
Use [cors.sh/playground](https://cors.sh/playground) for testing out your cors blocked request.

**JS**

Add `proxy.cors.sh` to your request. For example,

```js
fetch("https://proxy.cors.sh/https://example.com/");
```

## [Playground](https://cors.sh/playground)

A built-in, in-browser CORS tester: paste any URL and watch the **direct** request get blocked by CORS, then watch the **same request through `proxy.cors.sh`** succeed — status, headers, and body, side by side. No API key required.

It defaults to [`mock.cors.sh`](https://mock.cors.sh/no-cors) — our own CORS-reject test API (`/no-cors`, `/wrong-origin`, `/needs-preflight`, `/allow-all`), handy whenever you need an endpoint that reliably _fails_ CORS.

## Projects using CORS.SH

- https://github.com/IMGROOT2/algo
- https://github.com/alejandroch1202/dollar-monitor
- https://github.com/Iconem/search-satellite-imagery/
- https://github.com/PavelLaptev/JSON-to-Figma
- https://github.com/TomRadford/shootdrop

## Contributing

Monorepo on pnpm + turbo, hosted on Cloudflare Workers (own accounts + billing). Requires Node ≥ 22.

```bash
git clone https://github.com/gridaco/cors.sh
cd cors.sh && nvm use && pnpm install
pnpm stack:up      # run the full stack locally (web + proxy + mock)
pnpm test:e2e      # run the test suite
```

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for the full local setup, [`SPEC.md`](./SPEC.md) for how the service behaves (source of truth), and [`AGENTS.md`](./AGENTS.md) if you're working with an AI coding agent.

## Disclaimer

1. This project's intend is to serve developers a reliable cors proxy service with fast response for their development.
   Using a cors proxy service to connect to your own server is not a best practice.
   We'll consistently optimize our service infra to keep the paid version affordable as possible.

2. cors.sh draws its lineage from Rob W's [cors-anywhere](https://github.com/Rob--W/cors-anywhere) (the proxy) and previously shipped a [Hoppscotch](https://github.com/hoppscotch/hoppscotch) fork as its playground — both MIT. The current service is a ground-up rebuild on Cloudflare Workers with its own built-in playground, also MIT-licensed.

## TODOs

- Cost optimization - make it more cheap & provide free version to all.
- Management console - Enable usesrs to create projects as much as they want.
- OSS Application pipeline - Make OSS developers to get their api key right-on and get verified later.

## Misc

**Design file**

[Figma](https://www.figma.com/file/aPfdtNb1aGFIN9p05cmmVY/cors.sh)
