// src/utils/gamifications.ts

export interface Badge {
  id: string;
  name: Record<string, string>;          // { es: "xxx", en: "yyy", de: "zzz" }
  description: Record<string, string>;   // { es: "xxx", en: "yyy", de: "zzz" }
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (user: any) => boolean;
  xpReward: number;
}

export interface Achievement {
  type: 'xp' | 'badge' | 'level_up';
  xp?: number;
  badge?: Badge;
  newLevel?: number;
  message: string;
}

export const BADGES: Badge[] = [
  {
    id: 'first-fine',
    name: { es: 'Primera Multa', en: 'First Fine', de: 'Erste Strafe' },
    description: {
      es: 'Enviaste tu primera multa',
      en: 'You sent your first fine',
      de: 'Du hast deine erste Strafe gesendet'
    },
    icon: '🎯',
    rarity: 'common',
    condition: (user) => user.totalSent >= 1,
    xpReward: 10
  },
  {
    id: 'early-payer',
    name: { es: 'Pago Rápido', en: 'Quick Payer', de: 'Schnellzahler' },
    description: {
      es: 'Pagas multas en menos de 24h',
      en: 'You pay fines in less than 24h',
      de: 'Du zahlst Strafen in weniger als 24h'
    },
    icon: '⚡',
    rarity: 'common',
    condition: (user) => user.fastPayments >= 3,
    xpReward: 15
  },
  {
    id: 'top-finer',
    name: { es: 'Multador Supremo', en: 'Top Finer', de: 'Strafmeister' },
    description: {
      es: 'Enviaste más de 10 multas',
      en: 'You sent more than 10 fines',
      de: 'Du hast mehr als 10 Strafen gesendet'
    },
    icon: '👑',
    rarity: 'rare',
    condition: (user) => user.totalSent >= 10,
    xpReward: 50
  },
  {
    id: 'group-admin',
    name: { es: 'Administrador', en: 'Group Admin', de: 'Gruppenadmin' },
    description: {
      es: 'Admin de un grupo',
      en: 'Group admin',
      de: 'Admin einer Gruppe'
    },
    icon: '🛡️',
    rarity: 'epic',
    condition: (user) => user.adminGroups >= 1,
    xpReward: 30
  },
  {
    id: 'social-butterfly',
    name: { es: 'Mariposa Social', en: 'Social Butterfly', de: 'Sozialschmetterling' },
    description: {
      es: 'Tienes más de 20 contactos',
      en: 'You have more than 20 contacts',
      de: 'Du hast mehr als 20 Kontakte'
    },
    icon: '🦋',
    rarity: 'rare',
    condition: (user) => user.totalContacts >= 20,
    xpReward: 40
  },
  {
    id: 'debt-free',
    name: { es: 'Sin Deudas', en: 'Debt Free', de: 'Schuldenfrei' },
    description: {
      es: 'No tienes multas pendientes',
      en: 'You have no pending fines',
      de: 'Du hast keine offenen Strafen'
    },
    icon: '💎',
    rarity: 'epic',
    condition: (user) => user.pendingFines === 0 && user.totalReceived > 0,
    xpReward: 75
  },
  {
    id: 'master-collector',
    name: { es: 'Coleccionista Maestro', en: 'Master Collector', de: 'Meistersammler' },
    description: {
      es: 'Recaudaste más de 500 €',
      en: 'You collected more than 500 €',
      de: 'Du hast mehr als 500 € gesammelt'
    },
    icon: '💰',
    rarity: 'legendary',
    condition: (user) => user.totalEarned >= 500,
    xpReward: 100
  }
];

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  return currentLevel * 100;
};

export const getXPProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const currentLevel = calculateLevel(xp);
  const baseXP = (currentLevel - 1) * 100;
  const current = xp - baseXP;
  const needed = 100;
  const percentage = (current / needed) * 100;
  return { current, needed, percentage };
};

export const checkNewAchievements = (
  oldUser: any,
  newUser: any,
  lang: string = "en"
): Achievement[] => {
  const achievements: Achievement[] = [];

  // Experiencia ganada
  if (newUser.xp > oldUser.xp) {
    const xpGained = newUser.xp - oldUser.xp;
    achievements.push({
      type: 'xp',
      xp: xpGained,
      message: lang === 'es'
        ? `¡Enhorabuena! Has ganado ${xpGained} puntos de experiencia`
        : lang === 'en'
          ? `Congratulations! You gained ${xpGained} XP`
          : `Glückwunsch! Du hast ${xpGained} Erfahrungspunkte erhalten`
    });
  }

  // Level Up
  const oldLevel = calculateLevel(oldUser.xp);
  const newLevel = calculateLevel(newUser.xp);
  if (newLevel > oldLevel) {
    achievements.push({
      type: 'level_up',
      newLevel,
      message: lang === 'es'
        ? `¡Felicidades! Has alcanzado el nivel ${newLevel}`
        : lang === 'en'
          ? `Congratulations! You've reached level ${newLevel}`
          : `Glückwunsch! Du hast Level ${newLevel} erreicht`
    });
  }

  // Nuevas medallas
  const oldBadges = oldUser.badges || [];
  const newBadges = BADGES.filter(badge =>
    badge.condition(newUser) && !oldBadges.includes(badge.id)
  );

  newBadges.forEach(badge => {
    achievements.push({
      type: 'badge',
      badge,
      message: lang === 'es'
        ? `¡Enhorabuena! Has conseguido la insignia "${badge.name[lang] || badge.name["es"]}"`
        : lang === 'en'
          ? `Congratulations! You earned the badge "${badge.name[lang] || badge.name["en"]}"`
          : `Glückwunsch! Du hast das Abzeichen "${badge.name[lang] || badge.name["de"]}" erhalten`
    });
  });

  return achievements;
};

export const awardXP = (
  user: any,
  action: string,
  lang: string = "es"
): { newUser: any; achievements: Achievement[] } => {
  let xpGained = 0;
  let updates: any = {};

  switch (action) {
    case 'send_fine':
      xpGained = 10;
      updates = { totalSent: (user.totalSent || 0) + 1 };
      break;
    case 'pay_fine':
      xpGained = 5;
      updates = { totalPaid: (user.totalPaid || 0) + 1 };
      break;
    case 'fast_payment':
      xpGained = 15;
      updates = {
        totalPaid: (user.totalPaid || 0) + 1,
        fastPayments: (user.fastPayments || 0) + 1
      };
      break;
    case 'create_group':
      xpGained = 25;
      updates = { adminGroups: (user.adminGroups || 0) + 1 };
      break;
    case 'invite_friend':
      xpGained = 20;
      updates = { totalContacts: (user.totalContacts || 0) + 1 };
      break;
    default:
      xpGained = 5;
  }

  const oldUser = { ...user };
  const newUser = {
    ...user,
    ...updates,
    xp: (user.xp || 0) + xpGained,
    badges: user.badges || []
  };

  // Actualizar badges
  const earnedBadges = BADGES.filter(badge =>
    badge.condition(newUser) && !newUser.badges.includes(badge.id)
  );

  earnedBadges.forEach(badge => {
    newUser.xp += badge.xpReward;
    newUser.badges.push(badge.id);
  });

  const achievements = checkNewAchievements(oldUser, newUser, lang);

  return { newUser, achievements };
};
