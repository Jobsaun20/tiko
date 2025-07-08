
export const it = {
  // Header
  app: {
    name: "Pic",
    subtitle: "Among friends"
  },
  
  // Navigation & Actions
  nav: {
    notifications: "Notifications",
    profile: "My Profile",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    register: "Sign Up",
    invite: "Invite Friends"
  },
  
  // Dashboard Stats
  stats: {
    pending: "Pending",
    pendingFines: "Pending Fines",
    finesPending: "fines to pay",
    issued: "Issued",
    issuedFines: "Issued Fines",
    totalSent: "Total sent",
    received: "Received",
    receivedFines: "Received Fines",
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
    payFine: "Pay Fine",
    finePaid: "Fine paid!",
    noReceived: "You have no received fines",
    noSent: "You haven't sent any fines yet",
    phone: "Teléfono"
  },
  
  // Create Fine Modal
  createFine: {
    title: "Create New Fine",
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
    create: "Create Fine",
    created: "Fine created!",
    sentTo: "{amount} CHF fine sent to {recipient}",
    errors: {
      complete: "Please complete all required fields",
      selectRecipient: "Please select a recipient",
      validEmail: "Please enter a valid email"
    }
  },
  
  // Payment Modal
  payment: {
    title: "Pay Fine - {amount} CHF",
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
    markPaid: "Mark as Paid",
    processing: "Processing...",
    confirmed: "Payment confirmed!"
  },
  
  // User Profile
  profile: {
    title: "My Profile",
    description: "Update your personal information and configure your TWINT payment method",
    changePhoto: "Change photo",
    personalInfo: "Personal Information",
    fullName: "Full name",
    phone: "Phone",
    twintConfig: "TWINT Configuration",
    uploadQR: "Upload your TWINT QR code",
    uploadButton: "Upload QR",
    qrDescription: "This QR will be shown when someone needs to pay you a fine",
    save: "Save Changes",
    updated: "Profile updated",
    updateDescription: "Your data has been saved successfully",
    twintUpload: "TWINT QR",
    twintUploadDescription: "QR upload feature coming soon"
  },
  
  // Auth
  auth: {
    login: "Login",
    register: "Create Account",
    email: "Email",
    password: "Password",  
    confirmPassword: "Confirm password",
    fullName: "Full name",
    loginButton: "Login",
    registerButton: "Create Account",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign up here",
    signIn: "Sign in here",
    loginSuccess: "Welcome back!",
    registerSuccess: "Account created successfully!",
    errors: {
      emailRequired: "Email is required",
      passwordRequired: "Password is required", 
      passwordMatch: "Passwords don't match",
      invalidEmail: "Invalid email",
      weakPassword: "Password must be at least 6 characters"
    }
  },
  
  // Pages
  pages: {
    contacts: {
      title: "Contacts",
      description: "Manage your contact list",
      addContact: "Add Contact",
      addContactButton: "Add Contact",
      noContacts: "You have no contacts yet",
      name: "Name",
      email: "Email",
      phone: "Phone",
      edit: "Edit",
      delete: "Delete",
      fine: "Fine",
      save: "Save",
      cancel: "Cancel",
      editContact: "Edit Contact",
      deleteContact: "Delete Contact",
      deleteConfirmation: "Are you sure you want to delete this contact?",
      contactAdded: "Contact added",
      contactUpdated: "Contact updated",
      contactDeleted: "Contact deleted"
    },
    groups: {
      title: "Groups",
      description1: "Manage your groups",
      createGroup: "Create Group",
      joinGroup: "Join Group",
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
      enterCode: "Enter group code",
      join: "Join",
      create: "Create",
      groupCreated: "Group created",
      joinedGroup: "Joined group",
      leftGroup: "Left group",
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
      title: "My QR Code",
      description: "Share your QR code to receive fines",
      downloadQR: "Download QR",
      shareQR: "Share QR"
    },
    history: {
      title: "History",
      description: "Complete history of fines",
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
    title: "Invite Friends",
    description: "Invite your friends to use Pic",
    shareText: "Join Pic and manage social fines among friends! 🎉",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    sendInvite: "Send invitation"
  },
  
  // Achievements
  achievements: {
    title: "Achievement Unlocked!",
    close: "Close",
    xpGained: "Experience points gained",
    levelUp: "Level up!",
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
    total: "Total"
  }
};
