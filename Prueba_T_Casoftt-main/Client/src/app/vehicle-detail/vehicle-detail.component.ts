import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '@services/vehicles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailComponent implements OnInit {

  private service = inject(VehiclesService);
  private router: Router = new Router(); 
  private toastr = inject(ToastrService)

  

  vehicle: any;  


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getVehicleDetails(id).subscribe(
        (data) => {
          this.vehicle = data; 
        },
        (error) => {
          console.error('Error al obtener el vehículo:', error);  
        }
      );
    }
  }
  
  deleteActionVehicle(vehicleId: number | null | undefined){ 
    this.service.deleteVehicle(vehicleId)
    this.toastr.success(`Vehículo eliminado con éxito`);
    this.router.navigate(['vehicles']);
    
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

 

  

  
}
