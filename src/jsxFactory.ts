import { Renderable, isRenderable } from "./Renderable";
type DefaultIntrinsicElementsAttributeOverrides = {
    children: {};
    role?: string;
    readonly?: string;
    "data-bind"?: string;
};

type HtmlElementProps<T extends Element, K extends keyof T = "children"> = Partial<
    Omit<T, K> & DefaultIntrinsicElementsAttributeOverrides
>;
type TargetedEvent<T> = Event & {
    target: EventTarget & T;
};

type DefaultIntrinsicElements = {
    [P in keyof HTMLElementTagNameMap]: P extends "button"
        ? HtmlElementProps<HTMLElementTagNameMap["button"]>
        : P extends "input"
        ? HtmlElementProps<HTMLElementTagNameMap["input"], "onchange"> & {
              type:
                  | "button"
                  | "checkbox"
                  | "color"
                  | "date"
                  | "datetime-local"
                  | "email"
                  | "file"
                  | "hidden"
                  | "image"
                  | "month"
                  | "number"
                  | "password"
                  | "radio"
                  | "range"
                  | "reset"
                  | "search"
                  | "submit"
                  | "tel"
                  | "text"
                  | "time"
                  | "url"
                  | "week";
              onchange: ((this: HTMLInputElement, ev: TargetedEvent<HTMLInputElement>) => any) | null;
          }
        : HtmlElementProps<HTMLElementTagNameMap[P]> & { disabled?: string };
};

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

const JSXElementAttributeKey = "data-jsx-element";

export default class JSXFactory {
    static createElement(
        tagName: keyof JSX.IntrinsicElements | typeof Renderable,
        attrs: { [key: string]: any } = {},
        ...children: any[] | any
    ) {
        attrs = attrs ?? {};
        let elem: ReturnType<Renderable["render"]>;

        if (isRenderable(tagName)) {
            const elementClass: Renderable = Reflect.construct(tagName, [attrs]);
            elem = elementClass.render();
            elem.__tsxClass__ = elementClass;
            elem.setAttribute(JSXElementAttributeKey, "true");
            elementClass.append(
                ...Array.from(elem.children).filter(
                    v => v.getAttribute && v.getAttribute(JSXElementAttributeKey) === "true"
                )
            );
            attrs = {};
        } else {
            elem = document.createElement(tagName);
        }

        if (attrs["className"]) {
            elem.className = attrs["className"];
        }

        if (attrs["htmlFor"]) {
            (elem as HTMLLabelElement).htmlFor = attrs["htmlFor"];
            attrs["for"] = attrs["htmlFor"];
            delete attrs["htmlFor"];
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
