import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; 



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgxPaginationModule, NgbCarouselModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Client';

}
