import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './vehicle-home.component.html'
})
export class VehicleHomeComponent {

}
