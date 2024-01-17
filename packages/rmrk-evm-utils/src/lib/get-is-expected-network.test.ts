import { expect, test } from 'vitest';
import { EVM_NETWORKS } from './chain-mapping.js';
import { getIsExpectedNetwork } from './get-is-expected-network.js';

test('getIsExpectedNetwork', async () => {
  expect(getIsExpectedNetwork('ethereum', [EVM_NETWORKS.base])).toBe(false);
  expect(getIsExpectedNetwork('base', [EVM_NETWORKS.base])).toBe(true);
});
