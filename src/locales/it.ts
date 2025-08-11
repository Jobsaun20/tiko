import { add } from "date-fns";

export const it = {
  // Header
  app: {
    name: "Tiko",
    subtitle: "Tra amici",
    installApp: "Installa app",
    other: "Altro",
    installIosGuide: "Installa su iOS",
  },
notifications: {
  // Modelli di notifica
  fine_received: {
    title: "Multa ricevuta",
    icon: "💸",
    message: '{{sender}} ti ha inviato una multa di {{amount}} € per "{{reason}}"',
  },
  challenge_created: {
    title: "Sfida creata",
    icon: "🏆",
    message: "Hai creato una sfida: {{challenge_title}}",
  },
  challenge_invited: {
    title: "Invito a una sfida",
    icon: "🎯",
    message: "{{sender}} ti ha invitato alla sfida: {{challenge_title}}",
  },
  payment_received: {
    title: "Pagamento ricevuto",
    icon: "💰",
    message: "Hai ricevuto un pagamento di {{amount}} €",
  },
  group_invite: {
    title: "Invito a un gruppo",
    icon: "👥",
    message: "Sei stato invitato in un gruppo",
  },
  group_rule_proposed: {
    title: "Nuova regola proposta",
    icon: "⏳",
    message: "{{rule_description}}",
  },
  group_rule_deletion_proposed: {
  title: "Proposta di eliminazione di una regola",
  message: "È stata proposta l'eliminazione della regola '{{rule}}' dal gruppo '{{group}}'.",
},
group_rule_deleted: {
  title: "Regola eliminata",
  message: "La regola '{{rule}}' è stata eliminata dal gruppo '{{group}}'.",
},
contact_request_sent: {
  title: "Richiesta inviata",
  message: "Hai inviato una richiesta di contatto a {{name}}.",
},
contact_request_received: {
  title: "Richiesta ricevuta",
  message: "{{name}} ti ha inviato una richiesta di contatto.",
},
contact_request_accepted: {
  title: "Richiesta accettata",
  message: "{{name}} ha accettato la tua richiesta di contatto.",
},
contact_request_was_accepted: {
  title: "Richiesta accettata",
  message: "Hai accettato la richiesta di contatto di {{name}}.",
},



  // Intestazione e azioni
  title: "Notifiche",
  description: "Le tue notifiche recenti",
  markAllRead: "Segna tutto come letto",
  markReadMobile: "Segna come letto",
  deleteAll: "Elimina tutto",
  confirmDeleteAll: "Sei sicuro di voler eliminare tutte le notifiche?",
  notificationsMarked: "Notifiche segnate",
  notificationsMarkedDescription: "Tutte le notifiche sono state segnate come lette",
  notificationsDeleted: "Notifiche eliminate",
  notificationsDeletedDescription: "Tutte le notifiche sono state eliminate",
phoneUpdated: "Telefono aggiornato",
phoneUpdatedDescription: "Ora puoi ricevere i tuoi guadagni con Bizum",

  // Stati vuoti
  noNotifications: "Non hai ancora notifiche",
  emptyMessage: "Quando avrai notifiche, appariranno qui.",
  loading: "Caricamento notifiche...",

  // Date relative
  lessThanOneHour: "Meno di 1 ora fa",
  hoursAgo: "{{hours}} ore fa",
  daysAgo: "{{days}} giorni fa",
},


challengeCard: {
  you: "Tu",
  user: "Utente",
  sureDelete: "Sei sicuro di voler eliminare questa sfida?",
  errorDeleting: "Errore nell'eliminazione della sfida:",
  pending: "In attesa",
  active: "Attiva",
  finished: "Terminata",
  canceled: "Annullata",
  createdBy: "Creato da:",
  penalty: "Penalità",
  members: "Membri",
  rejected: "(Rifiutato)",
  completed: "Completato",
  notCompleted: "Non completato",
  accept: "Accetta",
  reject: "Rifiuta",
  deleteChallenge: "Elimina sfida",
  challengeNotCompleted: "Non hai completato la sfida: {title}",
newFineRecived: "Nuova multa ricevuta",
fineReceivedBody: "Hai ricevuto una multa da {{sender}} di {{amount}} €. Motivo: {{reason}}",
progress: "completati",


},

challenges: {
  challenges: "Sfide",
  status_all: "Tutti",
  status_accepted: "Accettati",
  status_rejected: "Rifiutati",
  status_achieved: "Completati",
  status_failed: "Non completati",
  back: "Indietro",
  createChallenge: "Crea sfida",
  filterChallenges: "Filtra sfide",
  searchChallengePlaceholder: "Cerca sfide per titolo o descrizione...",
  notLoggedIn: "Accedi per vedere le tue sfide.",
  titleChallengePage: "Sfide",
subtitle: "Sfida i tuoi amici, familiari, partner, ecc. Supera la sfida e ottieni ricompense.",
  loadingChallenges: "Caricamento sfide...",
  noChallenges: "Non hai ancora sfide.",
  noResults: "Nessuna sfida corrisponde alla tua ricerca.",
  acceptedCounter: "Accettati",
  rejectedCounter: "Rifiutati",
  achievedCounter: "Completati",
  failedCounter: "Non completati",

  inviteContacts: "Invita i tuoi contatti e sfidali a raggiungere un obiettivo insieme.",
  title: "Titolo",
  titlePlaceholder: "Es: Niente caffè per una settimana",
  description: "Descrizione",
  descriptionPlaceholder: "Descrivi la sfida (opzionale)",
  amount: "Penalità",
  amountPlaceholder: "Es: 5",
  currency: "€",
  addParticipants: "Aggiungi partecipanti",
  searchPlaceholder: "Cerca per nome o email...",
  loadingContacts: "Caricamento contatti...",
  noContactsFound: "Nessun contatto corrispondente trovato.",
  remove: "Rimuovi",
  cancel: "Annulla",
  creating: "Creazione...",
  create: "Crea sfida",
  newChallengeProposed: "Nuova sfida proposta!",
  youHaveNewChallengeToAccept: "Hai una sfida in attesa di accettazione: {{title}}",
  challengeFinished: "Sfida terminata",
  whoRejected: "{{name}} ha rifiutato la sfida '{{title}}'",
  challengeActivated: "Sfida attivata!",
  everyoneAccepted: "Tutti hanno accettato! La sfida è ora attiva.",
  challengeFinishCheckResult: "La sfida è terminata. Controlla il risultato!",
},
  

groupRulesModal: {
  title: "Regole del gruppo",
  newRulePlaceholder: "Essere puntuale, raccogliere i vestiti sporchi...",
  propose: "Proponi",
  loading: "Caricamento delle regole...",
  noRules: "Nessuna regola proposta al momento.",
  validated: "Validata",
  rejected: "Rifiutata",
  pendingOthers: "In attesa degli altri",
  youRejected: "Hai rifiutato",
  accept: "Accetta",
  reject: "Rifiuta",
  deleteTitle: "Elimina regola",
  close: "Chiudi",
  toastProposedTitle: "Nuova regola proposta",
  toastDeletedTitle: "Regola eliminata",
  toastDeletedDesc: "La regola è stata eliminata con successo.",
  proposeDelete: "Proponi eliminazione",
pendingDeletion: "Eliminazione in sospeso",
toastDeleteProposedTitle: "Eliminazione proposta",
toastDeleteProposedDesc: "Tutti i membri devono accettare per eliminare questa regola",
deleteRuleNotificationTitle: "Proposta di eliminazione di una regola",
deleteRuleNotificationBody: "{username} ha proposto di eliminare la regola: \"{rule}\"",
confirmDelete: "Elimina",
keepRule: "Mantieni",
deletedRulePushTitle: "Regola eliminata",
deletedRulePushBody: "La regola \"{rule}\" del gruppo \"{group}\" è stata eliminata.",
toastProposedBody: "La regola \"{rule}\" è stata proposta nel gruppo \"{group}\".",
amountLabel: "Multa",
amountPlaceholder: "Importo (€)",

},


 badgeUnlocked: {
    titleSingle: "Risultato sbloccato!",
    titleMultiple: "Nuovi risultati sbloccati!",
    descriptionSingle: "Hai sbloccato un nuovo badge!",
    descriptionMultiple: "Hai sbloccato nuovi badge!",
    close: "Chiudi",
  },


 createGroupModal: {
    createGroup: "Crea nuovo gruppo",
    createGroupDescription: "Configura il tuo gruppo per gestire multe sociali tra i membri",
    groupName: "Nome del gruppo",
    groupNamePlaceholder: "Es.: Coinquilini",
groupDescription: "Descrizione",
    groupDescriptionPlaceholder: "Descrivi brevemente lo scopo del gruppo",
    uploadAvatar: "Carica avatar",
    cancel: "Annulla",
    createGroupButton: "Crea gruppo",
    errorNoName: "Il nome del gruppo è obbligatorio",
    errorNoQR: "Devi fornire il codice QR Bizum per la modalità “Pagamento all’amministratore”",
    toastSuccess: "Gruppo creato con successo!",
    toastSuccessDesc: "Il gruppo “{groupName}” è stato creato con successo.",
  },


paymentModal: {
  title: "Paga la multa",
description: "Copia il numero del mittente e usalo per pagare con Bizum",
  fine: "Multa",
  amount: "Importo",
  sender: "Mittente",
  reason: "Motivo",
scanQR: "Numero Bizum",
  useNumber: "Oppure usa il numero Bizum",
  copyNumber: "Copia numero",
  copied: "Copiato",
  markAsPaid: "Segna come pagata",
  processing: "Elaborazione...",
  paid: "Pagamento confermato!",
  close: "Chiudi",
  noBizumNumber: "Il mittente non ha configurato il suo numero Bizum",
  you:"tu",
},


  installApp: {
    iosTitle: "Installa l'app su iOS",
    iosIntro: "Installa il sito web come app sul tuo iPhone o iPad per un accesso più rapido.",
    iosStep1: "Apri Safari e vai su questo sito.",
    iosStep2: "Tocca il pulsante 'Condividi'.",
    iosShareDesc: "È l'icona con un quadrato e una freccia verso l'alto nella parte inferiore.",
    iosStep3: "Seleziona 'Aggiungi a schermata Home'.",
    iosStep4: "Conferma toccando 'Aggiungi' in alto a destra.",
    iosDone: "Fatto! Ora puoi aprire l'app direttamente dalla schermata Home."
  },

  share: {
    title: "Condividi Tiko",
    description: "Condividi questo sito con amici o familiari:",
    copy: "Copia link",
    copied: "Copiato!",
    close: "Chiudi",
    button: "Condividi app",
    buttonDesc: "Condividi Tiko con i tuoi amici",
    intro: "Condividi l'app con i tuoi amici:",
    share: "Invia...",
    text: "Prova questa app!"
  },

  banner: {
    title: "Vuoi installare l'app per un accesso diretto?",
    install: "Installa",
    close: "Chiudi",
showInstallBanner: "Per installare su iOS: Tocca “Condividi” 📤 e seleziona “Aggiungi a Home”.",
    phoneWarning: "Aggiungi il tuo numero di telefono per ricevere pagamenti con Bizum. NON PREOCCUPARTI! Solo la persona che riceve la tua multa potrà vederlo.",
    phoneWarningButton: "Aggiungi numero",
  },

  welcome: {
  title: "Benvenuto su Tiko",
  subtitle1: "I loro errori, il tuo vantaggio",
  description: "Create il vostro gruppo, definite le vostre regole, lanciate sfide... e che nessuno scappi! Chi non rispetta le regole, paga!",
  login: "Accedi",
  newUser: "Nuovo utente",
},

onboard: {
  whatIsTiko: "Cos'è Tiko?",
  whatIsTikoDescription: "Tiko è l'app che trasforma la convivenza in un gioco dove vince chi rispetta e fa rispettare le regole.",
  createGroups: "Crea gruppi e regole",
  createGroupsDescription: "Crea un gruppo con il tuo partner, amici, coinquilini o colleghi e stabilite le vostre regole (Niente capelli nella doccia, Non interrompere le riunioni...) e se qualcuno non le rispetta, paga!",
  challengeTitle: "Sfida i tuoi contatti",
  challengeDefinition: "Crea sfide e migliora le abitudini in modo divertente (una settimana senza zucchero, superare il prossimo esame o iscriversi in palestra). Chi non ce la fa, paga. Convivi, migliora le abitudini, guadagna XP.",
  payAndLevelUp: "Convivi e vinci",
  payAndLevelUpDescription: "L'obiettivo di Tiko è migliorare la convivenza, giocare in squadra, migliorare le abitudini e divertirsi mentre diventi IL COINQUILINO PERFETTO.",
  back: "Indietro",
  next: "Avanti",
  createAccount: "Crea account",
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
    continueLikeThis: "Continua così!",
    quickActions: "Azioni rapide",
    quickQuickActionsDescription: "Gestisci le tue multe in modo efficiente",
    recivedFines: "Multe ricevute",
    recentRecivedFines: "Ultime multe ricevute",
    noRecivedFines: "Non hai ricevuto multe",
    seeAllRecivedFines: "Vedi tutte le multe ricevute",
    recentInsignias: "Badge recenti",
    recentHitos: "I tuoi ultimi risultati",
    seeAllInsignias: "Vedi tutti i badge",
    pendingFinesTitle:"Multas pendientes",
    seeAllPendingFines:"Ver todas las multas pendientes",
    subtitle: "Inizia a fare giustizia!",

  },

  // Contacts Page
  contacts: {
    error: "Errore",
    errorDescription: "Il contatto selezionato non è registrato come utente. Impossibile inviare la multa.",
    deletedContactConfirmed: "Contatto eliminato correttamente.",
    contactSearchPlaceholder: "Cerca contatto per nome o email",
    loading: "Caricamento...",
    addedContactConfirmed: "Contatto aggiunto correttamente",
    titleFineModalPage: "Crea nuova multa",
    challenge:"Sfida",
    statusActive:"Active",
    contactRequestSentTitle: "Richiesta inviata",
contactRequestSent: "La richiesta di contatto è stata inviata.",
contactRequestFailed: "Impossibile inviare la richiesta.",
confirmDeleteTitle: "Eliminare il contatto?",
confirmDeleteDescription: "Sei sicuro di voler eliminare questo contatto? Questa azione è irreversibile.",
newContactRequestTitle: "Nuova richiesta di contatto",
newContactRequestBody: "{name} ti ha inviato una richiesta di contatto.",
requestRejected: "Hai rifiutato la richiesta di contatto.",

  },

  // Groups Page
  groups: {
    notIdentifiedUser: "Utente non identificato",
    theGroup: "Il gruppo",
    createdSuccessfully: "è stato creato con successo",
    letTheGroup: "Hai lasciato il gruppo",
    groupDeleted: "Il gruppo è stato eliminato.",
    updatedGroup: "Gruppo aggiornato correttamente",
    savedCorrectly: "Modifiche salvate correttamente",
    deletedMember: "Membro rimosso",
    deletedMemberDescription: "L'utente è stato rimosso dal gruppo",
    memberAdded: "Membro aggiunto",
    memberAddedDescription: "Nuovo membro aggiunto correttamente",
    contactNotFounError: "Nessun contatto registrato trovato per questo membro.",
    groupNotFound: "Gruppo non trovato",
    notDeterminedUser: "Impossibile determinare l'utente da multare.",
    createFineError: "Impossibile creare la multa:",
    fineCreated: "Multa creata correttamente",
    fineSent: "Multa inviata correttamente",
    rules: "Regole",
    members: "Membri",
    sendFine: "Invia multa",
    createGroupToStart: "Crea un gruppo per iniziare",
    confirmDeleteTitle: "Eliminare il gruppo?",
confirmDeleteDescription: "Sei sicuro di voler eliminare il gruppo? Questa azione non può essere annullata.",
edit: "Modifica",
delete: "Elimina",
leave: "Lascia il gruppo",
showMembers: "Mostra membri",


  },

  // History Page
  history: {
    newFineReceived: "Nuova multa ricevuta!",
    newFineFrom: "Hai ricevuto una nuova multa da",
    fineForAmount: "Multa di",
    correctlyPaid: "pagata correttamente",
    experienceUpdateError: "Errore nell'aggiornamento dell'esperienza",
    xpUpdated: "Esperienza aggiornata correttamente",
    xpGained: "Hai guadagnato esperienza!",
    xpGainedDescription1: "Hai guadagnato",
    xpGainedDescription2: "XP per la tua azione.",
    searchPlaceholder: "Cerca multe per nome o descrizione", // Italiano

  },

  // Navigation & Actions
  nav: {
    notifications: "Notifiche",
    profile: "Il mio profilo",
    settings: "Impostazioni",
    logout: "Disconnetti",
    login: "Accedi",
    register: "Crea account",
    invite: "Invita amici",
     home: "Home",
  groups: "Gruppi",
  contacts: "Contatti",
  fines: "Multe",
  history: "Storico",
  language: "Lingua",

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
    description: "Gestisci le multe ricevute e inviate",
    from: "Da",
    to: "A",
    paid: "Pagata",
    pending: "In sospeso",
    pay: "Paga",
    payFine: "Paga la multa",
    finePaid: "Multa pagata!",
    noReceived: "Non hai multe ricevute",
    noSent: "Non hai ancora inviato multe",
    phone: "Telefono",
received: "ricevuta",
sent: "inviata",
created: "creata",

  },

  // Create Fine Modal
  createFine: {
    title: "Crea nuova multa",
    description: "Crea una multa sociale da inviare a un amico o familiare",
    reason: "Motivo della multa",
    reasonPlaceholder: "Es: In ritardo a cena, dimenticato il pane...",
    amount: "Importo (€)",
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
    sentTo: "Multa di {amount} € inviata a {recipient}",
    seeAndManageContacts: "Vedi e gestisci i contatti",
    seeHistoryComplete: "Vedi storico completo",
    manageGroups: "Gestisci gruppi",
    groups: "Gruppi",
    errors: {
      complete: "Per favore, completa tutti i campi obbligatori",
      selectRecipient: "Per favore, seleziona un destinatario",
      validEmail: "Inserisci una email valida"
    }
  },

  // Payment Modal
  payment: {
    title: "Paga multa - {amount} €",
    description: "Paga la tua multa usando Bizum scansionando il QR code o utilizzando il numero",
    details: "Dettagli della multa",
    reason: "Motivo:",
    sender: "Mittente:",
    amount: "Importo:",
    options: "Opzioni di pagamento Bizum",
    scanQR: "Scansiona con l'app Bizum",
    useNumber: "Oppure usa il numero Bizum:",
    copied: "Copiato",
    numberCopied: "Numero Bizum copiato negli appunti",
    markPaid: "Segna come pagata",
    processing: "Elaborazione...",
    confirmed: "Pagamento confermato!"
  },

  // User Profile
  profile: {
    title: "Il mio profilo",
    description: "Aggiorna le tue informazioni personali e configura Bizum come metodo di pagamento",
    changePhoto: "Cambia foto",
    personalInfo: "Informazioni personali",
    fullName: "Nome completo",
    userName: "Nome utente",
    phone: "Telefono",
    BizumConfig: "Configurazione Bizum",
    uploadQR: "Carica il tuo QR Bizum",
    uploadButton: "Carica QR",
    qrDescription: "Questo QR verrà mostrato quando qualcuno deve pagarti una multa",
    save: "Salva modifiche",
    updated: "Profilo aggiornato",
    updateDescription: "I tuoi dati sono stati salvati correttamente",
    BizumUpload: "Bizum QR",
    BizumUploadDescription: "Funzione caricamento QR in arrivo",
    updatedProfile: "Profilo aggiornato",
    deleteAccountError: "Errore nell'eliminazione dell'account",
    deleteAccountDescription: "Impossibile eliminare l'account. Contatta il supporto.",
    accountDeleted: "Account eliminato correttamente",
    accountDeletedDescription: "Il tuo account e tutti i tuoi dati sono stati eliminati.",
    goBack: "Torna indietro",
    noName: "Nessun nome",
    editProfile: "Modifica profilo",
    accountManagement: "Gestione account",
    endSession: "Disconnetti",
    deleteAccount: "Elimina account",
    insignias: "Badge",
    confirmDeleteAccount: "Eliminare l'account?",
    confirmDeleteAccountDescription: "Questa azione non può essere annullata. Tutti i tuoi dati, multe e storico verranno eliminati definitivamente.",
    Cancel: "Annulla",
    deleteAccountButton: "Elimina account",
    loadingBadges: "Caricamento badge...",
    noBadges: "Non hai ancora badge",
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
      passwordMatch: "Le password non corrispondono",
      invalidEmail: "Email non valida",
      weakPassword: "La password deve avere almeno 6 caratteri"
    }
  },

  // Pages
  pages: {
    contacts: {
      title: "Contatti",
      description: "Aggiungi contatti e usali per creare gruppi, sfide, ecc.",
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
      groupName: "Nome gruppo",
      description: "Crea un gruppo, aggiungi i membri e definite le vostre regole.",
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
      about: "Info",
      version: "Versione",
      enableNotifications: "Attiva notifiche",
      enableSounds: "Attiva suoni",
      privateProfile: "Profilo privato",
      dataExport: "Esporta dati",
      deleteAccount: "Elimina account",
      settingsSaved: "Impostazioni salvate"
    },
    myQR: {
      title: "Il mio QR code",
      description: "Condividi il tuo QR per ricevere multe",
      downloadQR: "Scarica QR",
      shareQR: "Condividi QR"
    },
    history: {
      title: "Multe",
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
      noNotifications: "Nessuna notifica",
      fine_received: "{{sender}} ti ha inviato una multa di {{amount}} € per \"{{reason}}\"",
      fine_received_title: "Multa ricevuta",
      payment_received: "{{sender}} ha pagato la tua multa di {{amount}} €",
      group_invite: "{{sender}} ti ha invitato al gruppo \"{{group}}\"",
      lessThanHour: "Meno di 1 ora fa",
      hoursAgo: "{hours} ore fa",
      daysAgo: "{days} giorni fa",
      marked: "Notifiche segnate",
      allRead: "Tutte le notifiche segnate come lette",
      emptyMessage: "Quando avrai notifiche, compariranno qui",
      newRuleProposed: "Nuova regola proposta",
    }
  },

  // Invite
  invite: {
    title: "Invita amici",
    description: "Invita i tuoi amici a usare Tiko",
    shareText: "Dove infrangere le regole ti fa vincere (purché non sia tu a farlo 😏)",
    shareTextShort: "Unisciti a Tiko!",
    copyLink: "Copia link",
    linkCopied: "Link copiato!",
    linkCopiedDescription: "Il link è stato copiato negli appunti",
    sendInvite: "Invia invito",
    invitationLink: "Link di invito",
    sendAskToContact: "Invia richiesta",

  },

  // Achievements
  achievements: {
    title: "Traguardo sbloccato!",
    close: "Chiudi",
    xpGained: "Punti esperienza guadagnati",
    levelUp: "Livello aumentato!",
    newBadge: "Nuovo badge!"
  },


  tutorial: {
    header: {
      title: "Come funziona DESWG",
      subtitle: "Tutorial rapido",
    },
    progress: {
      stepOfTotal: "Passo {current} di {total}",
    },
    nav: {
      back: "Indietro",
      next: "Avanti",
      finish: "Fine",
      skipTutorial: "Salta tutorial",
    },

    steps: {
      contact: {
        title: "Inizia con un contatto",
        subtitle: "Inizia aggiungendo un contatto. Cercalo per username o email.",
        body: "Con i contatti puoi creare gruppi, regole, multe e sfide.",
        note: "Puoi aggiungere contatti dalla pagina «Contatti». Cercali per username o email.",
      },

      group: {
        title: "Crea il tuo gruppo",
        subtitle: "Nei gruppi si definiscono regole, multe, ecc.",
        body: "Dopo aver creato il gruppo, modificalo per aggiungere i membri.",
        note: "Crea un gruppo dalla pagina «Gruppi». Puoi aggiungere solo membri già presenti in «Contatti».",
      },

      rule: {
        title: "Aggiungi regole ai tuoi gruppi",
        subtitle: "Inizia in modo semplice così tutti capiscono.",
        examples:
          "• «Non portare fuori la spazzatura» — CHF 1\n• «Arrivare in ritardo» — CHF 2",
        note: "Le regole del gruppo devono essere accettate da tutti i membri prima di diventare valide. Puoi modificare o eliminare le regole in qualsiasi momento.",
      },

      action: {
        title: "Invia una multa o una sfida",
        subtitle: "1. Dalla barra di navigazione.\n 2. Dai Gruppi.",
        tips:
          "• Dalla barra di navigazione '+': scegli il contatto e invia (Multa / Sfida).\n\n• Dal gruppo: tocca il nome del membro per inviare una multa mostrando il nome del gruppo.\n",
        note: "Per ricevere pagamenti, aggiungi il tuo numero di telefono in Il mio profilo > Modifica profilo.",
      },

      phoneShare: {
        title: "Attiva i pagamenti con Bizum",
        description: "Per ricevere pagamenti tramite Bizum, aggiungi il tuo numero di telefono. NIENTE PAURA! Solo la persona che riceve la tua multa lo vedrà.",
        addPhone: "Aggiungi numero",
        skipNow: "Salta per ora",
        shareApp: "Condividi app / Invita",
        phoneLabel: "Il tuo numero (Bizum)",
        phonePlaceholder: "+41 79 123 45 67",
        saving: "Salvataggio...",
        saved: "Numero salvato",
      },

      install: {
        title: "Installa l’APP",
        title2: "Ricevi notifiche e accedi a DESWG con un tocco",
        installed: "L’app è già installata ✅",
        installButton: "Installa",
        instructionsSafari: "In Safari: tocca l’icona di condivisione (📤) e scegli «Aggiungi alla schermata Home».",
        note: "Le web app sono sicure e funzionano come un collegamento al sito senza occupare spazio sul telefono.",
      },
    },
  },



  // Common
  common: {
    goHome: "Vai alla home",
    currency: "€",
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
  },

  modal: {
    close: "Chiudi",
    confirm: "Conferma",
    cancel: "Annulla",
    delete: "Elimina",
    save: "Salva",
    edit: "Modifica",
    create: "Crea",
    update: "Aggiorna",
    add: "Aggiungi",
    addMember: "Aggiungi membro al gruppo",
    searchContactToAdd: "Cerca un contatto da aggiungere",
    noContactsFound: "Nessun contatto trovato",
    startWriteToFind: "Inizia a scrivere per cercare contatti",
    searchNameOrEmail: "Cerca per nome o email",
    searching: "Ricerca in corso...",
    errorSelectUser: "Devi selezionare un utente esistente.",
    editGroup: "Modifica gruppo",
    editGroupDescription: "Gestisci le informazioni e i membri del gruppo.",
    generalTab: "Generale",
    avatarTab: "Immagine",
    membersTab: "Membri",
    groupName: "Nome gruppo",
    description: "Descrizione",
    avatarLabel: "Immagine gruppo",
    changeAvatarTitle: "Clicca per cambiare immagine",
    changeAvatar: "Cambia immagine",
    uploading: "Caricamento...",
    avatarHelpAdmin: "(Solo l’admin può cambiare l’immagine. Clicca o usa il pulsante per caricare una nuova foto.)",
    avatarHelpUser: "Solo l’admin può cambiare l’immagine del gruppo.",
    uploadSuccess: "Immagine caricata correttamente. Non dimenticare di salvare!",
    currentMembers: "Membri attuali:",
    adminLabel: "Admin",
    removeMemberTitle: "Rimuovi dal gruppo",
    saveChanges: "Salva modifiche",
    addTelephoneNumber: "Inserisci il tuo numero di telefono per Bizum",
placeholderPhone: "Es.: +34791234567 o 612345678",
errorPhone: "Inserisci un numero valido (+34 o 612345678).",
  }
};
export default it;