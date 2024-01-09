"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase64Value = void 0;
// TODO: explore more robust decoding: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
const getBase64Value = (str) => atob(str.split(';base64,')[1]);
exports.getBase64Value = getBase64Value;
