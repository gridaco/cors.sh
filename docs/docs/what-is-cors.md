---
title: What is CORS?
---

# What is `CORS` ?

`CORS` Cross-Origin Resource Sharing

## Do I need a cors proxy?

In short,

- **NO:** For your own backend
- **YES:** If..
  - Your front end is a plugin that runs on top of other sites. (e.g. shopify, figma plugin)
  - You are accessign third party api (e.g. instagram, twitter) and the api server responds with limited CORS headers.

## Okay, it seems I don't need cors proxy service, What can I do?

If you're application is a general web app and you have control over the backend, here are some quick guides for each backend frameworks.

- Express
- Koa
- Hapi
- Fastify
- NestJS
- AWS Lambda
