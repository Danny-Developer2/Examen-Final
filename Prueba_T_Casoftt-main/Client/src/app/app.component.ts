import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HttpClientModule, NgxPaginationModule, NgbCarouselModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Client';
}
