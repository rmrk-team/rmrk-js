export const isBase64Metadata = (str: string | null | undefined) =>
  str ? str.startsWith('data:application/json;base64') : false;
