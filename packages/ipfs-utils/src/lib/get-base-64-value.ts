// TODO: explore more robust decoding: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
export const getBase64Value = (str: string) => window.atob(str.split(';base64,')[1] || '');
