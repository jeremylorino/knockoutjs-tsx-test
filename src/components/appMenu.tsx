import * as ko from "knockout";
import jsxFactory from "../jsxFactory";
import { Dictionary } from "../types";
import { AppItem, apps } from "./AppMenuViewModel";
import { Renderable } from "../jsxFactory";

export default class SWAppMenu extends Renderable {
    public enabledApps: ko.Computed<AppItem[]>;
    public platformBaseUrl: string = "http://localhost";

    constructor(params: Dictionary) {
        super(params);
        this.enabledApps = ko.computed(function () {
            return apps.items().filter(app => app.isEnabled());
        });

        // setTimeout(() => {
        //     apps.items.unshift();
        // }, 1000);
    }

    render() {
        return (
            <div>
                <div className="navbar-collapse collapse stackwave-app-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown">
                            <a
                                href="#"
                                className="dropdown-toggle"
                                data-toggle="dropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <span className="glyphicon glyphicon-th"></span>
                            </a>
                            <ul className="dropdown-menu">
                                {this.enabledApps().map(v => {
                                    return (
                                        <li>
                                            <a href={v.field("URL").value()}>{v.field("Name").displayValue()}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

// const viewTemplate = (
//     <div>
//         <div className="navbar-collapse collapse stackwave-app-menu">
//             <ul className="nav navbar-nav">
//                 <li className="dropdown">
//                     <a
//                         href="#"
//                         className="dropdown-toggle"
//                         data-toggle="dropdown"
//                         role="button"
//                         aria-haspopup="true"
//                         aria-expanded="false"
//                     >
//                         <span className="glyphicon glyphicon-th"></span>
//                     </a>
//                     <ul className="dropdown-menu" data-bind="foreach: enabledApps">
//                         <li>
//                             <a data-bind="attr: { href: field('URL').value }, text: field('Name').displayValue"></a>
//                         </li>
//                     </ul>
//                 </li>
//             </ul>
//         </div>
//     </div>
// );

// export default viewTemplate;

// ko.components.register("sw-app-menu", {
//     viewModel: {
//         createViewModel: (params: Dictionary, componentInfo: ko.components.ComponentInfo) => {
//             console.log("componentInfo", componentInfo);

//             return new ViewModel(ko.utils.unwrapObservable(params));
//         },
//     },
//     template: viewTemplate.outerHTML,
// });
