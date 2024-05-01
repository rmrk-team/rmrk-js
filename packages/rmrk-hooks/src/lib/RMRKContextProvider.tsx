'use client';
import { EVM_RMRK_CONTRACTS } from '@rmrk-team/rmrk-evm-utils';
import { mergeDeepRight } from 'ramda';
import * as React from 'react';
import type { RMRKConfig } from './RMRKContext.js';
import { RMRKContext } from './RMRKContext.js';

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
