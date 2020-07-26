import { isObservable, MaybeObservable, MaybeComputed } from "knockout";

type Observable<T = any> = ko.Observable<T> | ko.PureComputed<T> | ko.Computed<T>;

/**
 * From T, make required a set of properties whose keys are in the union K
 *
 * @example
 * interface HasOptional {
 *      prop1?: string;
 *      prop2?: number;
 * }
 * RequireProperty<HasOptional, 'prop1'>; // { prop1: string; prop2?: number; }
 * RequireProperty<HasOptional, 'prop1' | 'prop2'>; // { prop1: string; prop2: number; }
 */
export type RequireProperty<T, K extends keyof T> = Omit<T, K> &
    {
        [P in K]-?: T[K];
    };

/**
 * From T, remove null type from a set of properties whose keys are in the union K
 *
 * @example
 * interface HasNull {
 *      prop1: string | null;
 *      prop2: number | null;
 *      prop3: boolean;
 * }
 * RemoveNull<HasNull>; // { prop1: string; prop2: number; prop3: boolean; }
 * RemoveNull<HasNull, 'prop1'>; // { prop1: string; prop2: number | null; prop3: boolean; }
 */
export type RemoveNull<T, K extends keyof T = keyof T> = {
    [P in K]: T[P] extends null | infer U ? U : T[P];
};
export type RemoveNullObservable<T> = T extends ko.PureComputed<infer U | null>
    ? ko.PureComputed<U>
    : T extends ko.Computed<infer U | null>
    ? ko.Computed<U>
    : T extends ko.Observable<infer U | null>
    ? ko.Observable<U>
    : T;

export type Dictionary<T = any> = {
    [index: string]: T;
};

export type KeyValuePair<V> = { name: string | (() => string); value: V | (() => V) };

export function isKeyValuePair<V = any>(value: any): value is KeyValuePair<V> {
    return Reflect.has(value, "name") && Reflect.has(value, "value");
}

export function isArrayOfKeyValuePair<V = any>(value: any): value is KeyValuePair<V>[] {
    return Array.isArray(value) && value.every(isKeyValuePair);
}

export function isNotNullObservable<T>(
    value: MaybeObservable<T> | MaybeComputed<T>
): value is ko.PureComputed<T> extends ko.PureComputed<infer U | null>
    ? ko.PureComputed<U>
    : ko.Computed<T> extends Observable<infer U | null>
    ? ko.Computed<U>
    : ko.Observable<T> extends Observable<infer U | null>
    ? ko.Observable<U>
    : MaybeObservable<T> | MaybeComputed<T> {
    if (!isObservable(value)) {
        return false;
    }
    return value() !== null;
}
