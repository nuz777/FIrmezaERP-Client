import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { toApiError } from '../../Services/Api.Service';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { LogoComponent } from '../Layout/Shell.Component';
import { BottomNavComponent, BottomNavItem } from '../Shared/BottomNav.Component';
import { IconComponent } from '../Shared/Icon.Component';
import { ProfileDrawerComponent } from '../Shared/ProfileDrawer.Component';
import { ThemeToggleComponent } from '../Shared/ThemeToggle.Component';
import { productDetailModalOpenSignal } from './ProductDetailDrawer.Component';

/**
 * Layout del portal del cliente. Es distinto del panel de administracion: el
 * cliente ve el catalogo, el carrito y su sesion, nada del inventario ni del
 * directorio de clientes.
 */
@Component({
  selector: 'app-client-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoComponent, IconComponent, ThemeToggleComponent, BottomNavComponent, ProfileDrawerComponent],
  template: `
    <div class="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <!-- HEADER FLOTANTE ESTILO SAUNUZ (TRANSPARENTE BORROSO SIEMPRE VISIBLE) -->
      <header
        class="fixed top-2 md:top-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-300 ease-out"
        [class.opacity-0]="isProductDetailOpen()"
        [class.-translate-y-full]="isProductDetailOpen()"
        [class.opacity-100]="!isProductDetailOpen()"
        [class.translate-y-0]="!isProductDetailOpen()"
      >
        <div
          class="pointer-events-auto mx-auto max-w-7xl rounded-2xl border transition-all duration-300 animate-header-enter"
          [class.bg-white/40]="!isScrolled()"
          [class.dark:bg-slate-900/40]="!isScrolled()"
          [class.border-slate-200/60]="!isScrolled()"
          [class.dark:border-white/10]="!isScrolled()"
          [class.backdrop-blur-md]="!isScrolled()"
          [class.shadow-lg]="!isScrolled()"
          [class.shadow-black/5]="!isScrolled()"
          [class.dark:shadow-black/20]="!isScrolled()"
          [class.bg-white/60]="isScrolled()"
          [class.dark:bg-slate-900/60]="isScrolled()"
          [class.border-slate-300/70]="isScrolled()"
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
            <!-- Logo a la izquierda -->
            <a routerLink="/tienda" class="flex items-center gap-2 group cursor-pointer select-none" aria-label="Firmeza Catálogo">
              <app-logo size="sm" />
              <span class="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                Firmeza<span class="text-blue-600">.</span>
              </span>
            </a>

            <!-- Navegación central (Escritorio) -->
            <nav class="hidden sm:flex items-center gap-1.5 md:gap-2" aria-label="Navegación del cliente">
              <a
                routerLink="/"
                class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                Inicio
              </a>
              <a
                routerLink="/tienda"
                routerLinkActive="bg-blue-50/90 text-blue-700 shadow-2xs font-black dark:bg-blue-950/60 dark:text-blue-300"
                class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Catálogo
              </a>
              <a
                routerLink="/carrito"
                routerLinkActive="bg-blue-50/90 text-blue-700 shadow-2xs font-black dark:bg-blue-950/60 dark:text-blue-300"
                class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                <app-icon name="cart" [size]="15" />
                Carrito
                @if (cart.count() > 0) {
                  <span class="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">{{ cart.count() }}</span>
                }
              </a>
              @if (authService.isAuthenticated()) {
                <a
                  routerLink="/mis-compras"
                  routerLinkActive="bg-blue-50/90 text-blue-700 shadow-2xs font-black dark:bg-blue-950/60 dark:text-blue-300"
                  class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70"
                >
                  <app-icon name="receipt" [size]="15" />
                  Mis compras
                </a>
              }
            </nav>

            <!-- Acciones a la derecha: Carrito móvil, Tema, Perfil/Auth -->
            <div class="flex items-center gap-2 sm:gap-3">
              <!-- Carrito en móvil -->
              <a
                routerLink="/carrito"
                class="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-slate-700 shadow-xs dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-200 sm:hidden backdrop-blur-md"
              >
                <app-icon name="cart" [size]="16" />
                @if (cart.count() > 0) {
                  <span class="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">{{ cart.count() }}</span>
                }
              </a>

              <!-- Selector de modo oscuro/claro (a la izquierda del perfil en escritorio) -->
              <div class="hidden sm:block">
                <app-theme-toggle size="sm" />
              </div>

              <!-- Perfil de usuario con menú desplegable animado -->
              @if (authService.getUser(); as user) {
                <div #userMenuContainer class="relative">
                  <button
                    type="button"
                    (click)="$event.stopPropagation(); toggleUserMenu()"
                    class="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cursor-pointer focus:outline-none"
                    [attr.aria-expanded]="userMenuOpen()"
                    aria-haspopup="true"
                    title="Opciones de perfil"
                  >
                    @if (user.avatarUrl) {
                      <img
                        [src]="user.avatarUrl"
                        [alt]="user.fullName"
                        class="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs"
                        (error)="user.avatarUrl = null"
                      />
                    } @else {
                      <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 font-black text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                        {{ user.fullName.charAt(0).toUpperCase() }}
                      </span>
                    }
                    <div class="hidden text-left sm:block">
                      <p class="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight">{{ user.fullName }}</p>
                      <p class="text-[10px] font-semibold text-slate-400">Cliente registrado</p>
                    </div>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200"
                      [class.rotate-180]="userMenuOpen()"
                    >
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  @if (userMenuOpen()) {
                    <!-- Panel desplegable con animación de entrada y salida -->
                    <div
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100"
                      [class.dropdown-menu-enter]="!userMenuClosing()"
                      [class.dropdown-menu-leave]="userMenuClosing()"
                      role="menu"
                    >
                      <!-- Tarjeta clickeable con foto, nombre y Gmail que abre el Drawer de Perfil -->
                      <button
                        type="button"
                        (click)="openProfileDrawer()"
                        class="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-blue-50/80 dark:hover:bg-blue-950/40 cursor-pointer border border-transparent hover:border-blue-200/60 dark:hover:border-blue-900/40"
                        title="Toca para editar tu foto, nombre, contraseña o datos personales"
                      >
                        @if (user.avatarUrl) {
                          <img
                            [src]="user.avatarUrl"
                            [alt]="user.fullName"
                            class="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition shadow-2xs"
                          />
                        } @else {
                          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 font-black text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition">
                            {{ user.fullName.charAt(0).toUpperCase() }}
                          </span>
                        }
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight transition">
                            {{ user.fullName }}
                          </p>
                          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {{ user.email }}
                          </p>
                          <span class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                            Editar perfil & contraseña →
                          </span>
                        </div>
                      </button>

                      <div class="my-1.5 h-px bg-slate-100 dark:bg-slate-800"></div>

                      <!-- Botón Mi perfil & Seguridad -->
                      <button
                        type="button"
                        (click)="openProfileDrawer()"
                        class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <div class="flex items-center gap-2.5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-blue-600 dark:text-blue-400">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Mi Perfil & Seguridad</span>
                        </div>
                        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 text-slate-400">
                          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                      </button>

                      <div class="my-1.5 h-px bg-slate-100 dark:bg-slate-800"></div>

                      <!-- Botón Borrar mis datos -->
                      <button
                        type="button"
                        [disabled]="deletingAccount()"
                        (click)="confirmDeleteAccount()"
                        class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-50 cursor-pointer"
                      >
                        <app-icon name="trash" [size]="15" />
                        <span>{{ deletingAccount() ? 'Borrando...' : 'Borrar mis datos' }}</span>
                      </button>

                      <!-- Botón Cerrar sesión -->
                      <button
                        type="button"
                        (click)="logout()"
                        class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-slate-400">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <div class="flex items-center gap-2">
                  <a
                    routerLink="/login"
                    class="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Ingresar
                  </a>
                  <a
                    routerLink="/register"
                    class="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-black text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95"
                  >
                    Crear cuenta
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </header>

      <!-- Contenedor central con padding superior para el header flotante -->
      <main class="relative z-20 mx-auto w-full max-w-7xl flex-1 px-4 pt-24 sm:pt-28 pb-28 sm:pb-8">
        <router-outlet />
      </main>

      <!-- Pie de página con seguridad y datos empresariales (al abrir el detalle de producto se oculta con animación suave y reaparece al cerrarlo) -->
      <footer
        class="relative z-10 border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 transition-all duration-300 ease-out"
        [class.opacity-0]="isProductDetailOpen()"
        [class.translate-y-full]="isProductDetailOpen()"
        [class.pointer-events-none]="isProductDetailOpen()"
        [class.opacity-100]="!isProductDetailOpen()"
        [class.translate-y-0]="!isProductDetailOpen()"
      >
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p>© {{ year }} Firmeza · Materiales de Construcción y Ferretería. Todos los derechos reservados.</p>
          <div class="flex items-center gap-1.5 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5 text-emerald-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Conexión segura TLS 1.3 · Compra directa sin intermediarios</span>
          </div>
        </div>
      </footer>

      <!-- BARRA DE NAVEGACIÓN INFERIOR PARA MÓVILES EN EL PORTAL DE CLIENTES -->
      <app-bottom-nav
        hideBreakpoint="sm"
        [items]="navItems()"
      />

      <!-- Botón flotante de Modo Claro / Oscuro para móvil -->
      <div class="sm:hidden">
        <app-theme-toggle variant="fab" positionClass="bottom-[88px] right-4" />
      </div>

      <!-- PANEL LATERAL DE PERFIL Y SEGURIDAD (DRAWER DERECHO) -->
      <app-profile-drawer
        [isOpen]="isProfileDrawerOpen()"
        (close)="closeProfileDrawer()"
      />
    </div>
  `
})
export class ClientShellComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);
  protected readonly isProductDetailOpen = productDetailModalOpenSignal;
  protected readonly isScrolled = signal(false);
  protected readonly isProfileDrawerOpen = signal(false);

  protected readonly year = new Date().getFullYear();
  protected readonly deletingAccount = signal(false);
  protected readonly userMenuOpen = signal(false);
  protected readonly userMenuClosing = signal(false);
  private userMenuTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('userMenuContainer') private readonly userMenuContainer?: ElementRef<HTMLElement>;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      this.isScrolled.set(scrollPos > 20);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.userMenuOpen() || this.userMenuClosing()) return;
    const target = event.target as Node | null;
    if (this.userMenuContainer?.nativeElement && !this.userMenuContainer.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.userMenuOpen() && !this.userMenuClosing()) {
      this.closeUserMenu();
    }
  }

  protected readonly navItems = computed<BottomNavItem[]>(() => {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: 'Catálogo',
          icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
          route: '/tienda'
        },
        {
          label: 'Carrito',
          icon: 'M2 3h2l2.4 11.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 7H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
          route: '/carrito',
          badge: this.cart.count(),
          badgeColor: 'bg-amber-500'
        },
        {
          label: 'Mis compras',
          icon: [
            'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
            'M14 2v6h6',
            'M16 13H8',
            'M16 17H8'
          ],
          route: '/mis-compras'
        }
      ];
    }

    return [
      {
        label: 'Inicio',
        icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
        route: '/'
      },
      {
        label: 'Catálogo',
        icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
        route: '/tienda'
      },
      {
        label: 'Carrito',
        icon: 'M2 3h2l2.4 11.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 7H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
        route: '/carrito',
        badge: this.cart.count(),
        badgeColor: 'bg-amber-500'
      },
      {
        label: 'Ingresar',
        icon: [
          'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4',
          'M10 17l5-5-5-5',
          'M15 12H3'
        ],
        route: '/login'
      }
    ];
  });

  protected openProfileDrawer(): void {
    this.closeUserMenu();
    this.isProfileDrawerOpen.set(true);
  }

  protected closeProfileDrawer(): void {
    this.isProfileDrawerOpen.set(false);
  }

  protected toggleUserMenu(): void {
    if (this.userMenuClosing()) return;
    if (this.userMenuOpen()) {
      this.closeUserMenu();
    } else {
      this.userMenuOpen.set(true);
    }
  }

  protected closeUserMenu(): void {
    if (!this.userMenuOpen() || this.userMenuClosing()) return;
    this.userMenuClosing.set(true);
    if (this.userMenuTimer) {
      clearTimeout(this.userMenuTimer);
    }
    this.userMenuTimer = setTimeout(() => {
      this.userMenuOpen.set(false);
      this.userMenuClosing.set(false);
      this.userMenuTimer = null;
    }, 150);
  }

  protected logout(): void {
    this.userMenuOpen.set(false);
    this.cart.clear();
    this.authService.logout(true);
  }

  protected confirmDeleteAccount(): void {
    this.userMenuOpen.set(false);
    if (this.deletingAccount()) return;

    void Swal.fire({
      icon: 'warning',
      title: '¿Borrar tu cuenta y todos tus datos?',
      html: `
        <p style="font-size: 14px; line-height: 1.5;">
          Esta acción es <strong>definitiva e irreversible</strong>. Se eliminará tu usuario, tus solicitudes, tu historial de compras y toda tu información registrada en Firmeza.
        </p>
      `,
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, borrar todos mis datos',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.deletingAccount.set(true);
      this.authService.deleteMyAccount().subscribe({
        next: () => {
          this.deletingAccount.set(false);
          this.cart.clear();
          this.authService.logout(false);
          void Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'Tu cuenta y todos tus datos han sido borrados correctamente.',
            timer: 2200,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.deletingAccount.set(false);
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar',
            text: toApiError(err).message || 'Ocurrió un problema al intentar borrar tu cuenta.'
          });
        }
      });
    });
  }
}