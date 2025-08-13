import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductService } from './product.service';
import { CategoryService } from './category.service';


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
import { ToolbarModule } from 'primeng/toolbar';


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
    Toast, ConfirmDialog, ToolbarModule
  ],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="container">
      <p-toolbar styleClass="mb-3">
        <div class="p-toolbar-group-left">
          <span class="section-title">Productos</span>
        </div>
        <div class="p-toolbar-group-right flex align-items-center gap-2">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText type="text" placeholder="Buscar..."
                  (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
          </span>
          <button pButton label="Nuevo" icon="pi pi-plus" size="small" (click)="create()"></button>
          <button pButton label="Logout" icon="pi pi-sign-out" size="small" severity="secondary" (click)="logout()"></button>
        </div>
      </p-toolbar>

      <div class="table-wrap">
        <p-table #dt
                [value]="products"
                [loading]="loading"
                [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]"
                sortMode="multiple"
                [globalFilterFields]="['name','description']"
                [rowHover]="true" [stripedRows]="true" [responsiveLayout]="'scroll'"
                [tableStyle]="{'min-width': 'var(--min-table-width)'}">

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
              <td>{{ p.name }}</td>
              <td>{{ p.price | number:'1.2-2' }}</td>
              <td>{{ p.stock }}</td>
              <td class="flex gap-2">
                <button pButton icon="pi pi-pencil" label="Editar" size="small" (click)="edit(p)"></button>
                <button pButton icon="pi pi-trash" label="Eliminar" size="small" severity="danger" (click)="confirmDel(p)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Diálogo -->
    <p-dialog [(visible)]="showForm"
      [modal]="true"
      styleClass="app-modal"
      [style]="{ width: '48rem' }"
      [breakpoints]="{ '1200px':'44rem', '992px':'90vw', '576px':'95vw' }"
      [draggable]="false"
      [dismissableMask]="true"
      [baseZIndex]="2000"
      header="{{editing ? 'Editar' : 'Nuevo'}} producto">
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
          <p-dropdown
            inputId="category_id"
            formControlName="category_id"
            [options]="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona categoría"
            appendTo="self"
            panelStyleClass="cat-panel"
            [style]="{ width:'100%' }">
          </p-dropdown>
          <small class="p-error" *ngIf="form.controls.category_id.touched && form.controls.category_id.invalid">
            La categoría es requerida
          </small>
        </div>

        <div class="flex flex-column gap-1">
          <label for="description">Descripción (opcional)</label>
          <textarea pInputTextarea id="description" formControlName="description" rows="4"></textarea>
        </div>

        <div class="flex justify-content-end gap-2">
          <button pButton type="button" label="Cancelar" size="small" severity="secondary" (click)="showForm=false"></button>
          <button pButton type="submit" label="Guardar" size="small" [disabled]="form.invalid"></button>
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

  private categoriesApi = inject(CategoryService);

  categoryOptions: { label: string; value: number }[] = [];


  form = this.fb.group({
  name: this.fb.nonNullable.control('', Validators.required),
  price: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0.01)]),
  stock: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
  description: this.fb.control<string>(''),
  category_id: this.fb.control<number | null>(null, Validators.required) 
  });



  ngOnInit(){
  this.load();
  this.categoriesApi.list().subscribe({
    next: (rows) => this.categoryOptions = rows.map(c => ({ label: c.name, value: c.id })),
    error: _ => {/* opcional: toast de error */}
  });
  }


  load(){
    this.loading = true;
    this.api.list().subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: _ => { this.loading = false; this.messages.add({severity:'error', summary:'Error', detail:'No se pudo cargar'}); }
    });
  }

  create(){
  this.editing = undefined;
  this.form.reset({ name:'', price:0, stock:0, description:'', category_id: null });
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
