# Carvex

Plataforma web aesthetic para la gestión inteligente de vehículos. Carvex ofrece una interfaz limpia, moderna y responsive que te permite llevar un registro completo de tus vehículos, gestionar sus datos y hacer seguimiento de las próximas ITV.

## Características

- **Diseño Aesthetic Moderno**: Interfaz con glassmorphism, gradientes suaves y animaciones fluidas
- **Autenticación de Usuarios**: Sistema de login seguro con registro de nuevos usuarios
- **Gestión Completa de Vehículos**: Añadir, editar y eliminar vehículos con toda su información
- **Seguimiento de ITV**: Sistema inteligente que te alerta sobre ITVs vencidas, próximas o al día
- **Estadísticas en Tiempo Real**: Dashboard con métricas actualizadas de tus vehículos
- **Diseño Responsive**: Funciona perfectamente en móviles, tablets y ordenadores
- **Almacenamiento Local**: Tus datos se guardan de forma segura en tu navegador

## Estructura del Proyecto

```
Carvex/
├── index.html          # Página de inicio de sesión
├── dashboard.html      # Dashboard principal de gestión
├── css/
│   ├── login.css       # Estilos del login
│   └── dashboard.css   # Estilos del dashboard
└── js/
    ├── login.js        # Lógica de autenticación
    └── dashboard.js    # Lógica de gestión de vehículos
```

## Cómo Usar

1. **Abrir la aplicación**: Abre `index.html` en tu navegador web
2. **Crear una cuenta**:
   - Haz click en "Crear nueva cuenta"
   - Ingresa un nombre de usuario y contraseña
   - Confirma la contraseña
3. **Iniciar sesión**:
   - Ingresa tu usuario y contraseña
   - Opcionalmente marca "Recordarme" para mantener la sesión
4. **Añadir vehículos**:
   - Click en "Añadir Vehículo"
   - Completa los datos del vehículo
   - Establece la fecha de la próxima ITV
5. **Gestionar vehículos**:
   - Edita la información con el botón de edición
   - Elimina vehículos con el botón de eliminar
   - Visualiza el estado de ITV en cada tarjeta

## Funcionalidades de ITV

El sistema clasifica automáticamente tus vehículos según el estado de su ITV:

- **ITV al Día**: Vehículos con ITV vigente (más de 30 días)
- **Advertencia**: ITV próxima a vencer (menos de 30 días)
- **Vencida**: ITV ya vencida

## Tecnologías Utilizadas

- HTML5
- CSS3 (Glassmorphism, Gradientes, Animaciones)
- JavaScript Vanilla
- LocalStorage para persistencia de datos

## Características de Diseño

- Gradientes aesthetic con colores suaves
- Efectos de glassmorphism y backdrop-filter
- Animaciones suaves y fluidas
- Tarjetas con efecto hover
- Notificaciones toast elegantes
- Modal responsivo para formularios
- Diseño completamente responsive

## Navegadores Compatibles

- Chrome (recomendado)
- Firefox
- Safari
- Edge

## Notas

- Los datos se almacenan localmente en el navegador
- La sesión expira después de 24 horas
- No se requiere conexión a internet para usar la aplicación
