import { add } from "date-fns";

export const fr = {
  // Header
  app: {
    name: "Tiko",
    subtitle: "Entre amis",
    installApp: "Installer l'app",
    other: "Autres",
    installIosGuide: "Installer sur iOS",
  },
notifications: {
  // Modèles de notification
  fine_received: {
    title: "Amende reçue",
    icon: "💸",
    message: '{{sender}} vous a envoyé une amende de {{amount}} € pour "{{reason}}"',
  },
  challenge_created: {
    title: "Défi créé",
    icon: "🏆",
    message: "Vous avez créé un défi : {{challenge_title}}",
  },
  challenge_invited: {
    title: "Invitation à un défi",
    icon: "🎯",
    message: "{{sender}} vous a invité au défi : {{challenge_title}}",
  },
  payment_received: {
    title: "Paiement reçu",
    icon: "💰",
    message: "Vous avez reçu un paiement de {{amount}} €",
  },
  group_invite: {
    title: "Invitation à un groupe",
    icon: "👥",
    message: "Vous avez été invité dans un groupe",
  },
  group_rule_proposed: {
    title: "Nouvelle règle proposée",
    icon: "⏳",
    message: "{{rule_description}}",
  },
  group_rule_deletion_proposed: {
  title: "Proposition de suppression de règle",
  message: "La règle '{{rule}}' du groupe '{{group}}' a été proposée pour suppression.",
},
group_rule_deleted: {
  title: "Règle supprimée",
  message: "La règle '{{rule}}' a été supprimée du groupe '{{group}}'.",
},
contact_request_sent: {
  title: "Demande envoyée",
  message: "Vous avez envoyé une demande de contact à {{name}}.",
},
contact_request_received: {
  title: "Demande reçue",
  message: "{{name}} vous a envoyé une demande de contact.",
},
contact_request_accepted: {
  title: "Demande acceptée",
  message: "{{name}} a accepté votre demande de contact.",
},
contact_request_was_accepted: {
  title: "Demande acceptée",
  message: "Vous avez accepté la demande de contact de {{name}}.",
},



  // En-tête et actions
  title: "Notifications",
  description: "Vos notifications récentes",
  markAllRead: "Tout marquer comme lu",
  markReadMobile: "Marquer comme lu",
  deleteAll: "Tout supprimer",
  confirmDeleteAll: "Êtes-vous sûr de vouloir supprimer toutes les notifications ?",
  notificationsMarked: "Notifications marquées",
  notificationsMarkedDescription: "Toutes les notifications ont été marquées comme lues",
  notificationsDeleted: "Notifications supprimées",
  notificationsDeletedDescription: "Toutes les notifications ont été supprimées",
phoneUpdated: "Téléphone mis à jour",
phoneUpdatedDescription: "Vous pouvez maintenant recevoir vos gains avec Bizum",

  // États vides
  noNotifications: "Vous n'avez pas encore de notifications",
  emptyMessage: "Lorsque vous aurez des notifications, elles apparaîtront ici.",
  loading: "Chargement des notifications...",

  // Dates relatives
  lessThanOneHour: "Il y a moins d'une hCHFe",
  hoursAgo: "Il y a {{hours}} hCHFes",
  daysAgo: "Il y a {{days}} jours",
},


challengeCard: {
  you: "Toi",
  user: "UtilisatCHF",
  sureDelete: "Es-tu sûr de vouloir supprimer ce défi ?",
  errorDeleting: "ErrCHF lors de la suppression du défi :",
  pending: "En attente",
  active: "Actif",
  finished: "Terminé",
  canceled: "Annulé",
  createdBy: "Créé par :",
  penalty: "Pénalité",
  members: "Membres",
  rejected: "(Refusé)",
  completed: "Terminé",
  notCompleted: "Non terminé",
  accept: "Accepter",
  reject: "Refuser",
  deleteChallenge: "Supprimer le défi",
  challengeNotCompleted: "Tu n'as pas terminé le défi : {title}",
newFineRecived: "Nouvelle amende reçue",
fineReceivedBody: "Vous avez reçu une amende de {{sender}} pour {{amount}} €. Motif : {{reason}}",
progress: "terminés",


},

challenges: {
  challenges: "Défis",
  status_all: "Tous",
  status_accepted: "Acceptés",
  status_rejected: "Refusés",
  status_achieved: "Réussis",
  status_failed: "Non réussis",
  back: "Retour",
  createChallenge: "Créer un défi",
  filterChallenges: "Filtrer les défis",
  searchChallengePlaceholder: "Rechercher des défis par titre ou description...",
  notLoggedIn: "Connecte-toi pour voir tes défis.",
  titleChallengePage: "Défis",
subtitle: "Défie tes amis, ta famille, ton partenaire, etc. Relève le défi et gagne des récompenses.",
  loadingChallenges: "Chargement des défis...",
  noChallenges: "Tu n'as pas encore de défis.",
  noResults: "Aucun défi ne correspond à ta recherche.",
  acceptedCounter: "Acceptés",
  rejectedCounter: "Refusés",
  achievedCounter: "Réussis",
  failedCounter: "Non réussis",

  inviteContacts: "Invite tes contacts et lance-lCHF un défi à réaliser ensemble.",
  title: "Titre",
  titlePlaceholder: "Ex : Pas de café pendant une semaine",
  description: "Description",
  descriptionPlaceholder: "Décris le défi (optionnel)",
  amount: "Pénalité",
  amountPlaceholder: "Ex : 5",
  currency: "€",
  addParticipants: "Ajouter des participants",
  searchPlaceholder: "Rechercher par nom ou email...",
  loadingContacts: "Chargement des contacts...",
  noContactsFound: "Aucun contact correspondant trouvé.",
  remove: "Supprimer",
  cancel: "Annuler",
  creating: "Création...",
  create: "Créer le défi",
  newChallengeProposed: "Nouveau défi proposé !",
  youHaveNewChallengeToAccept: "Tu as un défi en attente d'acceptation: {{title}}",
  challengeFinished: "Défi terminé",
  whoRejected: "{{name}} a refusé le défi '{{title}}'",
  challengeActivated: "Défi activé !",
  everyoneAccepted: "Tout le monde a accepté ! Le défi est maintenant actif.",
  challengeFinishCheckResult: "Le défi est terminé. Vérifie le résultat !",
},


  groupRulesModal: {
  title: "Règles du groupe",
  newRulePlaceholder: "Être ponctuel, ramasser les vêtements sales...",
  propose: "Proposer",
  loading: "Chargement des règles...",
  noRules: "Aucune règle proposée pour l’instant.",
  validated: "Validée",
  rejected: "Rejetée",
  pendingOthers: "En attente des autres",
  youRejected: "Vous avez rejeté",
  accept: "Accepter",
  reject: "Rejeter",
  deleteTitle: "Supprimer la règle",
  close: "Fermer",
  toastProposedTitle: "Nouvelle règle proposée",
  toastDeletedTitle: "Règle supprimée",
  toastDeletedDesc: "La règle a été supprimée avec succès.",
  proposeDelete: "Proposer la suppression",
pendingDeletion: "Suppression en attente",
toastDeleteProposedTitle: "Suppression proposée",
toastDeleteProposedDesc: "Tous les membres doivent accepter de supprimer cette règle",
deleteRuleNotificationTitle: "Proposition de suppression d'une règle",
deleteRuleNotificationBody: "{username} a proposé de supprimer la règle : \"{rule}\"",
confirmDelete: "Supprimer",
keepRule: "Conserver",
deletedRulePushTitle: "Règle supprimée",
deletedRulePushBody: "La règle « {rule} » du groupe « {group} » a été supprimée.",
toastProposedBody: "La règle \"{rule}\" a été proposée dans le groupe \"{group}\".",
amountLabel: "Amende",
amountPlaceholder: "Montant (€)",


},

badgeUnlocked: {
    titleSingle: "Succès débloqué !",
    titleMultiple: "Nouveaux succès débloqués !",
    descriptionSingle: "Vous avez débloqué un nouveau badge !",
    descriptionMultiple: "Vous avez débloqué de nouveaux badges !",
    close: "Fermer",
  },

createGroupModal: {
    createGroup: "Créer un nouveau groupe",
    createGroupDescription: "Configurez votre groupe pour gérer les amendes sociales entre membres",
    groupName: "Nom du groupe",
    groupNamePlaceholder: "Ex. : colocataires",
groupDescription: "Description",
    groupDescriptionPlaceholder: "Décrivez brièvement l'objectif du groupe",
    uploadAvatar: "Téléverser l’avatar",
    cancel: "Annuler",
    createGroupButton: "Créer le groupe",
    errorNoName: "Le nom du groupe est obligatoire",
    errorNoQR: "Vous devez fournir le QR Bizum pour le mode « Paiement par l’admin »",
    toastSuccess: "Groupe créé avec succès !",
    toastSuccessDesc: "Le groupe « {groupName} » a été créé avec succès.",
  },

paymentModal: {
  title: "Payer l'amende",
description: "Copie le numéro de l'expéditCHF et utilise-le pour payer avec Bizum",
  fine: "Amende",
  amount: "Montant",
  sender: "ExpéditCHF",
  reason: "Motif",
scanQR: "Numéro Bizum",
  useNumber: "Copie le numéro",
  copyNumber: "Copier le numéro",
  copied: "Copié",
  markAsPaid: "Marquer comme payée",
  processing: "Traitement...",
  paid: "Paiement confirmé !",
  close: "Fermer",
  noBizumNumber: "L'expéditCHF n'a pas configuré son numéro Bizum",
  you:"toi",
},


  installApp: {
    iosTitle: "Installer l'app sur iOS",
    iosIntro: "Installe le site comme une application sur ton iPhone ou iPad pour un accès plus rapide.",
    iosStep1: "Ouvre Safari et accède à ce site.",
    iosStep2: "Appuie sur le bouton 'Partager'.",
    iosShareDesc: "C'est l’icône avec un carré et une flèche vers le haut, en bas.",
    iosStep3: "Sélectionne 'Ajouter à l’écran d’accueil'.",
    iosStep4: "Confirme en appuyant sur 'Ajouter' en haut à droite.",
    iosDone: "C'est fait ! Tu peux maintenant ouvrir l'app directement depuis ton écran d'accueil."
  },

  share: {
    title: "Partager Tiko",
    description: "Partage ce site avec tes amis ou ta famille :",
    copy: "Copier le lien",
    copied: "Copié !",
    close: "Fermer",
    button: "Partager l'app",
    buttonDesc: "Partage Tiko avec tes amis",
    intro: "Partage l'app avec tes amis :",
    share: "Envoyer...",
    text: "Teste cette application !"
  },

  banner: {
    title: "Veux-tu installer l'app pour un accès direct ?",
    install: "Installer",
    close: "Fermer",
showInstallBanner: "Pour installer sur iOS : Appuie sur « Partager » 📤 puis sélectionne « Ajouter à l’écran d’accueil ». ",
    phoneWarning: "Ajoute ton numéro de téléphone pour recevoir des paiements avec Bizum. NE T’INQUIÈTE PAS ! Seule la personne qui reçoit ton amende pourra le voir.",
    phoneWarningButton: "Ajouter un numéro",
  },

  welcome: {
  title: "Bienvenue sur Tiko",
  subtitle1: "LCHFs errCHFs, ton avantage",
  description: "Créez votre groupe, définissez vos règles, lancez des défis... et que personne n'y échappe ! Celui qui ne respecte pas les règles doit payer!",
  login: "Se connecter",
  newUser: "Nouvel utilisatCHF",
},

onboard: {
  whatIsTiko: "Qu'est-ce que Tiko ?",
  whatIsTikoDescription: "Tiko est l'application qui transforme la vie en communauté en un jeu où gagne celui qui respecte et fait respecter les règles.",
  createGroups: "Crée des groupes et des règles",
  createGroupsDescription: "Crée un groupe avec ton partenaire, tes amis, colocataires ou collègues et définissez vos propres règles (Pas de cheveux dans la douche, Ne pas interrompre les réunions...) et si quelqu'un ne les respecte pas, il paie !",
  challengeTitle: "Lance un défi à tes contacts",
  challengeDefinition: "Crée des défis et améliore tes habitudes de façon ludique (une semaine sans sucre, réussir le prochain examen ou s'inscrire à la salle de sport). Si quelqu'un échoue, il paie. Vis ensemble, améliore tes habitudes, gagne des XP.",
  payAndLevelUp: "Vis et gagne",
  payAndLevelUpDescription: "L'objectif de Tiko est d'améliorer la cohabitation, de jouer en équipe, d'améliorer les habitudes et de s'amuser tout en devenant LE COLOCATAIRE PARFAIT.",
  back: "Retour",
  next: "Suivant",
  createAccount: "Créer un compte",
},


  // Index Page
  index: {
    hola: "Salut",
    level: "Niveau",
    noinsignias: "Aucun badge",
    lastFineRecived: "Dernière amende reçue",
    pendent: "En attente",
    pendents: "En attente",
    de: "De",
    payed: "Payée",
    congrats: "Félicitations !",
    noPendentFines: "Tu n’as pas d’amendes en attente",
    continueLikeThis: "Continue comme ça",
    quickActions: "Actions rapides",
    quickQuickActionsDescription: "Gère tes amendes efficacement",
    recivedFines: "Amendes reçues",
    recentRecivedFines: "Amendes reçues récemment",
    noRecivedFines: "Tu n’as reçu aucune amende",
    seeAllRecivedFines: "Voir toutes les amendes reçues",
    recentInsignias: "Badges récents",
    recentHitos: "Tes réalisations récentes",
    seeAllInsignias: "Voir tous les badges",
    pendingFinesTitle:"Multas pendientes",
    seeAllPendingFines:"Ver todas las multas pendientes",
    subtitle: "Commence à rendre justice !",

  },

  // Contacts Page
  contacts: {
    error: "ErrCHF",
    errorDescription: "Le contact sélectionné n'est pas inscrit comme utilisatCHF. Impossible d’envoyer l’amende.",
    deletedContactConfirmed: "Contact supprimé avec succès.",
    contactSearchPlaceholder: "Rechercher un contact par nom ou email",
    loading: "Chargement...",
    addedContactConfirmed: "Contact ajouté avec succès",
    titleFineModalPage: "Créer une nouvelle amende",
    challenge:"Défi",
    statusActive:"Active",
    contactRequestSentTitle: "Demande envoyée",
contactRequestSent: "La demande de contact a été envoyée.",
contactRequestFailed: "Impossible d'envoyer la demande.",
confirmDeleteTitle: "Supprimer le contact ?",
confirmDeleteDescription: "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.",
newContactRequestTitle: "Nouvelle demande de contact",
newContactRequestBody: "{name} vous a envoyé une demande de contact.",
requestRejected: "Vous avez refusé la demande de contact.",


  },

  // Groups Page
  groups: {
    notIdentifiedUser: "UtilisatCHF non identifié",
    theGroup: "Le groupe",
    createdSuccessfully: "a été créé avec succès",
    letTheGroup: "Tu as quitté le groupe",
    groupDeleted: "Le groupe a été supprimé.",
    updatedGroup: "Groupe mis à jour avec succès",
    savedCorrectly: "Modifications enregistrées",
    deletedMember: "Membre supprimé",
    deletedMemberDescription: "L’utilisatCHF a été supprimé du groupe",
    memberAdded: "Membre ajouté",
    memberAddedDescription: "Le nouveau membre a été ajouté avec succès",
    contactNotFounError: "Aucun contact enregistré trouvé pour ce membre.",
    groupNotFound: "Groupe non trouvé",
    notDeterminedUser: "Impossible de déterminer l'utilisatCHF à sanctionner.",
    createFineError: "Impossible de créer l’amende :",
    fineCreated: "Amende créée avec succès",
    fineSent: "Amende envoyée avec succès",
    rules: "Règles",
    members: "Membres",
    sendFine: "Envoyer une amende",
    createGroupToStart: "Crée un groupe pour commencer",
    confirmDeleteTitle: "Supprimer le groupe ?",
confirmDeleteDescription: "Êtes-vous sûr de vouloir supprimer le groupe ? Cette action ne peut pas être annulée.",
edit: "Modifier",
delete: "Supprimer",
leave: "Quitter le groupe",
showMembers: "Afficher les membres",


  },

  // History Page
  history: {
    newFineReceived: "Nouvelle amende reçue !",
    newFineFrom: "Tu as reçu une nouvelle amende de",
    fineForAmount: "Amende de",
    correctlyPaid: "payée avec succès",
    experienceUpdateError: "ErrCHF lors de la mise à jour de l’expérience",
    xpUpdated: "Expérience mise à jour avec succès",
    xpGained: "Tu as gagné de l’expérience !",
    xpGainedDescription1: "Tu as gagné",
    xpGainedDescription2: "XP pour ton action.",
    searchPlaceholder: "Rechercher des amendes par nom ou description", // Francés

  },

  // Navigation & Actions
  nav: {
    notifications: "Notifications",
    profile: "Mon profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    login: "Connexion",
    register: "Créer un compte",
    invite: "Inviter des amis",
    home: "Accueil",
  groups: "Groupes",
  contacts: "Contacts",
  fines: "Amendes",
  history: "Historique",
  language: "Langue",

  },

  // Dashboard Stats
  stats: {
    pending: "En attente",
    pendingFines: "Amendes en attente",
    finesPending: "amendes à payer",
    issued: "Émises",
    issuedFines: "Amendes émises",
    totalSent: "Total envoyé",
    received: "Reçues",
    receivedFines: "Amendes reçues",
    totalReceived: "Total reçu"
  },

  // Quick Actions
  quickActions: {
    title: "Actions rapides",
    description: "Gère tes amendes sociales",
    newFine: "Nouvelle amende",
    contacts: "Contacts",
    myQR: "Mon QR",
    history: "Historique",
    notifications: "Notifications"
  },

  // Fines List
  fines: {
    title: "Mes amendes",
    description: "Gère tes amendes reçues et envoyées",
    from: "De",
    to: "À",
    paid: "Payée",
    pending: "En attente",
    pay: "Payer",
    payFine: "Payer l’amende",
    finePaid: "Amende payée !",
    noReceived: "Tu n’as pas d’amendes reçues",
    noSent: "Tu n’as encore envoyé aucune amende",
    phone: "Téléphone",
received: "reçue",
sent: "envoyée",
created: "créée",

  },

  // Create Fine Modal
  createFine: {
    title: "Créer une nouvelle amende",
    description: "Crée une amende sociale à envoyer à un ami ou à un proche",
    reason: "Raison de l’amende",
    reasonPlaceholder: "Ex : En retard au dîner, oublié le pain...",
    amount: "Montant (€)",
    amountPlaceholder: "25.00",
    recipientType: "Type de destinataire",
    contact: "Contact",
    email: "Email",
    selectContact: "Sélectionner un contact",
    selectContactPlaceholder: "Sélectionne un contact",
    recipientEmail: "Email du destinataire",
    recipientEmailPlaceholder: "ami@exemple.com",
    cancel: "Annuler",
    create: "Créer l’amende",
    created: "Amende créée !",
    sentTo: "Amende de {amount} € envoyée à {recipient}",
    seeAndManageContacts: "Voir et gérer les contacts",
    seeHistoryComplete: "Voir l’historique complet",
    manageGroups: "Gérer les groupes",
    groups: "Groupes",
    errors: {
      complete: "Merci de remplir tous les champs obligatoires",
      selectRecipient: "Merci de sélectionner un destinataire",
      validEmail: "Entre un email valide"
    }
  },

  // Payment Modal
  payment: {
    title: "Payer l’amende - {amount} €",
    description: "Paie ton amende via Bizum en scannant le QR code ou en utilisant le numéro",
    details: "Détails de l’amende",
    reason: "Raison :",
    sender: "ExpéditCHF :",
    amount: "Montant :",
    options: "Options de paiement Bizum",
    scanQR: "Scanne avec ton appli Bizum",
    useNumber: "Ou utilise le numéro Bizum :",
    copied: "Copié",
    numberCopied: "Numéro Bizum copié dans le presse-papiers",
    markPaid: "Marquer comme payée",
    processing: "Traitement...",
    confirmed: "Paiement confirmé !"
  },

  // User Profile
  profile: {
    title: "Mon profil",
    description: "Mets à jour tes infos personnelles et configure Bizum comme moyen de paiement",
    changePhoto: "Changer la photo",
    personalInfo: "Informations personnelles",
    fullName: "Nom complet",
    userName: "Nom d'utilisatCHF",
    phone: "Téléphone",
    BizumConfig: "Configuration Bizum",
    uploadQR: "Télécharge ton QR Bizum",
    uploadButton: "Télécharger QR",
    qrDescription: "Ce QR sera affiché quand quelqu’un devra te payer une amende",
    save: "Enregistrer les modifications",
    updated: "Profil mis à jour",
    updateDescription: "Tes données ont été enregistrées avec succès",
    BizumUpload: "QR Bizum",
    BizumUploadDescription: "Fonction de téléchargement du QR bientôt disponible",
    updatedProfile: "Profil mis à jour",
    deleteAccountError: "ErrCHF lors de la suppression du compte",
    deleteAccountDescription: "Impossible de supprimer le compte. Contacte le support.",
    accountDeleted: "Compte supprimé avec succès",
    accountDeletedDescription: "Ton compte et toutes tes données ont été supprimés.",
    goBack: "Retour",
    noName: "Pas de nom",
    editProfile: "Modifier le profil",
    accountManagement: "Gestion du compte",
    endSession: "Déconnexion",
    deleteAccount: "Supprimer le compte",
    insignias: "Badges",
    confirmDeleteAccount: "Supprimer le compte ?",
    confirmDeleteAccountDescription: "Cette action est irréversible. Toutes tes données, amendes et historique seront définitivement supprimés.",
    Cancel: "Annuler",
    deleteAccountButton: "Supprimer le compte",
    loadingBadges: "Chargement des badges...",
    noBadges: "Tu n’as pas encore de badges",
  },

  // Auth
  auth: {
    login: "Connexion",
    register: "Créer un compte",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    loginButton: "Se connecter",
    registerButton: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Tu as déjà un compte ?",
    signUp: "S’inscrire ici",
    signIn: "Connecte-toi ici",
    loginSuccess: "Bon retour parmi nous !",
    registerSuccess: "Compte créé avec succès !",
    errors: {
      emailRequired: "L’email est obligatoire",
      passwordRequired: "Le mot de passe est obligatoire",
      passwordMatch: "Les mots de passe ne correspondent pas",
      invalidEmail: "Email invalide",
      weakPassword: "Le mot de passe doit comporter au moins 6 caractères"
    }
  },

  // Pages
  pages: {
    contacts: {
      title: "Contacts",
      description: "Ajoutez des contacts et utilisez-les pour créer des groupes, des défis, etc.",
      addContact: "Ajouter un contact",
      addContactButton: "Ajouter un contact",
      noContacts: "Tu n’as pas encore de contacts",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      edit: "Modifier",
      delete: "Supprimer",
      fine: "Amende",
      save: "Enregistrer",
      cancel: "Annuler",
      editContact: "Modifier le contact",
      deleteContact: "Supprimer le contact",
      deleteConfirmation: "Es-tu sûr de vouloir supprimer ce contact ?",
      contactAdded: "Contact ajouté",
      contactUpdated: "Contact modifié",
      contactDeleted: "Contact supprimé"
    },
    groups: {
      title: "Groupes",
      description1: "Gère tes groupes",
      createGroup: "Créer un groupe",
      joinGroup: "Rejoindre un groupe",
      noGroups: "Tu n’as pas encore de groupes",
      groupName: "Nom du groupe",
      description: "Crée un groupe, ajoute des membres et définissez vos règles.",
      members: "Membres",
      admin: "Admin",
      member: "Membre",
      leave: "Quitter",
      delete: "Supprimer",
      invite: "Inviter",
      manage: "Gérer",
      code: "Code",
      enterCode: "Entrer le code du groupe",
      join: "Rejoindre",
      create: "Créer",
      groupCreated: "Groupe créé",
      joinedGroup: "Tu as rejoint le groupe",
      leftGroup: "Tu as quitté le groupe",
      groupDeleted: "Groupe supprimé"
    },
    settings: {
      title: "Paramètres",
      description: "Configure l'app",
      language: "Langue",
      notifications: "Notifications",
      privacy: "Confidentialité",
      about: "À propos",
      version: "Version",
      enableNotifications: "Activer les notifications",
      enableSounds: "Activer les sons",
      privateProfile: "Profil privé",
      dataExport: "Exporter les données",
      deleteAccount: "Supprimer le compte",
      settingsSaved: "Paramètres enregistrés"
    },
    myQR: {
      title: "Mon code QR",
      description: "Partage ton QR pour recevoir des amendes",
      downloadQR: "Télécharger le QR",
      shareQR: "Partager le QR"
    },
    history: {
      title: "Amendes",
      description: "Historique complet des amendes",
      filter: "Filtrer",
      all: "Toutes",
      sent: "Envoyées",
      received: "Reçues",
      paid: "Payées",
      pending: "En attente",
      noResults: "Aucun résultat",
      noResultsDescription: "Aucune amende trouvée avec les filtres sélectionnés",
      viewAll: "Voir tout",
      total: "Total"
    },
    notifications: {
      title: "Notifications",
      description: "Tes notifications récentes",
      markAllRead: "Tout marquer comme lu",
      noNotifications: "Tu n’as pas de notifications",
      fine_received: "{{sender}} t’a envoyé une amende de {{amount}} € pour « {{reason}} »",
      fine_received_title: "Amende reçue",
      payment_received: "{{sender}} a payé ton amende de {{amount}} €",
      group_invite: "{{sender}} t’a invité dans le groupe « {{group}} »",
      lessThanHour: "Il y a moins d’1 hCHFe",
      hoursAgo: "Il y a {hours} hCHFes",
      daysAgo: "Il y a {days} jours",
      marked: "Notifications marquées",
      allRead: "Toutes les notifications ont été marquées comme lues",
      emptyMessage: "Tes notifications s’afficheront ici",
      newRuleProposed: "Nouvelle règle proposée",
    }
  },

  // Invite
  invite: {
    title: "Inviter des amis",
    description: "Invite tes amis à utiliser Tiko",
    shareText: "Là où enfreindre les règles te fait gagner (à condition que ce ne soit pas toi 😏)",
    shareTextShort: "Rejoins Tiko !",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié !",
    linkCopiedDescription: "Le lien a été copié dans le presse-papiers",
    sendInvite: "Envoyer une invitation",
    invitationLink: "Lien d’invitation",
    sendAskToContact: "Envoyer la demande",

  },

  // Achievements
  achievements: {
    title: "Succès débloqué !",
    close: "Fermer",
    xpGained: "Points d’expérience gagnés",
    levelUp: "Niveau supériCHF !",
    newBadge: "Nouveau badge !"
  },

  tutorial: {
    header: {
      title: "Comment fonctionne DESWG",
      subtitle: "Tutoriel rapide",
    },
    progress: {
      stepOfTotal: "Étape {current} sur {total}",
    },
    nav: {
      back: "Retour",
      next: "Suivant",
      finish: "Terminer",
      skipTutorial: "Ignorer le tutoriel",
    },

    steps: {
      contact: {
        title: "Commencez par un contact",
        subtitle: "Ajoutez d’abord un contact. Recherchez par nom d’utilisateur ou e-mail.",
        body: "Les contacts sont ceux avec qui vous pouvez créer des groupes, des règles, des amendes et des défis.",
        note: "Vous pouvez ajouter des contacts depuis la page « Contacts ». Recherchez par nom d’utilisateur ou e-mail.",
      },

      group: {
        title: "Créez votre groupe",
        subtitle: "Les règles, amendes, etc. vivent dans les groupes.",
        body: "Après avoir créé votre groupe, modifiez-le pour ajouter des membres.",
        note: "Créez un groupe depuis la page « Groupes ». Vous ne pouvez ajouter que des membres déjà présents dans « Contacts ».",
      },

      rule: {
        title: "Ajoutez des règles à vos groupes",
        subtitle: "Commencez simple pour que tout le monde comprenne.",
        examples:
          "• « Ne pas sortir les poubelles » — CHF 1\n• « Arriver en retard » — CHF 2",
        note: "Les règles du groupe doivent être acceptées par tous les membres avant d’être valides. Vous pouvez modifier ou supprimer les règles à tout moment.",
      },

      action: {
        title: "Envoyez une amende ou un défi",
        subtitle: "1. Depuis la barre de navigation.\n 2. Depuis les Groupes.",
        tips:
          "• Depuis la barre de navigation '+': choisissez le contact et envoyez (Amende / Défi).\n\n• Depuis le groupe : touchez le nom du membre pour envoyer une amende affichant le nom du groupe.\n",
        note: "Pour recevoir des paiements, ajoutez votre numéro de téléphone dans Mon profil > Modifier le profil.",
      },

      phoneShare: {
        title: "Activer les paiements avec TWINT",
        description: "Pour recevoir des paiements via TWINT, ajoutez votre numéro de téléphone. PAS D’INQUIÉTUDE ! Seule la personne qui reçoit votre amende le verra.",
        addPhone: "Ajouter le numéro",
        skipNow: "Ignorer pour l’instant",
        shareApp: "Partager l’app / Inviter",
        phoneLabel: "Votre numéro (TWINT)",
        phonePlaceholder: "+41 79 123 45 67",
        saving: "Enregistrement...",
        saved: "Numéro enregistré",
      },

      install: {
        title: "Installer l’APP",
        title2: "Recevez des notifications et accédez à DESWG en un clic",
        installed: "L’app est déjà installée ✅",
        installButton: "Installer",
        instructionsSafari: "Dans Safari : touchez l’icône de partage (📤) puis « Ajouter à l’écran d’accueil ».",
        note: "Les applications web sont sûres et fonctionnent comme un raccourci vers le site sans occuper d’espace sur votre téléphone.",
      },
    },
  },




  // Common
  common: {
    goHome: "Accueil",
    currency: "€",
    required: "*",
    ok: "OK",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    edit: "Modifier",
    delete: "Supprimer",
    loading: "Chargement...",
    error: "ErrCHF",
    success: "Succès",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    download: "Télécharger",
    share: "Partager",
    total: "Total",
  },

  modal: {
    close: "Fermer",
    confirm: "Confirmer",
    cancel: "Annuler",
    delete: "Supprimer",
    save: "Enregistrer",
    edit: "Modifier",
    create: "Créer",
    update: "Mettre à jour",
    add: "Ajouter",
    addMember: "Ajouter un membre au groupe",
    searchContactToAdd: "Recherche un contact à ajouter",
    noContactsFound: "Aucun contact trouvé",
    startWriteToFind: "Commence à écrire pour trouver des contacts",
    searchNameOrEmail: "Chercher par nom ou email",
    searching: "Recherche...",
    errorSelectUser: "Tu dois sélectionner un utilisatCHF existant.",
    editGroup: "Modifier le groupe",
    editGroupDescription: "Gère les infos et les membres de ton groupe.",
    generalTab: "Général",
    avatarTab: "Image",
    membersTab: "Membres",
    groupName: "Nom du groupe",
    description: "Description",
    avatarLabel: "Image du groupe",
    changeAvatarTitle: "Clique pour changer l’image",
    changeAvatar: "Changer l’image",
    uploading: "Téléchargement...",
    avatarHelpAdmin: "(Seul l’admin peut changer l’image. Clique ou utilise le bouton pour télécharger une nouvelle photo.)",
    avatarHelpUser: "Seul l’admin peut changer l’image du groupe.",
    uploadSuccess: "Image téléchargée avec succès. N’oublie pas d’enregistrer !",
    currentMembers: "Membres actuels :",
    adminLabel: "Admin",
    removeMemberTitle: "Retirer du groupe",
    saveChanges: "Enregistrer les modifications",
    addTelephoneNumber: "Saisis ton numéro de téléphone pour Bizum",
placeholderPhone: "Ex. : +34791234567 ou 612345678",
errorPhone: "Saisis un numéro valide (+34 ou 612345678).",
  }
};
export default fr;