import { getIsExpectedNetwork } from './get-is-expected-network';
import { EVM_NETWORKS } from './chain-mapping';
import { invariant } from './invariant';

export const getIsEvmNetwork = (value: unknown): value is EVM_NETWORKS => {
  return getIsExpectedNetwork(value, Object.values(EVM_NETWORKS));
};

export function assertIsEvmNetwork(value: unknown): asserts value is EVM_NETWORKS {
  invariant(getIsEvmNetwork(value), `Expected EVM network, got ${value}`);
}
