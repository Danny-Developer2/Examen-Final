import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@evirement/environment.development";

@Injectable({
    providedIn: 'root'
  })
  export class ErrorServices {
    validationErrors: string[] = [];
    baseUrl = `${environment.apiUrl}`;

    private http = inject(HttpClient);

    get404Error() {
        this.http.get(this.baseUrl + 'buggy/not-found').subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        })
      }
    
      get400Error() {
        this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        })
      }
    
      get500Error() {
        this.http.get(this.baseUrl + 'buggy/server-error').subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        })
      }
    
    //   get401Error() {
    //     this.http.get(this.baseUrl + 'buggy/auth').subscribe(response => {
    //       console.log(response);
    //     }, error => {
    //       console.log(error);
    //     })
    //   }
    
     
    
   
  }