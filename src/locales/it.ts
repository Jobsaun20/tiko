
export const it = {
  // Header
  app: {
    name: "Oopsie",
    subtitle: "Tra amici"
  },
  
  // Navigation & Actions
  nav: {
    notifications: "Notifiche",
    profile: "Il mio profilo",
    settings: "Impostazioni",
    logout: "Disconnetti",
    login: "Accedi",
    register: "Registrati", 
    invite: "Invita amici"
  },
  
  // Dashboard Stats
  stats: {
    pending: "In sospeso",
    pendingFines: "Multe in sospeso",
    finesPending: "multe da pagare",
    issued: "Emesse",
    issuedFines: "Multe emesse",
    totalSent: "Totale inviate",
    received: "Ricevute",
    receivedFines: "Multe ricevute",
    totalReceived: "Totale ricevute"
  },
  
  // Quick Actions
  quickActions: {
    title: "Azioni rapide",
    description: "Gestisci le tue multe sociali",
    newFine: "Nuova multa",
    contacts: "Contatti",
    myQR: "Il mio QR",
    history: "Cronologia",
    notifications: "Notifiche"
  },
  
  // Fines List
  fines: {
    title: "Le mie multe",
    description: "Gestisci le tue multe ricevute e inviate",
    from: "Da",
    to: "A",
    paid: "Pagata",
    pending: "In sospeso",
    pay: "Paga",
    payFine: "Paga multa",
    finePaid: "Multa pagata!",
    noReceived: "Non hai multe ricevute",
    noSent: "Non hai ancora inviato multe",
    phone: "Teléfono"
  },
  
  // Create Fine Modal
  createFine: {
    title: "Crea nuova multa",
    description: "Crea una multa sociale da inviare a un amico o familiare",
    reason: "Motivo della multa",
    reasonPlaceholder: "Es: Essere in ritardo per cena, dimenticare di comprare il pane...",
    amount: "Importo (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Tipo di destinatario",
    contact: "Contatto",
    email: "Email",
    selectContact: "Seleziona contatto",
    selectContactPlaceholder: "Seleziona un contatto",
    recipientEmail: "Email del destinatario",
    recipientEmailPlaceholder: "amico@example.com",
    cancel: "Annulla",
    create: "Crea multa",
    created: "Multa creata!",
    sentTo: "Multa di {amount} CHF inviata a {recipient}",
    errors: {
      complete: "Completa tutti i campi obbligatori",
      selectRecipient: "Seleziona un destinatario",
      validEmail: "Inserisci un'email valida"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Paga multa - {amount} CHF",
    description: "Paga la tua multa usando TWINT scansionando il codice QR o usando il numero",
    details: "Dettagli della multa",
    reason: "Motivo:",
    sender: "Mittente:",
    amount: "Importo:",
    options: "Opzioni di pagamento TWINT",
    scanQR: "Scansiona con la tua app TWINT",
    useNumber: "O usa il numero TWINT:",
    copied: "Copiato",
    numberCopied: "Numero TWINT copiato negli appunti",
    markPaid: "Segna come pagata",
    processing: "Elaborazione...",
    confirmed: "Pagamento confermato!"
  },
  
  // User Profile
  profile: {
    title: "Il mio profilo",
    description: "Aggiorna le tue informazioni personali e configura il tuo metodo di pagamento TWINT",
    changePhoto: "Cambia foto",
    personalInfo: "Informazioni personali",
    fullName: "Nome completo",
    phone: "Telefono",
    twintConfig: "Configurazione TWINT",
    uploadQR: "Carica il tuo codice QR TWINT",
    uploadButton: "Carica QR",
    qrDescription: "Questo QR verrà mostrato quando qualcuno deve pagarti una multa",
    save: "Salva modifiche",
    updated: "Profilo aggiornato",
    updateDescription: "I tuoi dati sono stati salvati correttamente",
    twintUpload: "QR TWINT",
    twintUploadDescription: "Funzione di caricamento QR presto disponibile"
  },
  
  // Auth
  auth: {
    login: "Accedi",
    register: "Crea account",
    email: "Email",
    password: "Password",
    confirmPassword: "Conferma password",
    fullName: "Nome completo",
    loginButton: "Accedi",
    registerButton: "Crea account",
    forgotPassword: "Password dimenticata?",
    noAccount: "Non hai un account?",
    hasAccount: "Hai già un account?",
    signUp: "Registrati qui",
    signIn: "Accedi qui",
    loginSuccess: "Bentornato!",
    registerSuccess: "Account creato con successo!",
    errors: {
      emailRequired: "L'email è richiesta",
      passwordRequired: "La password è richiesta",
      passwordMatch: "Le password non coincidono",
      invalidEmail: "Email non valida",
      weakPassword: "La password deve avere almeno 6 caratteri"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Contatti",
      description: "Gestisci la tua lista contatti",
      addContact: "Aggiungi contatto",
      noContacts: "Non hai ancora contatti"
    },
    myQR: {
      title: "Il mio codice QR",
      description: "Condividi il tuo codice QR per ricevere multe",
      downloadQR: "Scarica QR",
      shareQR: "Condividi QR"
    },
    history: {
      title: "Cronologia",
      description: "Cronologia completa delle multe",
      filter: "Filtra",
      all: "Tutte",
      sent: "Inviate",
      received: "Ricevute",
      paid: "Pagate",
      pending: "In sospeso"
    },
    notifications: {
      title: "Notifiche",
      description: "Le tue notifiche recenti",
      markAllRead: "Segna tutte come lette",
      noNotifications: "Non hai notifiche",
      fine_received: "{{sender}} hat dir eine Strafe von {{amount}} CHF wegen „{{reason}}“ geschickt",
  payment_received: "{{sender}} hat deine Strafe von {{amount}} CHF bezahlt",
  group_invite: "{{sender}} hat dich in die Gruppe „{{group}}“ eingeladen",
    lessThanHour: "Hace menos de 1 hora",
  hoursAgo: "Hace {hours} horas",
  daysAgo: "Hace {days} días",
  marked: "Notificaciones marcadas",
  allRead: "Todas las notificaciones han sido marcadas como leídas",
  emptyMessage: "Cuando tengas notificaciones, aparecerán aquí",
    }
  },
  
  // Invite
  invite: {
    title: "Invita amici",
    description: "Invita i tuoi amici a usare Oopsie",
    shareText: "Unisciti a Oopsie e gestisci le multe sociali tra amici! 🎉",
    copyLink: "Copia link",
    linkCopied: "Link copiato!",
    sendInvite: "Invia invito"
  },
  
  // Common
  common: {
    currency: "CHF",
    required: "*",
    ok: "OK",
    cancel: "Annulla",
    save: "Salva",
    close: "Chiudi",
    edit: "Modifica",
    delete: "Elimina",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    back: "Indietro",
    next: "Avanti",
    previous: "Precedente",
    search: "Cerca",
    filter: "Filtra",
    sort: "Ordina",
    download: "Scarica",
    share: "Condividi"
  }
};
