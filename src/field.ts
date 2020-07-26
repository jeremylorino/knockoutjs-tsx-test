import * as ko from "knockout";

export type FieldType =
    | "boolean"
    | "string"
    | "integer"
    | "time"
    | "date"
    | "timestamp"
    | "duration"
    | "real"
    | "decimal"
    | "percent"
    | "length"
    | "list"
    | "image"
    | "usdollars"
    | "phonenumber"
    | "map";
export type Primitive = string | boolean | number;

export interface FieldMetadataObject {
    name: string;
    label: string;
    required: boolean;
    type: FieldType | null;
    collectionName: string;
}

export interface FieldMap<ValueType> {
    name: ko.PureComputed<string | null>;
    value: ko.Observable<ValueType>;
}

export default class Field<ValueType = any> implements FieldMap<ValueType> {
    public metadata: FieldMetadataObject | null;
    public value: ko.Observable<ValueType>;
    public name: ko.PureComputed<string | null>;
    public displayValue: ko.PureComputed<string>;
    public label: ko.PureComputed<string | null>;

    constructor(value?: any, metadata?: Partial<FieldMetadataObject>) {
        this.value = ko.observable(value);
        this.metadata = (metadata ?? null) as Required<FieldMetadataObject>;
        this.displayValue = ko.pureComputed(() => value);

        if (this.metadata !== null) {
            const _metadata = this.metadata;
            this.name = ko.pureComputed<string | null>(() => _metadata.name);
            this.label = ko.pureComputed<string | null>(() => _metadata.label ?? _metadata.name);
        } else {
            this.name = ko.pureComputed<string | null>(() => null);
            this.label = ko.pureComputed<string | null>(() => null);
        }
    }
}
