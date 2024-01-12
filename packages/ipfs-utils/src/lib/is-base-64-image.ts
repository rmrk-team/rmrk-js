// TODO: perhaps make this more robust by checking for "data:" and then getting a media type from the mime type
export const isBase64Image = (str: string | null | undefined) =>
  str ? str.startsWith('data:image') : false;
