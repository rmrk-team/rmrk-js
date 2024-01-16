import { expect, test } from 'vitest';
import { getIsExpectedNetwork } from './get-is-expected-network.js';
import { EVM_NETWORKS } from './chain-mapping.js';

test('getIsExpectedNetwork', async () => {
  expect(getIsExpectedNetwork('ethereum', [EVM_NETWORKS.base])).toBe(false);
  expect(getIsExpectedNetwork('base', [EVM_NETWORKS.base])).toBe(true);
});
