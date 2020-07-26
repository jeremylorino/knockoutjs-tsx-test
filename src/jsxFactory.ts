import { Dictionary } from "./types";
type DefaultIntrinsicElementsAttributeOverrides = {
    children: {};
    role?: string;
    readonly?: string;
    "data-bind"?: string;
};

type DefaultIntrinsicElements = {
    [P in keyof HTMLElementTagNameMap]: P extends "button"
        ? Partial<Omit<HTMLElementTagNameMap[P], "children"> & DefaultIntrinsicElementsAttributeOverrides>
        : Partial<
              Omit<HTMLElementTagNameMap[P], "children"> &
                  DefaultIntrinsicElementsAttributeOverrides & { disabled?: string }
          >;
};

export abstract class Renderable<T extends Dictionary = {}> {
    constructor(protected params: T) {}
    abstract render(): Element;
}

declare global {
    namespace JSX {
        interface ElementChildrenAttribute {
            children: {};
        }
        interface IntrinsicElements extends DefaultIntrinsicElements {}
        interface ElementClass extends Renderable {}
    }

    export const jsxFactory: JSXFactory;
}

function isEventHandler(key: string, value: any): value is EventListenerOrEventListenerObject {
    return key.toLowerCase().startsWith("on") && typeof value === "function";
}

export default class JSXFactory {
    static createElement(
        tagName: keyof JSX.IntrinsicElements | Function,
        attrs: { [key: string]: any } = {},
        ...children: any[] | any
    ) {
        attrs = attrs ?? {};
        if (typeof tagName === "function") {
            return new (tagName as any)().render();
        }
        const elem = document.createElement(tagName);
        if (attrs["className"]) {
            elem.className = attrs["className"];
        }

        for (const [key, value] of Object.entries(attrs)) {
            if (isEventHandler(key, value)) {
                elem.addEventListener(key.replace(/^on/i, ""), value);
            } else {
                elem.setAttribute(key, value);
            }
        }

        for (const child of children) {
            if (Array.isArray(child)) {
                elem.append(...child);
            } else {
                elem.append(child);
            }
        }
        return elem;
    }
}
