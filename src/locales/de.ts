import { Cancel } from "@radix-ui/react-alert-dialog";
import { error } from "console";

export const de = {
  // Header
  app: {
    name: "Pic",
    subtitle: "Unter Freunden"
  },

  // Index Page
  index: {
    hola: "Hallo",
    level: "Level",
    noinsignias: "Keine Abzeichen",
    lastFineRecived: "Letzte erhaltene Strafe",
    pendent: "Ausstehend",
    pendents: "Ausstehend",
    de: "Von",
    payed: "Bezahlt",
    congrats: "Glückwunsch!",
    noPendentFines: "Du hast keine ausstehenden Strafen",
    continueLikeThis: "Mach weiter so!",
    quickActions: "Schnellaktionen",
    quickQuickActionsDescription: "Verwalte deine Strafen effizient",
    recivedFines: "Erhaltene Strafen",
    recentRecivedFines: "Kürzlich erhaltene Strafen",
    noRecivedFines: "Du hast keine Strafen erhalten",
    seeAllRecivedFines: "Alle erhaltenen Strafen ansehen",
    recentInsignias: "Kürzliche Abzeichen",
    recentHitos: "Deine neuesten Erfolge",
    seeAllInsignias: "Alle Abzeichen ansehen",
  },

  // Contacts Page
  contacts: {
    error: "Fehler",
    errorDescription: "Der ausgewählte Kontakt ist nicht als Benutzer registriert. Die Strafe kann nicht gesendet werden.",
    deletedContactConfirmed: "Kontakt erfolgreich gelöscht.",
    contactSearchPlaceholder: "Kontakt nach Name oder E-Mail suchen",
    loading: "Lädt...",
    addedContactConfirmed: "Kontakt erfolgreich hinzugefügt",
  },

  // Groups Page
  groups: {
    notIdentifiedUser: "Benutzer nicht identifiziert",
    theGroup: "Die Gruppe",
    createdSuccessfully: "wurde erfolgreich erstellt",
    letTheGroup: "Du hast die Gruppe verlassen",
    groupDeleted: "Die Gruppe wurde gelöscht.",
    updatedGroup: "Gruppe erfolgreich aktualisiert",
    savedCorrectly: "Änderungen wurden erfolgreich gespeichert",
    deletedMember: "Mitglied entfernt",
    deletedMemberDescription: "Der Benutzer wurde aus der Gruppe entfernt",
    memberAdded: "Mitglied hinzugefügt",
    memberAddedDescription: "Das neue Mitglied wurde erfolgreich hinzugefügt",
    contactNotFounError: "Für dieses Mitglied wurde kein registrierter Kontakt gefunden.",
    groupNotFound: "Gruppe nicht gefunden",
    notDeterminedUser: "Zu bestrafenden Benutzer konnte nicht ermittelt werden.",
    createFineError: "Strafe konnte nicht erstellt werden:",
    fineCreated: "Strafe erfolgreich erstellt",
    fineSent: "Strafe erfolgreich gesendet",
    rules: "Regeln",
    members: "Mitglieder",
    sendFine: "Strafe senden",
    createGroupToStart: "Erstelle eine Gruppe, um Strafen unter Freunden zu verwalten",
  },

  // History Page
  history: {
    newFineReceived: "Neue Strafe erhalten!",
    newFineFrom: "Du hast eine neue Strafe erhalten von",
    fineForAmount: "Strafe über",
    correctlyPaid: "erfolgreich bezahlt",
    experienceUpdateError: "Fehler beim Aktualisieren der Benutzererfahrung",
    xpUpdated: "Erfahrung erfolgreich aktualisiert",
    xpGained: "Du hast Erfahrungspunkte erhalten!",
    xpGainedDescription1: "Du hast",
    xpGainedDescription2: "EP für deine Aktion erhalten.",
  },

  // Navigation & Actions
  nav: {
    notifications: "Benachrichtigungen",
    profile: "Mein Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    login: "Anmelden",
    register: "Registrieren",
    invite: "Freunde einladen"
  },

  // Dashboard Stats
  stats: {
    pending: "Ausstehend",
    pendingFines: "Ausstehende Strafen",
    finesPending: "Strafen zu zahlen",
    issued: "Ausgestellt",
    issuedFines: "Ausgestellte Strafen",
    totalSent: "Insgesamt gesendet",
    received: "Erhalten",
    receivedFines: "Erhaltene Strafen",
    totalReceived: "Insgesamt erhalten"
  },

  // Quick Actions
  quickActions: {
    title: "Schnellaktionen",
    description: "Verwalte deine sozialen Strafen",
    newFine: "Neue Strafe",
    contacts: "Kontakte",
    myQR: "Mein QR",
    history: "Verlauf",
    notifications: "Benachrichtigungen"
  },

  // Fines List
  fines: {
    title: "Meine Strafen",
    description: "Verwalte deine erhaltenen und gesendeten Strafen",
    from: "Von",
    to: "An",
    paid: "Bezahlt",
    pending: "Ausstehend",
    pay: "Bezahlen",
    payFine: "Strafe bezahlen",
    finePaid: "Strafe bezahlt!",
    noReceived: "Du hast keine erhaltenen Strafen",
    noSent: "Du hast noch keine Strafen gesendet",
    phone: "Telefon"
  },

  // Create Fine Modal
  createFine: {
    title: "Neue Strafe erstellen",
    description: "Erstelle eine soziale Strafe für einen Freund oder ein Familienmitglied",
    reason: "Grund der Strafe",
    reasonPlaceholder: "Z.B.: Zu spät zum Abendessen, Brot vergessen zu kaufen...",
    amount: "Betrag (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Empfängertyp",
    contact: "Kontakt",
    email: "E-Mail",
    selectContact: "Kontakt auswählen",
    selectContactPlaceholder: "Wähle einen Kontakt aus",
    recipientEmail: "Empfänger-E-Mail",
    recipientEmailPlaceholder: "freund@beispiel.com",
    cancel: "Abbrechen",
    create: "Strafe erstellen",
    created: "Strafe erstellt!",
    sentTo: "{amount} CHF Strafe an {recipient} gesendet",
    seeAndManageContacts: "Kontakte anzeigen und verwalten",
    seeHistoryComplete: "Kompletten Verlauf anzeigen",
    manageGroups: "Gruppen verwalten",
    groups: "Gruppen",
    errors: {
      complete: "Bitte alle erforderlichen Felder ausfüllen",
      selectRecipient: "Bitte wähle einen Empfänger aus",
      validEmail: "Bitte eine gültige E-Mail-Adresse eingeben"
    }
  },

  // Payment Modal
  payment: {
    title: "Strafe bezahlen - {amount} CHF",
    description: "Bezahlen Sie Ihre Strafe mit TWINT, indem Sie den QR-Code scannen oder die Nummer verwenden",
    details: "Strafdetails",
    reason: "Grund:",
    sender: "Absender:",
    amount: "Betrag:",
    options: "TWINT-Zahlungsoptionen",
    scanQR: "Mit der TWINT-App scannen",
    useNumber: "Oder benutze die TWINT-Nummer:",
    copied: "Kopiert",
    numberCopied: "TWINT-Nummer in die Zwischenablage kopiert",
    markPaid: "Als bezahlt markieren",
    processing: "Verarbeite...",
    confirmed: "Bezahlung bestätigt!"
  },

  // User Profile
  profile: {
    title: "Mein Profil",
    description: "Aktualisiere deine persönlichen Daten und konfiguriere deine TWINT-Zahlungsmethode",
    changePhoto: "Foto ändern",
    personalInfo: "Persönliche Informationen",
    fullName: "Vollständiger Name",
    phone: "Telefon",
    twintConfig: "TWINT-Konfiguration",
    uploadQR: "TWINT-QR-Code hochladen",
    uploadButton: "QR hochladen",
    qrDescription: "Dieser QR wird angezeigt, wenn dir jemand eine Strafe bezahlen muss",
    save: "Änderungen speichern",
    updated: "Profil aktualisiert",
    updateDescription: "Deine Daten wurden erfolgreich gespeichert",
    twintUpload: "TWINT-QR",
    twintUploadDescription: "QR-Upload-Funktion kommt bald",
    updatedProfile: "Profil aktualisiert",
    deleteAccountError: "Fehler beim Löschen des Kontos",
    deleteAccountDescription: "Das Konto konnte nicht gelöscht werden. Kontaktiere den Support.",
    accountDeleted: "Konto erfolgreich gelöscht",
    accountDeletedDescription: "Dein Konto und alle deine Daten wurden erfolgreich gelöscht.",
    goBack: "Zurück",
    noName: "Kein Name",
    editProfile: "Profil bearbeiten",
    accountManagement: "Konto verwalten",
    endSession: "Abmelden",
    deleteAccount: "Konto löschen",
    insignias: "Abzeichen",
    confirmDeleteAccount: "Konto löschen?",
    confirmDeleteAccountDescription: "Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, Strafen und der Verlauf werden dauerhaft gelöscht.",
    Cancel: "Abbrechen",
    deleteAccountButton: "Konto löschen",
  },

  // Auth
  auth: {
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    fullName: "Vollständiger Name",
    loginButton: "Anmelden",
    registerButton: "Registrieren",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Noch kein Konto?",
    hasAccount: "Du hast bereits ein Konto?",
    signUp: "Hier registrieren",
    signIn: "Hier anmelden",
    loginSuccess: "Willkommen zurück!",
    registerSuccess: "Konto erfolgreich erstellt!",
    errors: {
      emailRequired: "E-Mail ist erforderlich",
      passwordRequired: "Passwort ist erforderlich",
      passwordMatch: "Passwörter stimmen nicht überein",
      invalidEmail: "Ungültige E-Mail",
      weakPassword: "Das Passwort muss mindestens 6 Zeichen lang sein"
    }
  },

  // Pages
  pages: {
    contacts: {
      title: "Kontakte",
      description: "Verwalte deine Kontaktliste",
      addContact: "Kontakt hinzufügen",
      addContactButton: "Kontakt hinzufügen",
      noContacts: "Du hast noch keine Kontakte",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      edit: "Bearbeiten",
      delete: "Löschen",
      fine: "Strafe",
      save: "Speichern",
      cancel: "Abbrechen",
      editContact: "Kontakt bearbeiten",
      deleteContact: "Kontakt löschen",
      deleteConfirmation: "Möchtest du diesen Kontakt wirklich löschen?",
      contactAdded: "Kontakt hinzugefügt",
      contactUpdated: "Kontakt aktualisiert",
      contactDeleted: "Kontakt gelöscht"
    },
    groups: {
      title: "Gruppen",
      description1: "Verwalte deine Gruppen",
      createGroup: "Gruppe erstellen",
      joinGroup: "Gruppe beitreten",
      noGroups: "Du hast noch keine Gruppen",
      groupName: "Gruppenname",
      description: "Beschreibung",
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
      leftGroup: "Du hast die Gruppe verlassen",
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
      description: "Teile deinen QR-Code, um Strafen zu erhalten",
      downloadQR: "QR herunterladen",
      shareQR: "QR teilen"
    },
    history: {
      title: "Verlauf",
      description: "Kompletter Strafverlauf",
      filter: "Filtern",
      all: "Alle",
      sent: "Gesendet",
      received: "Erhalten",
      paid: "Bezahlt",
      pending: "Ausstehend",
      noResults: "Keine Ergebnisse",
      noResultsDescription: "Mit den ausgewählten Filtern wurden keine Strafen gefunden",
      viewAll: "Alles anzeigen",
      total: "Gesamt"
    },
    notifications: {
      title: "Benachrichtigungen",
      description: "Deine neuesten Benachrichtigungen",
      markAllRead: "Alle als gelesen markieren",
      noNotifications: "Du hast keine Benachrichtigungen",
      fine_received: "{{sender}} hat dir eine Strafe von {{amount}} CHF wegen \"{{reason}}\" geschickt",
      payment_received: "{{sender}} hat deine Strafe von {{amount}} CHF bezahlt",
      group_invite: "{{sender}} hat dich in die Gruppe \"{{group}}\" eingeladen",
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
    description: "Lade deine Freunde ein, Pic zu nutzen",
    shareText: "Komm zu Pic und verwalte soziale Strafen unter Freunden! 🎉",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    sendInvite: "Einladung senden"
  },

  // Achievements
  achievements: {
    title: "Erfolg freigeschaltet!",
    close: "Schliessen",
    xpGained: "Erfahrungspunkte erhalten",
    levelUp: "Level up!",
    newBadge: "Neues Abzeichen!"
  },

  // Common
  common: {
    currency: "CHF",
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
  }
};
