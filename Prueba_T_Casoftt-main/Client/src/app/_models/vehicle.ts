import { Photo } from "../_models/photo";
import { SelectOption } from "../_models/selectOption";

export class Vehicle {
  id: number | null = null;
  model: string | null = null;
  year: number | null = null;
  color: string | null = null;
  brand: SelectOption | null = null;
  photos: Photo[] = [];


  constructor(init?: Partial<Vehicle>) {
    Object.assign(this, init);
  }
}
