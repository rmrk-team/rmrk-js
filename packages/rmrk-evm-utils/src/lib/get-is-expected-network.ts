import type { EVM_NETWORKS } from './chain-mapping.js';

/**
 * Tests a value against a list of expected networks.
 *
 * Acts as a type guard for the expected networks.
 *
 * @testedValue The value to test. Can be anything, but can only return true for strings.
 * @expectedNetworks The list of expected networks. Can be any array of NETWORKS values.
 */
export const getIsExpectedNetwork = <T extends EVM_NETWORKS[]>(
  testedValue: unknown,
  expectedNetworks: T,
): testedValue is T[number] => {
  if (typeof testedValue !== 'string') return false; // types other than string can't be network strings
  return Object.values(expectedNetworks).includes(testedValue as EVM_NETWORKS); // check if the value is in the list of expected networks
};
