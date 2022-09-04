# cors.sh

![cors.sh](./branding/artwork_cors.sh.jpg)

The only cors proxy service all you'll ever need.

| [Website](https://cors.sh) | [Proxy (proxy.cors.sh)](https://proxy.cors.sh) | [Playground](https://cors.sh/playground) |

## Usage

**Quick testing**
Use [cors.sh/playground](https://cors.sh/playground) for testing out your cors blocked request.

**JS**

Add `proxy.cors.sh` to your request. For example,

```js
fetch("https://proxy.cors.sh/https://example.com/");
```

## [`cors.sh/playground`](https://cors.sh/playground), The testing environment (forked from hoppscotch)

- [cors.sh/playground](https://cors.sh/playground)
- [gridaco/playground.cors.sh](https://github.com/gridaco/playground.cors.sh)
- [hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch)

## Disclaimer

1. This project's intend is to serve developers a reliable cors proxy service with fast response for their development.
   Using a cors proxy service to connect to your own server is not a best practice.
   We'll consistently optimize our service infra to keep the paid version affordable as possible.

2. The original code behind cors proxy is by Rob wu's cors-anywhere and the playground is forked from hoppscotch. both licensed under MIT, and our project cors.sh is licensed under Apache 2.0.
