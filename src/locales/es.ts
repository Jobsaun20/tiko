
export const es = {
  // Header
  app: {
    name: "Pic",
    subtitle: "Entre amigos"
  },
  
  // Navigation & Actions
  nav: {
    notifications: "Notificaciones",
    profile: "Mi Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    register: "Registrarse",
    invite: "Invitar Amigos"
  },
  
  // Dashboard Stats
  stats: {
    pending: "Pendientes",
    pendingFines: "Multas Pendientes",
    finesPending: "multas por pagar",
    issued: "Emitidas",
    issuedFines: "Multas Emitidas",
    totalSent: "Total enviadas",
    received: "Recibidas",
    receivedFines: "Multas Recibidas",
    totalReceived: "Total recibidas"
  },
  
  // Quick Actions
  quickActions: {
    title: "Acciones Rápidas",
    description: "Gestiona tus multas sociales",
    newFine: "Nueva Multa",
    contacts: "Contactos",
    myQR: "Mi QR",
    history: "Historial",
    notifications: "Notificaciones"
  },
  
  // Fines List
  fines: {
    title: "Mis Multas",
    description: "Gestiona tus multas recibidas y enviadas",
    from: "De",
    to: "Para",
    paid: "Pagada",
    pending: "Pendiente",
    pay: "Pagar",
    payFine: "Pagar Multa",
    finePaid: "¡Multa pagada!",
    noReceived: "No tienes multas recibidas",
    noSent: "No has enviado ninguna multa aún",
    phone: "Teléfono"
  },
  
  // Create Fine Modal
  createFine: {
    title: "Crear Nueva Multa",
    description: "Crea una multa social para enviar a un amigo o familiar",
    reason: "Motivo de la multa",
    reasonPlaceholder: "Ej.: Llegar tarde a la cena, olvidar comprar pan...",
    amount: "Cantidad (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Tipo de destinatario",
    contact: "Contacto",
    email: "Email",
    selectContact: "Seleccionar contacto",
    selectContactPlaceholder: "Selecciona un contacto",
    recipientEmail: "Email del destinatario",
    recipientEmailPlaceholder: "amigo@example.com",
    cancel: "Cancelar",
    create: "Crear Multa",
    created: "¡Multa creada!",
    sentTo: "Multa de {amount} CHF enviada a {recipient}",
    errors: {
      complete: "Por favor completa todos los campos requeridos",
      selectRecipient: "Por favor selecciona un destinatario",
      validEmail: "Por favor ingresa un email válido"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Pagar Multa - {amount} CHF",
    description: "Paga tu multa usando TWINT escaneando el código QR o usando el número",
    details: "Detalles de la multa",
    reason: "Motivo:",
    sender: "Emisor:",
    amount: "Monto:",
    options: "Opciones de pago TWINT",
    scanQR: "Escanea con tu app TWINT",
    useNumber: "O usa el número TWINT:",
    copied: "Copiado",
    numberCopied: "Número TWINT copiado al portapapeles",
    markPaid: "Marcar como Pagada",
    processing: "Procesando...",
    confirmed: "¡Pago confirmado!"
  },
  
  // User Profile
  profile: {
    title: "Mi Perfil",
    description: "Actualiza tu información personal y configura tu método de pago TWINT",
    changePhoto: "Cambiar foto",
    personalInfo: "Información Personal",
    fullName: "Nombre completo",
    phone: "Teléfono",
    twintConfig: "Configuración TWINT",
    uploadQR: "Sube tu código QR de TWINT",
    uploadButton: "Subir QR",
    qrDescription: "Este QR se mostrará cuando alguien deba pagarte una multa",
    save: "Guardar Cambios",
    updated: "Perfil actualizado",
    updateDescription: "Tus datos han sido guardados exitosamente",
    twintUpload: "QR TWINT",
    twintUploadDescription: "Función de subida de QR próximamente"
  },
  
  // Auth
  auth: {
    login: "Iniciar Sesión",
    register: "Crear Cuenta",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    fullName: "Nombre completo",
    loginButton: "Iniciar Sesión",
    registerButton: "Crear Cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?",
    signUp: "Regístrate aquí",
    signIn: "Inicia sesión aquí",
    loginSuccess: "¡Bienvenido de vuelta!",
    registerSuccess: "¡Cuenta creada exitosamente!",
    errors: {
      emailRequired: "El email es requerido",
      passwordRequired: "La contraseña es requerida",
      passwordMatch: "Las contraseñas no coinciden",
      invalidEmail: "Email inválido",
      weakPassword: "La contraseña debe tener al menos 6 caracteres"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Contactos",
      description: "Gestiona tu lista de contactos",
      addContact: "Agregar Contacto",
      addContactButton: "Agregar Contacto",
      noContacts: "No tienes contactos aún",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      edit: "Editar",
      delete: "Eliminar",
      fine: "Multar",
      save: "Guardar",
      cancel: "Cancelar",
      editContact: "Editar Contacto",
      deleteContact: "Eliminar Contacto",
      deleteConfirmation: "¿Estás seguro de que quieres eliminar este contacto?",
      contactAdded: "Contacto agregado",
      contactUpdated: "Contacto actualizado",
      contactDeleted: "Contacto eliminado"
    },
    groups: {
      title: "Grupos",
      description1: "Gestiona tus grupos",
      createGroup: "Crear Grupo",
      joinGroup: "Unirse a Grupo",
      noGroups: "No tienes grupos aún",
      groupName: "Nombre del grupo",
      description: "Descripción",
      members: "Miembros",
      admin: "Admin",
      member: "Miembro",
      leave: "Salir",
      delete: "Eliminar",
      invite: "Invitar",
      manage: "Gestionar",
      code: "Código",
      enterCode: "Ingresa el código del grupo",
      join: "Unirse",
      create: "Crear",
      groupCreated: "Grupo creado",
      joinedGroup: "Te uniste al grupo",
      leftGroup: "Saliste del grupo",
      groupDeleted: "Grupo eliminado"
    },
    settings: {
      title: "Configuración",
      description: "Configura la aplicación",
      language: "Idioma",
      notifications: "Notificaciones",
      privacy: "Privacidad",
      about: "Acerca de",
      version: "Versión",
      enableNotifications: "Habilitar notificaciones",
      enableSounds: "Habilitar sonidos",
      privateProfile: "Perfil privado",
      dataExport: "Exportar datos",
      deleteAccount: "Eliminar cuenta",
      settingsSaved: "Configuración guardada"
    },
    myQR: {
      title: "Mi Código QR",
      description: "Comparte tu código QR para recibir multas",
      downloadQR: "Descargar QR",
      shareQR: "Compartir QR"
    },
    history: {
      title: "Historial",
      description: "Historial completo de multas",
      filter: "Filtrar",
      all: "Todas",
      sent: "Enviadas",
      received: "Recibidas",
      paid: "Pagadas",
      pending: "Pendientes",
      noResults: "Sin resultados",
      noResultsDescription: "No se encontraron multas con los filtros seleccionados",
      viewAll: "Ver todas",
      total: "Total"
    },
    notifications: {
        title: "Notificaciones",
  description: "Tus notificaciones recientes",
  markAllRead: "Marcar todas como leídas",
  noNotifications: "No tienes notificaciones",
  fine_received: "{{sender}} te ha enviado una multa de {{amount}} CHF por “{{reason}}”",
  payment_received: "{{sender}} ha pagado tu multa de {{amount}} CHF",
  group_invite: "{{sender}} te ha invitado al grupo “{{group}}”",
  lessThanHour: "Hace menos de 1 hora",
  hoursAgo: "Hace {hours} horas",
  daysAgo: "Hace {days} días",
  marked: "Notificaciones marcadas",
  allRead: "Todas las notificaciones han sido marcadas como leídas",
  emptyMessage: "Cuando tengas notificaciones, aparecerán aquí"
    }
  },
  
  // Invite
  invite: {
    title: "Invitar Amigos",
    description: "Invita a tus amigos a usar Pic",
    shareText: "¡Únete a Pic y gestiona multas sociales entre amigos! 🎉",
    copyLink: "Copiar enlace",
    linkCopied: "¡Enlace copiado!",
    sendInvite: "Enviar invitación"
  },
  
  // Achievements
  achievements: {
    title: "¡Logro Desbloqueado!",
    close: "Cerrar",
    xpGained: "Puntos de experiencia ganados",
    levelUp: "¡Subiste de nivel!",
    newBadge: "¡Nueva insignia!"
  },
  
  // Common
  common: {
    currency: "CHF",
    required: "*",
    ok: "OK",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    edit: "Editar",
    delete: "Eliminar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    download: "Descargar",
    share: "Compartir",
    total: "Total"
  }
  
};
