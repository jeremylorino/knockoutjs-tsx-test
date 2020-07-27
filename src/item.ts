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

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

function id() {
    const d = new Date();
    return (
        guid() +
        "-" +
        d.getUTCFullYear() +
        (d.getUTCMonth() + 1) +
        d.getUTCDate() +
        "-" +
        d.getUTCHours() +
        d.getUTCMinutes() +
        d.getUTCSeconds()
    );
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

        if (!this._basis.Id) {
            this._basis.Id = id();
            this._metadata.fields.push({
                collectionName: "",
                label: "Id",
                name: "Id",
                required: true,
                type: "string",
            });
        }

        this._fields = Object.entries(this._basis).map(([k, v]) => {
            const fieldMetadata = this._metadata.fields.find(m => m.name === k) ?? {
                name: k,
            };
            const field = new Field(v, fieldMetadata);
            field.value.subscribe(v => (this._basis[field.name()!] = v));
            return field;
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
