import { Routes } from '@angular/router';
import { BrandsVehicleComponent } from 'src/app/brands-vehicle/brands-vehicle.component';
import { VehicleAlertsComponent } from 'src/app/vehicle-alerts/vehicle-alerts.component';
import { VehiclesComponent } from 'src/app/vehicles/vehicle-catalog.component';
import { VehicleCreateComponent } from 'src/app/vehicles/vehicle-create.component';
import { VehicleDetailComponent } from 'src/app/vehicles/vehicle-detail.component';
import { VehicleHomeComponent } from 'src/app/vehicles/vehicle-home.component';
import { VehicleUpdateComponent } from 'src/app/vehicles/vehicle-update.component';


export const routes: Routes = [
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'home', component: VehicleHomeComponent },
  {path: 'vehicle/create', component: VehicleCreateComponent},
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: 'vehicleAlert', component: VehicleAlertsComponent },
  { path: 'vehicle/:id/edit', component: VehicleUpdateComponent },
  { path: 'Brands', component: BrandsVehicleComponent },
  { path: '**', redirectTo: '/home' }
];
