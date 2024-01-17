import { expect, test } from 'vitest';
import { getIpfsCidFromGatewayUrl } from './get-ipfs-cid.js';

test('getIpfsCidFromGatewayUrl', async () => {
  expect(
    getIpfsCidFromGatewayUrl('https://cloudflare-ipfs.com/ipfs/foo'),
  ).to.not.eq('bar');

  expect(
    getIpfsCidFromGatewayUrl('https://cloudflare-ipfs.com/ipfs/foo'),
  ).to.eq('foo');

  expect(
    getIpfsCidFromGatewayUrl('https://cloudflare-ipfs.com/ipfs/foo/bar'),
  ).to.eq('foo/bar');
});
