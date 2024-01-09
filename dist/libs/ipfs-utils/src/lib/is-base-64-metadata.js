"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBase64Metadata = void 0;
const isBase64Metadata = (str) => str ? str.startsWith('data:application/json;base64') : false;
exports.isBase64Metadata = isBase64Metadata;
