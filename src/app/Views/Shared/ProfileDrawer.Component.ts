import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { toApiError } from '../../Services/Api.Service';
import { AuthService, UserSession } from '../../Services/auth.service';
import { IconComponent } from './Icon.Component';

export const AVATAR_PRESETS: readonly string[] = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
];

@Component({
  selector: 'app-profile-drawer',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CONTENEDOR PRINCIPAL FLOTANTE DEL DRAWER -->
    <div
      class="fixed inset-0 z-50 flex justify-end transition-visibility duration-300"
      [class.pointer-events-none]="!isOpen()"
      [class.invisible]="!isOpen() && !animating()"
    >
      <!-- Backdrop Oscuro con Desenfoque -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
        [class.opacity-100]="isOpen()"
        [class.opacity-0]="!isOpen()"
        (click)="requestClose()"
        aria-hidden="true"
      ></div>

      <!-- PANEL LATERAL DERECHO (SLIDE DE DERECHA A IZQUIERDA) -->
      <aside
        #drawerPanel
        class="relative z-10 flex h-full w-full max-w-xl md:max-w-2xl flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-out text-slate-800 dark:text-slate-100 outline-none"
        [class.translate-x-0]="isOpen()"
        [class.translate-x-full]="!isOpen()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-drawer-heading"
      >
        <!-- CABECERA DEL DRAWER -->
        <header class="flex items-center justify-between border-b border-slate-200/90 dark:border-slate-800 px-6 py-4.5 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div class="min-w-0">
              <h2 id="profile-drawer-heading" class="text-base font-black tracking-tight text-slate-900 dark:text-white truncate">
                Mi Perfil & Seguridad
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                Personaliza tus datos, foto de perfil y credenciales de acceso
              </p>
            </div>
          </div>

          <button
            type="button"
            (click)="requestClose()"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar panel de perfil"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <!-- SELECTOR DE PESTAÑAS (TABS) -->
        <nav class="flex border-b border-slate-200/80 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900" aria-label="Secciones del perfil">
          <button
            type="button"
            (click)="activeTab.set('personal')"
            class="relative flex items-center gap-2 pb-3 px-3 text-xs font-bold transition cursor-pointer"
            [class.text-blue-600]="activeTab() === 'personal'"
            [class.dark:text-blue-400]="activeTab() === 'personal'"
            [class.text-slate-500]="activeTab() !== 'personal'"
            [class.dark:text-slate-400]="activeTab() !== 'personal'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Datos Personales</span>
            @if (activeTab() === 'personal') {
              <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-header-enter"></span>
            }
          </button>

          <button
            type="button"
            (click)="activeTab.set('security')"
            class="relative flex items-center gap-2 pb-3 px-3 text-xs font-bold transition cursor-pointer"
            [class.text-blue-600]="activeTab() === 'security'"
            [class.dark:text-blue-400]="activeTab() === 'security'"
            [class.text-slate-500]="activeTab() !== 'security'"
            [class.dark:text-slate-400]="activeTab() !== 'security'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Seguridad & Contraseña</span>
            @if (activeTab() === 'security') {
              <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-header-enter"></span>
            }
          </button>
        </nav>

        <!-- CONTENIDO CON SCROLL INTERNO -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <!-- ========================================== -->
          <!-- PESTAÑA 1: DATOS PERSONALES                -->
          <!-- ========================================== -->
          @if (activeTab() === 'personal') {
            <form (ngSubmit)="savePersonalProfile($event)" class="space-y-6">
              <!-- SECCIÓN DE FOTO DE PERFIL / AVATAR -->
              <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4.5 space-y-4">
                <div class="flex items-center gap-4">
                  <!-- Vista previa de foto -->
                  <div class="relative shrink-0">
                    @if (previewAvatarUrl()) {
                      <img
                        [src]="previewAvatarUrl()"
                        alt="Avatar actual"
                        class="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md"
                        (error)="onAvatarError()"
                      />
                    } @else {
                      <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-2xl text-white shadow-md">
                        {{ (fullName().charAt(0) || 'U').toUpperCase() }}
                      </div>
                    }
                    <span class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 text-white" title="Perfil activo">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="h-3 w-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Foto de perfil</p>
                    <p class="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                      {{ fullName() || 'Usuario Firmeza' }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Pega una URL directa de tu imagen o selecciona una de las sugerencias rápidas.
                    </p>
                  </div>
                </div>

                <!-- Input para URL de foto -->
                <div class="space-y-1.5">
                  <label for="avatar-input" class="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enlace de imagen (URL directa)
                  </label>
                  <div class="relative">
                    <input
                      id="avatar-input"
                      type="url"
                      [ngModel]="avatarUrlInput()"
                      (ngModelChange)="onAvatarUrlInputChange($event)"
                      name="avatarUrlInput"
                      placeholder="https://ejemplo.com/mi-foto.jpg"
                      class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    @if (avatarUrlInput()) {
                      <button
                        type="button"
                        (click)="clearAvatar()"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 p-1 text-xs font-bold"
                        title="Quitar foto"
                      >
                        Quitar
                      </button>
                    }
                  </div>
                </div>

                <!-- Avatares sugeridos rápidos -->
                <div>
                  <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">Avatares sugeridos:</p>
                  <div class="flex items-center gap-2.5">
                    @for (preset of presets; track preset) {
                      <button
                        type="button"
                        (click)="selectPresetAvatar(preset)"
                        class="relative rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-2 hover:ring-blue-500 transition active:scale-95 cursor-pointer"
                        [class.ring-2]="previewAvatarUrl() === preset"
                        [class.ring-blue-600]="previewAvatarUrl() === preset"
                      >
                        <img [src]="preset" alt="Opción de avatar" class="h-10 w-10 object-cover" />
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- FORMULARIO DE CAMPOS DE DATOS -->
              <div class="space-y-4">
                <!-- Nombre Completo -->
                <div>
                  <label for="profile-name" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre completo <span class="text-rose-500">*</span>
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    [ngModel]="fullName()"
                    (ngModelChange)="fullName.set($event)"
                    name="fullName"
                    class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Tu nombre y apellidos"
                  />
                </div>

                <!-- Correo Electrónico (Gmail / Cuenta) -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label for="profile-email" class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Correo Electrónico (Gmail)
                    </label>
                    <span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Identificador de cuenta
                    </span>
                  </div>
                  <input
                    id="profile-email"
                    type="email"
                    [value]="userEmail()"
                    disabled
                    class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
                  />
                  <p class="text-[11px] text-slate-400 mt-1">
                    Tu correo es único y no editable para garantizar la trazabilidad de tus facturas y órdenes.
                  </p>
                </div>

                <!-- Teléfono / Celular -->
                <div>
                  <label for="profile-phone" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / Celular
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    [ngModel]="phone()"
                    (ngModelChange)="phone.set($event)"
                    name="phone"
                    class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej. 310 123 4567"
                  />
                </div>

                <!-- Dirección de entrega -->
                <div>
                  <label for="profile-address" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección de despacho / entrega
                  </label>
                  <input
                    id="profile-address"
                    type="text"
                    [ngModel]="address()"
                    (ngModelChange)="address.set($event)"
                    name="address"
                    class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej. Calle 100 # 15-20, Edificio o Bodega"
                  />
                </div>
              </div>

              <!-- BOTÓN GUARDAR CAMBIOS -->
              <div class="pt-2">
                <button
                  type="submit"
                  [disabled]="isSavingProfile() || !fullName().trim()"
                  class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 px-5 py-3 text-xs font-black text-white shadow-md shadow-blue-500/25 transition disabled:opacity-50 cursor-pointer"
                >
                  @if (isSavingProfile()) {
                    <svg class="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Guardando cambios...</span>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Guardar datos de perfil</span>
                  }
                </button>
              </div>
            </form>
          }

          <!-- ========================================== -->
          <!-- PESTAÑA 2: SEGURIDAD & CONTRASEÑA          -->
          <!-- ========================================== -->
          @if (activeTab() === 'security') {
            <div class="space-y-6">
              <!-- BANNER EXPLICATIVO DE VERIFICACIÓN POR CORREO -->
              <div class="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-4.5">
                <div class="flex items-start gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Protección con Código de Verificación (OTP)
                    </h3>
                    <p class="text-xs text-blue-800/80 dark:text-blue-300/80 mt-1 leading-relaxed">
                      Para garantizar que nadie más cambie tu contraseña, enviaremos un código numérico seguro de 6 dígitos a tu correo:
                      <strong class="font-bold underline text-blue-950 dark:text-blue-200">{{ userEmail() }}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <!-- PASO 1: SOLICITAR CÓDIGO -->
              <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4.5 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Paso 1: Solicita tu código al correo
                    </p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">
                      El código será válido durante 10 minutos.
                    </p>
                  </div>

                  <button
                    type="button"
                    [disabled]="isSendingCode() || cooldownRemaining() > 0"
                    (click)="requestCode()"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-2 text-xs font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition disabled:opacity-50 cursor-pointer"
                  >
                    @if (isSendingCode()) {
                      <svg class="h-3.5 w-3.5 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Enviando...</span>
                    } @else if (cooldownRemaining() > 0) {
                      <span>Reenviar en {{ cooldownRemaining() }}s</span>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>{{ codeSent() ? 'Reenviar código' : 'Enviar código al correo' }}</span>
                    }
                  </button>
                </div>

                @if (codeSent()) {
                  <div class="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>¡Código enviado! Revisa tu bandeja de entrada o spam.</span>
                  </div>
                }
              </div>

              <!-- PASO 2: FORMULARIO DE CAMBIO DE CONTRASEÑA -->
              <form (ngSubmit)="confirmChangePassword($event)" class="space-y-4">
                <!-- Input Código de Verificación (6 dígitos) -->
                <div>
                  <label for="otp-code" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código de verificación (6 dígitos numéricos) <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="otp-code"
                      type="text"
                      maxlength="6"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      [ngModel]="verificationCode()"
                      (ngModelChange)="verificationCode.set($event)"
                      name="verificationCode"
                      placeholder="123456"
                      required
                      class="w-full text-center tracking-[0.4em] font-mono text-xl font-black rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-blue-600 dark:text-blue-400 placeholder-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <p class="text-[11px] text-slate-400 mt-1">
                    Ingresa exactamente los 6 números que recibiste en tu correo de Firmeza.
                  </p>
                </div>

                <!-- Nueva Contraseña -->
                <div>
                  <label for="new-password" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nueva contraseña <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="new-password"
                      [type]="showNewPassword() ? 'text' : 'password'"
                      required
                      minlength="8"
                      [ngModel]="newPassword()"
                      (ngModelChange)="newPassword.set($event)"
                      name="newPassword"
                      placeholder="Mínimo 8 caracteres"
                      class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      (click)="showNewPassword.set(!showNewPassword())"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      [attr.aria-label]="showNewPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
                    >
                      @if (showNewPassword()) {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      } @else {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      }
                    </button>
                  </div>
                </div>

                <!-- Confirmar Nueva Contraseña -->
                <div>
                  <label for="confirm-password" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirmar nueva contraseña <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="confirm-password"
                      [type]="showConfirmPassword() ? 'text' : 'password'"
                      required
                      minlength="8"
                      [ngModel]="confirmPassword()"
                      (ngModelChange)="confirmPassword.set($event)"
                      name="confirmPassword"
                      placeholder="Repite la nueva contraseña"
                      class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      (click)="showConfirmPassword.set(!showConfirmPassword())"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      [attr.aria-label]="showConfirmPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
                    >
                      @if (showConfirmPassword()) {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      } @else {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      }
                    </button>
                  </div>
                  @if (confirmPassword() && newPassword() !== confirmPassword()) {
                    <p class="text-[11px] font-semibold text-rose-500 mt-1">
                      Las contraseñas no coinciden.
                    </p>
                  }
                </div>

                <!-- BOTÓN CONFIRMAR CAMBIO -->
                <div class="pt-3">
                  <button
                    type="submit"
                    [disabled]="
                      isChangingPassword() ||
                      verificationCode().trim().length !== 6 ||
                      newPassword().length < 8 ||
                      newPassword() !== confirmPassword()
                    "
                    class="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 px-5 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    @if (isChangingPassword()) {
                      <svg class="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Validando y actualizando...</span>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <span>Confirmar y Cambiar Contraseña</span>
                    }
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </aside>
    </div>
  `
})
export class ProfileDrawerComponent implements OnInit, OnDestroy {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  private readonly authService = inject(AuthService);
  protected readonly presets = AVATAR_PRESETS;

  // Estado del drawer
  protected readonly activeTab = signal<'personal' | 'security'>('personal');
  protected readonly animating = signal(false);

  // Campos de perfil
  protected readonly fullName = signal('');
  protected readonly userEmail = signal('');
  protected readonly phone = signal('');
  protected readonly address = signal('');
  protected readonly avatarUrlInput = signal('');
  protected readonly previewAvatarUrl = signal<string | null>(null);
  protected readonly isSavingProfile = signal(false);

  // Campos de contraseña y código OTP
  protected readonly isSendingCode = signal(false);
  protected readonly codeSent = signal(false);
  protected readonly cooldownRemaining = signal(0);
  protected readonly verificationCode = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly showNewPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly isChangingPassword = signal(false);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;
  @ViewChild('drawerPanel') private readonly drawerPanel?: ElementRef<HTMLElement>;

  constructor() {
    // Sincronizar datos del usuario cuando el drawer se abre
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.animating.set(true);
        this.loadUserData();
      } else {
        setTimeout(() => this.animating.set(false), 300);
      }
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.requestClose();
    }
  }

  protected requestClose(): void {
    this.close.emit();
  }

  private loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.fullName.set(user.fullName || '');
      this.userEmail.set(user.email || '');
      this.phone.set(user.phone || '');
      this.address.set(user.address || '');
      this.avatarUrlInput.set(user.avatarUrl || '');
      this.previewAvatarUrl.set(user.avatarUrl || null);
    }

    // Traer datos frescos del backend por si hay teléfono o dirección actualizada
    this.authService.me().subscribe({
      next: (freshUser) => {
        this.fullName.set(freshUser.fullName || '');
        this.userEmail.set(freshUser.email || '');
        if (freshUser.phone) this.phone.set(freshUser.phone);
        if (freshUser.address) this.address.set(freshUser.address);
        if (freshUser.avatarUrl) {
          this.avatarUrlInput.set(freshUser.avatarUrl);
          this.previewAvatarUrl.set(freshUser.avatarUrl);
        }
      },
      error: () => {
        // Usa datos del signal en fallback
      }
    });
  }

  protected onAvatarUrlInputChange(val: string): void {
    this.avatarUrlInput.set(val);
    this.updateAvatarPreview();
  }

  protected updateAvatarPreview(): void {
    const val = this.avatarUrlInput().trim();
    this.previewAvatarUrl.set(val ? val : null);
  }

  protected selectPresetAvatar(url: string): void {
    this.avatarUrlInput.set(url);
    this.previewAvatarUrl.set(url);
  }

  protected clearAvatar(): void {
    this.avatarUrlInput.set('');
    this.previewAvatarUrl.set(null);
  }

  protected onAvatarError(): void {
    this.previewAvatarUrl.set(null);
  }

  protected savePersonalProfile(event: Event): void {
    event.preventDefault();
    const name = this.fullName().trim();
    if (!name) return;

    this.isSavingProfile.set(true);

    this.authService
      .updateProfile({
        fullName: name,
        phone: this.phone().trim() || null,
        address: this.address().trim() || null,
        avatarUrl: this.previewAvatarUrl()
      })
      .subscribe({
        next: (updatedUser) => {
          this.isSavingProfile.set(false);
          void Swal.fire({
            icon: 'success',
            title: '¡Perfil actualizado!',
            text: 'Tus datos personales y foto de perfil se han guardado correctamente.',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        },
        error: (err) => {
          this.isSavingProfile.set(false);
          void Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: toApiError(err).message || 'No fue posible guardar los cambios de tu perfil.'
          });
        }
      });
  }

  protected requestCode(): void {
    if (this.isSendingCode() || this.cooldownRemaining() > 0) return;

    this.isSendingCode.set(true);

    this.authService.requestPasswordCode().subscribe({
      next: (res) => {
        this.isSendingCode.set(false);
        this.codeSent.set(true);
        this.startCooldown(60);

        void Swal.fire({
          icon: 'info',
          title: 'Código enviado',
          html: `Hemos enviado un código numérico de 6 dígitos a <strong>${res.email}</strong>. Revisa tu correo e ingrésalo a continuación.`,
          confirmButtonColor: '#2563eb'
        });
      },
      error: (err) => {
        this.isSendingCode.set(false);
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo enviar el código',
          text: toApiError(err).message || 'Ocurrió un error al intentar enviar el correo de verificación.'
        });
      }
    });
  }

  private startCooldown(seconds: number): void {
    this.cooldownRemaining.set(seconds);
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);

    this.cooldownTimer = setInterval(() => {
      const current = this.cooldownRemaining();
      if (current <= 1) {
        clearInterval(this.cooldownTimer!);
        this.cooldownTimer = null;
        this.cooldownRemaining.set(0);
      } else {
        this.cooldownRemaining.set(current - 1);
      }
    }, 1000);
  }

  protected confirmChangePassword(event: Event): void {
    event.preventDefault();
    const code = this.verificationCode().trim();
    const newPwd = this.newPassword();
    const confirmPwd = this.confirmPassword();

    if (code.length !== 6 || newPwd.length < 8 || newPwd !== confirmPwd) return;

    this.isChangingPassword.set(true);

    this.authService
      .changePasswordWithCode({
        code,
        newPassword: newPwd,
        confirmPassword: confirmPwd
      })
      .subscribe({
        next: () => {
          this.isChangingPassword.set(false);
          this.verificationCode.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
          this.codeSent.set(false);

          void Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada con éxito!',
            text: 'Tu contraseña ha sido actualizada. Podrás usarla en tu próximo inicio de sesión.',
            confirmButtonColor: '#059669'
          }).then(() => {
            this.activeTab.set('personal');
          });
        },
        error: (err) => {
          this.isChangingPassword.set(false);
          void Swal.fire({
            icon: 'error',
            title: 'Error al cambiar contraseña',
            text: toApiError(err).message || 'El código ingresado es incorrecto o ha expirado.'
          });
        }
      });
  }
}
