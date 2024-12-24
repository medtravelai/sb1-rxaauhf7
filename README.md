# Amigo Health App

Una aplicación de salud y bienestar diseñada específicamente para la comunidad hispana.

## Características

- **Ejercicio**
  - Seguimiento GPS para correr/caminar
  - Videos de ejercicios guiados en español
  - Planes de entrenamiento personalizados
  - Deportes tradicionales

- **Nutrición**
  - Base de datos de alimentos hispanos
  - Escáner de código de barras
  - Calculadora de recetas
  - Planificación de comidas

- **Bienestar**
  - Seguimiento del estado de ánimo
  - Monitoreo del sueño
  - Herramientas para el manejo del estrés
  - Informes mensuales

## Tecnologías

- React + TypeScript
- Vite
- Supabase
- Tailwind CSS
- React Router
- Lucide Icons

## Configuración Local

1. Clona el repositorio:
   ```bash
   git clone [repository-url]
   cd amigo-health-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

4. Configura tus variables de entorno en `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue

### Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL en `supabase/migrations/`
3. Copia las credenciales del proyecto a tu `.env`

### Netlify

1. Conecta tu repositorio de GitHub a Netlify
2. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Configura los ajustes de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Configura las redirecciones para React Router:
   ```toml
   /* /index.html 200
   ```

## Licencia

MIT

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/medtravelai/sb1-rxaauhf7)