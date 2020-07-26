import * as ko from "knockout";
import Field, { FieldMetadataObject, Primitive } from "./field";
import { Dictionary, isNotNullObservable } from "./types";

function isObject(obj: any): obj is Function | Dictionary {
    const type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
}

function mapObject<T, U>(
    object: Dictionary<T>,
    iteratee: (val: T, key: string, object: Dictionary<T>) => U,
    context?: any
) {
    return Object.entries(object).reduce((results, [k, v]) => {
        results[k] = iteratee(v, k, object);
        return results;
    }, {} as Dictionary<U>);
}

export interface ItemMetadata {
    identifierName?: string;
    fields: FieldMetadataObject[];
    collection?: string;
}

export default class Item {
    _basis: Dictionary = {};
    _metadata: ItemMetadata = { fields: [] };
    _fields: Field[] = [];

    constructor(basis: Dictionary, metadata?: ItemMetadata) {
        this._basis = basis;
        this._metadata = {
            ...this._metadata,
            ...(metadata ?? {}),
        };

        this._fields = Object.entries(this._basis).map(([k, v]) => {
            const fieldMetadata = this._metadata.fields.find(m => m.name === k) ?? {
                name: k,
            };
            return new Field(v, fieldMetadata);
        });
    }

    public fields() {
        return this._fields;
    }

    public field<T = any>(name: string) {
        const field = this.findFieldByMetadata<T>(name);
        if (!field) {
            throw new Error(`There is no field [${name}] for this item`);
        }
        return field;
    }

    private findFieldByMetadata<T = any>(name: string) {
        return this.fields().find(f => f.metadata && f.metadata.name === name) as Field<T> | undefined;
    }

    private _getJSON<T = any>(node: Item | T[] | Dictionary<T> | Primitive): any {
        if (Array.isArray(node)) {
            return node.map(v => this._getJSON(v));
        } else if (node instanceof Item) {
            let json: Dictionary = {};
            node.fields().forEach(f => {
                if (isNotNullObservable(f.name)) {
                    json[f.name()!] = this._getJSON(node.field(f.name()!).value());
                }
            });
            return json;
        } else if (isObject(node)) {
            return mapObject(node, v => this._getJSON(v));
        } else {
            return node;
        }
    }

    public toJSON(): Dictionary {
        return this._getJSON(this);
    }
}
