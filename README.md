# Gestor de Eventos - Frontend

Este proyecto es el frontend para el Gestor de Eventos, una aplicación web diseñada para administrar y visualizar eventos de forma sencilla y moderna. La interfaz se centra en una experiencia de usuario intuitiva, permitiendo a los usuarios acceder a la información de manera rápida y eficiente.

## Características Principales

- **Interfaz Intuitiva:** Facilita la gestión y visualización de eventos.
- **Integración con API:** Conecta fácilmente con el backend para obtener y enviar datos en tiempo real.
- **React + TypeScript + Vite:** Configuración ligera y moderna para desarrollo de aplicaciones.

## Requisitos

- **Node.js** (versión recomendada: LTS)
- **npm** (gestor de paquetes incluido con Node.js)
- **Backend en ejecución:** [Repositorio del backend](https://github.com/CristianAgudeloB/event-mngr-backend)

## Inicialización del Proyecto

1. **Instala las dependencias:**
   ```bash
   npm install
   ```
2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. Abre tu navegador en la URL que se muestre en consola (generalmente `http://localhost:5173`).

## Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes scripts útiles:

- **`npm run dev`**: Inicia el servidor de desarrollo con recarga automática.
- **`npm test`**: Ejecuta las pruebas unitarias y/o de integración con Vitest.

## Estructura del Proyecto

Algunos componentes importantes en la estructura del código son:

- **`src/`**  
  - **`components/`**: Contiene componentes reutilizables o lógicos que se emplean en distintas partes de la aplicación (por ejemplo, `ProtectedRoute`).
  - **`pages/`**: Páginas principales de la aplicación (Login, Registro, Listado de Eventos, etc.).
  - **`services/`**: Módulos que gestionan la comunicación con el backend, encapsulando llamadas HTTP (ej. `authService`, `eventService`).
  - **`styles/`**: Hojas de estilo globales o específicas (CSS o archivos SCSS).
  - **`tests/`**: Carpeta para las pruebas unitarias o de integración de componentes y páginas.
  - **`App.tsx`**: Componente raíz que define la estructura general de la aplicación.
  - **`main.tsx`**: Punto de entrada donde se monta la aplicación en el DOM.
  - **`vite-env.d.ts`**: Declaraciones de tipo específicas para Vite.

- **`index.html`**  
  Archivo HTML principal que sirve como plantilla para la aplicación de Vite/React.

- **`package.json`**  
  Archivo que define las dependencias, scripts y metadatos del proyecto.

- **`tsconfig.json`**  
  Configuración de TypeScript para el proyecto.

Esta organización facilita la lectura y el mantenimiento del código, separando claramente las responsabilidades entre componentes, páginas, servicios y estilos.

## Conexión con el Backend

Este frontend consume los endpoints expuestos por el backend del Gestor de Eventos. Asegúrate de que:

1. El backend esté configurado con la misma URL base o que el `authService` y el `eventService` apunten correctamente al dominio/puerto donde se ejecuta.
2. Ambos proyectos estén corriendo simultáneamente para un flujo de trabajo completo.
