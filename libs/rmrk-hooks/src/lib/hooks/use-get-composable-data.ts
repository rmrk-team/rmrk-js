import { Address } from 'viem';
import { Chain } from 'wagmi';

type Arguments = {
  tokenId: bigint;
  address: Address;
  assetId?: bigint;
  chainId: Chain['id'];
};

type Options = {
  enabled: boolean;
  fetcIpfsMetadata: boolean;
};

export const useGetComposableData = (
  { tokenId, address, assetId, chainId }: Arguments,
  { enabled = true, fetcIpfsMetadata = true }: Options,
) => {};
