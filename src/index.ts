import * as ko from "knockout";
import ApplicationPage from "./ApplicationPage";

ko.bindingHandlers.tsxBind = {
    init: function (element: Element, valueAccessor, allBindings, viewModel, bindingContext) {
        const jsxElement = bindingContext.$data.render() as HTMLElement;
        jsxElement.dataset.tsxbind = "true";
        element.appendChild(jsxElement);
    },
    update: function (element: Element, valueAccessor, allBindings, viewModel, bindingContext) {
        const currentJsxElement = element.querySelector(`[data-tsxbind="true"]`);
        const jsxElement = bindingContext.$data.render() as HTMLElement;
        jsxElement.dataset.tsxbind = "true";
        if (currentJsxElement) {
            currentJsxElement.replaceWith(jsxElement);
        } else {
            element.appendChild(jsxElement);
        }
    },
} as ko.BindingHandler;

ko.applyBindings(new ApplicationPage(), document.getElementById("myapp"));
