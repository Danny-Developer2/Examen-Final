import { Component, effect, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectOption } from '@_models/selectOption';
import { BadRequest } from '@_models/badRequest';
import { ToastService } from '@services/toast.service';
import { BrandsService } from '@services/brands.service';
import { VehiclesService } from '@services/vehicles.service';
import { Vehicle } from '@_models/vehicle';



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
  imports: [CommonModule, ReactiveFormsModule,ReactiveFormsModule, CommonModule],
  templateUrl: './vehicle-create.component.html',
})
export class VehicleCreateComponent {
  router = inject(Router);
  error = signal<BadRequest | null>(null);
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer);
  url: string | null = null;
  private brandsService = inject(BrandsService);
  service = inject(VehiclesService);
  showAlert: boolean = false;  
  vehicleId: number | null = null; 
  showAlertSucces: boolean = false;
  route = inject(ActivatedRoute);
  

  brandOptions: SelectOption[] = [];

    form = new FormGroup<FormType>({
    brand: new FormControl<SelectOption | null>(null, Validators.required),
    model: new FormControl<string | null>(null, Validators.required),
    year: new FormControl<number | null>(null, Validators.required),
    color: new FormControl<string | null>(null, Validators.required),
    photos: new FormArray<FormGroup<PhotoType>>([],Validators.required),
  });
  

  submitted = signal<boolean>(false);


  constructor() {

    
    
    
    // Obtener opciones de marcas al inicializar el componente
    this.brandsService.getOptions().subscribe((options) => {
      this.brandOptions = options;
    });

    // Cargar datos del vehículo si el ID es válido
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getById(parseInt(id)).subscribe({
        next: (data: Vehicle) => {
          console.log('Datos del vehículo', data); // Verificar los datos
          
          // Asignar los valores del vehículo a los campos del formulario
          this.form.patchValue({
            model: data.model,
            year: data.year,
            color: data.color,
          });

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
  }
  

  onPhotoChange(url: string | null) {
    this.url = url;
  }

  ngOnInit() {
    
  }
  

  onSubmit() {
    console.log(this.form.value)
      // Llamar al servicio para crear el vehículo
      this.service.createVehicle(this.form.value);
    
      // Mostrar un alert o un mensaje después de que el vehículo sea creado
      this.showAlertSucces = true;
      
      
    
      // Redirigir después de algunos segundos si es necesario
      setTimeout(() => {
        this.showAlertSucces = false;
        this.router.navigate(['/vehicles']);
      }, 4000);
    
    
}

  optionChanged(event: HTMLSelectElement) {
    const value: SelectOption = JSON.parse(event.value);
    this.form.controls.brand.patchValue(value);
  }

  closeAlert(): void {
    this.showAlert = false;
    this.router.navigate(['vehicles']);
  }
}
