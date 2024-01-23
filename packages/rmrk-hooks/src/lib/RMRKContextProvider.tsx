'use client';

import * as React from 'react';
import type { RMRKUtilityContracts } from '@rmrk-team/rmrk-evm-utils';
import { useContext } from 'react';
import { EVM_RMRK_CONTRACTS } from '@rmrk-team/rmrk-evm-utils';
import { mergeDeepRight } from 'ramda';

type RMRKConfigInitial = {
  utilityContracts: RMRKUtilityContracts;
};

export type RMRKConfig<
  utilityContracts extends RMRKUtilityContracts = RMRKUtilityContracts,
> = {
  utilityContracts: utilityContracts;
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

export const RMRKContext = React.createContext<RMRKConfig | undefined>(
  undefined,
);

export type UseConfigReturnType<config extends RMRKConfig = RMRKConfig> =
  config;

export type UseConfigParameters<config extends RMRKConfig = RMRKConfig> =
  ConfigParameter<config>;

export function useRMRKConfig<
  config extends RMRKConfig = ResolveRMRKConfig['config'],
>(): UseConfigReturnType<config> {
  const config = useContext(RMRKContext);
  if (!config) throw new Error('No config found');
  return config as UseConfigReturnType<config>;
}

type Props = {
  config?: RMRKConfig;
  children?: React.ReactNode;
};

export const RMRKContextProvider = ({ children, config }: Props) => {
  const defaultConfig = {
    utilityContracts: EVM_RMRK_CONTRACTS,
  } satisfies RMRKConfig;
  const rmrkConfig = mergeDeepRight(defaultConfig, config || {});
  return (
    <RMRKContext.Provider value={rmrkConfig}>{children}</RMRKContext.Provider>
  );
};
