import { AbstractPersistenceModel, ModelTypes, TypeAttributes } from "../../core/model/abstract-persistence-model"

// define model
export class ControlableUnit extends AbstractPersistenceModel {
    constructor(attributes, options) {
        super(attributes, options, ControlableUnit.keys);
    }

    static keys() {
        return {
            name: {
                type: ModelTypes.STRING,
                attributes: [TypeAttributes.REQUIRED]
            },
            description: {
                type: ModelTypes.STRING
            },
            address: {
                type: ModelTypes.STRING,
                attributes: [TypeAttributes.REQUIRED]
            },
            login: {
                type: ModelTypes.STRING
            },
            credentials: {
                type: ModelTypes.STRING
            },
            ports: {
                type: ModelTypes.ARRAY,
                arrayType: ModelTypes.OBJECT,
                attributes: [TypeAttributes.PERSISTED],
                modelClass: Port
            }
        };
    }
}

module.exports = {
    modelName: 'ControlableUnit',
    model: ControlableUnit
}