import type { Address, Chain } from "viem";
import {
  astar,
  base,
  baseSepolia,
  hardhat,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  polygon,
  polygonMumbai,
  sepolia,
} from "wagmi/chains";

export const NETWORK_CONTACTS_PROPS = {
  RMRKEquipRenderUtils: "RMRKEquipRenderUtils",
  RMRKBulkWriter: "RMRKBulkWriter",
  RMRKCollectionUtils: "RMRKCollectionUtils",
} as const;

export type NETWORK_CONTACTS_PROPS =
  (typeof NETWORK_CONTACTS_PROPS)[keyof typeof NETWORK_CONTACTS_PROPS];

export type NETWRORK_CONTRACT_TYPES = Record<NETWORK_CONTACTS_PROPS, Address>;
export type RMRKUtilityContracts = Record<Chain["id"], NETWRORK_CONTRACT_TYPES>;

export const EVM_RMRK_CONTRACTS = {
  [moonbeam.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x3bd52D2F911A1243f681d36f1C28bcC6aaa26ef6",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0xb6ccec23d23b4ed3f623cafbc90cfff32dbf1834",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x244eE3b7F2692191BdA9E9E236e4D2008dd35Ce9",
  },
  [mainnet.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0xEEDA3E023A8f0Db4E038f2d16d3CF39369D5bA8C",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0xA1bE03772e25001df2B8A3F4FC88d8d3810A285e",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x388e1d9b6509ad62c162cd68ccefa84e09aa8280",
  },
  [sepolia.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x6Ee72618573b4c7484D4Ee46b04f4b271a81e882",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0xee04d24462A3952aC8f64F23f5F16e0fFFb5b6CC",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x3ea5D7985718B6bFa75172Dcd0a79E4c587a6694",
  },
  [polygon.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x4e42678e426fdd147a7cf509dd6673b1853e12ed",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0x28F5550315182D8446e9BFa5eD24a7796ee6e2a1",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x7cD79daAF8E178Fb4Af7017608633e23587c167e",
  },
  [polygonMumbai.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x5b583eDC4e212Fb737894D2bE44fa7D0805f0774",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0xA799A6b45ED9BeE6A9bE436aef29469b9BE0DE3F",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0xf57160A562cD87dC786C7388b75BaBAe7EfB60C9",
  },
  [moonbaseAlpha.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0xC8EBEdb00cBE44da99c3eE1f0c6F5F5BdEf67843",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0x3d3295D71138078df5F470A22628ec4377416e5d",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x6407d7D24023348Ff660b6F5Fa0F5D644953cf2c",
  },
  [base.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x59E1038E3C94B7EFF7C24B0A2d56DBfc606C1b7C",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0x91d098a91faf61984F965C3A202Ad30747dae275",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0xBa1eA71FF1695C3fe8dfBC774Af30448316E98dc",
  },
  [baseSepolia.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x0665ddcACB4064044343fb0DBb368Be3851caB4f",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0xb4F28c86808872f7B368893cbc975F764aD0fdB5",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x4aCFECbA1a5d83a6D8868E55f784b9d5453d1339",
  },
  [astar.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x248ab178b3342bc843BE7Aacc88eCf3cbf2E25d3",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0x5B01637FD17c1ac79df13dFF4F7080Fdd4cfEC46",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0xCeecc3C73284CfB9d3AB87F8b653D14Bd3b65FeC",
  },
  [hardhat.id]: {
    [NETWORK_CONTACTS_PROPS.RMRKEquipRenderUtils]:
      "0x0000000000000000000000000000000000000000",
    [NETWORK_CONTACTS_PROPS.RMRKCollectionUtils]:
      "0x0000000000000000000000000000000000000000",
    [NETWORK_CONTACTS_PROPS.RMRKBulkWriter]:
      "0x0000000000000000000000000000000000000000",
  },
} as const satisfies RMRKUtilityContracts;
