export const OpenseaNumericDisplayType = {
  number: 'Number',
  boost_number: 'Boost Number',
  boost_percentage: 'Boost Percentage',
};

export const OpenseaDateDisplayType = {
  date: 'Date',
};

export const OpenseaDisplayType = {
  ...OpenseaNumericDisplayType,
  ...OpenseaDateDisplayType,
};

export type MetadataAttribute = {
  display_type?: keyof typeof OpenseaDisplayType | 'string' | '';
  label: string;
  type?: 'float' | 'integer' | 'string';
  value: string | number;
  trait_type: string;
};

export type Metadata = {
  mediaUri?: string;
  thumbnailUri?: string;
  externalUri?: string;
  description?: string;
  name?: string;
  license?: string;
  licenseUri?: string;
  type?: string;
  locale?: string;
  attributes?: MetadataAttribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
  animation_url?: string;
  [key: string]: any;
};
