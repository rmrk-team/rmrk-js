import { expect, test } from 'vitest';
import { base, mainnet } from 'wagmi/chains';
import {
  EVM_NETWORKS,
  mapEvmNetworkToSupportedChain,
} from './chain-mapping.js';

test('mapEvmNetworkToSupportedChain', async () => {
  expect(mapEvmNetworkToSupportedChain(EVM_NETWORKS.base)).not.toBe(mainnet);
  expect(mapEvmNetworkToSupportedChain(EVM_NETWORKS.base)).toBe(base);
});
