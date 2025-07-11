
export const it = {
  // Header
  app: {
    name: "Pic",
    subtitle: "Tra amici"
  },

  // Index Page
  index: {
    hola: "Ciao",
    level: "Livello",
    noinsignias: "Nessun badge",
    lastFineRecived: "Ultima multa ricevuta",
    pendent: "In sospeso",
    pendents: "In sospeso",
    de: "Da",
    payed: "Pagata",
    congrats: "Congratulazioni!",
    noPendentFines: "Non hai multe in sospeso",
    continueLikeThis: "Continua così",
    quickActions: "Azioni rapide",
    quickQuickActionsDescription: "Gestisci le tue multe in modo efficiente",
    recivedFines: "Multe ricevute",
    recentRecivedFines: "Multe ricevute di recente",
    noRecivedFines: "Non hai ricevuto multe",
    seeAllRecivedFines: "Vedi tutte le multe ricevute",
    recentInsignias: "Badge recenti",
    recentHitos: "I tuoi risultati più recenti",
    seeAllInsignias: "Vedi tutti i badge",
  },

  // Contacts Page
  contacts: {
    error: "Errore",
    errorDescription: "Il contatto selezionato non è registrato come utente. Non è possibile inviare la multa.",
    deletedContactConfirmed: "Contatto eliminato con successo.",
    contactSearchPlaceholder: "Cerca contatto per nome o email",
    loading: "Caricamento...",
    addedContactConfirmed: "Contatto aggiunto con successo",
  },

  // Groups Page
  groups: {
    notIdentifiedUser: "Utente non identificato",
    theGroup: "Il gruppo",
    createdSuccessfully: "è stato creato con successo",
    letTheGroup: "Hai lasciato il gruppo",
    groupDeleted: "Il gruppo è stato eliminato.",
    updatedGroup: "Gruppo aggiornato con successo",
    savedCorrectly: "Le modifiche sono state salvate correttamente",
    deletedMember: "Membro rimosso",
    deletedMemberDescription: "L'utente è stato rimosso dal gruppo",
    memberAdded: "Membro aggiunto",
    memberAddedDescription: "Il nuovo membro è stato aggiunto con successo",
    contactNotFounError: "Nessun contatto registrato trovato per questo membro.",
    groupNotFound: "Gruppo non trovato",
    notDeterminedUser: "Impossibile determinare l'utente da multare.",
    createFineError: "Impossibile creare la multa:",
    fineCreated: "Multa creata con successo",
    fineSent: "Multa inviata con successo",
    rules: "Regole",
    members: "Membri",
    sendFine: "Invia multa",
    createGroupToStart: "Crea un gruppo per iniziare a gestire le multe tra amici",
  },

  // History Page
  history: {
    newFineReceived: "Nuova multa ricevuta!",
    newFineFrom: "Hai ricevuto una nuova multa da",
    fineForAmount: "Multa di",
    correctlyPaid: "pagata correttamente",
    experienceUpdateError: "Errore durante l'aggiornamento dell'esperienza utente",
    xpUpdated: "Esperienza aggiornata con successo",
    xpGained: "Hai guadagnato esperienza!",
    xpGainedDescription1: "Hai guadagnato",
    xpGainedDescription2: "XP per la tua azione.",
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
    totalSent: "Totale inviato",
    received: "Ricevute",
    receivedFines: "Multe ricevute",
    totalReceived: "Totale ricevuto"
  },

  // Quick Actions
  quickActions: {
    title: "Azioni rapide",
    description: "Gestisci le tue multe sociali",
    newFine: "Nuova multa",
    contacts: "Contatti",
    myQR: "Il mio QR",
    history: "Storico",
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
    phone: "Telefono"
  },

  // Create Fine Modal
  createFine: {
    title: "Crea nuova multa",
    description: "Crea una multa sociale da inviare a un amico o familiare",
    reason: "Motivo della multa",
    reasonPlaceholder: "Es: In ritardo a cena, dimenticato di comprare il pane...",
    amount: "Importo (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Tipo destinatario",
    contact: "Contatto",
    email: "Email",
    selectContact: "Seleziona contatto",
    selectContactPlaceholder: "Seleziona un contatto",
    recipientEmail: "Email destinatario",
    recipientEmailPlaceholder: "amico@esempio.com",
    cancel: "Annulla",
    create: "Crea multa",
    created: "Multa creata!",
    sentTo: "Multa di {amount} CHF inviata a {recipient}",
    seeAndManageContacts: "Visualizza e gestisci i contatti",
    seeHistoryComplete: "Vedi la cronologia completa",
    manageGroups: "Gestisci gruppi",
    groups: "Gruppi",
    errors: {
      complete: "Per favore compila tutti i campi richiesti",
      selectRecipient: "Per favore seleziona un destinatario",
      validEmail: "Per favore inserisci una email valida"
    }
  },

  // Payment Modal
  payment: {
    title: "Paga multa - {amount} CHF",
    description: "Paga la tua multa usando TWINT scansionando il codice QR o usando il numero",
    details: "Dettagli multa",
    reason: "Motivo:",
    sender: "Mittente:",
    amount: "Importo:",
    options: "Opzioni di pagamento TWINT",
    scanQR: "Scansiona con la tua app TWINT",
    useNumber: "Oppure usa il numero TWINT:",
    copied: "Copiato",
    numberCopied: "Numero TWINT copiato negli appunti",
    markPaid: "Segna come pagata",
    processing: "Elaborazione...",
    confirmed: "Pagamento confermato!"
  },

  // User Profile
  profile: {
    title: "Il mio profilo",
    description: "Aggiorna le tue informazioni personali e configura il metodo di pagamento TWINT",
    changePhoto: "Cambia foto",
    personalInfo: "Informazioni personali",
    fullName: "Nome e cognome",
    phone: "Telefono",
    twintConfig: "Configurazione TWINT",
    uploadQR: "Carica il tuo codice QR di TWINT",
    uploadButton: "Carica QR",
    qrDescription: "Questo QR verrà mostrato quando qualcuno dovrà pagarti una multa",
    save: "Salva modifiche",
    updated: "Profilo aggiornato",
    updateDescription: "I tuoi dati sono stati salvati con successo",
    twintUpload: "TWINT QR",
    twintUploadDescription: "Funzione di caricamento QR in arrivo",
    updatedProfile: "Profilo aggiornato",
    deleteAccountError: "Errore nell'eliminazione dell'account",
    deleteAccountDescription: "Impossibile eliminare l'account. Contatta il supporto.",
    accountDeleted: "Account eliminato con successo",
    accountDeletedDescription: "Il tuo account e tutti i tuoi dati sono stati eliminati con successo.",
    goBack: "Torna indietro",
    noName: "Nessun nome",
    editProfile: "Modifica profilo",
    accountManagement: "Gestione account",
    endSession: "Disconnetti",
    deleteAccount: "Elimina account",
    insignias: "Badge",
    confirmDeleteAccount: "Eliminare l'account?",
    confirmDeleteAccountDescription: "Questa azione non può essere annullata. Tutti i tuoi dati, multe e storico saranno eliminati in modo permanente dall'app.",
    Cancel: "Annulla",
    deleteAccountButton: "Elimina account",
  },

  // Auth
  auth: {
    login: "Accedi",
    register: "Registrati",
    email: "Email",
    password: "Password",
    confirmPassword: "Conferma password",
    fullName: "Nome e cognome",
    loginButton: "Accedi",
    registerButton: "Registrati",
    forgotPassword: "Hai dimenticato la password?",
    noAccount: "Non hai un account?",
    hasAccount: "Hai già un account?",
    signUp: "Registrati qui",
    signIn: "Accedi qui",
    loginSuccess: "Bentornato!",
    registerSuccess: "Account creato con successo!",
    errors: {
      emailRequired: "L'email è obbligatoria",
      passwordRequired: "La password è obbligatoria",
      passwordMatch: "Le password non coincidono",
      invalidEmail: "Email non valida",
      weakPassword: "La password deve essere di almeno 6 caratteri"
    }
  },

  // Pages
  pages: {
    contacts: {
      title: "Contatti",
      description: "Gestisci la tua lista di contatti",
      addContact: "Aggiungi contatto",
      addContactButton: "Aggiungi contatto",
      noContacts: "Non hai ancora contatti",
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      edit: "Modifica",
      delete: "Elimina",
      fine: "Multa",
      save: "Salva",
      cancel: "Annulla",
      editContact: "Modifica contatto",
      deleteContact: "Elimina contatto",
      deleteConfirmation: "Sei sicuro di voler eliminare questo contatto?",
      contactAdded: "Contatto aggiunto",
      contactUpdated: "Contatto aggiornato",
      contactDeleted: "Contatto eliminato"
    },
    groups: {
      title: "Gruppi",
      description1: "Gestisci i tuoi gruppi",
      createGroup: "Crea gruppo",
      joinGroup: "Unisciti a un gruppo",
      noGroups: "Non hai ancora gruppi",
      groupName: "Nome del gruppo",
      description: "Descrizione",
      members: "Membri",
      admin: "Admin",
      member: "Membro",
      leave: "Lascia",
      delete: "Elimina",
      invite: "Invita",
      manage: "Gestisci",
      code: "Codice",
      enterCode: "Inserisci il codice del gruppo",
      join: "Unisciti",
      create: "Crea",
      groupCreated: "Gruppo creato",
      joinedGroup: "Ti sei unito al gruppo",
      leftGroup: "Hai lasciato il gruppo",
      groupDeleted: "Gruppo eliminato"
    },
    settings: {
      title: "Impostazioni",
      description: "Configura l'app",
      language: "Lingua",
      notifications: "Notifiche",
      privacy: "Privacy",
      about: "Informazioni",
      version: "Versione",
      enableNotifications: "Attiva notifiche",
      enableSounds: "Attiva suoni",
      privateProfile: "Profilo privato",
      dataExport: "Esporta dati",
      deleteAccount: "Elimina account",
      settingsSaved: "Impostazioni salvate"
    },
    myQR: {
      title: "Il mio codice QR",
      description: "Condividi il tuo codice QR per ricevere multe",
      downloadQR: "Scarica QR",
      shareQR: "Condividi QR"
    },
    history: {
      title: "Storico",
      description: "Storico completo delle multe",
      filter: "Filtra",
      all: "Tutte",
      sent: "Inviate",
      received: "Ricevute",
      paid: "Pagate",
      pending: "In sospeso",
      noResults: "Nessun risultato",
      noResultsDescription: "Nessuna multa trovata con i filtri selezionati",
      viewAll: "Vedi tutto",
      total: "Totale"
    },
    notifications: {
      title: "Notifiche",
      description: "Le tue notifiche recenti",
      markAllRead: "Segna tutte come lette",
      noNotifications: "Non hai notifiche",
      fine_received: "{{sender}} ti ha inviato una multa di {{amount}} CHF per \"{{reason}}\"",
      fine_received_title: "Multa ricevuta",
      payment_received: "{{sender}} ha pagato la tua multa di {{amount}} CHF",
      group_invite: "{{sender}} ti ha invitato nel gruppo \"{{group}}\"",
      lessThanHour: "Meno di 1 ora fa",
      hoursAgo: "{hours} ore fa",
      daysAgo: "{days} giorni fa",
      marked: "Notifiche segnate",
      allRead: "Tutte le notifiche sono state segnate come lette",
      emptyMessage: "Quando riceverai notifiche, appariranno qui",
      newRuleProposed: "Nuova regola proposta",
    }
  },

  // Invite
  invite: {
    title: "Invita amici",
    description: "Invita i tuoi amici a usare Pic",
    shareText: "Unisciti a Pic e gestisci le multe sociali tra amici! 🎉",
    copyLink: "Copia link",
    linkCopied: "Link copiato!",
    sendInvite: "Invia invito"
  },

  // Achievements
  achievements: {
    title: "Obiettivo sbloccato!",
    close: "Chiudi",
    xpGained: "Punti esperienza guadagnati",
    levelUp: "Sei salito di livello!",
    newBadge: "Nuovo badge!"
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
    share: "Condividi",
    total: "Totale",
  }
};
