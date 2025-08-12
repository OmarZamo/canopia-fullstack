import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductService } from './product.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumber } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    // tabla y diálogos
    TableModule, DialogModule, ButtonModule,
    // inputs
    InputTextModule, InputTextarea, InputNumber, DropdownModule,
    // feedback
    Toast, ConfirmDialog
  ],
  template: `
  <p-toast></p-toast>
  <p-confirmDialog></p-confirmDialog>

  <div class="p-3">
    <div class="flex align-items-center justify-content-between mb-3">
      <h2 class="m-0">Productos</h2>

      <div class="flex gap-2">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input pInputText type="text" placeholder="Buscar..."
             (input)="dt.filterGlobal($any($event.target).value, 'contains')">
        </span>
        <button pButton label="Nuevo" icon="pi pi-plus" (click)="create()"></button>
        <button pButton label="Logout" severity="secondary" icon="pi pi-sign-out" (click)="logout()"></button>
      </div>
    </div>

    <p-table #dt [value]="products" [loading]="loading"
             [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]"
             sortMode="multiple" [globalFilterFields]="['name','description']"
             [tableStyle]="{'min-width':'50rem'}">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
          <th pSortableColumn="price" style="width:10rem">Precio <p-sortIcon field="price" /></th>
          <th pSortableColumn="stock" style="width:8rem">Stock <p-sortIcon field="stock" /></th>
          <th style="width:14rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-p>
        <tr>
          <td>{{p.name}}</td>
          <td>{{p.price | number:'1.2-2'}}</td>
          <td>{{p.stock}}</td>
          <td class="flex gap-2">
            <button pButton icon="pi pi-pencil" label="Editar" (click)="edit(p)"></button>
            <button pButton icon="pi pi-trash" label="Eliminar" severity="danger" (click)="confirmDel(p)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>

  <p-dialog [(visible)]="showForm" [modal]="true" [style]="{width:'34rem'}" [draggable]="false"
            [dismissableMask]="true" header="{{editing ? 'Editar' : 'Nuevo'}} producto">
    <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-column gap-3">
      <div class="flex flex-column gap-1">
        <label for="name">Nombre</label>
        <input pInputText id="name" formControlName="name" />
        <small class="p-error" *ngIf="form.controls.name.touched && form.controls.name.invalid">
          El nombre es requerido
        </small>
      </div>

      <div class="grid">
        <div class="col-6 flex flex-column gap-1">
          <label for="price">Precio</label>
          <p-inputNumber inputId="price" formControlName="price" mode="currency" currency="MXN" [minFractionDigits]="2"></p-inputNumber>
          <small class="p-error" *ngIf="form.controls.price.touched && form.controls.price.invalid">
            Ingresa un precio válido
          </small>
        </div>
        <div class="col-6 flex flex-column gap-1">
          <label for="stock">Stock</label>
          <p-inputNumber inputId="stock" formControlName="stock" [min]="0"></p-inputNumber>
          <small class="p-error" *ngIf="form.controls.stock.touched && form.controls.stock.invalid">
            Ingresa un stock válido
          </small>
        </div>
      </div>

      <div class="flex flex-column gap-1">
        <label for="category_id">Categoría</label>
        <p-dropdown inputId="category_id" formControlName="category_id" [options]="categoryOptions" optionLabel="label" optionValue="value"
                    placeholder="Selecciona categoría"></p-dropdown>
      </div>

      <div class="flex flex-column gap-1">
        <label for="description">Descripción</label>
        <textarea pInputTextarea id="description" formControlName="description" rows="3"></textarea>
      </div>

      <div class="flex justify-content-end gap-2">
        <button pButton type="button" label="Cancelar" severity="secondary" (click)="showForm=false"></button>
        <button pButton type="submit" label="Guardar" [disabled]="form.invalid"></button>
      </div>
    </form>
  </p-dialog>
  `,
  styles:[`
    :host ::ng-deep .p-dialog .p-dialog-content{ overflow: visible; }
  `]
})
export class ProductListComponent implements OnInit {
  private api = inject(ProductService);
  private fb = inject(FormBuilder);
  private messages = inject(MessageService);
  private confirm = inject(ConfirmationService);

  products: Product[] = [];
  loading = false;

  showForm = false;
  editing?: Product;

  categoryOptions = [
    { label: 'General',     value: 1 },
    { label: 'Electrónica', value: 2 },
    { label: 'Libros',      value: 3 },
  ];

 form = this.fb.group({
  name: this.fb.nonNullable.control('', Validators.required),
  price: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0.01)]),
  stock: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
  description: this.fb.control<string>(''),
  category_id: this.fb.control<number | null>(null) // <-- clave
});


  ngOnInit(){ this.load(); }

  load(){
    this.loading = true;
    this.api.list().subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: _ => { this.loading = false; this.messages.add({severity:'error', summary:'Error', detail:'No se pudo cargar'}); }
    });
  }

  create(){
    this.editing = undefined;
    this.form.reset({ name:'', price:0, stock:0, description:'', category_id:null });
    this.showForm = true;
  }

  edit(p: Product){
  this.editing = p;
  this.form.patchValue({
    name: p.name,
    price: p.price,
    stock: p.stock,
    description: p.description ?? '',
    category_id: p.category_id ?? null
  });
  this.showForm = true;
}


  save(){
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto = this.form.value as any;

    const req = this.editing ? this.api.update(this.editing.id, dto) : this.api.create(dto);
    req.subscribe({
      next: () => {
        this.showForm = false;
        this.messages.add({severity:'success', summary:'Guardado', detail:'Producto guardado'});
        this.load();
      },
      error: _ => this.messages.add({severity:'error', summary:'Error', detail:'No se pudo guardar'})
    });
  }

  confirmDel(p: Product){
    this.confirm.confirm({
      message: `¿Eliminar "${p.name}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.del(p)
    });
  }

  del(p: Product){
    this.api.remove(p.id).subscribe({
      next: () => { this.messages.add({severity:'success', summary:'Eliminado', detail:'Producto eliminado'}); this.load(); },
      error: _ => this.messages.add({severity:'error', summary:'Error', detail:'No se pudo eliminar'})
    });
  }

  logout(){
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
