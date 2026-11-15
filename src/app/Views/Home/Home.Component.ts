import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ThemeService } from '../../Services/theme.service';
import { LogoComponent } from '../Layout/Shell.Component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LogoComponent],
  template: `
    <!-- CONTENEDOR RAÍZ CON PREVENCIÓN TOTAL DE DESBORDE HORIZONTAL EN MÓVILES -->
    <div class="relative w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">

      <!-- HEADER FLOTANTE ESTILO SAUNUZ (TRANSPARENTE BORROSO SIEMPRE VISIBLE) -->
      <header class="fixed top-2 sm:top-3 md:top-4 inset-x-0 z-50 px-2.5 sm:px-6 pointer-events-none">
        <div
          class="pointer-events-auto mx-auto max-w-6xl rounded-2xl border transition-all duration-300 animate-header-enter"
          [class.bg-white/30]="!isScrolled()"
          [class.dark:bg-black/30]="!isScrolled()"
          [class.border-slate-200/50]="!isScrolled()"
          [class.dark:border-white/10]="!isScrolled()"
          [class.backdrop-blur-md]="!isScrolled()"
          [class.shadow-lg]="!isScrolled()"
          [class.shadow-black/5]="!isScrolled()"
          [class.dark:shadow-black/20]="!isScrolled()"
          [class.bg-white/45]="isScrolled()"
          [class.dark:bg-black/45]="isScrolled()"
          [class.border-slate-300/60]="isScrolled()"
          [class.dark:border-white/15]="isScrolled()"
          [class.backdrop-blur-xl]="isScrolled()"
          [class.shadow-xl]="isScrolled()"
          [class.shadow-black/10]="isScrolled()"
          [class.dark:shadow-black/40]="isScrolled()"
        >
          <div
            class="flex items-center justify-between px-3 sm:px-5 md:px-6 transition-all duration-300"
            [class.h-14]="isScrolled()"
            [class.md:h-14]="isScrolled()"
            [class.h-15]="!isScrolled()"
            [class.md:h-16]="!isScrolled()"
          >
            <!-- Logo / Marca a la izquierda -->
            <a
              routerLink="/"
              (click)="scrollToTop($event)"
              class="flex items-center gap-2 group cursor-pointer select-none"
              aria-label="Firmeza Home"
            >
              <app-logo size="sm" />
              <span class="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                Firmeza<span class="text-blue-600">.</span>
              </span>
            </a>

            <!-- Links de navegación de escritorio en mayúsculas con tracking y subrayado animado -->
            <nav class="hidden md:flex items-center gap-5 lg:gap-7">
              <!-- MÓDULOS -->
              <button
                type="button"
                (click)="scrollToSection('modulos')"
                class="relative text-xs lg:text-sm uppercase tracking-wider font-bold cursor-pointer group pb-1 transition-colors"
                [class.text-blue-600]="activeSection() === 'modulos'"
                [class.dark:text-blue-400]="activeSection() === 'modulos'"
                [class.text-slate-600]="activeSection() !== 'modulos'"
                [class.dark:text-slate-300]="activeSection() !== 'modulos'"
                [class.hover:text-slate-950]="activeSection() !== 'modulos'"
                [class.dark:hover:text-white]="activeSection() !== 'modulos'"
              >
                <span>Módulos</span>
                <span
                  class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                  [class.w-full]="activeSection() === 'modulos'"
                  [class.w-0]="activeSection() !== 'modulos'"
                  [class.group-hover:w-full]="activeSection() !== 'modulos'"
                ></span>
              </button>

              <!-- INDICADORES -->
              <button
                type="button"
                (click)="scrollToSection('indicadores')"
                class="relative text-xs lg:text-sm uppercase tracking-wider font-bold cursor-pointer group pb-1 transition-colors"
                [class.text-blue-600]="activeSection() === 'indicadores'"
                [class.dark:text-blue-400]="activeSection() === 'indicadores'"
                [class.text-slate-600]="activeSection() !== 'indicadores'"
                [class.dark:text-slate-300]="activeSection() !== 'indicadores'"
                [class.hover:text-slate-950]="activeSection() !== 'indicadores'"
                [class.dark:hover:text-white]="activeSection() !== 'indicadores'"
              >
                <span>Indicadores</span>
                <span
                  class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                  [class.w-full]="activeSection() === 'indicadores'"
                  [class.w-0]="activeSection() !== 'indicadores'"
                  [class.group-hover:w-full]="activeSection() !== 'indicadores'"
                ></span>
              </button>

              <!-- FLUJO COMERCIAL -->
              <button
                type="button"
                (click)="scrollToSection('flujo-comercial')"
                class="relative text-xs lg:text-sm uppercase tracking-wider font-bold cursor-pointer group pb-1 transition-colors"
                [class.text-blue-600]="activeSection() === 'flujo-comercial'"
                [class.dark:text-blue-400]="activeSection() === 'flujo-comercial'"
                [class.text-slate-600]="activeSection() !== 'flujo-comercial'"
                [class.dark:text-slate-300]="activeSection() !== 'flujo-comercial'"
                [class.hover:text-slate-950]="activeSection() !== 'flujo-comercial'"
                [class.dark:hover:text-white]="activeSection() !== 'flujo-comercial'"
              >
                <span>Flujo comercial</span>
                <span
                  class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                  [class.w-full]="activeSection() === 'flujo-comercial'"
                  [class.w-0]="activeSection() !== 'flujo-comercial'"
                  [class.group-hover:w-full]="activeSection() !== 'flujo-comercial'"
                ></span>
              </button>

              <!-- CATÁLOGO -->
              <a
                routerLink="/tienda"
                class="relative text-xs lg:text-sm uppercase tracking-wider font-bold cursor-pointer group pb-1 transition-colors flex items-center gap-1.5"
                [class.text-blue-600]="activeSection() === 'tienda'"
                [class.dark:text-blue-400]="activeSection() === 'tienda'"
                [class.text-slate-600]="activeSection() !== 'tienda'"
                [class.dark:text-slate-300]="activeSection() !== 'tienda'"
                [class.hover:text-slate-950]="activeSection() !== 'tienda'"
                [class.dark:hover:text-white]="activeSection() !== 'tienda'"
              >
                <span>Catálogo</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span
                  class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                  [class.w-full]="activeSection() === 'tienda'"
                  [class.w-0]="activeSection() !== 'tienda'"
                  [class.group-hover:w-full]="activeSection() !== 'tienda'"
                ></span>
              </a>
            </nav>

            <!-- Acciones derecha: Toggle tema + Auth buttons (Escritorio) -->
            <div class="hidden md:flex items-center gap-2.5 lg:gap-3">
              <!-- Botón cambio de tema idéntico a Saunuz -->
              <button
                type="button"
                (click)="theme.toggle()"
                class="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                [attr.aria-label]="theme.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
                [attr.title]="theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'"
              >
                @if (theme.isDark()) {
                  <svg class="h-4.5 w-4.5 text-blue-400 transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                } @else {
                  <svg class="h-4.5 w-4.5 text-slate-700 transition-transform duration-300 hover:rotate-45" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                }
              </button>

              @if (currentUser(); as user) {
                <a
                  [routerLink]="authService.isAdministrator() ? '/dashboard' : '/tienda'"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 pl-2 pr-3.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-300 transition"
                >
                  @if (user.avatarUrl) {
                    <img [src]="user.avatarUrl" alt="Avatar" class="h-6 w-6 rounded-full object-cover" />
                  } @else {
                    <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      {{ (user.fullName.charAt(0) || 'U').toUpperCase() }}
                    </span>
                  }
                  <span>{{ authService.isAdministrator() ? 'Panel Admin' : 'Mi Cuenta' }}</span>
                </a>
              } @else {
                <!-- Botón Ingresar -->
                <a
                  routerLink="/login"
                  class="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Ingresar
                </a>

                <!-- Botón Crear cuenta -->
                <a
                  routerLink="/register"
                  class="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-black text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95"
                >
                  Crear cuenta
                </a>
              }
            </div>

            <!-- Acciones móvil: Botón tema + Botón Hamburguesa -->
            <div class="flex items-center gap-1 sm:gap-1.5 md:hidden">
              <!-- Botón de tema en móvil -->
              <button
                type="button"
                (click)="theme.toggle()"
                class="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                [attr.aria-label]="theme.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
              >
                @if (theme.isDark()) {
                  <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
                  </svg>
                } @else {
                  <svg class="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                }
              </button>

              <!-- Hamburguesa móvil estilo Saunuz -->
              <button
                type="button"
                (click)="toggleMobileMenu()"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-xl transition-colors cursor-pointer"
                aria-label="Abrir menú"
              >
                @if (!mobileMenuOpen()) {
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                } @else {
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Overlay oscuro para menú móvil -->
      <div
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        [class.opacity-100]="mobileMenuOpen()"
        [class.pointer-events-auto]="mobileMenuOpen()"
        [class.opacity-0]="!mobileMenuOpen()"
        [class.pointer-events-none]="!mobileMenuOpen()"
        (click)="closeMobileMenu()"
      ></div>

      <!-- Menú lateral móvil (Drawer) adaptado para celular -->
      <div
        class="fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between overflow-y-auto"
        [class.translate-x-0]="mobileMenuOpen()"
        [class.translate-x-full]="!mobileMenuOpen()"
      >
        <div>
          <!-- Cabecera del Drawer -->
          <div class="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-slate-200 dark:border-slate-800">
            <span class="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Menú</span>
            <button
              type="button"
              (click)="closeMobileMenu()"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-500 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Enlaces en móvil con indicador lateral izquierdo -->
          <nav class="py-3 flex flex-col">
            <button
              type="button"
              (click)="scrollToSection('modulos')"
              class="px-5 sm:px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
              [class.border-blue-600]="activeSection() === 'modulos'"
              [class.text-blue-600]="activeSection() === 'modulos'"
              [class.bg-blue-50/50]="activeSection() === 'modulos'"
              [class.dark:bg-blue-950/30]="activeSection() === 'modulos'"
              [class.border-transparent]="activeSection() !== 'modulos'"
              [class.text-slate-600]="activeSection() !== 'modulos'"
              [class.dark:text-slate-300]="activeSection() !== 'modulos'"
            >
              <span>Módulos</span>
              @if (activeSection() === 'modulos') {
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              }
            </button>

            <button
              type="button"
              (click)="scrollToSection('indicadores')"
              class="px-5 sm:px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
              [class.border-blue-600]="activeSection() === 'indicadores'"
              [class.text-blue-600]="activeSection() === 'indicadores'"
              [class.bg-blue-50/50]="activeSection() === 'indicadores'"
              [class.dark:bg-blue-950/30]="activeSection() === 'indicadores'"
              [class.border-transparent]="activeSection() !== 'indicadores'"
              [class.text-slate-600]="activeSection() !== 'indicadores'"
              [class.dark:text-slate-300]="activeSection() !== 'indicadores'"
            >
              <span>Indicadores</span>
              @if (activeSection() === 'indicadores') {
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              }
            </button>

            <button
              type="button"
              (click)="scrollToSection('flujo-comercial')"
              class="px-5 sm:px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
              [class.border-blue-600]="activeSection() === 'flujo-comercial'"
              [class.text-blue-600]="activeSection() === 'flujo-comercial'"
              [class.bg-blue-50/50]="activeSection() === 'flujo-comercial'"
              [class.dark:bg-blue-950/30]="activeSection() === 'flujo-comercial'"
              [class.border-transparent]="activeSection() !== 'flujo-comercial'"
              [class.text-slate-600]="activeSection() !== 'flujo-comercial'"
              [class.dark:text-slate-300]="activeSection() !== 'flujo-comercial'"
            >
              <span>Flujo comercial</span>
              @if (activeSection() === 'flujo-comercial') {
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              }
            </button>

            <a
              routerLink="/tienda"
              (click)="closeMobileMenu()"
              class="px-5 sm:px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between border-transparent text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span>Catálogo</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-blue-600">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </a>
          </nav>
        </div>

        <!-- Pie del Drawer con usuario o botones de acceso -->
        <div class="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          @if (currentUser(); as user) {
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              @if (user.avatarUrl) {
                <img [src]="user.avatarUrl" alt="Avatar" class="h-9 w-9 rounded-xl object-cover ring-1 ring-blue-500/20" />
              } @else {
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xs shadow-xs">
                  {{ (user.fullName.charAt(0) || 'U').toUpperCase() }}
                </div>
              }
              <div class="min-w-0 flex-1">
                <p class="text-xs font-black text-slate-900 dark:text-white truncate">{{ user.fullName }}</p>
                <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">{{ user.email }}</p>
              </div>
            </div>

            <a
              [routerLink]="authService.isAdministrator() ? '/dashboard' : '/tienda'"
              (click)="closeMobileMenu()"
              class="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-md shadow-blue-500/25 transition-all"
            >
              {{ authService.isAdministrator() ? 'Ir al Panel de Control' : 'Ir a la Tienda' }}
            </a>

            <button
              type="button"
              (click)="logout()"
              class="w-full text-center py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          } @else {
            <a
              routerLink="/login"
              (click)="closeMobileMenu()"
              class="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
            >
              Ingresar
            </a>
            <a
              routerLink="/register"
              (click)="closeMobileMenu()"
              class="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-md shadow-blue-500/25 transition-all"
            >
              Crear cuenta
            </a>
          }
        </div>
      </div>

      <!-- SECCIÓN HERO PRINCIPAL CON FONDO Fondohero.png -->
      <section class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-900">
        <!-- Imagen de fondo Fondohero.png -->
        <div class="pointer-events-none absolute inset-0 select-none">
          <img
            src="img/Fondohero.png"
            alt="Fondo Hero Ferretería Firmeza"
            class="h-full w-full object-cover object-center"
          />
          <!-- Degradados de cobertura para contraste y legibilidad impecable -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-950/60"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 dark:from-slate-950 dark:via-transparent dark:to-slate-950/40"></div>
        </div>

        <div class="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-24 sm:pt-28 md:pt-32 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8">
          <!-- Columna de contenido textual -->
          <div class="lg:col-span-6">
            <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/90 dark:bg-blue-950/60 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 shadow-2xs">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
              Gestión Ferretera & Construcción
            </div>

            <h1 class="mt-5 text-4xl font-black leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Control integral de inventario, clientes y ventas
              <span class="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                en una sola plataforma
              </span>
            </h1>

            <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Firmeza centraliza el catálogo de materiales de construcción, la gestión de clientes y el registro de ventas con trazabilidad completa, cálculo automático de IVA y control estricto de existencias.
            </p>

            <!-- Botones de acción principales -->
            <div class="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                routerLink="/login"
                class="group inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 hover:shadow-blue-500/35 active:scale-95"
              >
                <span>Acceder al panel</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4 transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>

              <a
                routerLink="/tienda"
                class="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-800/90 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-blue-600">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Ver catálogo público
              </a>

              <a
                routerLink="/register"
                class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                ¿Eres cliente? Regístrate →
              </a>
            </div>

            <!-- Métricas de confianza -->
            <dl class="mt-8 sm:mt-10 grid grid-cols-1 gap-2.5 sm:gap-4 border-t border-slate-200 dark:border-slate-800 pt-6 sm:grid-cols-3">
              @for (item of highlights; track item.label) {
                <div class="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 backdrop-blur-xs">
                  <dt class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ item.label }}</dt>
                  <dd class="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                    <svg fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-4 w-4" [class]="item.iconClass">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {{ item.value }}
                  </dd>
                </div>
              }
            </dl>
          </div>

          <!-- Columna de ilustración y tarjetas flotantes (Sin desborde lateral en celular) -->
          <div class="relative lg:col-span-6 flex justify-center mt-5 lg:mt-0">
            <div class="relative z-10 w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[560px] translate-y-6 sm:translate-y-8 lg:translate-y-14">
              <img
                src="img/Godman.png"
                alt="Operación Ferretería Firmeza"
                class="animate-slide-in-left block h-auto w-full object-contain drop-shadow-xl sm:drop-shadow-2xl transition duration-500 hover:scale-102"
              />

              <!-- Tarjeta flotante 1: Catálogo y materiales (Posicionada sin desbordar el ancho de pantalla) -->
              <div class="animate-float-card-1 absolute bottom-1 left-1 sm:-bottom-4 sm:-left-6 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2.5 sm:p-3.5 shadow-lg sm:shadow-xl shadow-slate-300/40 dark:shadow-black/50 backdrop-blur-md max-w-[80%] sm:max-w-none">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 sm:h-5 sm:w-5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white truncate">Inventario al instante</p>
                    <p class="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">+1.240 productos</p>
                  </div>
                </div>
              </div>

              <!-- Tarjeta flotante 2: Estado de pedidos (Sin desbordar el margen derecho) -->
              <div class="animate-float-card-2 absolute top-2 right-1 sm:top-8 sm:-right-4 rounded-xl sm:rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 bg-white/95 dark:bg-slate-900/95 p-2 sm:p-3 shadow-lg sm:shadow-xl shadow-slate-300/40 dark:shadow-black/50 backdrop-blur-md max-w-[80%] sm:max-w-none">
                <div class="flex items-center gap-2 sm:gap-2.5">
                  <div class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3.5 w-3.5 sm:h-4 sm:w-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white truncate">Ventas con IVA 19%</p>
                    <p class="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">Despachos trazables</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget interactivo: Gráfica de barras de operaciones de inventario -->
        <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16 lg:mt-24 pb-16 sm:pb-24">
          <div class="overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 dark:border-white/[0.07] bg-transparent shadow-2xl shadow-blue-950/10 dark:shadow-black/70 backdrop-blur-2xl sm:backdrop-blur-3xl">

            <!-- Barra superior del widget -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/20 dark:border-white/[0.07] bg-transparent px-4 sm:px-6 py-4">
              <div class="flex items-center gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="h-4.5 w-4.5">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                </span>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-xs sm:text-sm font-black text-slate-950 dark:text-white">Panel de operaciones de inventario</p>
                    <span class="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 text-[10px] font-black text-blue-700 dark:text-blue-300">En vivo</span>
                  </div>
                  <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Sincronización en tiempo real · Catálogo activo</p>
                </div>
              </div>

              <div class="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <div class="inline-flex rounded-xl bg-white/20 dark:bg-white/[0.06] border border-white/30 dark:border-white/10 p-0.5 text-[11px] font-bold backdrop-blur-md">
                  <button type="button" (click)="setChartMetric('stock')"
                    [class]="chartMetric() === 'stock' ? 'bg-white/90 text-blue-600 shadow-sm dark:bg-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                    class="rounded-lg px-3 py-1 transition-all cursor-pointer">Existencias (Uds)</button>
                  <button type="button" (click)="setChartMetric('value')"
                    [class]="chartMetric() === 'value' ? 'bg-white/90 text-blue-600 shadow-sm dark:bg-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                    class="rounded-lg px-3 py-1 transition-all cursor-pointer">Valorización</button>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-400 shrink-0">
                  <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operativo · 100%
                </span>
              </div>
            </div>

            <!-- Gráfica de Barras -->
            <div class="p-4 sm:p-6 lg:p-7">
              <div class="relative rounded-2xl border border-white/10 dark:border-white/[0.04] bg-white/5 dark:bg-white/[0.03] p-4 sm:p-6 backdrop-blur-3xl">

                <!-- Líneas guía -->
                <div class="absolute inset-x-4 sm:inset-x-6 top-6 bottom-14 flex flex-col justify-between pointer-events-none opacity-40 dark:opacity-30">
                  @for (label of (chartMetric() === 'stock' ? ['350 uds','250 uds','150 uds','50 uds'] : ['$ 14.0M','$ 10.0M','$ 5.0M','$ 1.0M']); track label) {
                    <div class="border-b border-dashed border-slate-400/40 dark:border-white/15 flex justify-end text-[9px] font-mono text-slate-500 dark:text-slate-400 pr-1 -mt-2">{{ label }}</div>
                  }
                </div>

                <!-- Columnas de barras animadas -->
                <div class="relative z-10 grid grid-cols-4 gap-2 sm:gap-6 items-end h-52 sm:h-64 pt-6 pb-2">
                  @for (item of sampleRows; track item.sku; let i = $index) {
                    <div class="group relative flex flex-col items-center h-full justify-end cursor-pointer"
                      (mouseenter)="hoveredBar.set(item.sku)" (mouseleave)="hoveredBar.set(null)">
                      <!-- Valor flotante -->
                      <div class="mb-2 flex flex-col items-center transition-all duration-300 group-hover:-translate-y-1">
                        <span class="rounded-md px-1.5 py-0.5 text-[10px] sm:text-xs font-black tabular-nums shadow-sm transition-colors"
                          [class]="item.lowStock ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-900/80 text-white dark:bg-white/15 dark:text-white dark:border dark:border-white/20'">
                          {{ chartMetric() === 'stock' ? item.stock + ' uds' : item.totalValueFormatted }}
                        </span>
                      </div>
                      <!-- Barra -->
                      <div class="relative w-full max-w-[48px] sm:max-w-[76px] flex items-end justify-center h-full">
                        <div class="w-full rounded-t-xl sm:rounded-t-2xl transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-110 group-hover:scale-x-105"
                          [class]="getBarAnimationClass(i)"
                          [style.background]="item.barGradient"
                          [style.boxShadow]="item.barShadow"
                          [style.height.%]="chartMetric() === 'stock' ? item.stockPct : item.valuePct">
                          <!-- Brillo superior (cristal) -->
                          <div class="absolute inset-x-0 top-0 h-1.5 sm:h-2 bg-white/40"></div>
                        </div>
                      </div>
                      <!-- Etiquetas X -->
                      <div class="mt-3 text-center w-full">
                        <span class="inline-block rounded font-mono text-[9px] sm:text-[10px] font-black text-slate-600 dark:text-slate-300 px-1.5 py-0.5">{{ item.sku }}</span>
                        <p class="mt-0.5 text-[11px] sm:text-xs font-black text-slate-950 dark:text-white truncate">{{ item.shortName }}</p>
                        <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{{ item.price }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Tarjetas de desglose (4 columnas en desktop) -->
              <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                @for (item of sampleRows; track item.sku) {
                  <div class="rounded-xl sm:rounded-2xl border border-white/20 dark:border-white/[0.07] bg-transparent backdrop-blur-sm p-3.5 hover:border-white/40 dark:hover:border-white/15 hover:bg-white/10 dark:hover:bg-white/[0.04] transition group"
                    [class.ring-2]="hoveredBar() === item.sku" [class.ring-blue-500]="hoveredBar() === item.sku"
                    (mouseenter)="hoveredBar.set(item.sku)" (mouseleave)="hoveredBar.set(null)">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span class="h-2 w-2 rounded-full shrink-0" [class]="item.dotClass"></span>
                          <span class="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ item.sku }}</span>
                        </div>
                        <p class="text-xs font-black text-slate-950 dark:text-white truncate mt-1">{{ item.name }}</p>
                      </div>
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black ring-1 shrink-0" [class]="item.badgeClass">{{ item.status }}</span>
                    </div>
                    <div class="mt-3">
                      <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                        <span>Existencias: <strong class="text-slate-950 dark:text-white">{{ item.stock }} uds</strong></span>
                        <span class="font-mono text-slate-500 dark:text-slate-400">{{ item.price }}</span>
                      </div>
                      <div class="h-2 w-full rounded-full bg-white/20 dark:bg-white/10 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000 ease-out" [class]="item.colorClass" [style.width.%]="item.stockPct"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Pie del widget -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/20 dark:border-white/[0.07] bg-transparent px-4 sm:px-6 py-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-600 dark:text-emerald-400">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Mostrando catálogo activo de alta rotación</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-slate-500 dark:text-slate-400 text-[11px]">Existencias totales: <strong class="text-slate-900 dark:text-white">589 uds</strong></span>
                <span class="text-slate-300 dark:text-slate-600">|</span>
                <span class="font-black text-slate-950 dark:text-white">Total valorizado: $ 52.480.000 COP</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- SECCIÓN DE MÉTRICAS / ESTADÍSTICAS -->
      <section id="indicadores" class="scroll-mt-20 sm:scroll-mt-28 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 sm:py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            @for (stat of stats; track stat.label) {
              <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 p-4 sm:p-6 text-center shadow-xs transition hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md">
                <p class="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white tabular-nums">{{ stat.value }}</p>
                <p class="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- SECCIÓN DE MÓDULOS -->
      <section id="modulos" class="scroll-mt-20 sm:scroll-mt-28 py-12 sm:py-16 bg-slate-50/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl">
            <p class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="h-4 w-4">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              Estructura Modular
            </p>
            <h2 class="mt-2.5 sm:mt-3 text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Una operación estructurada, de punta a punta
            </h2>
            <p class="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Cada módulo comparte las mismas reglas de validación en el dominio, eliminando inconsistencias y duplicación entre áreas.
            </p>
          </div>

          <div class="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (module of modules; track module.title) {
              <article class="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl">
                <div>
                  <span class="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl shadow-2xs transition group-hover:scale-110" [class]="module.iconClass">
                    <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-5 w-5 sm:h-6 sm:w-6">
                      <path [attr.d]="module.icon" />
                    </svg>
                  </span>
                  <h3 class="mt-4 sm:mt-5 text-sm sm:text-base font-black text-slate-950 dark:text-white">{{ module.title }}</h3>
                  <p class="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{{ module.description }}</p>
                </div>
                <div class="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-black text-blue-600 dark:text-blue-400">
                  <span>Módulo activo</span>
                  <span class="transition group-hover:translate-x-1">→</span>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- SECCIÓN DE FLUJO COMERCIAL -->
      <section id="flujo-comercial" class="scroll-mt-20 sm:scroll-mt-28 py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800">
              Flujo de trabajo
            </span>
            <h2 class="mt-2.5 sm:mt-3 text-2xl sm:text-4xl font-black text-slate-950 dark:text-white">
              ¿Cómo funciona la venta y despacho?
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Proceso transparente desde la cotización y solicitud hasta la entrega con soporte documental.
            </p>
          </div>

          <div class="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-5 sm:p-6">
              <span class="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">1</span>
              <h3 class="mt-3.5 sm:mt-4 text-sm sm:text-base font-black text-slate-950 dark:text-white">Solicitud del cliente</h3>
              <p class="mt-1.5 sm:mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El cliente consulta el catálogo de materiales, arma su carrito y envía la solicitud de compra desde el portal con estado <span class="font-bold text-amber-600 dark:text-amber-400">Pendiente</span>.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-5 sm:p-6">
              <span class="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white">2</span>
              <h3 class="mt-3.5 sm:mt-4 text-sm sm:text-base font-black text-slate-950 dark:text-white">Aprobación administrativa</h3>
              <p class="mt-1.5 sm:mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El administrador recibe una alerta en tiempo real en el panel, verifica existencias y aprueba o cancela dejando el motivo documentado.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-5 sm:p-6">
              <span class="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white">3</span>
              <h3 class="mt-3.5 sm:mt-4 text-sm sm:text-base font-black text-slate-950 dark:text-white">Despacho y comprobante</h3>
              <p class="mt-1.5 sm:mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El stock se descuenta con atomicidad transaccional, la venta pasa a <span class="font-bold text-emerald-600 dark:text-emerald-400">Entregada</span> y se genera el comprobante PDF oficial con IVA discriminado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- LLAMADO A LA ACCIÓN (CTA FINAL) -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 sm:px-6 py-12 sm:py-16 text-center text-white lg:px-8">
        <div class="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

        <div class="relative z-10 mx-auto max-w-3xl">
          <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Comienza a operar con Ferretería Firmeza
          </h2>
          <p class="mx-auto mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
            El acceso administrativo requiere credenciales autorizadas. Si eres cliente o contratista, puedes solicitar tu cuenta para cotizar y comprar materiales de construcción.
          </p>
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
            <a
              routerLink="/login"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95"
            >
              Iniciar sesión
            </a>
            <a
              routerLink="/register"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              Crear cuenta de cliente
            </a>
          </div>
        </div>
      </section>

      <!-- PIE DE PÁGINA -->
      <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-6 sm:py-8 text-xs text-slate-500 dark:text-slate-400 lg:px-8">
        <div class="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div class="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <app-logo size="sm" />
            <span>Firmeza · Gestión de Materiales y Ventas</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Conexión protegida TLS 1.3 </span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly currentUser = this.authService.currentUser;

  // Estados reactivos del header estilo Saunuz
  protected readonly isScrolled = signal(false);
  protected readonly activeSection = signal<string>('');
  protected readonly mobileMenuOpen = signal(false);

  private lastScrollY = 0;
  private scrollCleanUp?: () => void;
  private observer?: IntersectionObserver;
  private resizeCleanUp?: () => void;

  protected readonly highlights = [
    { label: 'Disponibilidad', value: '99,9 % uptime', iconClass: 'text-emerald-600' },
    { label: 'Soporte', value: 'Soporte especializado', iconClass: 'text-blue-600' },
    { label: 'Seguridad', value: 'Cifrado TLS 1.3', iconClass: 'text-sky-600' }
  ];

  protected readonly chartMetric = signal<'stock' | 'value'>('stock');
  protected readonly hoveredBar = signal<string | null>(null);

  protected readonly sampleRows = [
    {
      sku: 'MAT-1042', name: 'Cemento Portland 50 kg', shortName: 'Cemento Portland',
      stock: 320, price: '$ 18.400', totalValueFormatted: '$ 5.88M',
      stockPct: 91, valuePct: 42, lowStock: false, status: 'Disponible',
      barGradient: 'linear-gradient(to top, #3b82f6, #60a5fa, #93c5fd)',
      barShadow: '0 4px 12px rgba(59,130,246,0.30)',
      dotClass: 'bg-blue-500',
      colorClass: 'bg-blue-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20',
      progressGradient: 'linear-gradient(to right, #2563eb, #22d3ee)'
    },
    {
      sku: 'MAT-2087', name: 'Acero corrugado 12 mm', shortName: 'Acero corrugado',
      stock: 145, price: '$ 96.500', totalValueFormatted: '$ 13.9M',
      stockPct: 41, valuePct: 100, lowStock: false, status: 'Disponible',
      barGradient: 'linear-gradient(to top, #6366f1, #8b5cf6, #a78bfa)',
      barShadow: '0 4px 12px rgba(99,102,241,0.30)',
      dotClass: 'bg-indigo-500',
      colorClass: 'bg-indigo-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20',
      progressGradient: 'linear-gradient(to right, #4f46e5, #818cf8)'
    },
    {
      sku: 'MAT-3315', name: 'Ladrillo cerámico hueco', shortName: 'Ladrillo cerámico',
      stock: 28, price: '$ 3.250', totalValueFormatted: '$ 91K',
      stockPct: 10, valuePct: 4, lowStock: true, status: 'Stock bajo',
      barGradient: 'linear-gradient(to top, #f59e0b, #f97316, #fbbf24)',
      barShadow: '0 4px 12px rgba(245,158,11,0.30)',
      dotClass: 'bg-amber-500',
      colorClass: 'bg-amber-500',
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20',
      progressGradient: 'linear-gradient(to right, #f59e0b, #fb7185)'
    },
    {
      sku: 'MAT-4402', name: 'Adhesivo cerámico 25 kg', shortName: 'Adhesivo cerámico',
      stock: 96, price: '$ 27.900', totalValueFormatted: '$ 2.68M',
      stockPct: 27, valuePct: 19, lowStock: false, status: 'Disponible',
      barGradient: 'linear-gradient(to top, #0891b2, #06b6d4, #22d3ee)',
      barShadow: '0 4px 12px rgba(6,182,212,0.30)',
      dotClass: 'bg-sky-500',
      colorClass: 'bg-sky-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20',
      progressGradient: 'linear-gradient(to right, #0284c7, #38bdf8)'
    }
  ];

  setChartMetric(metric: 'stock' | 'value'): void {
    this.chartMetric.set(metric);
  }

  getBarAnimationClass(index: number): string {
    return ['animate-bar-rise-1','animate-bar-rise-2','animate-bar-rise-3','animate-bar-rise-4'][index] ?? 'animate-bar-rise-1';
  }

  protected readonly stats = [
    { value: '1.240', label: 'Productos en catálogo' },
    { value: '318', label: 'Clientes registrados' },
    { value: '2.907', label: 'Operaciones procesadas' },
    { value: '100%', label: 'Trazabilidad de ventas' }
  ];

  protected readonly modules = [
    {
      title: 'Catálogo de materiales',
      description:
        'Codificación única por producto, control de existencias en bodega, precios con vigencia y alertas de stock mínimo para evitar quiebres de suministro.',
      iconClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      icon:
        'M7.5 4.27l9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z'
    },
    {
      title: 'Gestión de clientes',
      description:
        'Ficha única por cliente con historial de operaciones, estado de cuenta y documentación asociada, accesible con seguridad desde el portal.',
      iconClass: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'
    },
    {
      title: 'Registro de ventas',
      description:
        'Emisión y seguimiento de operaciones con estados definidos, cálculo de IVA discriminado del 19% y emisión de comprobantes en PDF.',
      iconClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      icon: 'M2 5h20v14H2zM2 10h20'
    },
    {
      title: 'Carga masiva',
      description:
        'Importación de catálogos y listas mediante plantilla Excel validada, con reporte de errores por fila para agilizar altas de inventario.',
      iconClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'
    }
  ];

  scrollToSection(id: string): void {
    this.closeMobileMenu();
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
      this.activeSection.set(id);
    }
  }

  scrollToTop(event?: Event): void {
    event?.preventDefault();
    this.closeMobileMenu();
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', window.location.pathname);
    this.activeSection.set('');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout(false);
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.isAdministrator()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.initScrollEffects();
    this.initScrollSpy();

    // Soporte para URLs directas con ancla (ej: /#indicadores)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['modulos', 'indicadores', 'flujo-comercial'].includes(hash)) {
        this.activeSection.set(hash);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 250);
      }
    }
  }

  ngOnDestroy(): void {
    this.scrollCleanUp?.();
    this.resizeCleanUp?.();
    this.observer?.disconnect();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  private initScrollEffects(): void {
    if (typeof window === 'undefined') return;

    this.lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      // Compactar sutilmente el header al hacer scroll
      this.isScrolled.set(currentY > 20);

      // Si vuelve arriba del todo, restablece sección activa
      if (currentY < 180) {
        this.activeSection.set('');
      }

      this.lastScrollY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.scrollCleanUp = () => window.removeEventListener('scroll', onScroll);

    // Cerrar menú móvil automáticamente si se redimensiona a escritorio
    const onResize = () => {
      if (window.innerWidth >= 768 && this.mobileMenuOpen()) {
        this.closeMobileMenu();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    this.resizeCleanUp = () => window.removeEventListener('resize', onResize);
  }

  private initScrollSpy(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Secciones que rastrea el scroll spy
    const sectionIds = ['modulos', 'indicadores', 'flujo-comercial'];

    setTimeout(() => {
      const elements = sectionIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          if (window.scrollY < 180) {
            this.activeSection.set('');
            return;
          }

          const visibleEntries = entries.filter(e => e.isIntersecting);
          if (visibleEntries.length > 0) {
            visibleEntries.sort(
              (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
            );
            this.activeSection.set(visibleEntries[0].target.id);
          }
        },
        {
          root: null,
          rootMargin: '-20% 0px -55% 0px',
          threshold: [0.1, 0.25, 0.5]
        }
      );

      elements.forEach(el => this.observer?.observe(el));
    }, 150);
  }
}
