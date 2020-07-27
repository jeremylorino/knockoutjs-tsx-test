import * as ko from "knockout";
import Item, { ItemMetadata } from "../item";
import { Dictionary } from "../types";

export class AppItem extends Item {
    modules: ko.ObservableArray<Item> = ko.observableArray();
    isEnabled: ko.Computed<boolean>;

    constructor(basis: Dictionary, metadata: ItemMetadata) {
        super(basis, metadata);

        this.isEnabled = ko.computed(() => this.field<boolean>("IsEnabled").value());
    }
}
