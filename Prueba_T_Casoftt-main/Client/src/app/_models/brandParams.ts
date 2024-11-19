import { BaseParams } from "./baseParams";

export class BrandParams extends BaseParams {
    constructor(init?: Partial<BrandParams>) {
        super();
        Object.assign(this, init);
    }
}
