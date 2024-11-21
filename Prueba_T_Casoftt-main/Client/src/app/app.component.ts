import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgxPaginationModule, NgbCarouselModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Client';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe(
      data => console.log('Datos recibidos:', data),
      error => console.error('Error:', error)
    );
  }
}
