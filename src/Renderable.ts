import * as ko from "knockout";
import { Dictionary } from "./types";

export function createProxy<T extends object>(
    proxyTarget: T,
    predicate: (target: T, propertyKey: PropertyKey) => boolean,
    func: (target: T, propertyKey: PropertyKey) => any
) {
    return new Proxy<T>(proxyTarget, {
        get: (target, p, receiver) => {
            if (predicate(target, p)) {
                const result = func(target, p);
                if (result) {
                    return result;
                }
            }
            return Reflect.get(target, p, receiver);
        },
        apply: (target, thisArg, argArray) => {
            console.log("apply");
            return Reflect.apply(target as any, thisArg, argArray);
        },
    });
}

export class Renderable<T extends Dictionary = {}> {
    children: ko.ObservableArray<Element> = ko.observableArray();

    constructor(protected params: T) {
    }
    render(): HTMLElement & { __tsxClass__?: Renderable<T> } {
        const elem: HTMLElement & { __tsxClass__?: Renderable<T> } = document.createElement('div');
        elem.__tsxClass__ = this;
        return elem;
    }

    append(...elements: Element[]) {
        this.children.push(...elements);
    }
}

export function isRenderable(value: any): value is typeof Renderable {
    return typeof value === typeof Renderable;
}
