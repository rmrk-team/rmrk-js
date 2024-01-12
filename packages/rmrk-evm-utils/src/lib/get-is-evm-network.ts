import { EVM_NETWORKS } from './chain-mapping.js';
import { getIsExpectedNetwork } from './get-is-expected-network.js';
import { invariant } from './invariant.js';

export const getIsEvmNetwork = (value: unknown): value is EVM_NETWORKS => {
  return getIsExpectedNetwork(value, Object.values(EVM_NETWORKS));
};

export function assertIsEvmNetwork(
  value: unknown,
): asserts value is EVM_NETWORKS {
  invariant(getIsEvmNetwork(value), `Expected EVM network, got ${value}`);
}
