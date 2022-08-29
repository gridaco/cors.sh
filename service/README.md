# CORS.BRIDGED.CC
![cors.bridged.cc cover artwork](./docs/cors.bridged.cc-cover.png)



## The Web deployment
app.cors.bridged.cc is linked to repositoy https://github.com/bridgedxyz/proxy-client, deployed via aws amplify on `proxy-client`'s `app.cors.bridged.xyz` branch



**other cd options**
using serverless-finch (dropped & not used)
> this is an obsolete approach of deploying web to s3, which we are no longer using

in serverless.yml
```
custom:
  scripts:
    hooks:
      'before:package:createDeploymentArtifacts': yarn --cwd web build && sls client deploy
  client:
    bucketName: app.cors.bridged.cc
    distributionFolder: web/build
    indexDocument: index.html
    errorDocument: index.html

plugins:
    - serverless-finch
```


```
yarn add --dev serverless-plugin-scripts serverless-finch
```
