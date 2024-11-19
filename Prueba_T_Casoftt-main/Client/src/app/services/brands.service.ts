import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Brand } from '../_models/brands';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { environment } from '../../environments/environment.development';
import { BrandParams } from '../_models/brandParams';
import { SelectOption } from '../_models/selectOption';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private http = inject(HttpClient);

  baseUrl = `${environment.apiUrl}brands/`;
  paginatedResult = signal<PaginatedResult<Brand[]> | null>(null);
  cache = new Map();
  params = signal<BrandParams>(new BrandParams());

  options = signal<SelectOption[]>([]);

  resetParams() {
    this.params.set(new BrandParams());
  }

  getPagedList() {
    const response = this.cache.get(Object.values(this.params()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.params().pageNumber, this.params().pageSize);

    return this.http.get<Brand[]>(this.baseUrl, {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.cache.set(Object.values(this.params()).join('-'), response);
      }
    })
  }

  getById(id: number) {
    const brand: Brand = [...this.cache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Brand) => m.id === id);

    if (brand) return of(brand);

    return this.http.get<Brand>(`${this.baseUrl}${id}`);
  }

  update(id: number, model: any) {
    return this.http.put(`${this.baseUrl}${id}`, model);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }

  create(model: any): Observable<Brand> {
    return this.http.post<Brand>(`${this.baseUrl}`, model);
  }

  getOptions(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(`${this.baseUrl}options`).pipe(
      tap(response => {
        this.options.set(response);
      })
    )
  }
}
