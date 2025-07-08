
# MultasSociales - App de Multas Sociales Entre Amigos

Una aplicación web moderna y divertida para crear y gestionar "multas sociales" entre amigos, familiares o compañeros. Construida con React, TypeScript, Tailwind CSS y diseñada para integrarse con Supabase.

## 🚀 Características

### ✅ Funcionalidades Implementadas
- **Interfaz moderna y responsive** con gradientes y animaciones
- **Creación de multas** con motivo, monto y destinatario
- **Gestión de multas** recibidas y enviadas
- **Sistema de pagos TWINT** con códigos QR simulados
- **Panel de usuario** con estadísticas y perfil
- **Notificaciones** visuales con toast
- **Lista de contactos** para selección rápida
- **Estados de multas** (pendiente/pagada)

### 🔄 Próximas Funcionalidades (Requieren Supabase)
- **Autenticación** con email y contraseña
- **Base de datos** para persistir multas y usuarios
- **Notificaciones por email** automáticas
- **Almacenamiento de archivos** para QR de TWINT
- **Sistema de contactos** real
- **Notificaciones push** con OneSignal

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Backend Ready**: Supabase integration ready

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta de Supabase (para funcionalidades backend)

### 1. Clonar e Instalar
```bash
git clone [tu-repo-url]
cd multas-sociales
npm install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:8080`

### 3. Conectar Supabase (Recomendado)
Para habilitar las funcionalidades completas:

1. **En Lovable**: Haz clic en el botón verde "Supabase" en la esquina superior derecha
2. **Conecta tu proyecto** siguiendo las instrucciones
3. **Configura las tablas** necesarias:

```sql
-- Tabla de usuarios
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  twint_qr_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de multas
CREATE TABLE fines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  reason TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de contactos
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, contact_email)
);
```

### 4. Configurar Políticas RLS
```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para fines
CREATE POLICY "Users can view their fines" ON fines FOR SELECT USING (
  auth.uid() = sender_id OR 
  recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can create fines" ON fines FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update fine status" ON fines FOR UPDATE USING (
  recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
```

## 📧 Notificaciones por Email (Supabase)

Una vez conectado Supabase, puedes crear una Edge Function para enviar emails:

```typescript
// supabase/functions/send-fine-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { fine, recipientEmail, senderName } = await req.json()
  
  // Aquí integrarías con tu servicio de email (SendGrid, Resend, etc.)
  // usando las secrets de Supabase para las API keys
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  })
})
```

## 🔔 Notificaciones Push (OneSignal)

Para habilitar notificaciones push:

1. **Crear cuenta** en OneSignal
2. **Agregar la clave** en Supabase Secrets
3. **Integrar** en el frontend y backend

## 📱 PWA (Progressive Web App)

La app está configurada como PWA y se puede instalar:
- **Chrome/Edge**: Clic en el icono de instalación en la barra de direcciones
- **Safari/iOS**: Compartir → Agregar a la pantalla de inicio

## 🚀 Despliegue

### Lovable (Recomendado)
1. Haz clic en **"Publish"** en la esquina superior derecha
2. Tu app estará disponible en una URL de Lovable
3. Opcionalmente conecta tu dominio personalizado

### Vercel
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de shadcn/ui
│   ├── Header.tsx      # Header con navegación
│   ├── CreateFineModal.tsx
│   ├── FineCard.tsx
│   ├── PaymentModal.tsx
│   └── UserProfile.tsx
├── pages/              # Páginas de la aplicación
│   ├── Index.tsx       # Página principal
│   └── NotFound.tsx    # Página 404
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades
└── main.tsx           # Punto de entrada
```

## 🎨 Personalización

### Colores y Temas
Los colores están definidos en `src/index.css` usando variables CSS:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... más colores */
}
```

### Gradientes
La app usa gradientes personalizados definidos en Tailwind:
- `bg-gradient-to-r from-purple-500 to-pink-500`
- `bg-gradient-to-r from-red-500 to-pink-500`
- `bg-gradient-to-r from-green-500 to-emerald-500`

## 🐛 Troubleshooting

### Problemas Comunes
1. **Build errors**: Verifica que todas las dependencias estén instaladas
2. **TypeScript errors**: Revisa los tipos de datos en los componentes
3. **Supabase connection**: Asegúrate de haber configurado correctamente las variables de entorno

### Logs y Debug
- Usa las herramientas de desarrollador del navegador
- Revisa la consola para errores de JavaScript
- En Lovable, usa el modo Dev para ver el código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 💡 Ideas Futuras

- **Integración con bancos suizos** para pagos reales
- **Gamificación** con puntos y rankings
- **Multas grupales** para eventos
- **Recordatorios automáticos** de multas pendientes
- **Exportar informes** en PDF
- **Temas personalizables** claro/oscuro
- **Integración con calendarios** para multas programadas

---

¡Diviértete multando a tus amigos de forma responsable! 🎉
