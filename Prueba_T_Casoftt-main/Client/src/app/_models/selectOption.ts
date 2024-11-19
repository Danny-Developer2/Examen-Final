export class SelectOption {
    id: number | null = null;
    code: string | null = null;
    name: string | null = null;

    constructor(init?: Partial<SelectOption>) {
        Object.assign(this, init);
    }
}
