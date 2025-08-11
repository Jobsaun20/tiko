import { add } from "date-fns";

export const en = {
  // Header
  app: {
    name: "Tiko",
    subtitle: "Among friends",
    installApp: "Install app",
    other: "Other", 
    installIosGuide: "Install on iOS",
  },

  notifications: {
  // Notification templates
  fine_received: {
    title: "Fine received",
    icon: "💸",
    message: '{{sender}} sent you a fine of {{amount}} € for "{{reason}}"',
  },
  challenge_created: {
    title: "Challenge created",
    icon: "🏆",
    message: "You created a challenge: {{challenge_title}}",
  },
  challenge_invited: {
    title: "Challenge invitation",
    icon: "🎯",
    message:  "{{sender}} has invited you to the challenge: {{challenge_title}}",
  },
  payment_received: {
    title: "Payment received",
    icon: "💰",
    message: "You have received a payment of {{amount}} €",
  },
  group_invite: {
    title: "Group invitation",
    icon: "👥",
    message: "You have been invited to a group",
  },
  group_rule_proposed: {
    title: "New rule proposed",
    icon: "⏳",
    message: "{{rule_description}}",
  },
  group_rule_deletion_proposed: {
  title: "Rule deletion proposed",
  message: "The rule '{{rule}}' from group '{{group}}' has been proposed for deletion.",
},
group_rule_deleted: {
  title: "Rule deleted",
  message: "The rule '{{rule}}' has been deleted from the group '{{group}}'.",
},
contact_request_sent: {
  title: "Request sent",
  message: "You have sent a contact request to {{name}}.",
},
contact_request_received: {
  title: "Request received",
  message: "{{name}} has sent you a contact request.",
},
contact_request_accepted: {
  title: "Request accepted",
  message: "{{name}} has accepted your contact request.",
},
contact_request_was_accepted: {
  title: "Request accepted",
  message: "You have accepted the contact request from {{name}}.",
},



  // Header and actions
  title: "Notifications",
  description: "Your recent notifications",
  markAllRead: "Mark all as read",
  markReadMobile: "Mark as read",
  deleteAll: "Delete all",
  confirmDeleteAll: "Are you sure you want to delete all notifications?",
  notificationsMarked: "Notifications marked",
  notificationsMarkedDescription: "All notifications have been marked as read",
  notificationsDeleted: "Notifications deleted",
  notificationsDeletedDescription: "All notifications have been deleted",
  phoneUpdated: "Phone updated",
  phoneUpdatedDescription: "You can now receive your earnings with Bizum",


  // Empty states
  noNotifications: "You don't have any notifications yet",
  emptyMessage: "When you have notifications, they will appear here.",
  loading: "Loading notifications...",

  // Relative dates
  lessThanOneHour: "Less than 1 hour ago",
  hoursAgo: "{{hours}} hours ago",
  daysAgo: "{{days}} days ago",
},


challengeCard: {
  you: "You",
  user: "User",
  sureDelete: "Are you sure you want to delete this challenge?",
  errorDeleting: "Error deleting the challenge:",
  pending: "Pending",
  active: "Active",
  finished: "Finished",
  canceled: "Canceled",
  createdBy: "Created by:",
  penalty: "Penalty",
  members: "Members",
  rejected: "(Rejected)",
  completed: "Completed",
  notCompleted: "Not completed",
  accept: "Accept",
  reject: "Reject",
  deleteChallenge: "Delete challenge",
  challengeNotCompleted: "You did not complete the challenge: {title}",
newFineRecived: "New fine received",
fineReceivedBody: "You have received a fine from {{sender}} for {{amount}} €. Reason: {{reason}}",
progress: "completed",

},

challenges: {
  challenges: "Challenges",
  status_all: "All",
  status_accepted: "Accepted",
  status_rejected: "Rejected",
  status_achieved: "Achieved",
  status_failed: "Failed",
  back: "Back",
  createChallenge: "Create Challenge",
  filterChallenges: "Filter challenges",
  searchChallengePlaceholder: "Search challenges by title or description...",
  notLoggedIn: "Log in to see your challenges.",
  titleChallengePage: "Challenges",
subtitle: "Challenge your friends, family, partner, etc. Complete the challenge and earn rewards.",
  loadingChallenges: "Loading challenges...",
  noChallenges: "You don't have any challenges yet.",
  noResults: "No challenge matches your search.",
  acceptedCounter: "Accepted",
  rejectedCounter: "Rejected",
  achievedCounter: "Achieved",
  failedCounter: "Failed",

  inviteContacts: "Invite your contacts and challenge them to achieve a goal together.",
  title: "Title",
  titlePlaceholder: "E.g.: No coffee for a week",
  description: "Description",
  descriptionPlaceholder: "Describe the challenge (optional)",
  amount: "Penalty",
  amountPlaceholder: "E.g.: 5",
  currency: "€",
  addParticipants: "Add participants",
  searchPlaceholder: "Search by name or email...",
  loadingContacts: "Loading contacts...",
  noContactsFound: "No matching contacts found.",
  remove: "Remove",
  cancel: "Cancel",
  creating: "Creating...",
  create: "Create challenge",
  newChallengeProposed: "New challenge proposed!",
  youHaveNewChallengeToAccept: "You have a challenge pending to accept: {{title}}",
  challengeFinished: "Challenge finished",
  whoRejected: "{{name}} has rejected the challenge '{{title}}'",
  challengeActivated: "Challenge activated!",
  everyoneAccepted: "Everyone has accepted! The challenge is now active.",
  challengeFinishCheckResult: "The challenge has ended. Check the result!",
},


  groupRulesModal: {
  title: "Group Rules",
  newRulePlaceholder: "Be punctual, pick up dirty clothes...",
  propose: "Propose",
  loading: "Loading rules...",
  noRules: "No rules proposed yet.",
  validated: "Validated",
  rejected: "Rejected",
  pendingOthers: "Pending others",
  youRejected: "You rejected",
  accept: "Accept",
  reject: "Reject",
  deleteTitle: "Delete rule",
  close: "Close",
  toastProposedTitle: "New rule proposed",
  toastDeletedTitle: "Rule deleted",
  toastDeletedDesc: "The rule has been deleted successfully.",
  proposeDelete: "Propose deletion",
pendingDeletion: "Pending deletion",
toastDeleteProposedTitle: "Deletion proposed",
toastDeleteProposedDesc: "All members must agree to delete this rule",
deleteRuleNotificationTitle: "Rule deletion proposed",
deleteRuleNotificationBody: "{username} proposed to delete the rule: \"{rule}\"",
confirmDelete: "Delete",
keepRule: "Keep",
deletedRulePushTitle: "Rule deleted",
deletedRulePushBody: "The rule \"{rule}\" from group \"{group}\" was deleted.",
toastProposedBody: "The rule \"{rule}\" has been proposed in the group \"{group}\".",
amountLabel: "Fine",
amountPlaceholder: "Amount (€)",


},

 badgeUnlocked: {
    titleSingle: "Achievement Unlocked!",
    titleMultiple: "New Achievements Unlocked!",
    descriptionSingle: "You've unlocked a new badge!",
    descriptionMultiple: "You've unlocked new badges!",
    close: "Close",
  },
  
  createGroupModal: {
    createGroup: "Create New Group",
    createGroupDescription: "Set up your group to manage social fines among members",
    groupName: "Group Name",
    groupNamePlaceholder: "e.g.: Roommates",
groupDescription: "Description",
    groupDescriptionPlaceholder: "Briefly describe the purpose of the group",
    uploadAvatar: "Upload Avatar",
    cancel: "Cancel",
    createGroupButton: "Create Group",
    errorNoName: "Group name is required",
    errorNoQR: "You must provide the Bizum QR code for the 'Admin Pay' mode",
    toastSuccess: "Group created successfully!",
    toastSuccessDesc: "The group “{groupName}” has been created successfully.",
  },

paymentModal: {
  title: "Pay fine",
description: "Copy the sender's number and use it to pay with Bizum",
  fine: "Fine",
  amount: "Amount",
  sender: "Sender",
  reason: "Reason",
scanQR: "Bizum number",
  useNumber: "Copy the Number",
  copyNumber: "Copy number",
  copied: "Copied",
  markAsPaid: "Mark as paid",
  processing: "Processing...",
  paid: "Payment confirmed!",
  close: "Close",
  noBizumNumber: "The sender has not set up their Bizum number",
  you:"you",
},



  installApp: {
    iosTitle: "Install app on iOS",
    iosIntro: "Install the website as an app on your iPhone or iPad for faster access.",
    iosStep1: "Open Safari and go to this website.",
    iosStep2: "Tap the 'Share' button.",
    iosShareDesc: "It's the icon with a square and an upward arrow at the bottom.",
    iosStep3: "Select 'Add to Home Screen'.",
    iosStep4: "Confirm by tapping 'Add' in the top right corner.",
    iosDone: "Done! Now you can open the app directly from your home screen."
  },

  share: {
    title: "Share Tiko",
    description: "Share this website with your friends or family:",
    copy: "Copy link",
    copied: "Copied!",
    close: "Close",
    button: "Share app",
    buttonDesc: "Share Tiko with your friends",
    intro: "Share the app with your friends:",
    share: "Send...",
    text: "Try this app!"
  },

  banner: {
    title: "Do you want to install the app for quick access?",
    install: "Install",
    close: "Close",
showInstallBanner: "To install on iOS: Tap “Share” 📤 and select “Add to Home Screen”.",
    phoneWarning: "Add your phone number to receive payments with Bizum. DON'T WORRY! Only the person who receives your fine will be able to see it.",
    phoneWarningButton: "Add number",
  },

  welcome: {
  title: "Welcome to Tiko",
  subtitle1: "They fail, you win",
  description: "Create your group, set your rules, launch challenges... and no one escapes! Whoever breaks the rules pays up!",
  login: "Log in",
  newUser: "New user",
},

onboard: {
  whatIsTiko: "What is Tiko?",
  whatIsTikoDescription: "Tiko is the app that turns living together into a game where those who follow and enforce the rules win.",
  createGroups: "Create groups and rules",
  createGroupsDescription: "Create a group with your partner, friends, roommates, or coworkers and set your own rules (No hair in the shower, No interrupting in meetings...) and if someone breaks them, they pay!",
  challengeTitle: "Challenge your contacts",
  challengeDefinition: "Create challenges and improve habits in a fun way (a week without sugar, passing the next exam, or joining the gym). If someone fails, they pay. Live together, improve habits, earn XP.",
  payAndLevelUp: "Live and win",
  payAndLevelUpDescription: "The goal of Tiko is to improve coexistence, play as a team, develop better habits, and have fun while becoming THE PERFECT ROOMMATE.",
  back: "Back",
  next: "Next",
  createAccount: "Create account",
},



  // Index Page
  index: {
    hola: "Hi",
    level: "Level",
    noinsignias: "No badges",
    lastFineRecived: "Last fine received",
    pendent: "Pending",
    pendents: "Pending",
    de: "From",
    payed: "Paid",
    congrats: "Congratulations!",
    noPendentFines: "You have no pending fines",
    continueLikeThis: "Keep up the good work",
    quickActions: "Quick actions",
    quickQuickActionsDescription: "Manage your fines efficiently",
    recivedFines: "Fines received",
    recentRecivedFines: "Recently received fines",
    noRecivedFines: "You haven't received any fines",
    seeAllRecivedFines: "View all received fines",
    recentInsignias: "Recent badges",
    recentHitos: "Your most recent achievements",
    seeAllInsignias: "See all badges",
    pendingFinesTitle:"Multas pendientes",
    seeAllPendingFines:"Ver todas las multas pendientes",
    subtitle: "Start serving justice!",
  },

  // Contacts Page
  contacts: {
    error: "Error",
    errorDescription: "The selected contact is not registered as a user. The fine cannot be sent.",
    deletedContactConfirmed: "Contact deleted successfully.",
    contactSearchPlaceholder: "Search contact by name or email",
    loading: "Loading...",
    addedContactConfirmed: "Contact added successfully",
    titleFineModalPage: "Create new fine",
    challenge:"Challenge",
    statusActive:"Active",
       contactRequestSentTitle: "Request sent",
contactRequestSent: "The contact request has been sent.",
contactRequestFailed: "Could not send the request.",
confirmDeleteTitle: "Delete contact?",
confirmDeleteDescription: "Are you sure you want to delete this contact? This action is irreversible.",
newContactRequestTitle: "New contact request",
newContactRequestBody: "{name} has sent you a contact request.",
requestRejected: "You have rejected the contact request.",

},

  // Groups Page
  groups: {
    notIdentifiedUser: "User not identified",
    theGroup: "The group",
    createdSuccessfully: "was created successfully",
    letTheGroup: "You left the group",
    groupDeleted: "The group has been deleted.",
    updatedGroup: "Group updated successfully",
    savedCorrectly: "Changes saved successfully",
    deletedMember: "Member removed",
    deletedMemberDescription: "The user has been removed from the group",
    memberAdded: "Member added",
    memberAddedDescription: "The new member was added successfully",
    contactNotFounError: "No registered contact found for this member.",
    groupNotFound: "Group not found",
    notDeterminedUser: "Could not determine the user to fine.",
    createFineError: "Could not create the fine:",
    fineCreated: "Fine created successfully",
    fineSent: "Fine sent successfully",
    rules: "Rules",
    members: "Members",
    sendFine: "Send fine",
    createGroupToStart: "Create a group to get started",
 confirmDeleteTitle: "Delete group?",
confirmDeleteDescription: "Are you sure you want to delete the group? This action cannot be undone.",
edit: "Edit",
delete: "Delete",
leave: "Leave group",
showMembers: "Show members",



  },

  // History Page
  history: {
    newFineReceived: "New fine received!",
    newFineFrom: "You've received a new fine from",
    fineForAmount: "Fine of",
    correctlyPaid: "paid successfully",
    experienceUpdateError: "Error updating user experience",
    xpUpdated: "Experience updated successfully",
    xpGained: "You've gained experience!",
    xpGainedDescription1: "You've gained",
    xpGainedDescription2: "XP for your action.",
    searchPlaceholder: "Search fines by name or description",    // Inglés

  },

  // Navigation & Actions
  nav: {
    notifications: "Notifications",
    profile: "My profile",
    settings: "Settings",
    logout: "Log out",
    login: "Log in",
    register: "Create account",
    invite: "Invite friends",
      home: "Home",
  groups: "Groups",
  contacts: "Contacts",
  fines: "Fines",
  history: "History",
  language: "Language",

  },
  
  // Dashboard Stats
  stats: {
    pending: "Pending",
    pendingFines: "Pending fines",
    finesPending: "fines to pay",
    issued: "Issued",
    issuedFines: "Issued fines",
    totalSent: "Total sent",
    received: "Received",
    receivedFines: "Fines received",
    totalReceived: "Total received"
  },
  
  // Quick Actions
  quickActions: {
    title: "Quick actions",
    description: "Manage your social fines",
    newFine: "New fine",
    contacts: "Contacts",
    myQR: "My QR",
    history: "History",
    notifications: "Notifications"
  },
  
  // Fines List
  fines: {
    title: "My fines",
    description: "Manage your received and sent fines",
    from: "From",
    to: "To",
    paid: "Paid",
    pending: "Pending",
    pay: "Pay",
    payFine: "Pay fine",
    finePaid: "Fine paid!",
    noReceived: "You have no received fines",
    noSent: "You haven't sent any fines yet",
    
    phone: "Phone",
received: "received",
sent: "sent",
created: "created",

  },
  
  // Create Fine Modal
  createFine: {
    title: "Create new fine",
    description: "Create a social fine to send to a friend or family member",
    reason: "Reason for fine",
    reasonPlaceholder: "e.g. Late for dinner, forgot to buy bread...",
    amount: "Amount (€)",
    amountPlaceholder: "25.00",
    recipientType: "Recipient type",
    contact: "Contact",
    email: "Email",
    selectContact: "Select contact",
    selectContactPlaceholder: "Select a contact",
    recipientEmail: "Recipient's email",
    recipientEmailPlaceholder: "friend@example.com",
    cancel: "Cancel",
    create: "Create fine",
    created: "Fine created!",
    sentTo: "Fine of {amount} € sent to {recipient}",
    seeAndManageContacts: "View and manage contacts",
    seeHistoryComplete: "View full history",
    manageGroups: "Manage groups",
    groups: "Groups",
    errors: {
      complete: "Please complete all required fields",
      selectRecipient: "Please select a recipient",
      validEmail: "Enter a valid email"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Pay fine - {amount} €",
    description: "Pay your fine using Bizum by scanning the QR code or using the number",
    details: "Fine details",
    reason: "Reason:",
    sender: "Sender:",
    amount: "Amount:",
    options: "Bizum payment options",
    scanQR: "Scan with your Bizum app",
    useNumber: "Or use the Bizum number:",
    copied: "Copied",
    numberCopied: "Bizum number copied to clipboard",
    markPaid: "Mark as paid",
    processing: "Processing...",
    confirmed: "Payment confirmed!"
  },
  
  // User Profile
  profile: {
    title: "My profile",
    description: "Update your personal information and set up your Bizum payment method",
    changePhoto: "Change photo",
    personalInfo: "Personal information",
    fullName: "Full name",
    userName: "Username",
    phone: "Phone",
    BizumConfig: "Bizum configuration",
    uploadQR: "Upload your Bizum QR code",
    uploadButton: "Upload QR",
    qrDescription: "This QR will be shown when someone has to pay you a fine",
    save: "Save changes",
    updated: "Profile updated",
    updateDescription: "Your data has been saved successfully",
    BizumUpload: "Bizum QR",
    BizumUploadDescription: "QR upload feature coming soon",
    updatedProfile: "Profile updated",
    deleteAccountError: "Error deleting account",
    deleteAccountDescription: "Account could not be deleted. Please contact support.",
    accountDeleted: "Account deleted successfully",
    accountDeletedDescription: "Your account and all data have been deleted.",
    goBack: "Go back",
    noName: "No name",
    editProfile: "Edit profile",
    accountManagement: "Account management",
    endSession: "Log out",
    deleteAccount: "Delete account",
    insignias: "Badges",
    confirmDeleteAccount: "Delete account?",
    confirmDeleteAccountDescription: "This action cannot be undone. All your data, fines, and history will be permanently deleted.",
    Cancel: "Cancel",
    deleteAccountButton: "Delete account",
    loadingBadges: "Loading badges...",
    noBadges: "You don't have any badges yet",
  },
  
  // Auth
  auth: {
    login: "Log in",
    register: "Create account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    fullName: "Full name",
    loginButton: "Login",
    registerButton: "Create account",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign up here",
    signIn: "Sign in here",
    loginSuccess: "Welcome back!",
    registerSuccess: "Account created successfully!",
    errors: {
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordMatch: "Passwords do not match",
      invalidEmail: "Invalid email",
      weakPassword: "Password must be at least 6 characters"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Contacts",
      description: "Add contacts and use them to create groups, challenges, etc.",
      addContact: "Add contact",
      addContactButton: "Add contact",
      noContacts: "You have no contacts yet",
      name: "Name",
      email: "Email",
      phone: "Phone",
      edit: "Edit",
      delete: "Delete",
      fine: "Fine",
      save: "Save",
      cancel: "Cancel",
      editContact: "Edit contact",
      deleteContact: "Delete contact",
      deleteConfirmation: "Are you sure you want to delete this contact?",
      contactAdded: "Contact added",
      contactUpdated: "Contact updated",
      contactDeleted: "Contact deleted"
    },
    groups: {
      title: "Groups",
      description1: "Manage your groups",
      createGroup: "Create group",
      joinGroup: "Join a group",
      noGroups: "You have no groups yet",
      groupName: "Group name",
      description: "Create a group, add its members, and define your rules.",
      members: "Members",
      admin: "Admin",
      member: "Member",
      leave: "Leave",
      delete: "Delete",
      invite: "Invite",
      manage: "Manage",
      code: "Code",
      enterCode: "Enter group code",
      join: "Join",
      create: "Create",
      groupCreated: "Group created",
      joinedGroup: "You joined the group",
      leftGroup: "You left the group",
      groupDeleted: "Group deleted"
    },
    settings: {
      title: "Settings",
      description: "Configure the app",
      language: "Language",
      notifications: "Notifications",
      privacy: "Privacy",
      about: "About",
      version: "Version",
      enableNotifications: "Enable notifications",
      enableSounds: "Enable sounds",
      privateProfile: "Private profile",
      dataExport: "Export data",
      deleteAccount: "Delete account",
      settingsSaved: "Settings saved"
    },
    myQR: {
      title: "My QR code",
      description: "Share your QR code to receive fines",
      downloadQR: "Download QR",
      shareQR: "Share QR"
    },
    history: {
      title: "Fines",
      description: "Complete fines history",
      filter: "Filter",
      all: "All",
      sent: "Sent",
      received: "Received",
      paid: "Paid",
      pending: "Pending",
      noResults: "No results",
      noResultsDescription: "No fines found with the selected filters",
      viewAll: "View all",
      total: "Total"
    },
    notifications: {
      title: "Notifications",
      description: "Your recent notifications",
      markAllRead: "Mark all as read",
      noNotifications: "You have no notifications",
      fine_received: "{{sender}} sent you a fine of {{amount}} € for \"{{reason}}\"",
      fine_received_title: "Fine received",
      payment_received: "{{sender}} has paid your fine of {{amount}} €",
      group_invite: "{{sender}} invited you to the group \"{{group}}\"",
      lessThanHour: "Less than 1 hour ago",
      hoursAgo: "{hours} hours ago",
      daysAgo: "{days} days ago",
      marked: "Notifications marked",
      allRead: "All notifications marked as read",
      emptyMessage: "When you have notifications, they'll appear here",
      newRuleProposed: "New rule proposed",
    }
  },
  
  // Invite
  invite: {
    title: "Invite friends",
    description: "Invite your friends to use Tiko",
    shareText: "Where breaking the rules makes you win (as long as you're not the one breaking them 😏)",
    shareTextShort: "Join Tiko!",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    linkCopiedDescription: "The link has been copied to the clipboard",
    sendInvite: "Send invite",
    invitationLink: "Invitation link",
    sendAskToContact: "Send request",

  },
  
  // Achievements
  achievements: {
    title: "Achievement unlocked!",
    close: "Close",
    xpGained: "Experience points earned",
    levelUp: "You leveled up!",
    newBadge: "New badge!"
  },

  tutorial: {
    header: {
      title: "How DESWG works",
      subtitle: "Quick tutorial",
    },
    progress: {
      stepOfTotal: "Step {current} of {total}",
    },
    nav: {
      back: "Back",
      next: "Next",
      finish: "Finish",
      skipTutorial: "Skip tutorial",
    },

    steps: {
      contact: {
        title: "Start with a contact",
        subtitle: "Start by adding a contact. Search by username or email.",
        body: "Contacts are the people you can create groups, rules, fines and challenges with.",
        note: "You can add contacts from the 'Contacts' page. Search by username or email.",
      },

      group: {
        title: "Create your group",
        subtitle: "Rules, fines, etc. live inside groups.",
        body: "After creating your group, edit it to add members.",
        note: "Create a group from the 'Groups' page. You can only add members who are already in 'Contacts'.",
      },

      rule: {
        title: "Add rules to your groups",
        subtitle: "Start simple so everyone understands.",
        examples:
          "• “Not taking out the trash” — 1 €\n• “Arriving late” — 2 €",
        note: "Group rules must be accepted by all members before they become valid. You can edit or delete rules at any time.",
      },

      action: {
        title: "Send a fine or a challenge",
        subtitle: "1. From the navigation bar '+'.\n 2. From Groups.",
        tips:
          "• From the navigation bar '+': pick the contact and send (Fine / Challenge).\n\n• From the group: tap the member's name to send a fine showing the group's name.\n",
note: "• Fine: sent for breaking a rule.\n • Challenge: temporary challenges proposed to one or more contacts."
      },

      phoneShare: {
        title: "Enable payments with Bizum",
        description: "To receive payments via Bizum, add your phone number. DON'T WORRY! Only the person you fine will see it.",
        addPhone: "Add phone number",
        skipNow: "Skip for now",
        shareApp: "Share app / Invite",
        phoneLabel: "Your number (Bizum)",
        phonePlaceholder: "+41 79 123 45 67",
        saving: "Saving...",
        saved: "Phone saved",
      },

      install: {
        title: "Install the APP",
        title2: "Get notifications and access DESWG with one tap",
        installed: "The app is already installed ✅",
        installButton: "Install",
        instructionsSafari: "In Safari: tap the share icon (📤) and choose 'Add to Home Screen'.",
        note: "Web apps are safe and work like a shortcut to the website without taking space on your phone.",
      },
    },
  },



  
  // Common
  common: {
    goHome: "Go home",
    currency: "€",
    required: "*",
    ok: "OK",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    download: "Download",
    share: "Share",
    total: "Total",
  },

  modal: {
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    edit: "Edit",
    create: "Create",
    update: "Update",
    add: "Add",
    addMember: "Add member to group",
    searchContactToAdd: "Search a contact to add",
    noContactsFound: "No contacts found",
    startWriteToFind: "Start typing to search contacts",
    searchNameOrEmail: "Search by name or email",
    searching: "Searching...",
    errorSelectUser: "You must select an existing user.",
    editGroup: "Edit group",
    editGroupDescription: "Manage your group's information and members.",
    generalTab: "General",
    avatarTab: "Image",
    membersTab: "Members",
    groupName: "Group name",
    description: "Description",
    avatarLabel: "Group image",
    changeAvatarTitle: "Click to change the image",
    changeAvatar: "Change image",
    uploading: "Uploading...",
    avatarHelpAdmin: "(Only the admin can change the image. Click or use the button to upload a new photo.)",
    avatarHelpUser: "Only the admin can change the group image.",
    uploadSuccess: "Image uploaded successfully. Don't forget to save!",
    currentMembers: "Current members:",
    adminLabel: "Admin",
    removeMemberTitle: "Remove from group",
    saveChanges: "Save changes",
    addTelephoneNumber: "Enter your phone number for Bizum",
placeholderPhone: "E.g.: +34 or 612345678",
errorPhone: "Enter a valid number (+34 or 612345678).",
  }
};
export default en;