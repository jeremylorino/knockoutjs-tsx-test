import * as ko from "knockout";
import jsxFactory from "../jsxFactory";
import { Dictionary } from "../types";
import { AppItem } from "./AppMenuViewModel";
import { Renderable } from "../Renderable";

export default class AppMenu extends Renderable<{ items: ko.ObservableArray<AppItem> }> {
    public enabledApps: ko.PureComputed<AppItem[]>;
    public platformBaseUrl: string = "http://localhost";

    constructor(params: { items: ko.ObservableArray<AppItem> }) {
        super(params);
        this.enabledApps = ko.pureComputed(() => this.params.items().filter(app => app.isEnabled()));
    }

    handleOnChange(target: HTMLInputElement, item: AppItem) {
        this.params.items.valueWillMutate();
        item.field<boolean>("IsEnabled").value(target.checked);
        setTimeout(() => {
            this.params.items.valueHasMutated();
        }, 250);
    }

    render() {
        const enabledApps = this.params.items();
        const handleOnChange = this.handleOnChange.bind(this);
        return (
            <div>
                <div className="navbar-collapse collapse app-menu">
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
                                {enabledApps.map(v => {
                                    return (
                                        <li>
                                            <label htmlFor={v.field<string>("Id").value()}>
                                                {v.field("Name").displayValue()}
                                            </label>
                                            {v.field<boolean>("IsEnabled").value() ? (
                                                <input
                                                    id={v.field<string>("Id").value()}
                                                    type="checkbox"
                                                    checked
                                                    onchange={function () {
                                                        handleOnChange(this, v);
                                                    }}
                                                ></input>
                                            ) : (
                                                <input
                                                    id={v.field<string>("Id").value()}
                                                    type="checkbox"
                                                    onchange={function () {
                                                        handleOnChange(this, v);
                                                    }}
                                                ></input>
                                            )}
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
