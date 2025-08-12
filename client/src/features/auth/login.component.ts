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
  <p-toast></p-toast>
  <div class="page">
    <p-card header="Iniciar sesión" styleClass="w-full">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid">
        <div class="field">
          <label for="username">Usuario</label>
          <input pInputText id="username" formControlName="username" />
        </div>
        <div class="field">
          <label for="password">Contraseña</label>
          <input pInputText id="password" type="password" formControlName="password" />
        </div>
        <button pButton type="submit" label="Entrar" [disabled]="form.invalid || loading"></button>
      </form>
    </p-card>
  </div>
  `,
  styles: [`.page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem}.grid{display:flex;flex-direction:column;gap:.75rem;width:280px}.field{display:flex;flex-direction:column;gap:.25rem}`]
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

