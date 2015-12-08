const Mongorito = require('mongorito');
const Model = Mongorito.Model;
const _ = require('underscore');

export const ModelTypes = {
    STRING: "STRING",
    OBJECT: "OBJECT",
    ARRAY: "ARRAY"
};

export const TypeAttributes = {
    REQUIRED: "REQUIRED",
    PERSISTED: "PERSISTED"
};

export class AbstractPersistenceModel extends Model {
    constructor(attributes, options, keys) {
        super(attributes, options);
        this.keys = keys();
        let result = initKeys(this.keys, attributes);
        this.attributes = result.attributes;
        this.requiredKeys = result.requiredKeys;
        this.persistedObjectKeys = result.persistedObjectKeys;
        this.persistedObjectArrays = result.persistedObjectArrays;
    }

    configure() {
        this.before('save', 'validate');
        this.before('save', 'createObjectsWhenNecessary');
    }

    *validate(next) {
        let obj = this.attributes;

        for (let key in obj) {
            if (_.contains(this.requiredKeys, key)) {
                if (!obj[key]) {
                    throw new Error(`${ key } must not be undefined!`);
                }
            }
        }

        yield next;
    }

    *createObjectsWhenNecessary(next) {
        for (let key in this.attributes) {
            if (_.contains(this.persistedObjectKeys, key)) {

                let value = this.keys[key];
                let object = this.attributes[key];

                if (object === undefined) {
                    continue;
                }

                if (!_.contains(object, '_id')) {
                    let model = new value['modelClass'](object);
                    yield model.save();
                }
                object = {'id': object._id};

            } else if (_.contains(this.persistedObjectArrays, key)) {

                let value = this.keys[key];
                let objectArray = this.attributes[key];
                console.log("pre: " + JSON.stringify(this.attributes));

                for (let i = 0; i < objectArray.length; i++) {
                    let object = objectArray[i];

                    if (object === undefined) {
                        continue;
                    }

                    let id = object['_id'];

                    if (!id) {
                        let model = new value['modelClass'](object);
                        yield model.save();
                        id = model.get('_id');
                    }
                    //object = {'id': object._id};
                    objectArray[i] = {
                        '_id': id
                    };
                    console.log("post: " + JSON.stringify(this.attributes));
                }
            }
        }

        yield next;
    }
}

function initKeys(keys, attributes) {
    let requiredKeys = [];
    let persistedObjectKeys = [];
    let persistedObjectArrays = [];

    let persistObj = {};

    for (let key in keys) {
        // copy persistent value if available
        if (attributes[key]) {
            persistObj[key] = attributes[key];
        }


        let keyValue = keys[key];

        // add to required attributes
        let attr = keyValue.attributes;
        if (hasAttribute(attr, TypeAttributes.REQUIRED)) {
            requiredKeys.push(key);
        }

        // add object attributes
        let type = keyValue.type;
        if (hasAttribute(attr, TypeAttributes.PERSISTED) && isType(type, ModelTypes.OBJECT)) {
            persistedObjectKeys.push(key);
        }

        if (hasAttribute(attr, TypeAttributes.PERSISTED) && isType(type, ModelTypes.ARRAY)) {
            let arrayType = keyValue.arrayType;
            if (isType(arrayType, ModelTypes.OBJECT)) {
                persistedObjectArrays.push(key);
            }
        }
    }

    return {
        attributes: persistObj,
        requiredKeys: requiredKeys,
        persistedObjectKeys: persistedObjectKeys,
        persistedObjectArrays: persistedObjectArrays

    };
}

function isType(actual, expected) {
    return actual === expected;
}

function hasAttribute(actual, expected) {
    return actual !== undefined && _.contains(actual, expected);
}


//global["AbstractPersistenceModel"] = AbstractPersistenceModel;
//global["ModelTypes"] = ModelTypes;
//global["TypeAttributes"] = TypeAttributes;
//
//let exports = [];
//
//module.exports = exports;