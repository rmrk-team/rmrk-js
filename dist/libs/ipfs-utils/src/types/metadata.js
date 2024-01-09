"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenseaDisplayType = exports.OpenseaDateDisplayType = exports.OpenseaNumericDisplayType = void 0;
exports.OpenseaNumericDisplayType = {
    number: 'Number',
    boost_number: 'Boost Number',
    boost_percentage: 'Boost Percentage',
};
exports.OpenseaDateDisplayType = {
    date: 'Date',
};
exports.OpenseaDisplayType = { ...exports.OpenseaNumericDisplayType, ...exports.OpenseaDateDisplayType };
