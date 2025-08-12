import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Product {
  id:number; name:string; description?:string;
  price:number; stock:number; category_id?:number; status?:number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/products`;
  list() { return this.http.get<Product[]>(this.base); }
  get(id: number) { return this.http.get<Product>(`${this.base}/${id}`); }
  create(dto: Partial<Product>) { return this.http.post<Product>(this.base, dto); }
  update(id: number, dto: Partial<Product>) { return this.http.put<Product>(`${this.base}/${id}`, dto); }
  remove(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
