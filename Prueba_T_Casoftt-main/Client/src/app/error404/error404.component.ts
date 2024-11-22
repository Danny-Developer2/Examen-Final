import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  templateUrl: './error404.component.html'
})
export class Error404Component implements OnInit {

  error:any


  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }






  ngOnInit(): void {
  }
}

