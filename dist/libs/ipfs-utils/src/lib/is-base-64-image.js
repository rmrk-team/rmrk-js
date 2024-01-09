"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBase64Image = void 0;
// TODO: perhaps make this more robust by checking for "data:" and then getting a media type from the mime type
const isBase64Image = (str) => str ? str.startsWith('data:image') : false;
exports.isBase64Image = isBase64Image;
