import { expect, test } from 'vitest';
import { EVM_NETWORKS } from './chain-mapping.js';
import { getIsEvmNetwork } from './get-is-evm-network.js';

test('getIsEvmNetwork', async () => {
  expect(getIsEvmNetwork('foo')).toBe(false);
  expect(getIsEvmNetwork(EVM_NETWORKS.base)).toBe(true);
  expect(getIsEvmNetwork('ethereum')).toBe(true);
});
