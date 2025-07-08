
export interface Badge {
  id: string;
  name: string;
  description: string;
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
    name: 'Primera Multa',
    description: 'Enviaste tu primera multa',
    icon: '🎯',
    rarity: 'common',
    condition: (user) => user.totalSent >= 1,
    xpReward: 10
  },
  {
    id: 'early-payer',
    name: 'Pago Rápido',
    description: 'Pagas multas en menos de 24h',
    icon: '⚡',
    rarity: 'common',
    condition: (user) => user.fastPayments >= 3,
    xpReward: 15
  },
  {
    id: 'top-finer',
    name: 'Multador Supremo',
    description: 'Enviaste más de 10 multas',
    icon: '👑',
    rarity: 'rare',
    condition: (user) => user.totalSent >= 10,
    xpReward: 50
  },
  {
    id: 'group-admin',
    name: 'Administrador',
    description: 'Admin de un grupo',
    icon: '🛡️',
    rarity: 'epic',
    condition: (user) => user.adminGroups >= 1,
    xpReward: 30
  },
  {
    id: 'social-butterfly',
    name: 'Mariposa Social',
    description: 'Tienes más de 20 contactos',
    icon: '🦋',
    rarity: 'rare',
    condition: (user) => user.totalContacts >= 20,
    xpReward: 40
  },
  {
    id: 'debt-free',
    name: 'Sin Deudas',
    description: 'No tienes multas pendientes',
    icon: '💎',
    rarity: 'epic',
    condition: (user) => user.pendingFines === 0 && user.totalReceived > 0,
    xpReward: 75
  },
  {
    id: 'master-collector',
    name: 'Coleccionista Maestro',
    description: 'Recaudaste más de 500 CHF',
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

export const checkNewAchievements = (oldUser: any, newUser: any): Achievement[] => {
  const achievements: Achievement[] = [];
  
  // Check XP gain
  if (newUser.xp > oldUser.xp) {
    const xpGained = newUser.xp - oldUser.xp;
    achievements.push({
      type: 'xp',
      xp: xpGained,
      message: `¡Enhorabuena! Has ganado ${xpGained} puntos de experiencia`
    });
  }
  
  // Check level up
  const oldLevel = calculateLevel(oldUser.xp);
  const newLevel = calculateLevel(newUser.xp);
  if (newLevel > oldLevel) {
    achievements.push({
      type: 'level_up',
      newLevel,
      message: `¡Felicidades! Has alcanzado el nivel ${newLevel}`
    });
  }
  
  // Check new badges
  const oldBadges = oldUser.badges || [];
  const newBadges = BADGES.filter(badge => 
    badge.condition(newUser) && !oldBadges.includes(badge.id)
  );
  
  newBadges.forEach(badge => {
    achievements.push({
      type: 'badge',
      badge,
      message: `¡Enhorabuena! Has conseguido la insignia "${badge.name}"`
    });
  });
  
  return achievements;
};

export const awardXP = (user: any, action: string): { newUser: any; achievements: Achievement[] } => {
  let xpGained = 0;
  let updates = {};
  
  switch (action) {
    case 'send_fine':
      xpGained = 10;
      updates = { totalSent: user.totalSent + 1 };
      break;
    case 'pay_fine':
      xpGained = 5;
      updates = { totalPaid: user.totalPaid + 1 };
      break;
    case 'fast_payment':
      xpGained = 15;
      updates = { 
        totalPaid: user.totalPaid + 1,
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
    xp: user.xp + xpGained,
    badges: user.badges || []
  };
  
  // Update badges
  const earnedBadges = BADGES.filter(badge => 
    badge.condition(newUser) && !newUser.badges.includes(badge.id)
  );
  
  earnedBadges.forEach(badge => {
    newUser.xp += badge.xpReward;
    newUser.badges.push(badge.id);
  });
  
  const achievements = checkNewAchievements(oldUser, newUser);
  
  return { newUser, achievements };
};
