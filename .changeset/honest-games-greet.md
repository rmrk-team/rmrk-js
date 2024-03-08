---
'@rmrk-team/ipfs-utils': minor
'@rmrk-team/nft-renderer': minor
'@rmrk-team/rmrk-2d-renderer': minor
'@rmrk-team/rmrk-evm-utils': minor
'@rmrk-team/rmrk-hooks': minor
'@rmrk-team/types': minor
---

Don't ship nft-renderer with css import, as this can break build tools, instead consumer will have to import css as needed
