import { Card, Task, Move, Category } from '../types';
import { Player, PlayerCreationData, PlayerStats } from '../types/player';

export function validateCard(card: Partial<Card>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!card.name) errors.push('Card name is required');
  if (!card.class) errors.push('Card class is required');
  if (!card.category) errors.push('Card category is required');

  // Ensure stats have default values
  card.stats = {
    attack: card.stats?.attack ?? 10,
    defense: card.stats?.defense ?? 10,
    health: card.stats?.health ?? 100,
    energy: card.stats?.energy ?? 100
  };

  // Default other fields if not provided
  card.description = card.description || '';
  card.rank = card.rank || 'COMMON';
  card.imageUrl = card.imageUrl || '/default-card-image.png';
  card.starLevel = card.starLevel || 1;

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTask(task: Partial<Task>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!task.name) errors.push('Task name is required');
  if (!task.description) errors.push('Task description is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateMove(move: Partial<Move>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!move.name) errors.push('Move name is required');
  if (!move.description) errors.push('Move description is required');
  if (!move.power) errors.push('Move power is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCategory(category: Partial<Category>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!category.name) errors.push('Category name is required');
  if (!category.description) errors.push('Category description is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function showValidationErrors(errors: string[]) {
  if (errors.length > 0) {
    // You can customize this to use a toast library or your preferred notification method
    alert(errors.join('\n'));
  }
}

export function ensureDefaultValues<T>(obj: Partial<T>, defaults: Partial<T>): T {
  return Object.keys(defaults).reduce((acc, key) => {
    acc[key] = obj[key] ?? defaults[key];
    return acc;
  }, {} as T);
}

// Add player validation
export function validatePlayer(player: Partial<PlayerCreationData>): { 
  isValid: boolean; 
  errors: string[]; 
  sanitizedData?: PlayerCreationData 
} {
  const errors: string[] = [];

  // Username validation
  if (!player.username) {
    errors.push('Username is required');
  } else if (player.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!player.email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(player.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!player.password) {
    errors.push('Password is required');
  } else if (player.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Confirm password
  if (player.password !== player.confirmPassword) {
    errors.push('Passwords do not match');
  }

  // Card selection (optional but recommended)
  if (!player.selectedCard) {
    errors.push('Please select a starter card');
  }

  // If no errors, return sanitized data
  const sanitizedData: PlayerCreationData | undefined = errors.length === 0 ? {
    username: player.username!,
    email: player.email!,
    password: player.password!,
    confirmPassword: player.confirmPassword!,
    selectedCard: player.selectedCard
  } : undefined;

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

export function validatePlayerStats(stats: Partial<PlayerStats>): { 
  isValid: boolean; 
  errors: string[]; 
  sanitizedStats: PlayerStats 
} {
  const defaultStats: PlayerStats = {
    level: 1,
    experience: 0,
    gamesPlayed: 0,
    wins: 0,
    coins: 100,
    energy: 100,
    health: 100
  };

  const sanitizedStats: PlayerStats = {
    level: stats.level ?? defaultStats.level,
    experience: stats.experience ?? defaultStats.experience,
    gamesPlayed: stats.gamesPlayed ?? defaultStats.gamesPlayed,
    wins: stats.wins ?? defaultStats.wins,
    coins: stats.coins ?? defaultStats.coins,
    energy: stats.energy ?? defaultStats.energy,
    health: stats.health ?? defaultStats.health
  };

  return {
    isValid: true,
    errors: [],
    sanitizedStats
  };
}

export function validatePlayerInventory(
  inventory: Card[], 
  maxCapacity = 50
): { 
  isValid: boolean; 
  errors: string[]; 
  sanitizedInventory: Card[] 
} {
  const errors: string[] = [];

  if (inventory.length > maxCapacity) {
    errors.push(`Inventory cannot exceed ${maxCapacity} cards`);
  }

  // Optional: Add more complex inventory validation logic
  const uniqueCards = new Set(inventory.map(card => card.id));
  if (uniqueCards.size !== inventory.length) {
    errors.push('Duplicate cards found in inventory');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedInventory: inventory.slice(0, maxCapacity)
  };
}
