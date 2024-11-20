import { Routes } from '@angular/router';
import { BrandsVehicleComponent } from 'src/app/brands-vehicle/brands-vehicle.component';
import { Error404Component } from 'src/app/error404/error404.component';
import { VehicleAlertsComponent } from 'src/app/vehicle-alerts/vehicle-alerts.component';
import { VehiclesComponent } from 'src/app/vehicle-catalog/vehicle-catalog.component';
import { VehicleCreateComponent } from 'src/app/vehicle-create/vehicle-create.component';
import { VehicleDetailComponent } from 'src/app/vehicle-detail/vehicle-detail.component';
import { VehicleHomeComponent } from 'src/app/vehicle-home/vehicle-home.component';
import { VehicleUpdateComponent } from 'src/app/vehicle-update/vehicle-update.component';



export const routes: Routes = [
  {path: '', component: VehicleHomeComponent},
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'home', component: VehicleHomeComponent },
  {path: 'vehicle/create', component: VehicleCreateComponent},
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: 'vehicleAlert', component: VehicleAlertsComponent },
  { path: 'vehicle/:id/edit', component: VehicleUpdateComponent },
  { path: 'Brands', component: BrandsVehicleComponent },
  { path: '404', component: Error404Component }, 
  { path: '**', redirectTo: '/404' },
];
