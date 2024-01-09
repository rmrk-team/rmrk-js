export declare const OpenseaNumericDisplayType: {
    number: string;
    boost_number: string;
    boost_percentage: string;
};
export declare const OpenseaDateDisplayType: {
    date: string;
};
export declare const OpenseaDisplayType: {
    date: string;
    number: string;
    boost_number: string;
    boost_percentage: string;
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
