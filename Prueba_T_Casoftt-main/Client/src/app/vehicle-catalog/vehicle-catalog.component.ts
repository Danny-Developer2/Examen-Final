import {
  Component,
  inject,
  signal,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBroom } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BrandsService } from '@services/brands.service';
import { VehiclesService } from '@services/vehicles.service';
import { PaginatedResult } from '@_models/pagination';
import { Vehicle } from '@_models/vehicle';
import { SelectOption } from '@_models/selectOption';

@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './vehicle-catalog.component.html',
})
export class VehiclesComponent implements OnInit, OnDestroy {
  faBroom = faBroom;
  faSearch = faSearch;

  

  private brandsService = inject(BrandsService);
  paginatedResult = signal<PaginatedResult<Vehicle[]> | null>(null);


  private service = inject(VehiclesService);
  private searchTerms = new Subject<string>();

  term: string = '';
  year: number | null = null;
  showMorePhotos: boolean = false;
  brandOptions: SelectOption[] = [];

  constructor() {
    effect(
      () => {
        this.paginatedResult.set(this.service.paginatedResult());
        console.log('soy los autos ',this.paginatedResult());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.service.getVehicles().subscribe({
      next: (data: PaginatedResult<Vehicle[]>) => {
        this.paginatedResult.set(data); 
      },
      error: (err) => {
        console.error('Error al obtener los vehículos:', err);
      },
    });
  }

  ngOnDestroy() {
    this.paginatedResult.set(null);
    this.service.clearCache();
    console.log('Componente destruido, datos limpiados.');
  }

  applyFilters() {
    const term = this.term;
    // const term = this.term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if ((term?.toLocaleLowerCase() || '') !== (this.service.params().term?.toLocaleLowerCase() || '')) {
      this.service.params().term = term;
    }
    

    if (this.year !== this.service.params().year) {
      this.service.params().year = this.year ?? 0;
    }

    this.service.getVehicles().subscribe({
      next: (data: PaginatedResult<Vehicle[]>) => {
        this.paginatedResult.set(data);
      },
      error: (err) => {
        console.error('Error al aplicar filtros:', err);
      },
    });
  }

  pageChanged(event: any) {
    const totalPages = this.paginatedResult()?.pagination?.totalPages;
    if (this.service.params().pageNumber !== event.page) {
      this.service.params().pageNumber = event.page;
    }

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
      this.ngOnInit(); 
    }

    console.log('Solicitud para obtener vehículos de la página:', event.page);
  }

  navigateToVehicle(vehicleId: number | null | undefined) {

    this.service.navigateToVehicle1(vehicleId);
  }
  onSearchChange() {
    this.searchTerms.next(this.term);
  }

  resetFilters() {
    this.term = '';
    this.year = null;
    this.service.resetVehicleParams();
    this.service.getVehicles();
  }
}
