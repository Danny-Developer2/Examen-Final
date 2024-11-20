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

  

  vehicle: any;  


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getVehicleDetails(id).subscribe(
        (data) => {
          this.vehicle = data; 
          console.log(this.vehicle);  
        },
        (error) => {
          console.error('Error al obtener el vehículo:', error);  
        }
      );
    }
  }
  
  deleteActionVehicle(vehicleId: number | null | undefined){ 
    this.service.deleteVehicle(vehicleId)
    this.showAlert = true;

    
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigate(['vehicles']);
    }, 4000);
  }
  actuaizarDatosVehicle(vehicleId: number | null | undefined){
    this.service.navigateToVehicleUpdate(vehicleId);
    
  }


  confirmDelete(vehicleId: number): void {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
    
    if (confirmDelete) {
      this.deleteActionVehicle(vehicleId); 
    }
  }
  
    

    

  
  closeAlert(): void {
    this.showAlert = false;
    this.router.navigate(['vehicles']);
  }

  

  
}
