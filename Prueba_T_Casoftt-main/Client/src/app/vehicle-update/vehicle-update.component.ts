import {
  Component,
  ChangeDetectorRef,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectOption } from '@_models/selectOption';
import { BadRequest } from '@_models/badRequest';
import { VehiclesService } from '@services/vehicles.service';
import { Vehicle } from '@_models/vehicle';
import { BrandsService } from '@services/brands.service';
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
  selector: 'app-vehicle-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-update.component.html',
})
export class VehicleUpdateComponent {
  response: any;
  router = inject(Router);
  error = signal<BadRequest | null>(null);
  sanitizer = inject(DomSanitizer);
  url: string | null = null;
  private brandsService = inject(BrandsService);
  service = inject(VehiclesService);
  vehicleId: number | null = null;
  vehicles: Vehicle[] = [];
  route = inject(ActivatedRoute);
  brandOptions: SelectOption[] = [];
  private toastr = inject(ToastrService);
  form: FormGroup<FormType> = new FormGroup<FormType>({
    brand: new FormControl<SelectOption | null>(null),
    model: new FormControl<string | null>(null),
    year: new FormControl<number | null>(null),
    color: new FormControl<string | null>(null),
    photos: new FormArray<FormGroup<PhotoType>>([]),
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.vehicleId = this.route.snapshot.paramMap.get('id')
      ? parseInt(this.route.snapshot.paramMap.get('id')!)
      : null;

    this.brandsService.getOptions().subscribe((options) => {
      this.brandOptions = options;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getById(parseInt(id)).subscribe({
        next: (data: Vehicle) => {
          console.log('Datos del vehículo', data);

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

          this.cdr.detectChanges();
        },
        error: () => {
          console.error('Error al cargar los datos del vehículo.', 'danger');
        },
      });
    }
  }

  deletePhoto(index: number) {
    this.form.controls.photos.removeAt(index);
    this.toastr.success(`url de imagen eliminada.`);
  }

  addPhoto() {
    if (this.form.controls.photos.length >= 5) {
      this.toastr.error(`No se pueden agregar más de cinco fotos.`);
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
    this.toastr.success(`Edición cancelada.`);
  }

  onPhotoChange(url: string | null) {
    this.url = url;
  }

  ngOnInit() {
    this.service.getVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicles = data;

        const vehicle = this.vehicles.find((v) => v.id === this.vehicleId);
        if (vehicle) {
          const selectedBrand = this.brandOptions.find(
            (brand) => brand.id === vehicle.brand?.id
          );

          if (selectedBrand) {
            this.form.controls.brand.setValue(selectedBrand);
          }

          this.form.patchValue({
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
          });

          vehicle.photos.forEach((photo) => {
            const photoFormGroup = new FormGroup<PhotoType>({
              url: new FormControl(photo.url),
              id: new FormControl(photo.id),
            });
            this.form.controls.photos.push(photoFormGroup);
          });

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al cargar los vehículos.', 'danger');
      },
    });
  }

  onSubmit() {
    this.service.updateVehicle(this.vehicleId, this.form.value).subscribe({
      next: (response: Vehicle) => {
        this.toastr.success(`Los Datos se actualizaron con éxito.`);
        this.router.navigate(['/vehicles']);
      },
      error: (error) => this.toastr.error(error.error),
    });
  }

  optionChanged(event: HTMLSelectElement) {
    const value: SelectOption = JSON.parse(event.value);
    this.form.controls.brand.patchValue(value);
  }
}
