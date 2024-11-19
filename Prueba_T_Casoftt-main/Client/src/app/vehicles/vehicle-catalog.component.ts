import { Component, inject, signal, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../services/vehicles.service';
import { PaginatedResult } from '../_models/pagination';
import { Vehicle } from '../_models/vehicle';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectOption } from '../_models/selectOption';
import { BrandsService } from '../services/brands.service';


@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './vehicle-catalog.component.html',
})
export class VehiclesComponent implements OnInit, OnDestroy {
  // Señal para almacenar los resultados paginados.

  private brandsService = inject(BrandsService);
  paginatedResult = signal<PaginatedResult<Vehicle[]> | null>(null);
  
  // Inyección del servicio VehiclesService.
  private service = inject(VehiclesService);
  
  term: string = '';  // Término de búsqueda.
  year: number | null = null;  // Año de búsqueda.
  showMorePhotos: boolean = false;  // Para mostrar más fotos si es necesario.
  brandOptions: SelectOption[] = [];

  constructor() {
    // Configuración de efecto reactivo para actualizar los datos cuando cambie la señal.
    effect(() => {
  
    
      this.paginatedResult.set(this.service.paginatedResult());
      console.log(this.paginatedResult());
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Cargar los vehículos cuando el componente se inicializa.
    this.service.getVehicles().subscribe({
      next: (data: PaginatedResult<Vehicle[]>) => {
        this.paginatedResult.set(data);  // Actualizar la señal con los datos obtenidos.
      },
      error: (err) => {
        console.error('Error al obtener los vehículos:', err);
        // Manejo del error: podrías mostrar un mensaje o realizar alguna acción.
      }
    });
  }

  ngOnDestroy() {
    // Limpiar los datos cuando el componente se destruye.
    this.paginatedResult.set(null);
    // Limpiar la caché si el servicio lo maneja.
    this.service.clearCache();
    console.log('Componente destruido, datos limpiados.');
  }

  applyFilters() {
    // Aplicar filtros de búsqueda.
    const term = this.term.trim();
    if (term !== this.service.params().term) {
      this.service.params().term = term;  // Actualizar el término de búsqueda en el servicio.
    }

    if (this.year !== this.service.params().year) {
      this.service.params().year = this.year ?? 0;  // Actualizar el año en los parámetros del servicio.
    }

    // Realizar la búsqueda con los filtros aplicados.
    this.service.getVehicles().subscribe({
      next: (data: PaginatedResult<Vehicle[]>) => {
        this.paginatedResult.set(data);  // Actualizar los resultados paginados.
      },
      error: (err) => {
        console.error('Error al aplicar filtros:', err);
      }
    });
  }

  pageChanged(event: any) {
    // Cambiar la página según la selección del usuario.
    const totalPages = this.paginatedResult()?.pagination?.totalPages;

    // Si la página seleccionada es diferente, actualizar el número de página.
    if (this.service.params().pageNumber !== event.page) {
      this.service.params().pageNumber = event.page;
    }

    // Verificar si la página es válida antes de hacer la solicitud.
    if (event.page < 1 || event.page > totalPages!) {
      console.log('Página inválida, no se puede navegar');
      return;
    }

    if (event.page === 1 && totalPages === 1) {
      console.log('Ya estamos en la primera página, no se puede ir atrás');
      return;
    }

    if (totalPages! + 1 !== event.page) {
      this.service.params().pageNumber = event.page;
      this.ngOnInit();  // Volver a cargar los vehículos para la página seleccionada.
    }

    console.log('Solicitud para obtener vehículos de la página:', event.page);
  }

  navigateToVehicle(vehicleId: number | null | undefined) {
    // Navegar al detalle de un vehículo específico.
    this.service.navigateToVehicle1(vehicleId);
  }

  


  
}
