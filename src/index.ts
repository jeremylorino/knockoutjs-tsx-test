import * as ko from "knockout";
import jsxFactory from "./jsxFactory";
import ApplicationPage from "./ApplicationPage";
import { createProxy, Renderable } from "./Renderable";

const JSXElementAttributeKey = "data-jsx-element";

ko.bindingHandlers.tsxBind = {
    init: function (element: Element, valueAccessor, allBindings, viewModel, bindingContext) {
        const instance = createProxy(
            bindingContext.$rawData as Renderable,
            (target, propertyKey) => propertyKey === "render",
            target => {
                function render() {
                    return jsxFactory.createElement(ApplicationPage as any);
                }
                return render;
            }
        );
        const jsxElement = instance.render();
        jsxElement.dataset.tsxBind = "true";
        element.append(jsxElement);
    },
    update: function (element: Element, valueAccessor, allBindings, viewModel, bindingContext) {
        const value = ko.unwrap(valueAccessor());

        const currentJsxElement = element.querySelector(`[data-tsx-bind="true"]:first-child`);
        const jsxElement = bindingContext.$data.render() as HTMLElement;
        jsxElement.dataset.tsxBind = "true";
        if (currentJsxElement) {
            currentJsxElement.replaceWith(jsxElement);
        } else {
            element.appendChild(jsxElement);
        }
    },
} as ko.BindingHandler;

ko.applyBindings(new ApplicationPage(), document.getElementById("myapp"));
