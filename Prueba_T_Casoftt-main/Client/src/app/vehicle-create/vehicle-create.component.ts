import { Component, effect, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectOption } from '@_models/selectOption';
import { BadRequest } from '@_models/badRequest';
import { BrandsService } from '@services/brands.service';
import { VehiclesService } from '@services/vehicles.service';
import { Vehicle } from '@_models/vehicle';
import { ToastrService } from 'ngx-toastr';

type PhotoType = {
  url: FormControl<string | null>;
  id: FormControl<number | null>;
};

type FormType = {
  brand: FormControl<SelectOption | null>;
  model: FormControl<string | null>;
  year: FormControl<number | null>;
  color: FormControl<string | null>;
  photos: FormArray<FormGroup<PhotoType>>;
};

@Component({
  selector: 'app-vehicle-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './vehicle-create.component.html',
})
export class VehicleCreateComponent {
  router = inject(Router);
  error = signal<BadRequest | null>(null);
  sanitizer = inject(DomSanitizer);
  url: string | null = null;
  private brandsService = inject(BrandsService);
  service = inject(VehiclesService);
  vehicleId: number | null = null;
  route = inject(ActivatedRoute);
  errorMessage: string | undefined;
  private toastr = inject(ToastrService)

  brandOptions: SelectOption[] = [];

  form = new FormGroup<FormType>({
    brand: new FormControl<SelectOption | null>(null, Validators.required),
    model: new FormControl<string | null>(null, Validators.required),
    year: new FormControl<number | null>(null, Validators.required),
    color: new FormControl<string | null>(null, Validators.required),
    photos: new FormArray<FormGroup<PhotoType>>([], Validators.required),
  });

  submitted = signal<boolean>(false);

  constructor() {
    this.brandsService.getOptions().subscribe((options) => {
      this.brandOptions = options;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getById(parseInt(id)).subscribe({
        next: (data: Vehicle) => {
          console.log('Datos del vehículo', data);

          this.form.patchValue({
            model: data.model,
            year: data.year,
            color: data.color,
          });

          const selectedBrand = this.brandOptions.find(
            (brand) => brand.id === data.brand?.id
          );
          if (selectedBrand) {
            this.form.controls.brand.setValue(selectedBrand);
          } else {
            console.log('Marca no encontrada:', data.brand);
          }

          data.photos.forEach((photo) => {
            const photoFormGroup = new FormGroup<PhotoType>({
              url: new FormControl(photo.url),
              id: new FormControl(photo.id),
            });
            this.form.controls.photos.push(photoFormGroup);
          });
        },
        error: (e) => {
          console.error(e)
        },
      });
    }
  }

  deletePhoto(index: number) {
    this.toastr.success(`url de imagen eliminada.`);
    this.form.controls.photos.removeAt(index);
  }

  addPhoto() {
    if (this.form.controls.photos.length >= 5) {
      this.toastr.error(`No se pueden agregar más de cinco fotos.`);

  
    } else {
      const photoFormGroup = new FormGroup({
        url: new FormControl<string | null>(null),
        id: new FormControl<number | null>(null),
      });
      this.form.controls.photos.push(photoFormGroup);
      this.form.updateValueAndValidity();
    }
  }
  onCancel() {
    this.router.navigate(['/home']);
    this.toastr.success(`Creación cancelada.`);
  }

  onPhotoChange(url: string | null) {
    this.url = url;
  }

 
  onSubmit() {
    
    this.service.createVehicle(this.form.value).subscribe({
      next: (response: Vehicle) => {
        this.toastr.success(`El auto con ID ${response.id} se guardó con éxito.`);
          this.router.navigate(['/vehicles']);
      },
      error:
      (error) => {
        this.toastr.error(error.error.error)
      }
        
      
    
    })
   
  }

  optionChanged(event: HTMLSelectElement) {
    const value: SelectOption = JSON.parse(event.value);
    this.form.controls.brand.patchValue(value);
  }

  
}
