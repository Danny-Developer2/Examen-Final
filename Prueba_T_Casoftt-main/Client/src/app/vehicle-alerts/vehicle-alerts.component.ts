import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-alerts',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-alerts.component.html'
})
export class VehicleAlertsComponent {
  private router: Router = new Router;
  


  closeAlert(){
    this.router.navigate([`vehicles`]);
  }

}
