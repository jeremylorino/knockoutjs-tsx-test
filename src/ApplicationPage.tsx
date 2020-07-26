import * as ko from "knockout";
import jsxFactory, { Renderable } from "./jsxFactory";
import SWAppMenu from "./components/appMenu";

export default class ApplicationPage extends Renderable {
    text: ko.PureComputed<string>;
    textSuffix: ko.Observable<number> = ko.observable(0);

    constructor() {
        super({});
        this.text = ko.pureComputed<string>(() => `hey${this.textSuffix()}`);
    }

    setTitle(title: string) {}

    handleButtonClick = (ev: MouseEvent) => {
        this.textSuffix(this.textSuffix() + 1);
    };

    render() {
        return (
            <div>
                <h1>{this.text()}</h1>
                <button onclick={this.handleButtonClick}>click</button>
                <SWAppMenu></SWAppMenu>
            </div>
        );
    }
}
