# RMRK js packages monorepo

A collection of typescript and frontend packages for working with [RMRK EVM NFTs](https://https://evm.rmrk.app).

---

> Note: Do not try to update `next.js` version, it's confirmed that `next@^13.4` will cause a constant object in `@pixi/core` become empty after `npm run build`.


## Packages

- [@rmrk-team/nft-renderer](./packages/nft-renderer) - React component that fetches NFT data and assets and renders 2d renderer <a href="https://www.npmjs.com/package/@rmrk-team/nft-renderer"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/nft-renderer?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/nft-renderer?style=flat" alt="Version"></picture></a>
- [@rmrk-team/rmrk-hooks](./packages/rmrk-hooks) - Collection of React hooks for working with RMRK EVM NFTs (WIP) <a href="https://www.npmjs.com/package/@rmrk-team/rmrk-hooks"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/rmrk-hooks?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/rmrk-hooks?style=flat" alt="Version"></picture></a>
- [@rmrk-team/rmrk-evm-utils](./packages/rmrk-evm-utils) - Typescript utils and actions for RMRK EVM NFTs (WIP) <a href="https://www.npmjs.com/package/@rmrk-team/rmrk-evm-utils"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/rmrk-evm-utils?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/rmrk-evm-utils?style=flat" alt="Version"></picture></a>
- [@rmrk-team/ipfs-utils](./packages/ipfs-utils) - IPFS utils for RMRK EVM NFTs (WIP) <a href="https://www.npmjs.com/package/@rmrk-team/ipfs-utils"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/ipfs-utils?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/ipfs-utils?style=flat" alt="Version"></picture></a>
- [@rmrk-team/rmrk-2d-renderer](./packages/rmrk-2d-renderer) - Pixi.js based 2d composable renderer. Takes an array of AssetParts as input and renders them on HTML canvas. Usually not used on it's own <a href="https://www.npmjs.com/package/@rmrk-team/rmrk-2d-renderer"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/rmrk-2d-renderer?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/rmrk-2d-renderer?style=flat" alt="Version"></picture></a>
- [@rmrk-team/types](./packages/types) - Common Typescript types for RMRK EVM NFTs (WIP) <a href="https://www.npmjs.com/package/@rmrk-team/types"><picture><source srcset="https://img.shields.io/npm/v/@rmrk-team/types?style=flat"><img src="https://img.shields.io/npm/v/@rmrk-team/types?style=flat" alt="Version"></picture></a>

## Example apps

- [composable-nft-renderer-app](./apps/composable-nft-renderer-app) - Next.js app that renders [@rmrk/nft-renderer](./packages/nft-renderer)


## Usage
See individual package READMEs for usage instructions.

### composable-nft-renderer-app
To run example app, run `pnpm dev:react` from root directory. Then view in browser, for example https://localhost:3002/base/0x011ff409bc4803ec5cfab41c3fd1db99fd05c004/399

This app uses [Panda.css](https://panda-css.com) and [Ark.ui](https://ark-ui.com) for styling. When running the dev server, styles will automatically re-generate using postcss when appropriate files are changed, however if you need to manually generate styles, run `pnpm panda:prepare`.

## Development

This project uses [Biome.js](https://biomejs.dev) for code formatting (instead of prettier) and linting. To run both formatting and linting at any time, run `pnpm format && pnpm lint:fix`. Please visit Biome.js website to see how to install and use biome IDE plugin.

## Publishing a release

Build all packages and generate a new changeset

When submitting a PR with a change that requires a new version, please run `pnpm changeset` and select appropriate type of version bump (major, minor or patch if none is selected). When PR is merged, the new version will be automatically published to npm


## Credits:

- Initial code was forked from [Lightm nft-renderer](https://github.com/LightmNFT/nft-renderer) by [Ayuilos](https://github.com/Ayuilos)
- Project structure and setup was inspired by [Wagmi](https://github.com/wevm/wagmi)
