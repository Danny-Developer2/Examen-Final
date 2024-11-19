import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '@services/vehicles.service';


@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailComponent implements OnInit {

  private service = inject(VehiclesService);
  private router: Router = new Router();
  showAlert: boolean = false; 

  

  vehicle: any;  // Esta propiedad guardará los detalles del vehículo


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Obtener el id de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Llamar al servicio y suscribirse al Observable
      this.service.getVehicleDetails(id).subscribe(
        (data) => {
          this.vehicle = data;  // Asignar los datos a la propiedad
          console.log(this.vehicle);  // Mostrar los datos en consola
        },
        (error) => {
          console.error('Error al obtener el vehículo:', error);  // Manejo de errores
        }
      );
    }
  }
  
  deleteActionVehicle(vehicleId: number | null | undefined){ 
    this.service.deleteVehicle(vehicleId)
    this.showAlert = true;

    // Opcional: Hacer que el alert desaparezca después de 3 segundos
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigate(['vehicles']);
    }, 4000);
  }
  actuaizarDatosVehicle(vehicleId: number | null | undefined){
    this.service.navigateToVehicleUpdate(vehicleId);
    
  }
    

    

  
  closeAlert(): void {
    this.showAlert = false;
    this.router.navigate(['vehicles']);
  }

  

  
}
