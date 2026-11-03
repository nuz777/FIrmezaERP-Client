import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ProfileDrawerComponent } from './ProfileDrawer.Component';
import { AuthService, UserSession } from '../../Services/auth.service';

describe('ProfileDrawerComponent', () => {
  let component: ProfileDrawerComponent;
  let fixture: ComponentFixture<ProfileDrawerComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: UserSession = {
    id: 'user-123',
    email: 'cliente@firmeza.local',
    fullName: 'Cliente de Prueba',
    roles: ['Cliente'],
    avatarUrl: 'https://avatar.test/foto.jpg',
    phone: '3001234567',
    address: 'Calle 10 # 20-30'
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();

    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

    await TestBed.configureTestingModule({
      imports: [ProfileDrawerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    vi.spyOn(authService, 'getUser').mockReturnValue(mockUser);
    vi.spyOn(authService, 'me').mockReturnValue(of(mockUser));

    fixture = TestBed.createComponent(ProfileDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((req) => req.flush({}));
    httpMock.verify();
  });

  it('debe crearse correctamente e inicializar datos del usuario', () => {
    expect(component).toBeTruthy();
    expect(component['fullName']()).toBe(mockUser.fullName);
    expect(component['userEmail']()).toBe(mockUser.email);
    expect(component['phone']()).toBe(mockUser.phone);
    expect(component['address']()).toBe(mockUser.address);
    expect(component['previewAvatarUrl']()).toBe(mockUser.avatarUrl);
  });

  it('debe permitir cambiar de pestaña entre Datos Personales y Seguridad', () => {
    expect(component['activeTab']()).toBe('personal');

    component['activeTab'].set('security');
    expect(component['activeTab']()).toBe('security');

    component['activeTab'].set('personal');
    expect(component['activeTab']()).toBe('personal');
  });

  it('debe emitir close al invocar requestClose()', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component['requestClose']();
    expect(closed).toBe(true);
  });

  it('debe actualizar la foto al seleccionar un preset', () => {
    const preset = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d';
    component['selectPresetAvatar'](preset);

    expect(component['avatarUrlInput']()).toBe(preset);
    expect(component['previewAvatarUrl']()).toBe(preset);
  });

  it('debe limpiar la foto al llamar clearAvatar()', () => {
    component['clearAvatar']();

    expect(component['avatarUrlInput']()).toBe('');
    expect(component['previewAvatarUrl']()).toBeNull();
  });

  it('debe invocar requestPasswordCode del AuthService al solicitar código', () => {
    const spy = vi.spyOn(authService, 'requestPasswordCode').mockReturnValue(
      of({ email: mockUser.email, message: 'Código enviado', expiresInMinutes: 10 })
    );

    component['requestCode']();

    expect(spy).toHaveBeenCalled();
    expect(component['codeSent']()).toBe(true);
    expect(component['cooldownRemaining']()).toBe(60);
  });

  it('debe manejar eventos de drag and drop para subir foto', () => {
    const dragEvent = { preventDefault: vi.fn() } as unknown as DragEvent;
    component['onDragOver'](dragEvent);
    expect(component['isDraggingFile']()).toBe(true);

    component['onDragLeave'](dragEvent);
    expect(component['isDraggingFile']()).toBe(false);
  });
});
