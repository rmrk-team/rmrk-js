# RMRK js packages monorepo

A collection of typescript and frontend packages for working with [RMRK EVM NFTs](https://https://evm.rmrk.app).

> Note: Do not try to update `next.js` version, it's confirmed that `next@^13.4` will cause a constant object in `@pixi/core` become empty after `npm run build`.


## Packages

- [@rmrk-team/ipfs-utils](./packages/ipfs-utils) - IPFS utils for RMRK EVM NFTs
- [@rmrk-team/nft-renderer](./packages/nft-renderer) - React component that fetches NFT data and assets and renders 2d renderer
- [@rmrk-team/rmrk-2d-renderer](./packages/rmrk-2d-renderer) - Pixi.js based 2d composable renderer. Takes an array of AssetParts as input and renders them on HTML canvas
- [@rmrk-team/rmrk-hooks](./packages/rmrk-hooks) - Collection of react hooks for working with RMRK EVM NFTs
- [@rmrk-team/types](./packages/types) - Common Typescript types for RMRK EVM NFTs

## Example apps

- [composable-nft-renderer-app](./apps/composable-nft-renderer-app) - Next.js app that renders [@rmrk/nft-renderer](./packages/nft-renderer)


## Usage
See individual package READMEs for usage instructions.

### composable-nft-renderer-app
To run example app, run `pnpm dev:react` from root directory.

This app uses [Panda.css](https://panda-css.com) and [Ark.ui](https://ark-ui.com) for styling. When running the dev server, styles will automatically re-generate using postcss when appropriate files are changed, however if you need to manually generate styles, run `pnpm panda:prepare`.

## Development

This project uses [Biome.js](https://biomejs.dev) for code formatting (instead of prettier) and linting. To run both formatting and linting at any time, run `pnpm format && pnpm lint:fix`. Please visit Biome.js website to see how to install and use biome IDE plugin.

## Publishing a release

Build all packages and generate a new changeset
```bash
pnpm install && pnpm build && pnpm changeset
 ```

Create a new version from the changeset. Interactive prompt will appear, use spacebar to select All packages, then in most cases skip major and minor version (press enter instead of spacebar), this will fallback to `patch` semver.
```bash
pnpm changeset version
```

Check the git diff and commit the changelog, then finally publish all packages to npm
```bash
pnpm publish -r --access=public
```


## Credits:

- Initial code was forked from [Lightm nft-renderer](https://github.com/LightmNFT/nft-renderer) by [Ayuilos](https://github.com/Ayuilos)
- Project structure and setup was inspired by [Wagmi](https://github.com/wevm/wagmi)
