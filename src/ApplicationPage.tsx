import * as ko from "knockout";
import jsxFactory from "./jsxFactory";
import { Renderable } from "./Renderable";
import SWAppMenu from "./components/appMenu";
import { AppItem } from "./components/AppMenuViewModel";

export default class ApplicationPage extends Renderable {
    text: ko.PureComputed<string>;
    textSuffix: ko.Observable<number> = ko.observable(10);
    items: ko.ObservableArray<AppItem> = ko.observableArray();

    constructor() {
        super({});
        console.log("construct", this.constructor.name);
        this.text = ko.pureComputed<string>(() => `hey${this.textSuffix()}`);
        this.items.subscribe(value => {
            console.log(value);
        });
    }

    setTitle(title: string) {}

    handleButtonClick = () => {
        this.textSuffix(this.textSuffix() + 1);
        this.items.push(
            new AppItem(
                {
                    Name: `App${this.textSuffix()}`,
                    IsEnabled: true,
                    URL: `/App${this.textSuffix()}`,
                },
                {
                    fields: [
                        { name: "Name", label: "Name", collectionName: "", required: true, type: "string" },
                        { name: "IsEnabled", label: "IsEnabled", collectionName: "", required: true, type: "boolean" },
                        { name: "URL", label: "url", collectionName: "", required: true, type: "string" },
                    ],
                }
            )
        );
    };

    render() {
        return (
            <div>
                <h1>{this.text()}</h1>
                <button onclick={this.handleButtonClick}>click</button>
                <SWAppMenu items={this.items}></SWAppMenu>
            </div>
        );
    }
}
