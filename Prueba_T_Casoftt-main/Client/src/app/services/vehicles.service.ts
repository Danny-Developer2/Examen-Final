import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Vehicle } from '../_models/vehicle';
import { VehicleParms } from '../_models/vehicleParams';
import { catchError, map, Observable, of } from 'rxjs';
import { CacheService } from './cache.service';
import { Photo } from '../_models/photo';
import { environment } from '../../environments/environment.development';
import { Router, RouterModule } from '@angular/router';

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
  vehicles: any;

  

  resetVehicleParams() {
    this.params.set(new VehicleParms());
  }

  getVehicles() {
    const cacheKey = Object.values(this.params()).join('-');
    const cachedResponse = this.cache.get(cacheKey);

    // Si existe una respuesta en la caché, usa esa respuesta en lugar de hacer la solicitud.
    if (cachedResponse) {
      setPaginatedResponse(cachedResponse, this.paginatedResult);
      return of(cachedResponse); // Retorna un Observable para mantener consistencia.
    }

    // Configura los parámetros de paginación.
    let params = setPaginationHeaders(
      this.params().pageNumber!,
      this.params().pageSize!
    );

    // Verifica que `orderBy` no sea `undefined` antes de agregarlo a los parámetros.
    if (this.params()['orderBy']) {
      params = params.append('orderBy', this.params()['orderBy']);
    } else {
      console.warn('El parámetro "orderBy" no está definido y se omitirá.');
    }

    // Realiza la solicitud HTTP.
    console.log(this.baseUrl);
    return this.http
      .get<Vehicle[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((response) => {
          setPaginatedResponse(response, this.paginatedResult);
          console.log(response);
          this.cache.set(cacheKey, response); // Guarda la respuesta en la caché.

          return response.body; // Retorna solo el cuerpo de la respuesta.
        }),
        catchError((err) => {
          console.error('Error al obtener los vehículos:', err);
          return of([]); // Retorna un array vacío en caso de error para manejarlo de forma segura.
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

  createVehicle(vehicleData: any ): void  {
    
      // Asegúrate de que el objeto updatedVehicle tiene la estructura adecuada
      this.http
        .post<any>(`${this.baseUrl}/`, vehicleData, {
          observe: 'response',
        })
        .subscribe(
          (response) => {
            console.log('Status code:', response.status);
            console.log('Response body:', response.body);
            if (response.status === 200) {
              console.log('Vehicle updated successfully');
              this.getVehicles(); // Puedes volver a cargar la lista de vehículos
              // Lógica adicional como mostrar alertas o redirigir
            }
          },
          (error) => {
            console.error('Error updating vehicle:', error);
            console.error('Error status:', error.status); // Para atrapar el código de estado del error
          }
        );
    
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
              // this.router.navigate(['vehicles']); // Redirigir a la lista de vehículos
              // Lógica adicional como mostrar alertas o redirigir
            }
          },
          (error) => {
            console.error('Error deleting vehicle:', error);
            console.error('Error status:', error.status); // Para atrapar el código de estado del error
          }
        );
    } else {
      console.error('ID de vehículo no válido');
    }
  }

  updateVehicle(
    vehicleId: number | null | undefined,
    updatedVehicle: any
  ): void {
    if (vehicleId !== null && vehicleId !== undefined) {
      // Asegúrate de que el objeto updatedVehicle tiene la estructura adecuada
      this.http
        .put(`${this.baseUrl}/${vehicleId}/edit`, updatedVehicle, {
          observe: 'response',
        })
        .subscribe(
          (response) => {
            console.log('Status code:', response.status);
            console.log('Response body:', response.body);
            if (response.status === 200) {
              console.log('Vehicle updated successfully');

            
              
              // Puedes también mostrar un mensaje de éxito o alerta
              // this.toastService.add('Vehículo actualizado con éxito', 'success');
  
              // Redirigir a la lista de vehículos
              setTimeout(() => {
                this.router.navigate([`vehicles`]);
              }, 4000); 
            
  
              // Recargar los vehículos si es necesario, aunque ya están actualizados
              // this.getVehicles(); // Esta línea ya no es necesaria si actualizas localmente
            }
          },
          (error) => {
            console.error('Error updating vehicle:', error);
            console.error('Error status:', error.status); // Para atrapar el código de estado del error
          //   this.toastService.add('Error al actualizar el vehículo', 'danger');
          }
        );
    } else {
      console.error('ID de vehículo no válido');
      // this.toastService.add('ID de vehículo no válido', 'danger');
    }
  }
  

  
  getVehicleDetails(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
