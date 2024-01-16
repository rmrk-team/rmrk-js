import { expect, test } from 'vitest';
import { getChainIdByNetworkName } from './get-chain-id-by-network-name.js';
import {EVM_NETWORKS, mapChainIdToNetwork} from './chain-mapping.js';
import {base, mainnet} from 'wagmi/chains';

test('getChainIdByNetworkName', async () => {
  expect(getChainIdByNetworkName(EVM_NETWORKS.base)).toBe(base.id);
  expect(getChainIdByNetworkName('foo')).toBe(undefined);
});

test('mapChainIdToNetwork', async () => {
    expect(mapChainIdToNetwork(base.id)).toBe(EVM_NETWORKS.base);
    expect(mapChainIdToNetwork(mainnet.id)).not.toBe(EVM_NETWORKS.base);
});
