import * as ko from "knockout";
import Item, { ItemMetadata } from "../item";
import { Dictionary } from "../types";

export class AppItem extends Item {
    modules: ko.ObservableArray<Item> = ko.observableArray();
    isEnabled: ko.Computed<boolean>;

    constructor(basis: Dictionary, metadata: ItemMetadata) {
        super(basis, metadata);

        const modules = Array.from({ length: 5 }, (v, i) => ({
            Name: `App${i} Core`,
            IsEnabled: true,
            URL: `/App${i}Core`,
        })).map(
            v =>
                new Item(v, {
                    fields: [
                        { name: "Name", label: "Name", collectionName: "", required: true, type: "string" },
                        { name: "IsEnabled", label: "IsEnabled", collectionName: "", required: true, type: "boolean" },
                        { name: "URL", label: "url", collectionName: "", required: true, type: "string" },
                    ],
                })
        );
        this.modules(modules);

        this.isEnabled = ko.computed(() => {
            if (!this.modules().length) {
                return false;
            }
            const coreModule = this.modules().find(module => {
                return module.field("Name").value() === this.field("Name").value() + " Core";
            });
            return coreModule && coreModule.field("IsEnabled").value();
        });
    }
}

class Apps {
    items: ko.ObservableArray<AppItem> = ko.observableArray();

    constructor() {
        const apps: AppItem[] = Array.from({ length: 2 }, (v, i) => ({
            Name: `App${i}`,
            IsEnabled: true,
            URL: `/App${i}`,
        })).map(
            v =>
                new AppItem(v, {
                    fields: [
                        { name: "Name", label: "Name", collectionName: "", required: true, type: "string" },
                        { name: "IsEnabled", label: "IsEnabled", collectionName: "", required: true, type: "boolean" },
                        { name: "URL", label: "url", collectionName: "", required: true, type: "string" },
                    ],
                })
        );
        this.items(apps);
    }
}

export const apps = new Apps();

export default class AppMenuViewModel {
    public enabledApps: ko.Computed<AppItem[]>;
    public platformBaseUrl: string = "http://localhost";
    private params: Dictionary;

    constructor(params: Dictionary) {
        this.params = params;
        this.enabledApps = ko.computed(function () {
            return apps.items().filter(app => app.isEnabled());
        });
    }
}
