
export const fr = {
  // Header
  app: {
    name: "Oopsie",
    subtitle: "Entre amis"
  },
  
  // Navigation & Actions
  nav: {
    notifications: "Notifications",
    profile: "Mon Profil",
    settings: "Paramètres",
    logout: "Se déconnecter",
    login: "Se connecter",
    register: "S'inscrire",
    invite: "Inviter des amis"
  },
  
  // Dashboard Stats
  stats: {
    pending: "En attente",
    pendingFines: "Amendes en attente",
    finesPending: "amendes à payer",
    issued: "Émises",
    issuedFines: "Amendes émises",
    totalSent: "Total envoyées",
    received: "Reçues",
    receivedFines: "Amendes reçues",
    totalReceived: "Total reçues"
  },
  
  // Quick Actions
  quickActions: {
    title: "Actions rapides",
    description: "Gérez vos amendes sociales",
    newFine: "Nouvelle amende",
    contacts: "Contacts",
    myQR: "Mon QR",
    history: "Historique",
    notifications: "Notifications"
  },
  
  // Fines List
  fines: {
    title: "Mes amendes",
    description: "Gérez vos amendes reçues et envoyées",
    from: "De",
    to: "À",
    paid: "Payée",
    pending: "En attente",
    pay: "Payer",
    payFine: "Payer l'amende",
    finePaid: "Amende payée !",
    noReceived: "Vous n'avez pas d'amendes reçues",
    noSent: "Vous n'avez pas encore envoyé d'amendes",
    phone: "Teléfono"
  },
  
  // Create Fine Modal
  createFine: {
    title: "Créer une nouvelle amende",
    description: "Créez une amende sociale à envoyer à un ami ou un membre de la famille",
    reason: "Motif de l'amende",
    reasonPlaceholder: "Ex: Être en retard pour le dîner, oublier d'acheter le pain...",
    amount: "Montant (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Type de destinataire",
    contact: "Contact",
    email: "E-mail",
    selectContact: "Sélectionner un contact",
    selectContactPlaceholder: "Sélectionnez un contact",
    recipientEmail: "E-mail du destinataire",
    recipientEmailPlaceholder: "ami@example.com",
    cancel: "Annuler",
    create: "Créer l'amende",
    created: "Amende créée !",
    sentTo: "Amende de {amount} CHF envoyée à {recipient}",
    errors: {
      complete: "Veuillez compléter tous les champs obligatoires",
      selectRecipient: "Veuillez sélectionner un destinataire",
      validEmail: "Veuillez saisir un e-mail valide"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Payer l'amende - {amount} CHF",
    description: "Payez votre amende avec TWINT en scannant le code QR ou en utilisant le numéro",
    details: "Détails de l'amende",
    reason: "Motif :",
    sender: "Expéditeur :",
    amount: "Montant :",
    options: "Options de paiement TWINT",
    scanQR: "Scannez avec votre app TWINT",
    useNumber: "Ou utilisez le numéro TWINT :",
    copied: "Copié",
    numberCopied: "Numéro TWINT copié dans le presse-papiers",
    markPaid: "Marquer comme payée",
    processing: "Traitement...",
    confirmed: "Paiement confirmé !"
  },
  
  // User Profile
  profile: {
    title: "Mon profil",
    description: "Mettez à jour vos informations personnelles et configurez votre méthode de paiement TWINT",
    changePhoto: "Changer la photo",
    personalInfo: "Informations personnelles",
    fullName: "Nom complet",
    phone: "Téléphone",
    twintConfig: "Configuration TWINT",
    uploadQR: "Téléchargez votre code QR TWINT",
    uploadButton: "Télécharger QR",
    qrDescription: "Ce QR sera affiché quand quelqu'un doit vous payer une amende",
    save: "Sauvegarder les modifications",
    updated: "Profil mis à jour",
    updateDescription: "Vos données ont été sauvegardées avec succès",
    twintUpload: "QR TWINT",
    twintUploadDescription: "Fonction de téléchargement QR bientôt disponible"
  },
  
  // Auth
  auth: {
    login: "Se connecter",
    register: "Créer un compte",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    loginButton: "Se connecter",
    registerButton: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Vous n'avez pas de compte ?",
    hasAccount: "Vous avez déjà un compte ?",
    signUp: "Inscrivez-vous ici",
    signIn: "Connectez-vous ici",
    loginSuccess: "Bon retour !",
    registerSuccess: "Compte créé avec succès !",
    errors: {
      emailRequired: "L'e-mail est requis",
      passwordRequired: "Le mot de passe est requis",
      passwordMatch: "Les mots de passe ne correspondent pas",
      invalidEmail: "E-mail invalide",
      weakPassword: "Le mot de passe doit contenir au moins 6 caractères"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Contacts",
      description: "Gérez votre liste de contacts",
      addContact: "Ajouter un contact",
      noContacts: "Vous n'avez pas encore de contacts"
    },
    myQR: {
      title: "Mon code QR",
      description: "Partagez votre code QR pour recevoir des amendes",
      downloadQR: "Télécharger QR",
      shareQR: "Partager QR"
    },
    history: {
      title: "Historique",
      description: "Historique complet des amendes",
      filter: "Filtrer",
      all: "Toutes",
      sent: "Envoyées",
      received: "Reçues",
      paid: "Payées",
      pending: "En attente"
    },
    notifications: {
      title: "Notifications",
      description: "Vos notifications récentes",
      markAllRead: "Marquer toutes comme lues",
      noNotifications: "Vous n'avez pas de notifications",
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
    title: "Inviter des amis",
    description: "Invitez vos amis à utiliser Oopsie",
    shareText: "Rejoignez Oopsie et gérez les amendes sociales entre amis ! 🎉",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié !",
    sendInvite: "Envoyer une invitation"
  },
  
  // Common
  common: {
    currency: "CHF",
    required: "*",
    ok: "OK",
    cancel: "Annuler",
    save: "Sauvegarder",
    close: "Fermer",
    edit: "Modifier",
    delete: "Supprimer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent", 
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    download: "Télécharger",
    share: "Partager"
  }
};
