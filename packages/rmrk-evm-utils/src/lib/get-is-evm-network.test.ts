import { expect, test } from 'vitest';
import { getIsEvmNetwork } from './get-is-evm-network.js';
import { EVM_NETWORKS } from './chain-mapping.js';

test('getIsEvmNetwork', async () => {
  expect(getIsEvmNetwork('foo')).toBe(false);
  expect(getIsEvmNetwork(EVM_NETWORKS.base)).toBe(true);
  expect(getIsEvmNetwork('ethereum')).toBe(true);
});
