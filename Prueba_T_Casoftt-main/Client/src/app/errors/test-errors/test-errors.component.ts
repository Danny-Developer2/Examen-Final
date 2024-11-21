import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ErrorServices } from '@services/errors.service';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-errors.component.html'
})
export class TestErrorsComponent {

  private errors = inject(ErrorServices)
  
  constructor() { }

  ngOninit() {}
  testError404() {
    this.errors.get404Error();
  }
  testError400() {
    this.errors.get400Error();
  }
  
  testError500() {
    this.errors.get500Error();
  }
  

 



  


}
