# Marina Wallet
Liquid Network browser extension


![mockup_marina-p-2000 2825524f](https://user-images.githubusercontent.com/3596602/163511145-3085879d-486c-42d1-880a-1f8ba3f98803.png)



## Install

Available on chrome store: https://chrome.google.com/webstore/detail/marina/nhanebedohgejbllffboeipobccgedhl

## Usage

Visit docs.vulpem.com: https://docs.vulpem.com/marina/introduction

## Development

Install dependencies.
```
yarn install
```

Run webpack bundler in watch mode.
```
yarn start
```

You can install the unpacked extension in `dist` inside your browser. Chrome-based browsers support HMR.

## Build

```
yarn build
yarn web-ext:build
```

The packaged extension will appear in `web-ext-artifacts` directory.

## Responsible disclosure

At Vulpem, we consider the security of our Marina Wallet a top priority. But even putting top priority status and maximum effort, there is still possibility that vulnerabilities can exist. 

In case you discover a vulnerability, we would like to know about it immediately so we can take steps to address it as quickly as possible.  

If you discover a vulnerability, please e-mail your findings to marinawallet@vulpem.com
