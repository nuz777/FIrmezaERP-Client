import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { SaleStatus, SaleSummary, SalesService } from '../../Services/sales.service';
import { AdminNotificationService } from '../../Services/admin-notification.service';
import { ImportsService, ToastService } from '../../Services/imports.service';
import { ConfirmService } from '../../Services/confirm.service';
import { toApiError } from '../../Services/Api.Service';
import { IconComponent } from '../Shared/Icon.Component';

/**
 * Dashboard de Métricas Comerciales con Gráfico de Dona para el Cliente.
 * Réplica fiel del diseño y animaciones del dashboard administrativo, adaptado
 * al alcance de las compras, inversiones y solicitudes del usuario autenticado.
 */
@Component({
  selector: 'app-customer-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, IconComponent],
  template: `
    <div class="space-y-6 sm:space-y-8 pb-12">
      <!-- CABECERA DEL PANEL -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Portal del cliente
            </span>
            <span class="text-xs font-semibold text-slate-400 capitalize">· {{ todayFormatted }}</span>
          </div>
          <h1 class="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {{ greeting() }}, {{ authService.getUser()?.fullName }}
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitorea el estado, inversión acumulada y distribución de tus solicitudes de materiales.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            (click)="load()"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 cursor-pointer"
            title="Actualizar datos en tiempo real"
          >
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" [class.animate-spin]="loading()">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <span>Actualizar</span>
          </button>

          <a
            routerLink="/mis-compras"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-blue-300 hover:text-blue-600 active:scale-95"
          >
            <app-icon name="receipt" [size]="15" />
            <span>Ver mis compras</span>
          </a>

          <a
            routerLink="/tienda"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span>Catálogo</span>
          </a>
        </div>
      </div>

      <!-- ALERTA DE SOLICITUDES PENDIENTES (SI LAS HAY) -->
      @if (pendingCount() > 0) {
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 shadow-sm dark:border-amber-500/40 dark:bg-[#1a1408] dark:shadow-lg dark:shadow-black/60">
          <div class="flex items-center gap-3.5">
            <div class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex h-3.5 w-3.5 rounded-full bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-sm font-black text-amber-950 dark:text-amber-200">
                  {{ pendingCount() === 1 ? 'Tienes 1 solicitud de pedido pendiente de confirmación' : 'Tienes ' + pendingCount() + ' solicitudes de pedido pendientes de confirmación' }}
                </h3>
                <span class="rounded-full bg-amber-200/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900 dark:bg-amber-500/25 dark:text-amber-300 dark:border dark:border-amber-500/40">
                  En revisión
                </span>
              </div>
              <p class="mt-1 text-xs font-semibold text-amber-900/90 dark:text-amber-300/90">
                La administración de Firmeza está verificando existencias para confirmar y despachar tus materiales.
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="filterByStatus('Pending')"
            class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Ver pendientes</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      }

      @if (loading() && sales().length === 0) {
        <div class="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-24 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" class="h-8 w-8 animate-spin text-blue-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <span class="ml-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Cargando métricas de compras…</span>
        </div>
      } @else if (sales().length === 0) {
        <!-- Estado vacío para clientes nuevos sin compras -->
        <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-8 w-8">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h2 class="mt-4 text-xl font-black text-slate-900 dark:text-white">Aún no tienes compras registradas</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Explora nuestro catálogo de materiales de construcción y solicita tus productos para empezar a ver tus métricas en tiempo real.
          </p>
          <a
            routerLink="/tienda"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95"
          >
            Explorar catálogo de materiales
          </a>
        </div>
      } @else {
        <!-- 4 TARJETAS KPI PRINCIPALES -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- KPI 1: Inversión acumulada -->
          <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-950/10 ring-1 ring-white/10">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-blue-300">Inversión acumulada</span>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-400/30">
                  <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-5 w-5">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <p class="mt-4 break-words text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
                {{ totalAmount() | currency: 'COP' }}
              </p>
            </div>
            <div class="mt-5 border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Ticket promedio:</span>
              <span class="font-bold text-slate-200 tabular-nums">{{ averageTicket() | currency: 'COP' }}</span>
            </div>
          </div>

          <!-- KPI 2: Solicitudes pendientes -->
          <div
            (click)="filterByStatus('Pending')"
            class="flex flex-col justify-between rounded-2xl border-t-4 border-t-amber-500 bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition hover:shadow-md cursor-pointer"
            [class.ring-2]="selectedFilterStatus() === 'Pending'"
            [class.ring-amber-400]="selectedFilterStatus() === 'Pending'"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pendientes</span>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-5 w-5">
                    <path d="M6 2 3 6h14l-3-4H6Z" />
                    <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
              </div>
              <div class="mt-4 flex items-baseline gap-2">
                <p class="text-3xl font-black tabular-nums text-slate-900 dark:text-white" [class.text-amber-600]="pendingCount() > 0">
                  {{ pendingCount() }}
                </p>
                @if (pendingCount() > 0) {
                  <span class="rounded-md bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 dark:text-amber-300">
                    Por validar
                  </span>
                }
              </div>
            </div>
            <div class="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
              <span>Filtrar pedidos</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>

          <!-- KPI 3: Pedidos confirmados -->
          <div
            (click)="filterByStatus('Confirmed')"
            class="flex flex-col justify-between rounded-2xl border-t-4 border-t-sky-500 bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition hover:shadow-md cursor-pointer"
            [class.ring-2]="selectedFilterStatus() === 'Confirmed'"
            [class.ring-sky-400]="selectedFilterStatus() === 'Confirmed'"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Confirmadas</span>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-5 w-5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <p class="mt-4 text-3xl font-black tabular-nums text-slate-900 dark:text-white">{{ confirmedCount() }}</p>
            </div>
            <div class="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-bold">
              <span>En preparación</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>

          <!-- KPI 4: Materiales entregados -->
          <div
            (click)="filterByStatus('Delivered')"
            class="flex flex-col justify-between rounded-2xl border-t-4 border-t-emerald-500 bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition hover:shadow-md cursor-pointer"
            [class.ring-2]="selectedFilterStatus() === 'Delivered'"
            [class.ring-emerald-400]="selectedFilterStatus() === 'Delivered'"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Entregadas</span>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="h-5 w-5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                    <path d="m6 15 4-4 3 2 5-5" />
                  </svg>
                </div>
              </div>
              <p class="mt-4 text-3xl font-black tabular-nums text-slate-900 dark:text-white">{{ deliveredCount() }}</p>
            </div>
            <div class="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Completadas</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>

        <!-- SECCIÓN PRINCIPAL: GRÁFICO DE DONA (IDÉNTICO AL DEL ADMIN) -->
        <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          <!-- Cabecera de la sección de dona -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-blue-600"></span>
                <h2 class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Distribución de Pedidos por Estado
                </h2>
              </div>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Visualiza el balance de tus solicitudes: pendientes, aprobadas, entregadas y canceladas.
              </p>
            </div>

            <div class="flex items-center gap-2">
              @if (selectedFilterStatus()) {
                <button
                  type="button"
                  (click)="filterByStatus(null)"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  <span>Limpiar filtro: {{ salesService.statusLabel(selectedFilterStatus()!) }}</span>
                  <span class="text-slate-400">✕</span>
                </button>
              }

              <button
                type="button"
                (click)="triggerDonutAnimation()"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Reproducir animación de la dona"
              >
                <svg class="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Animar dona</span>
              </button>
            </div>
          </div>

          <!-- CUERPO DE LA DONA Y LEYENDA (12 Columnas) -->
          @if (donutData(); as donutInfo) {
            <div class="mt-8 grid items-center gap-8 lg:grid-cols-12 animate-donut-pop">
              <!-- Dona SVG interactiva -->
              <div class="flex flex-col items-center justify-center lg:col-span-5">
                <div
                  class="relative h-60 w-60 transition-transform duration-700 ease-out"
                  [style.transform]="'scale(' + (0.92 + 0.08 * donutAnimationProgress()) + ')'"
                >
                  <svg viewBox="0 0 240 240" class="h-full w-full -rotate-90 transform select-none">
                    <!-- Anillo base de fondo -->
                    <circle
                      cx="120"
                      cy="120"
                      [attr.r]="donutInfo.radius"
                      fill="none"
                      stroke="#f1f5f9"
                      class="dark:stroke-slate-800"
                      stroke-width="26"
                    />

                    <!-- Rebanadas de la dona -->
                    @for (slice of donutInfo.slices; track slice.status) {
                      @if (slice.percentage > 0) {
                        <circle
                          cx="120"
                          cy="120"
                          [attr.r]="donutInfo.radius"
                          fill="none"
                          [attr.stroke]="slice.color"
                          [attr.stroke-width]="hoveredDonutStatus() === slice.status || selectedFilterStatus() === slice.status ? 32 : 26"
                          [attr.stroke-dasharray]="slice.dashArray"
                          [attr.stroke-dashoffset]="slice.dashOffset"
                          class="donut-slice cursor-pointer"
                          [style.filter]="(hoveredDonutStatus() === slice.status || selectedFilterStatus() === slice.status) ? 'drop-shadow(0 0 8px ' + slice.glow + ')' : 'none'"
                          [style.opacity]="(hoveredDonutStatus() && hoveredDonutStatus() !== slice.status) || (selectedFilterStatus() && selectedFilterStatus() !== slice.status) ? '0.35' : '1'"
                          (mouseenter)="hoveredDonutStatus.set(slice.status)"
                          (mouseleave)="hoveredDonutStatus.set(null)"
                          (click)="filterByStatus(slice.status)"
                        />
                      }
                    }
                  </svg>

                  <!-- Centro de la dona reactivo con contadores -->
                  <div
                    class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300"
                    [style.opacity]="0.3 + 0.7 * donutAnimationProgress()"
                  >
                    @if (activeDonutSlice(); as active) {
                      <span class="text-[11px] font-black uppercase tracking-wider text-slate-400 animate-donut-center">{{ active.label }}</span>
                      <span class="text-3xl font-black text-slate-950 dark:text-white tabular-nums animate-donut-center">{{ active.count }}</span>
                      <span class="text-xs font-bold animate-donut-center" [class]="active.textClass">{{ active.percentage | number: '1.0-1' }}%</span>
                    } @else {
                      <span class="text-[11px] font-black uppercase tracking-wider text-slate-400">Total</span>
                      <span class="text-3xl font-black text-slate-950 dark:text-white tabular-nums">{{ animatedTotalCount() }}</span>
                      <span class="text-xs font-bold text-slate-500 dark:text-slate-400">solicitudes</span>
                    }
                  </div>
                </div>

                <div class="mt-4 flex items-center gap-2">
                  <p class="text-xs text-slate-400 dark:text-slate-500">Pasa el cursor o haz clic en un segmento para filtrar.</p>
                </div>
              </div>

              <!-- Desglose por estados (Tarjetas / Leyenda interactiva) -->
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
                @for (slice of donutInfo.slices; track slice.status) {
                  <div
                    class="flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 cursor-pointer"
                    [class]="(hoveredDonutStatus() === slice.status || selectedFilterStatus() === slice.status)
                      ? slice.cardActiveClass
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'"
                    (mouseenter)="hoveredDonutStatus.set(slice.status)"
                    (mouseleave)="hoveredDonutStatus.set(null)"
                    (click)="filterByStatus(slice.status)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded-full" [style.backgroundColor]="slice.color"></span>
                        <span class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">{{ slice.label }}</span>
                      </div>
                      <span class="text-xs font-black text-slate-950 dark:text-white">{{ slice.percentage | number: '1.0-1' }}%</span>
                    </div>

                    <div class="mt-3 flex items-baseline justify-between">
                      <div>
                        <p class="text-2xl font-black text-slate-950 dark:text-white tabular-nums">{{ slice.count }}</p>
                        <span class="text-[11px] text-slate-400 dark:text-slate-500">{{ slice.count === 1 ? 'solicitud' : 'solicitudes' }}</span>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-black text-slate-800 dark:text-slate-200 tabular-nums">{{ slice.total | currency: 'COP' }}</p>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500">acumulado</span>
                      </div>
                    </div>

                    <!-- Barra de progreso miniatura animada -->
                    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        [style.width.%]="slice.percentage * donutAnimationProgress()"
                        [style.backgroundColor]="slice.color"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- LISTADO DE COMPRAS RECIENTES (CON FILTRO REACTIVO) -->
        <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                {{ selectedFilterStatus() ? 'Compras filtradas por: ' + salesService.statusLabel(selectedFilterStatus()!) : 'Tus Compras Recientes' }}
              </h2>
              <p class="text-xs text-slate-400">
                Mostrando {{ filteredSales().length }} de {{ sales().length }} solicitudes.
              </p>
            </div>
            @if (selectedFilterStatus()) {
              <button
                type="button"
                (click)="filterByStatus(null)"
                class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Ver todas
              </button>
            }
          </div>

          <div class="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            @for (sale of filteredSales(); track sale.id) {
              <article class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2.5">
                    <span class="font-mono text-sm font-black text-slate-900 dark:text-white">{{ sale.saleNumber }}</span>
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1"
                      [class]="salesService.statusClass(sale.status)"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
                      {{ salesService.statusLabel(sale.status) }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ sale.saleDate | date: 'dd/MM/yyyy HH:mm' }} · {{ sale.lineCount }}
                    {{ sale.lineCount === 1 ? 'producto' : 'productos' }}
                  </p>
                  @if (sale.decisionNote) {
                    <p class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 italic">
                      Nota admin: "{{ sale.decisionNote }}"
                    </p>
                  }
                </div>

                <div class="flex items-center gap-4">
                  <span class="text-base font-black text-slate-950 dark:text-white tabular-nums">
                    {{ sale.total | currency: 'COP' }}
                  </span>

                  <a
                    [routerLink]="['/compras', sale.id]"
                    class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Detalle
                  </a>

                  @if (sale.status === 'Delivered') {
                    <button
                      type="button"
                      (click)="previewReceipt(sale)"
                      class="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-100 cursor-pointer"
                    >
                      PDF
                    </button>
                  }
                  @if (sale.status === 'Pending') {
                    <button
                      type="button"
                      (click)="cancel(sale)"
                      class="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  }
                </div>
              </article>
            } @empty {
              <div class="py-8 text-center text-xs text-slate-400">
                No hay compras con el filtro seleccionado.
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  protected readonly salesService = inject(SalesService);
  private readonly notificationService = inject(AdminNotificationService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);
  private readonly importsService = inject(ImportsService);

  private stockChangeSub?: Subscription;
  private donutAnimFrameId: number | null = null;

  protected readonly sales = signal<SaleSummary[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly selectedFilterStatus = signal<SaleStatus | null>(null);
  protected readonly hoveredDonutStatus = signal<SaleStatus | null>(null);
  protected readonly donutAnimationProgress = signal<number>(1);

  protected readonly todayFormatted = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  protected readonly totalCount = computed(() => this.sales().length);

  protected readonly totalAmount = computed(() => {
    return this.sales().reduce((sum, s) => sum + s.total, 0);
  });

  protected readonly averageTicket = computed(() => {
    const count = this.totalCount();
    return count > 0 ? this.totalAmount() / count : 0;
  });

  protected readonly pendingCount = computed(() => {
    return this.sales().filter((s) => s.status === 'Pending').length;
  });

  protected readonly confirmedCount = computed(() => {
    return this.sales().filter((s) => s.status === 'Confirmed').length;
  });

  protected readonly deliveredCount = computed(() => {
    return this.sales().filter((s) => s.status === 'Delivered').length;
  });

  protected readonly cancelledCount = computed(() => {
    return this.sales().filter((s) => s.status === 'Cancelled').length;
  });

  protected readonly filteredSales = computed(() => {
    const status = this.selectedFilterStatus();
    const list = this.sales();
    if (!status) return list;
    return list.filter((s) => s.status === status);
  });

  // Datos calculados para la dona SVG (idéntico a Dashboard admin)
  protected readonly donutData = computed(() => {
    const allSales = this.sales();
    const totalCount = allSales.length;

    const statusCounts: Record<SaleStatus, { count: number; total: number }> = {
      Pending: { count: 0, total: 0 },
      Confirmed: { count: 0, total: 0 },
      Delivered: { count: 0, total: 0 },
      Cancelled: { count: 0, total: 0 }
    };

    for (const s of allSales) {
      if (statusCounts[s.status]) {
        statusCounts[s.status].count++;
        statusCounts[s.status].total += s.total;
      }
    }

    const totalAmount = Object.values(statusCounts).reduce((sum, item) => sum + item.total, 0);

    const radius = 78;
    const circumference = 2 * Math.PI * radius;
    const progress = this.donutAnimationProgress();

    const statusConfig: Record<
      SaleStatus,
      { label: string; color: string; textClass: string; cardActiveClass: string; glow: string; bgClass: string }
    > = {
      Pending: {
        label: 'Pendientes',
        color: '#f59e0b',
        textClass: 'text-amber-600 dark:text-amber-400',
        cardActiveClass: 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-300 dark:ring-amber-500/50 scale-[1.015]',
        glow: 'rgba(245, 158, 11, 0.45)',
        bgClass: 'bg-amber-50 dark:bg-amber-950/60'
      },
      Confirmed: {
        label: 'Confirmadas',
        color: '#0284c7',
        textClass: 'text-sky-600 dark:text-sky-400',
        cardActiveClass: 'border-sky-400 bg-sky-50/70 dark:bg-sky-950/40 shadow-md ring-2 ring-sky-300 dark:ring-sky-500/50 scale-[1.015]',
        glow: 'rgba(2, 132, 199, 0.45)',
        bgClass: 'bg-sky-50 dark:bg-sky-950/60'
      },
      Delivered: {
        label: 'Entregadas',
        color: '#10b981',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        cardActiveClass: 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-500/50 scale-[1.015]',
        glow: 'rgba(16, 185, 129, 0.45)',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/60'
      },
      Cancelled: {
        label: 'Canceladas',
        color: '#f43f5e',
        textClass: 'text-rose-600 dark:text-rose-400',
        cardActiveClass: 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 shadow-md ring-2 ring-rose-300 dark:ring-rose-500/50 scale-[1.015]',
        glow: 'rgba(244, 63, 94, 0.45)',
        bgClass: 'bg-rose-50 dark:bg-rose-950/60'
      }
    };

    const orderOfStatuses: SaleStatus[] = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

    let accumulatedLength = 0;
    const slices = orderOfStatuses.map((status) => {
      const item = statusCounts[status];
      const config = statusConfig[status];
      const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
      const fullStrokeLength = totalCount > 0 ? (item.count / totalCount) * circumference : 0;
      const strokeLength = fullStrokeLength * progress;
      const dashArray = `${strokeLength} ${circumference - strokeLength}`;
      const dashOffset = -accumulatedLength;
      accumulatedLength += strokeLength;

      return {
        status,
        label: config.label,
        color: config.color,
        textClass: config.textClass,
        cardActiveClass: config.cardActiveClass,
        glow: config.glow,
        bgClass: config.bgClass,
        count: item.count,
        total: item.total,
        percentage,
        dashArray,
        dashOffset
      };
    });

    return {
      totalCount,
      totalAmount,
      circumference,
      radius,
      slices
    };
  });

  protected readonly animatedTotalCount = computed(() => {
    const total = this.donutData()?.totalCount ?? 0;
    return Math.round(total * this.donutAnimationProgress());
  });

  protected readonly activeDonutSlice = computed(() => {
    const status = this.hoveredDonutStatus();
    if (!status) return null;
    return this.donutData()?.slices.find((s) => s.status === status) ?? null;
  });

  ngOnInit(): void {
    this.load();
    this.stockChangeSub = this.notificationService.stockOrSaleChanged$.subscribe(() => {
      this.load(true);
    });
  }

  ngOnDestroy(): void {
    this.stockChangeSub?.unsubscribe();
    if (this.donutAnimFrameId !== null) {
      cancelAnimationFrame(this.donutAnimFrameId);
      this.donutAnimFrameId = null;
    }
  }

  protected filterByStatus(status: SaleStatus | null): void {
    if (this.selectedFilterStatus() === status) {
      this.selectedFilterStatus.set(null);
    } else {
      this.selectedFilterStatus.set(status);
    }
  }

  protected triggerDonutAnimation(): void {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      this.donutAnimationProgress.set(1);
      return;
    }

    if (this.donutAnimFrameId !== null) {
      cancelAnimationFrame(this.donutAnimFrameId);
      this.donutAnimFrameId = null;
    }

    this.donutAnimationProgress.set(0);
    const startTime = performance.now();
    const duration = 850;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      this.donutAnimationProgress.set(eased);

      if (t < 1) {
        this.donutAnimFrameId = requestAnimationFrame(animate);
      } else {
        this.donutAnimationProgress.set(1);
        this.donutAnimFrameId = null;
      }
    };

    this.donutAnimFrameId = requestAnimationFrame(animate);
  }

  protected async cancel(sale: SaleSummary): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Cancelar solicitud',
      message: `¿Cancelar la solicitud ${sale.saleNumber}? Esta acción no se puede deshacer.`,
      confirmLabel: 'Cancelar solicitud'
    });
    if (!confirmed) return;

    this.salesService.cancelRequest(sale.id).subscribe({
      next: () => {
        AdminNotificationService.broadcastStockChanged(sale.saleNumber, 'Cancelled');
        this.toastService.success('Solicitud cancelada.');
        this.load(true);
      },
      error: (error) => this.toastService.error(toApiError(error).message)
    });
  }

  protected previewReceipt(sale: SaleSummary): void {
    this.importsService.preview(this.salesService.receiptUrl(sale.id, true)).subscribe({
      error: (error) => this.toastService.error(toApiError(error).message)
    });
  }

  protected load(silent = false): void {
    if (!silent) {
      this.loading.set(true);
    }

    this.salesService.list({ pageSize: 1000 }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.sales.set(response.items);
        this.triggerDonutAnimation();
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.error(toApiError(error).message);
      }
    });
  }
}
