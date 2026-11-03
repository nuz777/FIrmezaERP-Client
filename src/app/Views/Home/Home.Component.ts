import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ThemeService } from '../../Services/theme.service';
import { LogoComponent } from '../Layout/Shell.Component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LogoComponent],
  template: `
    <!-- HEADER FLOTANTE ESTILO SAUNUZ (TRANSPARENTE BORROSO SIEMPRE VISIBLE) -->
    <header class="fixed top-2 md:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
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
          [class.h-16]="!isScrolled()"
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
            <span class="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
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
          </div>

          <!-- Acciones móvil: Botón tema + Botón Hamburguesa -->
          <div class="flex items-center gap-1.5 md:hidden">
            <!-- Botón de tema en móvil -->
            <button
              type="button"
              (click)="theme.toggle()"
              class="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              [attr.aria-label]="theme.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            >
              @if (theme.isDark()) {
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
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

    <!-- Menú lateral móvil (Drawer) idéntico a Saunuz -->
    <div
      class="fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between"
      [class.translate-x-0]="mobileMenuOpen()"
      [class.translate-x-full]="!mobileMenuOpen()"
    >
      <div>
        <!-- Cabecera del Drawer -->
        <div class="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-slate-800">
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
        <nav class="py-4 flex flex-col">
          <button
            type="button"
            (click)="scrollToSection('modulos')"
            class="px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
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
            class="px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
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
            class="px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between"
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
            class="px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-left transition-all w-full cursor-pointer border-l-2 flex items-center justify-between border-transparent text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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

      <!-- Pie del Drawer con botones de acceso y tema -->
      <div class="p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
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
      </div>
    </div>

    <!-- SECCIÓN HERO PRINCIPAL -->
    <section class="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/60 to-blue-50/30">
      <!-- Malla decorativa sutil -->
      <div class="pointer-events-none absolute inset-0 auth-grid opacity-40"></div>

      <!-- Skyline de edificios en la base de la sección -->
      <svg
        class="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full select-none"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="ventanasHome" width="14" height="18" patternUnits="userSpaceOnUse">
            <rect x="3" y="4" width="6" height="8" fill="#ffffff" opacity=".8" />
          </pattern>
          <g id="edificiosHome">
            <rect x="0" y="140" width="90" height="160" />
            <rect x="90" y="100" width="70" height="200" />
            <rect x="160" y="170" width="100" height="130" />
            <rect x="260" y="80" width="80" height="220" />
            <rect x="340" y="150" width="110" height="150" />
            <rect x="450" y="110" width="70" height="190" />
            <rect x="520" y="60" width="90" height="240" />
            <rect x="610" y="140" width="100" height="160" />
            <rect x="710" y="90" width="80" height="210" />
            <rect x="790" y="160" width="110" height="140" />
            <rect x="900" y="70" width="80" height="230" />
            <rect x="980" y="130" width="100" height="170" />
            <rect x="1080" y="100" width="120" height="200" />
          </g>
          <clipPath id="recorteHome"><use href="#edificiosHome" /></clipPath>
        </defs>

        <use href="#edificiosHome" fill="#cbd5e1" opacity=".5" />
        <rect width="1200" height="300" fill="url(#ventanasHome)" clip-path="url(#recorteHome)" opacity=".6" />
        <g fill="#bfdbfe" opacity=".65">
          <rect x="40" y="200" width="100" height="100" />
          <rect x="140" y="170" width="70" height="130" />
          <rect x="230" y="210" width="120" height="90" />
          <rect x="380" y="180" width="80" height="120" />
          <rect x="490" y="220" width="110" height="80" />
          <rect x="640" y="190" width="90" height="110" />
          <rect x="760" y="215" width="120" height="85" />
          <rect x="910" y="185" width="80" height="115" />
          <rect x="1020" y="210" width="110" height="90" />
        </g>
      </svg>

      <div class="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-24 sm:pt-28 md:pt-32 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8">
        <!-- Columna de contenido textual -->
        <div class="lg:col-span-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-2xs">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
            Gestión Ferretera & Construcción
          </div>

          <h1 class="mt-5 text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Control integral de inventario, clientes y ventas
            <span class="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              en una sola plataforma
            </span>
          </h1>

          <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
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
              class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-slate-50 hover:text-blue-700 active:scale-95"
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
              class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-slate-900"
            >
              ¿Eres cliente? Regístrate →
            </a>
          </div>

          <!-- Métricas de confianza -->
          <dl class="mt-10 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
            @for (item of highlights; track item.label) {
              <div class="rounded-xl border border-slate-200/80 bg-white/70 p-3 backdrop-blur-xs">
                <dt class="text-[11px] font-black uppercase tracking-wider text-slate-400">{{ item.label }}</dt>
                <dd class="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-900">
                  <svg fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-4 w-4" [class]="item.iconClass">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ item.value }}
                </dd>
              </div>
            }
          </dl>
        </div>

        <!-- Columna de ilustración y tarjetas flotantes de producto -->
        <div class="relative lg:col-span-6 flex justify-center">
          <!-- Resplandor decorativo de fondo -->
          <div class="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-tr from-blue-300/35 to-indigo-200/35 blur-3xl"></div>

          <div class="relative z-10 w-full max-w-[620px] -translate-y-3 lg:-translate-y-6">
            <img
              src="img/Godman.png"
              alt="Operación Ferretería Firmeza"
              class="animate-slide-in-left block h-auto w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-102"
            />

            <!-- Tarjeta flotante 1: Catálogo y materiales (aparece tras la animación) -->
            <div class="animate-float-card-1 absolute -bottom-4 left-0 sm:-left-6 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl shadow-slate-300/50 backdrop-blur-md">
              <div class="flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-900">Inventario al instante</p>
                  <p class="text-[11px] font-semibold text-slate-500">+1.240 productos codificados</p>
                </div>
              </div>
            </div>

            <!-- Tarjeta flotante 2: Estado de pedidos (aparece tras la animación) -->
            <div class="animate-float-card-2 absolute top-8 -right-2 sm:-right-4 rounded-2xl border border-emerald-200/90 bg-white/95 p-3 shadow-xl shadow-slate-300/50 backdrop-blur-md">
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-900">Ventas con IVA 19%</p>
                  <p class="text-[11px] font-semibold text-emerald-600">Despachos trazables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget interactivo: Vista previa del panel de operaciones -->
      <div class="relative z-10 mx-auto max-w-4xl px-5 pb-16 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-300">
                <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                  <path d="M13.35 1.5h-.92L4.35 14h4.46l-4 8.5h.85L14.69 16H8.9l5.6-14.5Z" />
                </svg>
              </span>
              <div>
                <p class="text-xs font-black text-slate-950">Panel de operaciones de inventario</p>
                <p class="text-[11px] text-slate-500">Sincronización en tiempo real · </p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operativo · 100%
            </span>
          </div>

          <div class="overflow-x-auto p-2 sm:p-4">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <th class="py-2.5 px-3">Código</th>
                  <th class="py-2.5 px-3">Descripción de material</th>
                  <th class="py-2.5 px-3 text-right">Existencias</th>
                  <th class="py-2.5 px-3 text-right">Precio unitario</th>
                  <th class="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (row of sampleRows; track row.sku) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-3 font-mono font-bold text-slate-900">{{ row.sku }}</td>
                    <td class="py-3 px-3 font-bold text-slate-800">{{ row.name }}</td>
                    <td class="py-3 px-3 text-right font-black tabular-nums" [class]="row.lowStock ? 'text-amber-600' : 'text-slate-900'">
                      {{ row.stock }} uds
                    </td>
                    <td class="py-3 px-3 text-right font-black text-slate-900 tabular-nums">{{ row.price }}</td>
                    <td class="py-3 px-3 text-center">
                      @if (row.lowStock) {
                        <span class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-200">
                          Stock bajo
                        </span>
                      } @else {
                        <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200">
                          Disponible
                        </span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-600">
            <span>Mostrando catálogo activo de alta rotación</span>
            <span class="font-black text-slate-900">Total valorizado: $ 52.480.000 COP</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE MÉTRICAS / ESTADÍSTICAS -->
    <section id="indicadores" class="scroll-mt-24 sm:scroll-mt-28 border-b border-slate-200 bg-white py-12">
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div class="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-xs transition hover:border-blue-300 hover:shadow-md">
              <p class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl tabular-nums">{{ stat.value }}</p>
              <p class="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE MÓDULOS -->
    <section id="modulos" class="scroll-mt-24 sm:scroll-mt-28 py-16 bg-slate-50/60 border-b border-slate-200">
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <div class="max-w-2xl">
          <p class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="h-4 w-4">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
            Estructura Modular
          </p>
          <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Una operación estructurada, de punta a punta
          </h2>
          <p class="mt-3 text-base text-slate-600 leading-relaxed">
            Cada módulo comparte las mismas reglas de validación en el dominio, eliminando inconsistencias y duplicación entre áreas.
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (module of modules; track module.title) {
            <article class="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl">
              <div>
                <span class="flex h-12 w-12 items-center justify-center rounded-xl shadow-2xs transition group-hover:scale-110" [class]="module.iconClass">
                  <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-6 w-6">
                    <path [attr.d]="module.icon" />
                  </svg>
                </span>
                <h3 class="mt-5 text-base font-black text-slate-950">{{ module.title }}</h3>
                <p class="mt-2 text-xs leading-relaxed text-slate-600">{{ module.description }}</p>
              </div>
              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-black text-blue-600">
                <span>Módulo activo</span>
                <span class="transition group-hover:translate-x-1">→</span>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE FLUJO COMERCIAL -->
    <section id="flujo-comercial" class="scroll-mt-24 sm:scroll-mt-28 py-16 bg-white border-b border-slate-200">
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <div class="text-center max-w-2xl mx-auto">
          <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700 ring-1 ring-blue-200">
            Flujo de trabajo
          </span>
          <h2 class="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            ¿Cómo funciona la venta y despacho?
          </h2>
          <p class="mt-2 text-sm text-slate-600">
            Proceso transparente desde la cotización y solicitud hasta la entrega con soporte documental.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">1</span>
            <h3 class="mt-4 text-base font-black text-slate-950">Solicitud del cliente</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">
              El cliente consulta el catálogo de materiales, arma su carrito y envía la solicitud de compra desde el portal con estado <span class="font-bold text-amber-700">Pendiente</span>.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white">2</span>
            <h3 class="mt-4 text-base font-black text-slate-950">Aprobación administrativa</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">
              El administrador recibe una alerta en tiempo real en el panel, verifica existencias y aprueba o cancela dejando el motivo documentado.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white">3</span>
            <h3 class="mt-4 text-base font-black text-slate-950">Despacho y comprobante</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">
              El stock se descuenta con atomicidad transaccional, la venta pasa a <span class="font-bold text-emerald-700">Entregada</span> y se genera el PDF oficial con IVA discriminado.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- LLAMADO A LA ACCIÓN (CTA FINAL) -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-16 text-center text-white lg:px-8">
      <div class="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

      <div class="relative z-10 mx-auto max-w-3xl">
        <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Comienza a operar con Ferretería Firmeza
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          El acceso administrativo requiere credenciales autorizadas. Si eres cliente o contratista, puedes solicitar tu cuenta para cotizar y comprar materiales de construcción.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a
            routerLink="/login"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95"
          >
            Iniciar sesión
          </a>
          <a
            routerLink="/register"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
          >
            Crear cuenta de cliente
          </a>
        </div>
      </div>
    </section>

    <!-- PIE DE PÁGINA -->
    <footer class="border-t border-slate-200 bg-white px-5 py-8 text-xs text-slate-500 lg:px-8">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2 font-bold text-slate-800">
          <app-logo size="sm" />
          <span>Firmeza · Gestión de Materiales y Ventas</span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-600">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Conexión protegida TLS 1.3 </span>
        </div>
      </div>
    </footer>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);

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

  protected readonly sampleRows = [
    { sku: 'MAT-1042', name: 'Cemento Portland 50 kg', stock: 320, price: '$ 18.400', lowStock: false },
    { sku: 'MAT-2087', name: 'Acero corrugado 12 mm', stock: 145, price: '$ 96.500', lowStock: false },
    { sku: 'MAT-3315', name: 'Ladrillo cerámico hueco', stock: 28, price: '$ 3.250', lowStock: true },
    { sku: 'MAT-4402', name: 'Adhesivo cerámico 25 kg', stock: 96, price: '$ 27.900', lowStock: false }
  ];

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
      iconClass: 'bg-blue-50 text-blue-600',
      icon:
        'M7.5 4.27l9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z'
    },
    {
      title: 'Gestión de clientes',
      description:
        'Ficha única por cliente con historial de operaciones, estado de cuenta y documentación asociada, accesible con seguridad desde el portal.',
      iconClass: 'bg-sky-50 text-sky-600',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'
    },
    {
      title: 'Registro de ventas',
      description:
        'Emisión y seguimiento de operaciones con estados definidos, cálculo de IVA discriminado del 19% y emisión de comprobantes en PDF.',
      iconClass: 'bg-emerald-50 text-emerald-600',
      icon: 'M2 5h20v14H2zM2 10h20'
    },
    {
      title: 'Carga masiva',
      description:
        'Importación de catálogos y listas mediante plantilla Excel validada, con reporte de errores por fila para agilizar altas de inventario.',
      iconClass: 'bg-indigo-50 text-indigo-600',
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
