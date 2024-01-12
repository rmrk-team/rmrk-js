import {
  EVM_NETWORKS,
  mapEvmNetworkToSupportedChain,
} from './chain-mapping.js';

export const getChainIdByNetworkName = (network: EVM_NETWORKS) => {
  return mapEvmNetworkToSupportedChain(network)?.id;
};
