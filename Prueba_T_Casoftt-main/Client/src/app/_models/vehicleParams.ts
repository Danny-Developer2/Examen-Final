import { BaseParams } from "./baseParams";

export class VehicleParms extends BaseParams {
  [x: string]: string | number | boolean;
  term: string  = "";
  year: number = 0;


  constructor(init?: Partial<VehicleParms>) {
    super();
    Object.assign(this, init);
  }
}
