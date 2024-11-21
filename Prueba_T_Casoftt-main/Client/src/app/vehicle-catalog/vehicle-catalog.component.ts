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
import { PipeFiltersPipe } from 'src/app/pipe-filtes/pipe-filters.pipe';

@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    PipeFiltersPipe,
  ],
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
        console.log('Vehículos actuales:', this.paginatedResult());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.loadVehicles();
  }

  ngOnDestroy() {
    this.paginatedResult.set(null);
    this.service.clearCache();
    console.log('Componente destruido, datos limpiados.');
  }

  applyFilters() {
    const term = this.term;

    if (
      (term?.toLocaleLowerCase() || '') !==
      (this.service.params().term?.toLocaleLowerCase() || '')
    ) {
      this.service.params().term = term;
    }

    if (this.year !== this.service.params().year) {
      this.service.params().year = this.year ?? 0;
    }

    this.service.params().pageNumber = 1;

    this.loadVehicles();
  }

  loadVehicles() {
    this.service.getVehicles().subscribe({
      next: (data: PaginatedResult<Vehicle[]>) => {
        this.paginatedResult.set(data);
      },
      error: (err) => {
        console.error('Error al obtener los vehículos:', err);
      },
    });
  }

  pageChanged(event: any) {
    const totalPages = this.paginatedResult()?.pagination?.totalPages;

    if (
      this.service.params().pageNumber !== event.page &&
      event.page > 0 &&
      event.page <= totalPages!
    ) {
      this.service.params().pageNumber = event.page;
      this.loadVehicles();
      console.log('Página cambiada a:', event.page);
    } else {
      console.log('Página inválida o ya en la página solicitada');
    }
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
