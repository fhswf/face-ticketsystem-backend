const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * Extend a mongoose Schema.
 * @param schema The mongoose Schema to be extended.
 * @param extensionObj The mongoose Schema definition (first parameter of a mongoose Schema constructor).
 * @param options The Schema options (second parameter of a mongoose Schema constructor).
 * @returns {Schema} The extended mongoose Schema.
 */
function extendSchema(schema, extensionObj, options = {}) {
    return new Schema(
        Object.assign({}, schema.obj, extensionObj),
        options
    );
}

module.exports = {
    extendSchema
};