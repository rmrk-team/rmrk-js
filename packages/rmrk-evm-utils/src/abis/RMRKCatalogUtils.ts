export const RMRKCatalogUtils = [
  {
    inputs: [],
    name: 'RMRKNotComposableAsset',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'catalog',
        type: 'address',
      },
    ],
    name: 'getCatalogData',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'type_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'metadataURI',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'catalog',
        type: 'address',
      },
      {
        internalType: 'uint64[]',
        name: 'partIds',
        type: 'uint64[]',
      },
    ],
    name: 'getCatalogDataAndExtendedParts',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'type_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'metadataURI',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'partId',
            type: 'uint64',
          },
          {
            internalType: 'enum IRMRKCatalog.ItemType',
            name: 'itemType',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'z',
            type: 'uint8',
          },
          {
            internalType: 'address[]',
            name: 'equippable',
            type: 'address[]',
          },
          {
            internalType: 'bool',
            name: 'equippableToAll',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
        ],
        internalType: 'struct RMRKCatalogUtils.ExtendedPart[]',
        name: 'parts',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'catalog',
        type: 'address',
      },
      {
        internalType: 'uint64[]',
        name: 'partIds',
        type: 'uint64[]',
      },
    ],
    name: 'getExtendedParts',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'partId',
            type: 'uint64',
          },
          {
            internalType: 'enum IRMRKCatalog.ItemType',
            name: 'itemType',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'z',
            type: 'uint8',
          },
          {
            internalType: 'address[]',
            name: 'equippable',
            type: 'address[]',
          },
          {
            internalType: 'bool',
            name: 'equippableToAll',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
        ],
        internalType: 'struct RMRKCatalogUtils.ExtendedPart[]',
        name: 'parts',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'parentAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'parentId',
        type: 'uint256',
      },
    ],
    name: 'getOrphanEquipmentsFromChildAsset',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'parentAssetId',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'slotId',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'childAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'childId',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'childAssetId',
            type: 'uint64',
          },
        ],
        internalType: 'struct RMRKCatalogUtils.ExtendedEquipment[]',
        name: 'equipments',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'parentAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'parentId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'catalogAddress',
        type: 'address',
      },
      {
        internalType: 'uint64[]',
        name: 'slotPartIds',
        type: 'uint64[]',
      },
    ],
    name: 'getOrphanEquipmentsFromParentAsset',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'parentAssetId',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'slotId',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'childAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'childId',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'childAssetId',
            type: 'uint64',
          },
        ],
        internalType: 'struct RMRKCatalogUtils.ExtendedEquipment[]',
        name: 'equipments',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'assetId',
        type: 'uint64',
      },
    ],
    name: 'getSlotPartsAndCatalog',
    outputs: [
      {
        internalType: 'uint64[]',
        name: 'parentSlotPartIds',
        type: 'uint64[]',
      },
      {
        internalType: 'address',
        name: 'catalogAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'allPartIds',
        type: 'uint64[]',
      },
      {
        internalType: 'address',
        name: 'catalogAddress',
        type: 'address',
      },
    ],
    name: 'splitSlotAndFixedParts',
    outputs: [
      {
        internalType: 'uint64[]',
        name: 'slotPartIds',
        type: 'uint64[]',
      },
      {
        internalType: 'uint64[]',
        name: 'fixedPartIds',
        type: 'uint64[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
