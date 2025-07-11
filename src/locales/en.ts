
export const en = {
  // Header
  app: {
    name: "Pic",
    subtitle: "Among friends"
  },

  // Index Page
  index: {
    hola: "Hello",
    level: "Level",
    noinsignias: "No badges",
    lastFineRecived: "Last fine received",
    pendent: "Pending",
    pendents: "Pending",
    de: "From",
    payed: "Paid",
    congrats: "Congratulations!",
    noPendentFines: "You have no pending fines",
    continueLikeThis: "Keep up this good behavior",
    quickActions: "Quick Actions",
    quickQuickActionsDescription: "Manage your fines efficiently",
    recivedFines: "Received fines",
    recentRecivedFines: "Recent received fines",
    noRecivedFines: "You have not received any fines",
    seeAllRecivedFines: "See all received fines",
    recentInsignias: "Recent badges",
    recentHitos: "Your most recent achievements",
    seeAllInsignias: "See all badges",
  },

  // Contacts Page
  contacts: {
    error: "Error",
    errorDescription: "The selected contact is not registered as a user. The fine cannot be sent.",
    deletedContactConfirmed: "Contact successfully deleted.",
    contactSearchPlaceholder: "Search contact by name or email",
    loading: "Loading...",
    addedContactConfirmed: "Contact added successfully",
  },

  // Groups Page
  groups: {
    notIdentifiedUser: "User not identified",
    theGroup: "The group",
    createdSuccessfully: "has been created successfully",
    letTheGroup: "You have left the group",
    groupDeleted: "The group has been deleted.",
    updatedGroup: "Group updated successfully",
    savedCorrectly: "Changes have been saved successfully",
    deletedMember: "Member removed",
    deletedMemberDescription: "The user has been removed from the group",
    memberAdded: "Member added",
    memberAddedDescription: "The new member has been added successfully",
    contactNotFounError: "No registered contact found for this member.",
    groupNotFound: "Group not found",
    notDeterminedUser: "Could not determine the user to fine.",
    createFineError: "Could not create the fine:",
    fineCreated: "Fine created successfully",
    fineSent: "Fine sent successfully",
    rules: "Rules",
    members: "Members",
    sendFine: "Send fine",
    createGroupToStart: "Create a group to start managing fines among friends",
  },

  // History Page
  history: {
    newFineReceived: "New fine received!",
    newFineFrom: "You have received a new fine from",
    fineForAmount: "Fine of",
    correctlyPaid: "successfully paid",
    experienceUpdateError: "Error updating user experience",
    xpUpdated: "Experience updated successfully",
    xpGained: "You have gained experience!",
    xpGainedDescription1: "You gained",
    xpGainedDescription2: "XP for your action.",
  },

  // Navigation & Actions
  nav: {
    notifications: "Notifications",
    profile: "My Profile",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    register: "Sign up",
    invite: "Invite Friends"
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
    receivedFines: "Received fines",
    totalReceived: "Total received"
  },

  // Quick Actions
  quickActions: {
    title: "Quick Actions",
    description: "Manage your social fines",
    newFine: "New Fine",
    contacts: "Contacts",
    myQR: "My QR",
    history: "History",
    notifications: "Notifications"
  },

  // Fines List
  fines: {
    title: "My Fines",
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
    phone: "Phone"
  },

  // Create Fine Modal
  createFine: {
    title: "Create new fine",
    description: "Create a social fine to send to a friend or family member",
    reason: "Fine reason",
    reasonPlaceholder: "E.g.: Being late for dinner, forgetting to buy bread...",
    amount: "Amount (CHF)",
    amountPlaceholder: "25.00",
    recipientType: "Recipient type",
    contact: "Contact",
    email: "Email",
    selectContact: "Select contact",
    selectContactPlaceholder: "Select a contact",
    recipientEmail: "Recipient email",
    recipientEmailPlaceholder: "friend@example.com",
    cancel: "Cancel",
    create: "Create fine",
    created: "Fine created!",
    sentTo: "{amount} CHF fine sent to {recipient}",
    seeAndManageContacts: "See and manage contacts",
    seeHistoryComplete: "View complete history",
    manageGroups: "Manage groups",
    groups: "Groups",
    errors: {
      complete: "Please complete all required fields",
      selectRecipient: "Please select a recipient",
      validEmail: "Please enter a valid email"
    }
  },

  // Payment Modal
  payment: {
    title: "Pay fine - {amount} CHF",
    description: "Pay your fine using TWINT by scanning the QR code or using the number",
    details: "Fine details",
    reason: "Reason:",
    sender: "Sender:",
    amount: "Amount:",
    options: "TWINT payment options",
    scanQR: "Scan with your TWINT app",
    useNumber: "Or use the TWINT number:",
    copied: "Copied",
    numberCopied: "TWINT number copied to clipboard",
    markPaid: "Mark as paid",
    processing: "Processing...",
    confirmed: "Payment confirmed!"
  },

  // User Profile
  profile: {
    title: "My Profile",
    description: "Update your personal information and set up your TWINT payment method",
    changePhoto: "Change photo",
    personalInfo: "Personal information",
    fullName: "Full name",
    phone: "Phone",
    twintConfig: "TWINT Configuration",
    uploadQR: "Upload your TWINT QR code",
    uploadButton: "Upload QR",
    qrDescription: "This QR will be shown when someone needs to pay you a fine",
    save: "Save changes",
    updated: "Profile updated",
    updateDescription: "Your data has been saved successfully",
    twintUpload: "TWINT QR",
    twintUploadDescription: "QR upload feature coming soon",
    updatedProfile: "Profile updated",
    deleteAccountError: "Error deleting account",
    deleteAccountDescription: "Could not delete the account. Contact support.",
    accountDeleted: "Account deleted successfully",
    accountDeletedDescription: "Your account and all your data have been deleted successfully.",
    goBack: "Go back",
    noName: "No name",
    editProfile: "Edit profile",
    accountManagement: "Account management",
    endSession: "Log out",
    deleteAccount: "Delete account",
    insignias: "Badges",
    confirmDeleteAccount: "Delete account?",
    confirmDeleteAccountDescription: "This action cannot be undone. All your data, fines, and history will be permanently deleted from the app.",
    Cancel: "Cancel",
    deleteAccountButton: "Delete account",
  },

  // Auth
  auth: {
    login: "Login",
    register: "Sign up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    fullName: "Full name",
    loginButton: "Login",
    registerButton: "Sign up",
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
      description: "Manage your contact list",
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
      description: "Description",
      members: "Members",
      admin: "Admin",
      member: "Member",
      leave: "Leave",
      delete: "Delete",
      invite: "Invite",
      manage: "Manage",
      code: "Code",
      enterCode: "Enter the group code",
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
      title: "History",
      description: "Complete fine history",
      filter: "Filter",
      all: "All",
      sent: "Sent",
      received: "Received",
      paid: "Paid",
      pending: "Pending",
      noResults: "No results",
      noResultsDescription: "No fines found with selected filters",
      viewAll: "View all",
      total: "Total"
    },
    notifications: {
      title: "Notifications",
      description: "Your recent notifications",
      markAllRead: "Mark all as read",
      noNotifications: "You have no notifications",
      fine_received: "{{sender}} sent you a fine of {{amount}} CHF for \"{{reason}}\"",
      fine_received_title: "Fine received",
      payment_received: "{{sender}} has paid your fine of {{amount}} CHF",
      group_invite: "{{sender}} has invited you to the group \"{{group}}\"",
      lessThanHour: "Less than 1 hour ago",
      hoursAgo: "{hours} hours ago",
      daysAgo: "{days} days ago",
      marked: "Notifications marked",
      allRead: "All notifications have been marked as read",
      emptyMessage: "When you have notifications, they'll appear here",
      newRuleProposed: "New rule proposed",
    }
  },

  // Invite
  invite: {
    title: "Invite friends",
    description: "Invite your friends to use Pic",
    shareText: "Join Pic and manage social fines among friends! 🎉",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    sendInvite: "Send invitation"
  },

  // Achievements
  achievements: {
    title: "Achievement unlocked!",
    close: "Close",
    xpGained: "Experience points gained",
    levelUp: "You leveled up!",
    newBadge: "New badge!"
  },

  // Common
  common: {
    currency: "CHF",
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
  }
};
