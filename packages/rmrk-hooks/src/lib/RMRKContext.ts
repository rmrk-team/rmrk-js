import type { RMRKUtilityContracts } from '@rmrk-team/rmrk-evm-utils';
import * as React from 'react';
import { useContext } from 'react';

type RMRKConfigInitial = {
  utilityContracts: RMRKUtilityContracts;
  ipfsGateway?: string;
};

export type RMRKConfig<utilityContracts extends RMRKUtilityContracts = RMRKUtilityContracts> = {
  utilityContracts: utilityContracts;
  ipfsGateway?: string;
};

export type ResolveRMRKConfig = {
  config: RMRKConfigInitial extends {
    config: infer config extends RMRKConfig;
  }
    ? config
    : RMRKConfig;
};

export type ConfigParameter<config extends RMRKConfig = RMRKConfig> = {
  config?: RMRKConfig | config | undefined;
};

export const RMRKContext = React.createContext<RMRKConfig | undefined>(undefined);

export type UseConfigReturnType<config extends RMRKConfig = RMRKConfig> = config;

export type UseConfigParameters<config extends RMRKConfig = RMRKConfig> = ConfigParameter<config>;

export function useRMRKConfig<
  config extends RMRKConfig = ResolveRMRKConfig['config'],
>(): UseConfigReturnType<config> {
  const config = useContext(RMRKContext);
  if (!config) throw new Error('No config found');
  return config as UseConfigReturnType<config>;
}
