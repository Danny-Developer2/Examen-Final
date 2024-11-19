import { Component, inject } from '@angular/core';
import { SelectOption } from '../_models/selectOption';
import { BrandsService } from '../services/brands.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands-vehicle.component.html'
})
export class BrandsVehicleComponent {

  private brandsService = inject(BrandsService);
  brandOptions: SelectOption[] = [];


  ngOnInit() {
    this.brandsService.getOptions().subscribe(
      (options: SelectOption[]) => {
        this.brandOptions = options;
        console.log('soy las marcas', this.brandOptions);
      },
      (error) => {
        console.error('Error al obtener las opciones de marca:', error);
      }
    );

  }

}
