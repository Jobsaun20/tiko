import { add } from "date-fns";

export const de = {
  // Header
  app: {
    name: "Tiko",
    subtitle: "Unter Freunden",
    installApp: "App installieren",
    other: "Andere", 
    installIosGuide: "iOS installieren",
  },
notifications: {
  // Benachrichtigungs-Vorlagen
  fine_received: {
    title: "Erhaltene Busse",
    icon: "💸",
    message: '{{sender}} hat dir eine Busse von {{amount}} € für "{{reason}}" geschickt',
  },
  challenge_created: {
    title: "Challenge erstellt",
    icon: "🏆",
    message: "Du hast eine Challenge erstellt: {{challenge_title}}",
  },
  challenge_invited: {
    title: "Challenge-Einladung",
    icon: "🎯",
    message: "{{sender}} hat dich zur Herausforderung eingeladen: {{challenge_title}}",
  },
  payment_received: {
    title: "Zahlung erhalten",
    icon: "💰",
    message: "Du hast eine Zahlung von {{amount}} € erhalten",
  },
  group_invite: {
    title: "Gruppeneinladung",
    icon: "👥",
    message: "Du wurdest zu einer Gruppe eingeladen",
  },
  group_rule_proposed: {
    title: "Neue Regel vorgeschlagen",
    icon: "⏳",
    message: "{{rule_description}}",
  },
  group_rule_deletion_proposed: {
  title: "Regel zur Löschung vorgeschlagen",
  message: "Die Regel '{{rule}}' der Gruppe '{{group}}' wurde zur Löschung vorgeschlagen.",
},
group_rule_deleted: {
  title: "Regel gelöscht",
  message: "Die Regel '{{rule}}' wurde aus der Gruppe '{{group}}' gelöscht.",
},
contact_request_sent: {
  title: "Anfrage gesendet",
  message: "Du hast {{name}} eine Kontaktanfrage gesendet.",
},
contact_request_received: {
  title: "Anfrage erhalten",
  message: "{{name}} hat dir eine Kontaktanfrage gesendet.",
},
contact_request_accepted: {
  title: "Anfrage akzeptiert",
  message: "{{name}} hat deine Kontaktanfrage akzeptiert.",
},
contact_request_was_accepted: {
  title: "Anfrage akzeptiert",
  message: "Du hast die Kontaktanfrage von {{name}} akzeptiert.",
},



  // Kopfzeile und Aktionen
  title: "Benachrichtigungen",
  description: "Deine aktuellen Benachrichtigungen",
  markAllRead: "Alle als gelesen markieren",
  markReadMobile: "Als gelesen markieren",
  deleteAll: "Alle löschen",
  confirmDeleteAll: "Möchtest du wirklich alle Benachrichtigungen löschen?",
  notificationsMarked: "Benachrichtigungen markiert",
  notificationsMarkedDescription: "Alle Benachrichtigungen wurden als gelesen markiert",
  notificationsDeleted: "Benachrichtigungen gelöscht",
  notificationsDeletedDescription: "Alle Benachrichtigungen wurden gelöscht",
  phoneUpdated: "Telefon aktualisiert",
phoneUpdatedDescription: "Du kannst jetzt deine Einnahmen mit Bizum erhalten",


  // Leere Zustände
  noNotifications: "Du hast noch keine Benachrichtigungen",
  emptyMessage: "Wenn du Benachrichtigungen hast, erscheinen sie hier.",
  loading: "Benachrichtigungen werden geladen...",

  // Relative Zeitangaben
  lessThanOneHour: "Vor weniger als 1 Stunde",
  hoursAgo: "Vor {{hours}} Stunden",
  daysAgo: "Vor {{days}} Tagen",
},


challengeCard: {
  you: "Du",
  user: "Benutzer",
  sureDelete: "Bist du sicher, dass du diese Challenge löschen möchtest?",
  errorDeleting: "Fehler beim Löschen der Challenge:",
  pending: "Ausstehend",
  active: "Aktiv",
  finished: "Beendet",
  canceled: "Abgebrochen",
  createdBy: "Erstellt von:",
  penalty: "Busse",
  members: "Mitglieder",
  rejected: "(Abgelehnt)",
  completed: "Abgeschlossen",
  notCompleted: "Nicht abgeschlossen",
  accept: "Akzeptieren",
  reject: "Ablehnen",
  deleteChallenge: "Challenge löschen",
  challengeNotCompleted: "Du hast die Herausforderung nicht abgeschlossen: {title}",
newFineRecived: "Neue Busse erhalten",
fineReceivedBody: "Du hast eine Busse von {{sender}} über {{amount}} € erhalten. Grund: {{reason}}",
progress: "abgeschlossen",


},

challenges: {
  challenges: "Challenges",
  status_all: "Alle",
  status_accepted: "Akzeptiert",
  status_rejected: "Abgelehnt",
  status_achieved: "Geschafft",
  status_failed: "Nicht geschafft",
  back: "Zurück",
  createChallenge: "Challenge erstellen",
  filterChallenges: "Challenges filtern",
  searchChallengePlaceholder: "Challenges nach Titel oder Beschreibung suchen...",
  notLoggedIn: "Melde dich an, um deine Challenges zu sehen.",
  titleChallengePage: "Challenges",
subtitle: "Fordere deine Freunde, Familie, deinen Partner usw. heraus. Schliesse die Herausforderung ab und erhalte Belohnungen.",
  loadingChallenges: "Challenges werden geladen...",
  noChallenges: "Du hast noch keine Challenges.",
  noResults: "Keine Challenge entspricht deiner Suche.",
  acceptedCounter: "Akzeptiert",
  rejectedCounter: "Abgelehnt",
  achievedCounter: "Geschafft",
  failedCounter: "Nicht geschafft",

  inviteContacts: "Lade deine Kontakte ein und fordere sie heraus, ein Ziel gemeinsam zu erreichen.",
  title: "Titel",
  titlePlaceholder: "z. B.: Eine Woche kein Kaffee",
  description: "Beschreibung",
  descriptionPlaceholder: "Beschreibe die Challenge (optional)",
  amount: "Busse",
  amountPlaceholder: "z. B.: 5",
  currency: "€",
  addParticipants: "Teilnehmer hinzufügen",
  searchPlaceholder: "Nach Name oder E-Mail suchen...",
  loadingContacts: "Kontakte werden geladen...",
  noContactsFound: "Keine passenden Kontakte gefunden.",
  remove: "Entfernen",
  cancel: "Abbrechen",
  creating: "Wird erstellt...",
  create: "Challenge erstellen",
  newChallengeProposed: "Neue Challenge vorgeschlagen!",
  youHaveNewChallengeToAccept: "Du hast eine Challenge zum Annehmen: {{title}}",
  challengeFinished: "Challenge beendet",
  whoRejected: "{{name}} hat die Challenge abgelehnt '{{title}}'",
  challengeActivated: "Challenge aktiviert!",
  everyoneAccepted: "Alle haben akzeptiert! Die Challenge ist jetzt aktiv.",
  challengeFinishCheckResult: "Die Challenge ist beendet. Überprüfe das Ergebnis!",
},



 groupRulesModal: {
  title: "Gruppenregeln",
  newRulePlaceholder: "Pünktlich sein, schmutzige Wäsche wegräumen...",
  propose: "Vorschlagen",
  loading: "Lade Regeln...",
  noRules: "Es wurden noch keine Regeln vorgeschlagen.",
  validated: "Bestätigt",
  rejected: "Abgelehnt",
  pendingOthers: "Warten auf andere",
  youRejected: "Du hast abgelehnt",
  accept: "Akzeptieren",
  reject: "Ablehnen",
  deleteTitle: "Regel löschen",
  close: "Schliessen",
  toastProposedTitle: "Neue Regel vorgeschlagen",
  toastDeletedTitle: "Regel gelöscht",
  toastDeletedDesc: "Die Regel wurde erfolgreich gelöscht.",
  proposeDelete: "Löschung vorschlagen",
pendingDeletion: "Löschung ausstehend",
toastDeleteProposedTitle: "Löschung vorgeschlagen",
toastDeleteProposedDesc: "Alle Mitglieder müssen der Löschung dieser Regel zustimmen",
deleteRuleNotificationTitle: "Löschung einer Regel vorgeschlagen",
deleteRuleNotificationBody: "{username} hat vorgeschlagen, die Regel zu löschen: \"{rule}\"",
confirmDelete: "Löschen",
keepRule: "Behalten",
deletedRulePushTitle: "Regel gelöscht",
deletedRulePushBody: "Die Regel \"{rule}\" der Gruppe \"{group}\" wurde gelöscht.",
toastProposedBody: "Die Regel \"{rule}\" wurde in der Gruppe \"{group}\" vorgeschlagen.",
amountLabel: "Busse",
amountPlaceholder: "Betrag (€)",

},

 badgeUnlocked: {
    titleSingle: "Erfolg freigeschaltet!",
    titleMultiple: "Neue Erfolge freigeschaltet!",
    descriptionSingle: "Du hast ein neues Abzeichen freigeschaltet!",
    descriptionMultiple: "Du hast neue Abzeichen freigeschaltet!",
    close: "Schliessen",
  },

createGroupModal: {
    createGroup: "Neue Gruppe erstellen",
    createGroupDescription: "Richte deine Gruppe ein, um soziale GeldBussen unter Mitgliedern zu verwalten",
    groupName: "Gruppenname",
    groupNamePlaceholder: "z. B.: Mitbewohner",
groupDescription: "Beschreibung",
    groupDescriptionPlaceholder: "Beschreibe kurz den Zweck der Gruppe",
    uploadAvatar: "Avatar hochladen",
    cancel: "Abbrechen",
    createGroupButton: "Gruppe erstellen",
    errorNoName: "Der Gruppenname ist erforderlich",
    errorNoQR: "Du musst den Bizum-QR-Code für den Modus „Admin bezahlt“ angeben",
    toastSuccess: "Gruppe erfolgreich erstellt!",
    toastSuccessDesc: "Die Gruppe „{groupName}“ wurde erfolgreich erstellt.",
  },

paymentModal: {
  title: "Busse bezahlen",
description: "Kopiere die Nummer des Absenders und verwende sie zum Bezahlen mit Bizum",
  fine: "Busse",
  amount: "Betrag",
  sender: "Absender",
  reason: "Grund",
scanQR: "Bizum-Nummer",
  useNumber: "Kopiere die Nummer",
  copyNumber: "Nummer kopieren",
  copied: "Kopiert",
  markAsPaid: "Als bezahlt markieren",
  processing: "Verarbeite...",
  paid: "Bezahlung bestätigt!",
  close: "Schliessen",
  noBizumNumber: "Der Absender hat seine Bizum-Nummer nicht hinterlegt",
  you:"du",
},


  installApp: {
    iosTitle: "App auf iOS installieren",
    iosIntro: "Installiere die Website als App auf deinem iPhone oder iPad für schnelleren Zugriff.",
    iosStep1: "Öffne Safari und gehe auf diese Website.",
    iosStep2: "Tippe auf den Teilen-Button.",
    iosShareDesc: "Das ist das Symbol mit dem Quadrat und dem Pfeil nach oben unten in der Leiste.",
    iosStep3: "Wähle 'Zum Home-Bildschirm hinzufügen'.",
    iosStep4: "Bestätige mit 'Hinzufügen' oben rechts.",
    iosDone: "Fertig! Jetzt kannst du die App direkt vom Home-Bildschirm aus öffnen."
  },

  share: {
    title: "Teile Tiko",
    description: "Teile diese Website mit deinen Freunden oder deiner Familie:",
    copy: "Link kopieren",
    copied: "Kopiert!",
    close: "Schliessen",
    button: "App teilen",
    buttonDesc: "Teile Tiko mit deinen Freunden",
    intro: "Teile die App mit deinen Freunden:",
    share: "Senden...",
    text: "Probier diese App aus!"
  },

  banner: {
    title: "Möchtest du die App für den Schnellzugriff installieren?",
    install: "Installieren",
    close: "Schliessen",
showInstallBanner: "Für die Installation auf iOS: Tippe auf „Teilen“ 📤 und wähle „Zum Home-Bildschirm hinzufügen“ aus.",
    phoneWarning: "Füge deine Telefonnummer hinzu, um Zahlungen mit Bizum zu erhalten. KEINE SORGE! Nur derjenige, der deine Busse erhält, kann sie sehen.",
    phoneWarningButton: "Nummer hinzufügen",
  },

  welcome: {
  title: "Willkommen bei Tiko",
  subtitle1: "Ihre Fehler – dein Gewinn",
  description: "Erstellt eure Gruppe, legt eure Regeln fest, startet Herausforderungen… und keiner entkommt! Wer sich nicht an die Regeln hält, muss zahlen!",
  login: "Einloggen",
  newUser: "Neuer Benutzer",
},

onboard: {
  whatIsTiko: "Was ist Tiko?",
  whatIsTikoDescription: "Tiko ist die App, die das Zusammenleben in ein Spiel verwandelt, bei dem gewinnt, wer die Regeln einhält und durchsetzt.",
  createGroups: "Gruppen und Regeln erstellen",
  createGroupsDescription: "Erstelle eine Gruppe mit deinem Partner, Freunden, Mitbewohnern oder Kollegen und definiert eure eigenen Regeln (Keine Haare in der Dusche, Kein Unterbrechen in Meetings...) und wenn sich jemand nicht daran hält, zahlt er!",
  challengeTitle: "Fordere deine Kontakte heraus",
  challengeDefinition: "Erstelle Herausforderungen und verbessere Gewohnheiten auf spielerische Weise (eine Woche ohne Zucker, die nächste Prüfung bestehen oder ins Fitnessstudio gehen). Wer es nicht schafft, zahlt. Zusammenleben, Gewohnheiten verbessern, XP sammeln.",
  payAndLevelUp: "Zusammenleben & gewinnen",
  payAndLevelUpDescription: "Das Ziel von Tiko ist, das Zusammenleben zu verbessern, als Team zu spielen, Gewohnheiten zu verbessern und Spass zu haben, während du zum PERFEKTEN PARTNER wirst.",
  back: "Zurück",
  next: "Weiter",
  createAccount: "Konto erstellen",
},

  // Index Page
  index: {
    hola: "Hallo",
    level: "Level",
    noinsignias: "Keine Abzeichen",
    lastFineRecived: "Letzte erhaltene Busse",
    pendent: "Ausstehend",
    pendents: "Ausstehende",
    de: "Von",
    payed: "Bezahlt",
    congrats: "Glückwunsch!",
    noPendentFines: "Keine ausstehenden Bussen",
    continueLikeThis: "Mach weiter so!",
    quickActions: "Schnellaktionen",
    quickQuickActionsDescription: "Verwalte deine Bussen effizient",
    recivedFines: "Erhaltene Bussen",
    recentRecivedFines: "Kürzlich erhaltene Bussen",
    noRecivedFines: "Keine Bussen erhalten",
    seeAllRecivedFines: "Alle erhaltenen Bussen ansehen",
    recentInsignias: "Neueste Abzeichen",
    recentHitos: "Deine neuesten Erfolge",
    seeAllInsignias: "Alle Abzeichen anzeigen",
    pendingFinesTitle:"Multas pendientes",
    seeAllPendingFines:"Ver todas las multas pendientes",
    subtitle: "Fang an Gerechtigkeit zu verteilen!",
  },

  // Contacts Page
  contacts: {
    error: "Fehler",
    errorDescription: "Der ausgewählte Kontakt ist kein registrierter Benutzer. Die Busse kann nicht gesendet werden.",
    deletedContactConfirmed: "Kontakt wurde erfolgreich gelöscht.",
    contactSearchPlaceholder: "Kontakt nach Name oder E-Mail suchen",
    loading: "Lädt...",
    addedContactConfirmed: "Kontakt erfolgreich hinzugefügt",
    titleFineModalPage: "Neue Busse erstellen",
    challenge:"Challenge",
    statusActive:"Active",
    contactRequestSentTitle: "Anfrage gesendet",
contactRequestSent: "Die Kontaktanfrage wurde gesendet.",
contactRequestFailed: "Die Anfrage konnte nicht gesendet werden.",
confirmDeleteTitle: "Kontakt löschen?",
confirmDeleteDescription: "Bist du sicher, dass du diesen Kontakt löschen möchtest? Diese Aktion ist unwiderruflich.",
newContactRequestTitle: "Neue Kontaktanfrage",
newContactRequestBody: "{name} hat dir eine Kontaktanfrage gesendet.",
requestRejected: "Du hast die Kontaktanfrage abgelehnt.",

  },

  // Groups Page
  groups: {
    notIdentifiedUser: "Benutzer nicht erkannt",
    theGroup: "Die Gruppe",
    createdSuccessfully: "wurde erfolgreich erstellt",
    letTheGroup: "Du hast die Gruppe verlassen",
    groupDeleted: "Die Gruppe wurde gelöscht.",
    updatedGroup: "Gruppe erfolgreich aktualisiert",
    savedCorrectly: "Änderungen wurden erfolgreich gespeichert",
    deletedMember: "Mitglied entfernt",
    deletedMemberDescription: "Das Mitglied wurde aus der Gruppe entfernt",
    memberAdded: "Mitglied hinzugefügt",
    memberAddedDescription: "Neues Mitglied erfolgreich hinzugefügt",
    contactNotFounError: "Für dieses Mitglied wurde kein registrierter Kontakt gefunden.",
    groupNotFound: "Gruppe nicht gefunden",
    notDeterminedUser: "Benutzer zum BeBussen konnte nicht bestimmt werden.",
    createFineError: "Busse konnte nicht erstellt werden:",
    fineCreated: "Busse erfolgreich erstellt",
    fineSent: "Busse erfolgreich gesendet",
    rules: "Regeln",
    members: "Mitglieder",
    sendFine: "Busse senden",
    createGroupToStart: "Erstelle eine Gruppe, um zu beginnen",
    confirmDeleteTitle: "Gruppe löschen?",
confirmDeleteDescription: "Bist du sicher, dass du die Gruppe löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
edit: "Bearbeiten",
delete: "Löschen",
leave: "Gruppe verlassen",
showMembers: "Mitglieder anzeigen",


  },

  // History Page
  history: {
    newFineReceived: "Neue Busse erhalten!",
    newFineFrom: "Du hast eine neue Busse erhalten von",
    fineForAmount: "Busse über",
    correctlyPaid: "erfolgreich bezahlt",
    experienceUpdateError: "Fehler beim Aktualisieren der Erfahrung",
    xpUpdated: "Erfahrung erfolgreich aktualisiert",
    xpGained: "Erfahrungspunkte erhalten!",
    xpGainedDescription1: "Du hast",
    xpGainedDescription2: "XP für deine Aktion bekommen.",
    searchPlaceholder: "Bussen nach Name oder Beschreibung suchen", // Alemán

  },

  // Navigation & Actions
  nav: {
    notifications: "Benachrichtigungen",
    profile: "Mein Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    login: "Anmelden",
    register: "Registrieren",
    invite: "Freunde einladen",
    home: "Startseite",
  groups: "Gruppen",
  contacts: "Kontakte",
  fines: "Bussen",
  history: "Verlauf",
  language: "Sprache",

  },

  // Dashboard Stats
  stats: {
    pending: "Ausstehend",
    pendingFines: "Ausstehende Bussen",
    finesPending: "Bussen zu zahlen",
    issued: "Erstellt",
    issuedFines: "Erstellte Bussen",
    totalSent: "Insgesamt gesendet",
    received: "Erhalten",
    receivedFines: "Erhaltene Bussen",
    totalReceived: "Insgesamt erhalten"
  },

  // Quick Actions
  quickActions: {
    title: "Schnellaktionen",
    description: "Verwalte deine sozialen Bussen",
    newFine: "Neue Busse",
    contacts: "Kontakte",
    myQR: "Mein QR",
    history: "Verlauf",
    notifications: "Benachrichtigungen"
  },

  // Fines List
  fines: {
    title: "Meine Bussen",
    description: "Verwalte deine erhaltenen und gesendeten Bussen",
    from: "Von",
    to: "An",
    paid: "Bezahlt",
    pending: "Ausstehend",
    pay: "Bezahlen",
    payFine: "Busse bezahlen",
    finePaid: "Busse bezahlt!",
    noReceived: "Keine Bussen erhalten",
    noSent: "Noch keine Busse gesendet",
    phone: "Telefon",
received: "erhalten",
sent: "gesendet",
created: "erstellt",

  },

  // Create Fine Modal
  createFine: {
    title: "Neue Busse erstellen",
    description: "Erstelle eine soziale Busse für einen Freund oder ein Familienmitglied",
    reason: "Grund der Busse",
    reasonPlaceholder: "z.B.: Zu spät zum Abendessen, Brot vergessen...",
    amount: "Betrag (€)",
    amountPlaceholder: "25.00",
    recipientType: "Empfängertyp",
    contact: "Kontakt",
    email: "E-Mail",
    selectContact: "Kontakt auswählen",
    selectContactPlaceholder: "Kontakt auswählen",
    recipientEmail: "E-Mail des Empfängers",
    recipientEmailPlaceholder: "freund@beispiel.com",
    cancel: "Abbrechen",
    create: "Busse erstellen",
    created: "Busse erstellt!",
    sentTo: "Busse über {amount} € an {recipient} gesendet",
    seeAndManageContacts: "Kontakte anzeigen und verwalten",
    seeHistoryComplete: "Kompletten Verlauf anzeigen",
    manageGroups: "Gruppen verwalten",
    groups: "Gruppen",
    errors: {
      complete: "Bitte fülle alle Pflichtfelder aus",
      selectRecipient: "Bitte wähle einen Empfänger",
      validEmail: "Bitte gib eine gültige E-Mail ein"
    }
  },

  // Payment Modal
  payment: {
    title: "Busse bezahlen - {amount} €",
    description: "Bezahlen Sie Ihre Busse mit Bizum, indem Sie den QR-Code scannen oder die Nummer verwenden",
    details: "Strafdetails",
    reason: "Grund:",
    sender: "Absender:",
    amount: "Betrag:",
    options: "Bizum-Zahlungsoptionen",
    scanQR: "Mit der Bizum-App scannen",
    useNumber: "Oder Bizum-Nummer verwenden:",
    copied: "Kopiert",
    numberCopied: "Bizum-Nummer in die Zwischenablage kopiert",
    markPaid: "Als bezahlt markieren",
    processing: "Wird verarbeitet...",
    confirmed: "Zahlung bestätigt!"
  },

  // User Profile
  profile: {
    title: "Mein Profil",
    description: "Aktualisiere deine persönlichen Daten und konfiguriere Bizum als Zahlungsmethode",
    changePhoto: "Foto ändern",
    personalInfo: "Persönliche Informationen",
    fullName: "Vollständiger Name",
    userName: "Benutzername",
    phone: "Telefon",
    BizumConfig: "Bizum-Konfiguration",
    uploadQR: "Bizum-QR hochladen",
    uploadButton: "QR hochladen",
    qrDescription: "Dieser QR wird angezeigt, wenn dir jemand eine Busse zahlen soll",
    save: "Änderungen speichern",
    updated: "Profil aktualisiert",
    updateDescription: "Deine Daten wurden erfolgreich gespeichert",
    BizumUpload: "Bizum-QR",
    BizumUploadDescription: "QR-Upload-Funktion demnächst verfügbar",
    updatedProfile: "Profil aktualisiert",
    deleteAccountError: "Fehler beim Löschen des Kontos",
    deleteAccountDescription: "Konto konnte nicht gelöscht werden. Kontaktiere den Support.",
    accountDeleted: "Konto erfolgreich gelöscht",
    accountDeletedDescription: "Dein Konto und alle Daten wurden gelöscht.",
    goBack: "Zurück",
    noName: "Kein Name",
    editProfile: "Profil bearbeiten",
    accountManagement: "Kontoverwaltung",
    endSession: "Abmelden",
    deleteAccount: "Konto löschen",
    insignias: "Abzeichen",
    confirmDeleteAccount: "Konto löschen?",
    confirmDeleteAccountDescription: "Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, Bussen und der Verlauf werden dauerhaft gelöscht.",
    Cancel: "Abbrechen",
    deleteAccountButton: "Konto löschen",
    loadingBadges: "Lade Abzeichen...",
    noBadges: "Du hast noch keine Abzeichen",
  },

  // Auth
  auth: {
    login: "Anmelden",
    register: "Konto erstellen",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    fullName: "Vollständiger Name",
    loginButton: "Einloggen",
    registerButton: "Konto erstellen",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Noch kein Konto?",
    hasAccount: "Du hast schon ein Konto?",
    signUp: "Hier registrieren",
    signIn: "Hier anmelden",
    loginSuccess: "Willkommen zurück!",
    registerSuccess: "Konto erfolgreich erstellt!",
    errors: {
      emailRequired: "E-Mail ist erforderlich",
      passwordRequired: "Passwort ist erforderlich",
      passwordMatch: "Passwörter stimmen nicht überein",
      invalidEmail: "Ungültige E-Mail-Adresse",
      weakPassword: "Das Passwort muss mindestens 6 Zeichen haben"
    }
  },

  // Pages
  pages: {
    contacts: {
      title: "Kontakte",
      description: "Füge Kontakte hinzu und nutze sie, um Gruppen, Herausforderungen usw. zu erstellen.",
      addContact: "Kontakt hinzufügen",
      addContactButton: "Kontakt hinzufügen",
      noContacts: "Noch keine Kontakte",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      edit: "Bearbeiten",
      delete: "Löschen",
      fine: "Busse",
      save: "Speichern",
      cancel: "Abbrechen",
      editContact: "Kontakt bearbeiten",
      deleteContact: "Kontakt löschen",
      deleteConfirmation: "Bist du sicher, dass du diesen Kontakt löschen möchtest?",
      contactAdded: "Kontakt hinzugefügt",
      contactUpdated: "Kontakt aktualisiert",
      contactDeleted: "Kontakt gelöscht"
    },
    groups: {
      title: "Gruppen",
      description1: "Verwalte deine Gruppen",
      createGroup: "Gruppe erstellen",
      joinGroup: "Gruppe beitreten",
      noGroups: "Noch keine Gruppen",
      groupName: "Gruppenname",
      description: "Erstelle eine Gruppe, füge Mitglieder hinzu und legt eure Regeln fest.",
      members: "Mitglieder",
      admin: "Admin",
      member: "Mitglied",
      leave: "Verlassen",
      delete: "Löschen",
      invite: "Einladen",
      manage: "Verwalten",
      code: "Code",
      enterCode: "Gib den Gruppencode ein",
      join: "Beitreten",
      create: "Erstellen",
      groupCreated: "Gruppe erstellt",
      joinedGroup: "Du bist der Gruppe beigetreten",
      leftGroup: "Gruppe verlassen",
      groupDeleted: "Gruppe gelöscht"
    },
    settings: {
      title: "Einstellungen",
      description: "App konfigurieren",
      language: "Sprache",
      notifications: "Benachrichtigungen",
      privacy: "Datenschutz",
      about: "Über",
      version: "Version",
      enableNotifications: "Benachrichtigungen aktivieren",
      enableSounds: "Sounds aktivieren",
      privateProfile: "Privates Profil",
      dataExport: "Daten exportieren",
      deleteAccount: "Konto löschen",
      settingsSaved: "Einstellungen gespeichert"
    },
    myQR: {
      title: "Mein QR-Code",
      description: "Teile deinen QR-Code, um Bussen zu erhalten",
      downloadQR: "QR herunterladen",
      shareQR: "QR teilen"
    },
    history: {
      title: "Bussen",
      description: "Vollständiger Bussenverlauf",
      filter: "Filtern",
      all: "Alle",
      sent: "Gesendet",
      received: "Erhalten",
      paid: "Bezahlt",
      pending: "Ausstehend",
      noResults: "Keine Ergebnisse",
      noResultsDescription: "Keine Bussen für die ausgewählten Filter gefunden",
      viewAll: "Alle anzeigen",
      total: "Gesamt"
    },
    notifications: {
      title: "Benachrichtigungen",
      description: "Deine aktuellen Benachrichtigungen",
      markAllRead: "Alle als gelesen markieren",
      noNotifications: "Keine Benachrichtigungen",
      fine_received: "{{sender}} hat dir eine Busse von {{amount}} € für \"{{reason}}\" gesendet",
      fine_received_title: "Busse erhalten",
      payment_received: "{{sender}} hat deine Busse von {{amount}} € bezahlt",
      group_invite: "{{sender}} hat dich zur Gruppe \"{{group}}\" eingeladen",
      lessThanHour: "Vor weniger als 1 Stunde",
      hoursAgo: "Vor {hours} Stunden",
      daysAgo: "Vor {days} Tagen",
      marked: "Benachrichtigungen markiert",
      allRead: "Alle Benachrichtigungen wurden als gelesen markiert",
      emptyMessage: "Wenn du Benachrichtigungen hast, erscheinen sie hier",
      newRuleProposed: "Neue Regel vorgeschlagen",
    }
  },

  // Invite
  invite: {
    title: "Freunde einladen",
    description: "Lade deine Freunde ein, Tiko zu nutzen",
    shareText: "Wo Regelbruch dir Punkte bringt (solange du es nicht selbst bist 😏)",
    shareTextShort: "Tritt Tiko bei!",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    linkCopiedDescription: "Der Link wurde in die Zwischenablage kopiert",
    sendInvite: "Einladung senden",
    invitationLink: "Einladungslink",
    sendAskToContact: "Anfrage senden",

  },

  // Achievements
  achievements: {
    title: "Erfolg freigeschaltet!",
    close: "Schliessen",
    xpGained: "Erfahrungspunkte erhalten",
    levelUp: "Levelaufstieg!",
    newBadge: "Neues Abzeichen!"
  },


  tutorial: {
    header: {
      title: "So funktioniert DESWG",
      subtitle: "Kurzes Tutorial",
    },
    progress: {
      stepOfTotal: "Schritt {current} von {total}",
    },
    nav: {
      back: "Zurück",
      next: "Weiter",
      finish: "Fertig",
      skipTutorial: "Tutorial überspringen",
    },

    steps: {
      contact: {
        title: "Starte mit einem Kontakt",
        subtitle: "Füge zuerst einen Kontakt hinzu. Suche nach Benutzername oder E-Mail.",
        body: "Mit Kontakten kannst du Gruppen, Regeln, Bussen und Challenges erstellen.",
        note: "Du kannst Kontakte auf der Seite „Kontakte“ hinzufügen. Suche nach Benutzername oder E-Mail.",
      },

      group: {
        title: "Erstelle deine Gruppe",
        subtitle: "In Gruppen werden Regeln, Bussen usw. festgelegt.",
        body: "Nachdem du die Gruppe erstellt hast, bearbeite sie, um Mitglieder hinzuzufügen.",
        note: "Erstelle eine Gruppe auf der Seite „Gruppen“. Du kannst nur Mitglieder hinzufügen, die bereits in „Kontakte“ sind.",
      },

      rule: {
        title: "Füge Regeln zu deinen Gruppen hinzu",
        subtitle: "Starte simpel, damit es alle verstehen.",
        examples:
          "• „Müll nicht rausbringen“ — CHF 1\n• „Zu spät kommen“ — CHF 2",
        note: "Gruppenregeln müssen von allen Mitgliedern akzeptiert werden, bevor sie gültig sind. Du kannst Regeln jederzeit bearbeiten oder löschen.",
      },

      action: {
        title: "Sende eine Busse oder eine Challenge",
        subtitle: "1. Über die Navigationsleiste '+'.\n 2. Über die Gruppen.",
        tips:
          "• Über die Navigationsleiste '+': Kontakt auswählen und senden (Busse / Challenge).\n\n• In der Gruppe: Tippe auf den Namen des Mitglieds, um eine Busse zu senden, die den Gruppennamen anzeigt.\n",
note: "• Busse: wird bei Regelverstoss versendet.\n • Challenge: zeitlich begrenzte Herausforderungen, vorgeschlagen an einen oder mehrere Kontakte."
      },

      phoneShare: {
        title: "Zahlungen mit Bizum aktivieren",
        description: "Um Zahlungen via Bizum zu erhalten, füge deine Telefonnummer hinzu. KEINE SORGE! Nur die von dir gebüsste Person sieht sie.",
        addPhone: "Telefonnummer hinzufügen",
        skipNow: "Jetzt überspringen",
        shareApp: "App teilen / Einladen",
        phoneLabel: "Deine Nummer (Bizum)",
        phonePlaceholder: "+41 79 123 45 67",
        saving: "Speichern...",
        saved: "Telefonnummer gespeichert",
      },

      install: {
        title: "App installieren",
        title2: "Erhalte Mitteilungen und öffne DESWG mit einem Tipp",
        installed: "Die App ist bereits installiert ✅",
        installButton: "Installieren",
        instructionsSafari: "In Safari: Tippe auf das Teilen-Symbol (📤) und wähle „Zum Home-Bildschirm hinzufügen“.",
        note: "Web-Apps sind sicher und funktionieren wie eine Verknüpfung zur Website, ohne Speicher auf deinem Telefon zu belegen.",
      },
    },
  },



  // Common
  common: {
    goHome: "Startseite",
    currency: "€",
    required: "*",
    ok: "OK",
    cancel: "Abbrechen",
    save: "Speichern",
    close: "Schliessen",
    edit: "Bearbeiten",
    delete: "Löschen",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",
    back: "Zurück",
    next: "Weiter",
    previous: "Zurück",
    search: "Suchen",
    filter: "Filtern",
    sort: "Sortieren",
    download: "Herunterladen",
    share: "Teilen",
    total: "Gesamt",
  },

  modal: {
    close: "Schliessen",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    delete: "Löschen",
    save: "Speichern",
    edit: "Bearbeiten",
    create: "Erstellen",
    update: "Aktualisieren",
    add: "Hinzufügen",
    addMember: "Mitglied zur Gruppe hinzufügen",
    searchContactToAdd: "Suche einen Kontakt zum Hinzufügen",
    noContactsFound: "Keine Kontakte gefunden",
    startWriteToFind: "Beginne zu tippen, um Kontakte zu suchen",
    searchNameOrEmail: "Suche nach Name oder E-Mail",
    searching: "Suche...",
    errorSelectUser: "Du musst einen bestehenden Nutzer auswählen.",
    editGroup: "Gruppe bearbeiten",
    editGroupDescription: "Verwalte Informationen und Mitglieder deiner Gruppe.",
    generalTab: "Allgemein",
    avatarTab: "Bild",
    membersTab: "Mitglieder",
    groupName: "Gruppenname",
    description: "Beschreibung",
    avatarLabel: "Gruppenbild",
    changeAvatarTitle: "Klicke, um das Bild zu ändern",
    changeAvatar: "Bild ändern",
    uploading: "Wird hochgeladen...",
    avatarHelpAdmin: "(Nur der Admin kann das Bild ändern. Klicke oder verwende die Schaltfläche, um ein neues Foto hochzuladen.)",
    avatarHelpUser: "Nur der Admin kann das Gruppenbild ändern.",
    uploadSuccess: "Bild erfolgreich hochgeladen. Nicht vergessen zu speichern!",
    currentMembers: "Aktuelle Mitglieder:",
    adminLabel: "Admin",
    removeMemberTitle: "Aus der Gruppe entfernen",
    saveChanges: "Änderungen speichern",
    addTelephoneNumber: "Gib deine Telefonnummer für Bizum ein",
placeholderPhone: "Z.B.: +34 oder 612345678",
errorPhone: "Gib eine gültige Nummer ein (+34 oder 612345678)."
  }
};
export default de;
