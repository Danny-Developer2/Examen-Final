import { HttpErrorResponse } from "@angular/common/http";

export type Errors = "BadRequest" | "ValidationError";

export class BadRequest {
    type: Errors;
    message?: string;
    validationErrors: string[] = [];
    error: HttpErrorResponse;
  
    constructor(error: HttpErrorResponse) {
      this.error = error;
      this.message = error.error;
      if (error.error.errors) {
        this.type = "ValidationError";
        const modalStateErrors = [];
        for (const key in error.error.errors) {
          if (error.error.errors[key]) {
            modalStateErrors.push(error.error.errors[key]);
          }
        }
        this.validationErrors = modalStateErrors.flat();
      } else {
        this.type = "BadRequest";
      }
    }
  }