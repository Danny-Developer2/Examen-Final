import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { VehicleParms } from '../_models/vehicleParams';
import { catchError, map, Observable, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { PaginatedResult } from '@_models/pagination';
import { Vehicle } from '@_models/vehicle';
import { Photo } from '@_models/photo';
import { environment } from '@evirement/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}vehicles`;
  paginatedResult = signal<PaginatedResult<Vehicle[]> | null>(null);
  cache = new Map();
  params = signal<VehicleParms>(new VehicleParms());
  private router: Router = new Router();
  vehicles: any[] = [];

  

  resetVehicleParams() {
    this.params.set(new VehicleParms());
  }

  getVehicles() {
    const cacheKey = Object.values(this.params()).join('-');
    const cachedResponse = this.cache.get(cacheKey);

    if (cachedResponse) {
      setPaginatedResponse(cachedResponse, this.paginatedResult);
      return of(cachedResponse);
    }

    let params = setPaginationHeaders(
      this.params().pageNumber!,
      this.params().pageSize!
    );

    if (this.params()['orderBy']) {
      params = params.append('orderBy', this.params()['orderBy']);
    } else {
      console.warn('El parámetro "orderBy" no está definido y se omitirá.');
    }

    if (this.params()['term']) {
      params = params.append('term', this.params()['term'] as string);
    }
    if (this.params()['year']) {
      params = params.append('year', this.params()['year'] as number);
    }

    console.log(this.baseUrl);
    return this.http
      .get<Vehicle[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((response) => {
          setPaginatedResponse(response, this.paginatedResult);
          console.log(response);
          this.cache.set(cacheKey, response);

          return response.body;
        }),
        catchError((err) => {
          console.error('Error al obtener los vehículos:', err);
          return of([]);
        })
      );
  }

  getByIdAync(id: number) {
    const itemToReturn: Vehicle = [...this.cache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Vehicle) => m.id === id);

    if (itemToReturn) return of(itemToReturn);

    return this.http.get<Vehicle>(`${this.baseUrl}${id}`);
  }

  update(model: any, id: number) {
    return this.http.put(`${this.baseUrl}${id}/edit`, model).pipe();
  }

  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.baseUrl + '/delete-photo-card/' + photo.id)
      .pipe();
  }

  createVehicle(vehicleData: any): Observable<Vehicle> {
    this.cache.clear();
    return this.http.post<Vehicle>(`${this.baseUrl}`, vehicleData);
  }
 
  navigateToVehicle1(vehicleId: number | null | undefined) {
    if (vehicleId !== null && vehicleId !== undefined) {
      this.router.navigate([`vehicle/`, vehicleId]);
    } else {
      console.error('ID de vehículo no válido');
    }
  }

  navigateToVehicleUpdate(vehicleId: number | null | undefined) {
    if (vehicleId !== null && vehicleId !== undefined) {
      this.router.navigate([`vehicle/${vehicleId}/edit`]);
    } else {
      console.error('ID de vehículo no válido');
    }
  }
  getById(id: number) {
    const vehicle: Vehicle = [...this.cache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Vehicle) => m.id === id);

    if (vehicle) return of(vehicle);

    return this.http.get<Vehicle>(`${this.baseUrl}${id}`);
  }
  clearCache() {
    this.cache.clear();
    console.log('Caché limpiada.');
  }
  deleteVehicle(vehicleId: number | null | undefined): void {
    if (vehicleId !== null && vehicleId !== undefined) {
      this.http
        .delete(`${this.baseUrl}/${vehicleId}`, { observe: 'response' })
        .subscribe(
          (response) => {
            console.log('Status code:', response.status);
            console.log('Response body:', response.body);
            if (response.status === 200) {
              console.log('Vehicle deleted successfully');
              this.getVehicles();
            }
          },
          (error) => {
            console.log(error)
            console.error('Error deleting vehicle:', error);
            console.error('Error status:', error.status); 
          }
        );
    } else {
      console.error('ID de vehículo no válido');
    }
  }


  updateVehicle(  vehicleId: number | null | undefined,
    updatedVehicle: any): Observable<Vehicle> {
    this.cache.clear();
    return this.http.put<Vehicle>(`${this.baseUrl}/${vehicleId}/edit`, updatedVehicle);
  }
 
 
  

  getVehicleDetails(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url);
  }
}



