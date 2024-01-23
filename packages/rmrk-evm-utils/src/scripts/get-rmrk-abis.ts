import * as fs from 'fs';
import { Abi } from 'abitype/zod';
import 'dotenv/config';
import type { Address } from 'viem';
import { base } from 'wagmi/chains';
import { EVM_RMRK_CONTRACTS, NETWORK_CONTACTS_PROPS } from '../index.js';

const BASESCAN_API_URL = 'https://api.basescan.org/api';

const getRmrkAbi = async (contractName: string, contractAddress: Address) => {
  const result = await fetch(
    `${BASESCAN_API_URL}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.BASESCAN_API_KEY}`,
  );
  const abiResponse = await result.json();
  const abi = Abi.parse(JSON.parse(abiResponse.result));

  await fs.promises.writeFile(
    `${process.cwd()}/src/abis/${contractName}.json`,
    JSON.stringify(JSON.parse(abiResponse.result), null, 2),
  );

  await fs.promises.writeFile(
    `${process.cwd()}/src/abis/${contractName}.ts`,
    `export const ${contractName} = ${JSON.stringify(
      JSON.parse(abiResponse.result),
      null,
      2,
    )} as const;`,
  );

  console.log(abi);
};

const getRmrkAbis = async () => {
  for (const contractName of Object.keys(EVM_RMRK_CONTRACTS[base.id])) {
    await getRmrkAbi(
      contractName,
      EVM_RMRK_CONTRACTS[base.id][
        contractName as keyof typeof NETWORK_CONTACTS_PROPS
      ],
    );
  }
};

getRmrkAbis();
