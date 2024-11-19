import { Component, ChangeDetectorRef, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { BadRequest } from '../_models/badRequest';
import { SelectOption } from '../_models/selectOption';
import { BrandsService } from '../services/brands.service';
import { VehiclesService } from '../services/vehicles.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../_models/vehicle';
import { ToastService } from '../services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  selector: 'app-vehicle-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-update.component.html',
})
export class VehicleUpdateComponent {
  response: any
  router = inject(Router);
  error = signal<BadRequest | null>(null);
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer);
  url: string | null = null;
  private brandsService = inject(BrandsService);
  service = inject(VehiclesService);
  showAlert: boolean = false;
  showAlertSucces: boolean = false;
  vehicleId: number | null = null;
  vehicles: Vehicle[] = [];
  route = inject(ActivatedRoute);
  brandOptions: SelectOption[] = [];
  form: FormGroup<FormType> = new FormGroup<FormType>({
    brand: new FormControl<SelectOption | null>(null),
    model: new FormControl<string | null>(null),
    year: new FormControl<number | null>(null),
    color: new FormControl<string | null>(null),
    photos: new FormArray<FormGroup<PhotoType>>([]),
  });


  

  submitted = signal<boolean>(false);

  constructor(private cdr: ChangeDetectorRef) {
    this.vehicleId = this.route.snapshot.paramMap.get('id')
      ? parseInt(this.route.snapshot.paramMap.get('id')!)
      : null;

    // Obtener opciones de marcas al inicializar el componente
    this.brandsService.getOptions().subscribe((options) => {
      this.brandOptions = options;
    });

    // Cargar datos del vehículo si el ID es válido
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getById(parseInt(id)).subscribe({
        next: (data: Vehicle) => {
          console.log('Datos del vehículo', data);

          // Verificar que la marca esté presente y asignarla
          const selectedBrand = this.brandOptions.find(
            (brand) => brand.id === data.brand?.id
          );
          if (selectedBrand) {
            this.form.controls.brand.setValue(selectedBrand);
          } else {
            console.log('Marca no encontrada:', data.brand);
          }

          // Rellenar las fotos en el formulario
          data.photos.forEach((photo) => {
            const photoFormGroup = new FormGroup<PhotoType>({
              url: new FormControl(photo.url),
              id: new FormControl(photo.id),
            });
            this.form.controls.photos.push(photoFormGroup);
          });

          // Forzar la detección de cambios para que Angular actualice la vista
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastService.add('Error al cargar los datos del vehículo.', 'danger');
        },
      });
    }
  }

  deletePhoto(index: number) {
    this.form.controls.photos.removeAt(index);
  }

  addPhoto() {
    if (this.form.controls.photos.length >= 5) {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 4000);
    } else {
      const photoFormGroup = new FormGroup<PhotoType>({
        url: new FormControl<string | null>(null),
        id: new FormControl<number | null>(null),
      });
      this.form.controls.photos.push(photoFormGroup);
      this.form.updateValueAndValidity();
    }
  }

  onCancel() {
    this.router.navigate([`/vehicles`]);
  }

  onPhotoChange(url: string | null) {
    this.url = url;
  }

  ngOnInit() {
    this.service.getVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicles = data;

        // Buscar la marca seleccionada usando vehicleId
        const vehicle = this.vehicles.find((v) => v.id === this.vehicleId);
        if (vehicle) {
          const selectedBrand = this.brandOptions.find(
            (brand) => brand.id === vehicle.brand?.id
          );

          if (selectedBrand) {
            this.form.controls.brand.setValue(selectedBrand);
          }

          // Rellenar el formulario con los valores del vehículo
          this.form.patchValue({
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
          });

          // Asegurarse de que las fotos se asignen correctamente
          vehicle.photos.forEach((photo) => {
            const photoFormGroup = new FormGroup<PhotoType>({
              url: new FormControl(photo.url),
              id: new FormControl(photo.id),
            });
            this.form.controls.photos.push(photoFormGroup);
          });

          // Forzar la detección de cambios para que Angular actualice la vista
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.toastService.add('Error al cargar los vehículos.', 'danger');
      },
    });
  }

  onSubmit() {
    console.log('Formulario enviado');
    console.log(this.vehicleId, this.form.value);
    this.response = this.service.updateVehicle(this.vehicleId, this.form.value);
    this.showAlertSucces = true;
      setTimeout(() => {
        this.showAlertSucces = false;
      }, 4000); 
  }

  optionChanged(event: HTMLSelectElement) {
    const value: SelectOption = JSON.parse(event.value);
    this.form.controls.brand.patchValue(value);
  }
  
  
}
