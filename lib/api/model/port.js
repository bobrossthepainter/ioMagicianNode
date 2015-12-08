import { AbstractPersistenceModel, ModelTypes, TypeAttributes } from "../../core/model/abstract-persistence-model"

// define model
export class Port extends AbstractPersistenceModel {
    constructor(attributes, options) {
        super(attributes, options, Port.keys);
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
            controlableUnit: {
                type: ModelTypes.OBJECT,
                attributes: [TypeAttributes.PERSISTED],
                modelClass: ControlableUnit
            }
        };
    }
}


module.exports = {
    modelName: 'Port',
    model: Port
}