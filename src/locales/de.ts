
export const de = {
  // Header
  app: {
    name: "Oopsie",
    subtitle: "Unter Freunden"
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
    pendingFines: "Ausstehende Bussen",
    finesPending: "Bussen zu zahlen",
    issued: "Ausgestellt",
    issuedFines: "Ausgestellte Bussen",
    totalSent: "Gesamt gesendet",
    received: "Erhalten",
    receivedFines: "Erhaltene Bussen",
    totalReceived: "Gesamt erhalten"
  },
  
  // Quick Actions
  quickActions: {
    title: "Schnellaktionen",
    description: "Verwalten Sie Ihre sozialen Bussen",
    newFine: "Neue Busse",
    contacts: "Kontakte",
    myQR: "Mein QR",
    history: "Verlauf",
    notifications: "Benachrichtigungen"
  },
  
  // Fines List
  fines: {
    title: "Meine Bussen",
    description: "Verwalten Sie Ihre erhaltenen und gesendeten Bussen",
    from: "Von",
    to: "An",
    paid: "Bezahlt",
    pending: "Ausstehend",
    pay: "Zahlen",
    payFine: "Busse zahlen",
    finePaid: "Busse bezahlt!",
    noReceived: "Sie haben keine erhaltenen Bussen",
    noSent: "Sie haben noch keine Bussen gesendet",
    phone: "Teléfono"
  },
  
  // Create Fine Modal
  createFine: {
    title: "Neue Busse erstellen",
    description: "Erstellen Sie eine soziale Busse für einen Freund oder Familienangehoerigen",
    reason: "Grund der Busse",
    reasonPlaceholder: "Z.B.: Zu spaet zum Abendessen, Brot vergessen zu kaufen...",
    amount: "Betrag (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Empfaengertyp",
    contact: "Kontakt",
    email: "E-Mail",
    selectContact: "Kontakt auswaehlen",
    selectContactPlaceholder: "Waehlen Sie einen Kontakt",
    recipientEmail: "Empfaenger E-Mail",
    recipientEmailPlaceholder: "freund@example.com",
    cancel: "Abbrechen",
    create: "Busse erstellen",
    created: "Busse erstellt!",
    sentTo: "{amount} CHF Busse an {recipient} gesendet",
    errors: {
      complete: "Bitte fuellen Sie alle Pflichtfelder aus",
      selectRecipient: "Bitte waehlen Sie einen Empfaenger",
      validEmail: "Bitte geben Sie eine gueltige E-Mail ein"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Busse zahlen - {amount} CHF",
    description: "Zahlen Sie Ihre Busse mit TWINT durch Scannen des QR-Codes oder mit der Nummer",
    details: "Bussendetails",
    reason: "Grund:",
    sender: "Absender:",
    amount: "Betrag:",
    options: "TWINT-Zahlungsoptionen",
    scanQR: "Mit Ihrer TWINT-App scannen",
    useNumber: "Oder verwenden Sie die TWINT-Nummer:",
    copied: "Kopiert",
    numberCopied: "TWINT-Nummer in die Zwischenablage kopiert",
    markPaid: "Als bezahlt markieren",
    processing: "Verarbeitung...",
    confirmed: "Zahlung bestaetigt!"
  },
  
  // User Profile
  profile: {
    title: "Mein Profil",
    description: "Aktualisieren Sie Ihre persoenlichen Daten und konfigurieren Sie Ihre TWINT-Zahlungsmethode",
    changePhoto: "Foto aendern",
    personalInfo: "Persoenliche Informationen",
    fullName: "Vollstaendiger Name",
    phone: "Telefon",
    twintConfig: "TWINT-Konfiguration",
    uploadQR: "Laden Sie Ihren TWINT QR-Code hoch",
    uploadButton: "QR hochladen",
    qrDescription: "Dieser QR wird angezeigt, wenn Ihnen jemand eine Busse zahlen muss",
    save: "Aenderungen speichern",
    updated: "Profil aktualisiert",
    updateDescription: "Ihre Daten wurden erfolgreich gespeichert",
    twintUpload: "TWINT QR",
    twintUploadDescription: "QR-Upload-Funktion kommt bald"
  },
  
  // Auth
  auth: {
    login: "Anmelden",
    register: "Konto erstellen",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestaetigen",
    fullName: "Vollstaendiger Name",
    loginButton: "Anmelden",
    registerButton: "Konto erstellen",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Haben Sie kein Konto?",
    hasAccount: "Haben Sie bereits ein Konto?",
    signUp: "Hier registrieren",
    signIn: "Hier anmelden",
    loginSuccess: "Willkommen zurueck!",
    registerSuccess: "Konto erfolgreich erstellt!",
    errors: {
      emailRequired: "E-Mail ist erforderlich",
      passwordRequired: "Passwort ist erforderlich",
      passwordMatch: "Passwoerter stimmen nicht ueberein",
      invalidEmail: "Ungueltige E-Mail",
      weakPassword: "Passwort muss mindestens 6 Zeichen haben"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Kontakte",
      description: "Verwalten Sie Ihre Kontaktliste",
      addContact: "Kontakt hinzufuegen",
      noContacts: "Sie haben noch keine Kontakte"
    },
    myQR: {
      title: "Mein QR-Code",
      description: "Teilen Sie Ihren QR-Code, um Bussen zu erhalten",
      downloadQR: "QR herunterladen",
      shareQR: "QR teilen"
    },
    history: {
      title: "Verlauf",
      description: "Vollstaendiger Verlauf der Bussen",
      filter: "Filtern",
      all: "Alle",
      sent: "Gesendet",
      received: "Erhalten",
      paid: "Bezahlt",
      pending: "Ausstehend"
    },
    notifications: {
      title: "Benachrichtigungen",
      description: "Deine neuesten Benachrichtigungen",
      markAllRead: "Alle als gelesen markieren",
      noNotifications: "Du hast keine Benachrichtigungen",
      fine_received: "{{sender}} hat dir eine Strafe von {{amount}} CHF wegen „{{reason}}“ geschickt",
      payment_received: "{{sender}} hat deine Strafe von {{amount}} CHF bezahlt",
      group_invite: "{{sender}} hat dich in die Gruppe „{{group}}“ eingeladen",
      lessThanHour: "Vor weniger als 1 Stunde",
      hoursAgo: "Vor {hours} Stunden",
      daysAgo: "Vor {days} Tagen",
      marked: "Benachrichtigungen markiert",
      allRead: "Alle Benachrichtigungen wurden als gelesen markiert",
      emptyMessage: "Wenn du Benachrichtigungen hast, erscheinen sie hier"
    }
  },
  
  // Invite
  invite: {
    title: "Freunde einladen",
    description: "Laden Sie Ihre Freunde ein, Oopsie zu verwenden",
    shareText: "Schliessen Sie sich Oopsie an und verwalten Sie soziale Bussen unter Freunden! 🎉",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    sendInvite: "Einladung senden"
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
    delete: "Loeschen",
    loading: "Laden...",
    error: "Fehler",
    success: "Erfolg",
    back: "Zurueck",
    next: "Weiter",
    previous: "Vorherige",
    search: "Suchen",
    filter: "Filtern",
    sort: "Sortieren",
    download: "Herunterladen",
    share: "Teilen"  
  }
};
