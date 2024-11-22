import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsService } from '@services/brands.service';
import { SelectOption } from '@_models/selectOption';
import { PaginatedResult } from '@_models/pagination';
import { Brand } from '@_models/brands';

@Component({
  selector: 'app-brands-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands-vehicle.component.html'
})
export class BrandsVehicleComponent {

  paginatedResult = signal<PaginatedResult<Brand[]> | null>(null);



  private brandsService = inject(BrandsService);
  brandOptions: SelectOption[] = [];

  constructor() {
    

    effect(() => {
      this.paginatedResult.set(this.brandsService.paginatedResult());
    }, { allowSignalWrites: true })
  }

  ngOnInit() : void {
    this.brandsService.getPagedList();

  }

  pageChanged(event: any) {
    if (this.brandsService.params().pageNumber != event.page) {
      this.brandsService.params().pageNumber = event.page;
      this.brandsService.getPagedList();
    }
  }



}
