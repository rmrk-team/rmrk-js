import { expect, test } from 'vitest';
import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  containsCID,
  convertToDesiredGateway,
  sanitizeIpfsUrl,
} from './ipfs.js';

test('containsCID', async () => {
  expect(containsCID('https://cloudflare-ipfs.com/ipfs/foo').containsCid).to.be
    .false;

  expect(
    containsCID(
      'https://cloudflare-ipfs.com/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL',
    ).containsCid,
  ).to.be.true;

  expect(
    containsCID(
      'https://cloudflare-ipfs.com/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json',
    ).containsCid,
  ).to.be.true;

  expect(
    containsCID(
      'https://cloudflare-ipfs.com/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json',
    ).cid,
  ).to.eq('QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL');
});

test('convertToDesiredGateway', async () => {
  expect(() => convertToDesiredGateway('ipfs://ipfs/foo')).toThrowError(
    'url does not contain CID',
  );

  expect(
    convertToDesiredGateway(
      'ipfs://ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL',
    ),
  ).to.eq(
    `${
      DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.pinata]
    }/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL`,
  );

  expect(
    convertToDesiredGateway(
      'https://cloudflare-ipfs.com/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json',
      DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.nftStorage],
    ),
  ).to.eq(
    `${
      DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.nftStorage]
    }/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json`,
  );
});

test('sanitizeIpfsUrl', async () => {
  expect(sanitizeIpfsUrl('foo')).to.eq('');

  expect(sanitizeIpfsUrl('http://cloudflare-ipfs.com/ipfs/foo')).to.eq(
    'https://cloudflare-ipfs.com/ipfs/foo',
  );

  expect(
    sanitizeIpfsUrl(
      'ipfs://ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json',
    ),
  ).to.eq(
    `${
      DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.pinata]
    }/ipfs/QmPhzGxn1xyskk519vUJvvrc7FG3huU4B7kCg4VtbaexEL/1.json`,
  );
});
