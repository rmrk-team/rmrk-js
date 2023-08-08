/**
 * The metadata interface follow RMRK-Spec
 * https://github.com/rmrk-team/rmrk-spec/blob/master/standards/abstract/entities/metadata.md
 */
export interface IMetadata {
  name: string;
  description?: string;
  type?: string;
  locale?: string;
  license?: string;
  licenseUri?: string;
  mediaUri?: string;
  thumbnailUri?: string;
  externalUri?: string;
  preferThumb?: boolean;
  properties?: {
    [k: string]: {
      type: string;
      value: any;
    };
  };
  animation_url?: string; // Opensea metadata standard compatible
  image?: string; // Deprecated
  external_url?: string; // Deprecated
}

/**
 * The metadata extension of `IMetadata`, more details:
 * https://lightm.notion.site/Recommended-allocation-way-for-Part-ID-of-Catalog-1e471ff9f38f49c191f68db6845bc353
 */
export interface ILightmCatalogMetadataExtension extends IMetadata {
  LIGHTM_CATALOG?: boolean;
  LIGHTM_CATALOG_PART_CLASS_NAMES?: Record<string, string>;
}
