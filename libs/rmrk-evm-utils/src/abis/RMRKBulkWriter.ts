export const RMRKBulkWriter = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "RMRKCanOnlyDoBulkOperationsOnOwnedTokens",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RMRKCanOnlyDoBulkOperationsWithOneTokenAtATime",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "collection",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "assetId",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "slotPartId",
            "type": "uint64"
          }
        ],
        "internalType": "struct RMRKBulkWriter.IntakeUnequip[]",
        "name": "unequips",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "childIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "assetId",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "slotPartId",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "childAssetId",
            "type": "uint64"
          }
        ],
        "internalType": "struct IERC6220.IntakeEquip[]",
        "name": "equips",
        "type": "tuple[]"
      }
    ],
    "name": "bulkEquip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "collection",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "childIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "assetId",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "slotPartId",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "childAssetId",
            "type": "uint64"
          }
        ],
        "internalType": "struct IERC6220.IntakeEquip",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "replaceEquip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;