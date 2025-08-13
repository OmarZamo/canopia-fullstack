import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, Toast],
  template: `
  <p-toast position="top-center"></p-toast>
  <div class="auth-shell">
    <p-card styleClass="auth-card" header="Iniciar sesión">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon"><i class="pi pi-user"></i></span>
          <input pInputText id="username" placeholder=" Usuario" formControlName="username" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon"><i class="pi pi-lock"></i></span>
          <input pInputText id="password" type="password" placeholder=" Contraseña" formControlName="password" />
        </div>
        <button pButton type="submit" label="Entrar" [disabled]="form.invalid || loading"></button>
      </form>
    </p-card>
  </div>
`,
styles: [``]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private router = inject(Router);
  private messages = inject(MessageService);

  loading = false;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.api.login(this.form.value as any).subscribe({
      next: ({ token }) => { localStorage.setItem('token', token); this.router.navigateByUrl('/'); },
      error: (err) => {
        this.messages.add({severity:'error', summary:'Login', detail: err?.error?.message ?? 'Credenciales inválidas'});
        this.loading = false;
      }
    });
  }
}

