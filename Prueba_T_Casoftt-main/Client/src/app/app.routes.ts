import { Routes } from '@angular/router';
import { BrandsVehicleComponent } from 'src/app/brands-vehicle/brands-vehicle.component';
import { Error404Component } from 'src/app/error404/error404.component';
import { NotFoundComponent } from 'src/app/errors/not-found/not-found.component';
import { ServerErrorComponent } from 'src/app/errors/server-error/server-error.component';
import { TestErrorsComponent } from 'src/app/errors/test-errors/test-errors.component';
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
  { path: 'vehicle/:id/edit', component: VehicleUpdateComponent },
  { path: 'Brands', component: BrandsVehicleComponent },
  { path: '404', component: Error404Component }, 
  { path: 'e', component: TestErrorsComponent }, 
  { path: 'not-found', component: NotFoundComponent }, 
  { path: 'server-error', component: ServerErrorComponent }, 

  
];




