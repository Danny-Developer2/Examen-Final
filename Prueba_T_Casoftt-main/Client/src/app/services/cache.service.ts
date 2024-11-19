import { Injectable } from "@angular/core";
import { Vehicle } from "../_models/vehicle";

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  getById(id: number): any {
    return [...this.cache.values()]
      .flatMap(item => item.body)
      .find((vehicle: Vehicle) => vehicle.id === id);
  }

  clear(): void {
    this.cache.clear();
  }
}
