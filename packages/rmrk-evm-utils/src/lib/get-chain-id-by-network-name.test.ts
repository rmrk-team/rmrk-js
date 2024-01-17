import { expect, test } from 'vitest';
import { base, mainnet } from 'wagmi/chains';
import { EVM_NETWORKS, mapChainIdToNetwork } from './chain-mapping.js';
import { getChainIdByNetworkName } from './get-chain-id-by-network-name.js';

test('getChainIdByNetworkName', async () => {
  expect(getChainIdByNetworkName(EVM_NETWORKS.base)).toBe(base.id);
  expect(getChainIdByNetworkName('foo')).toBe(undefined);
});

test('mapChainIdToNetwork', async () => {
  expect(mapChainIdToNetwork(base.id)).toBe(EVM_NETWORKS.base);
  expect(mapChainIdToNetwork(mainnet.id)).not.toBe(EVM_NETWORKS.base);
});
