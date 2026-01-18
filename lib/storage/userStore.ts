import { User } from '@/types/user';

// Simple in-memory store for demo purposes
const usersStore = new Map<string, User>();

export function createUser(id: string, name: string, email: string): User {
  const user: User = {
    id,
    name,
    email,
    soulColorId: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  usersStore.set(id, user);
  return user;
}

export function getUser(id: string): User | undefined {
  return usersStore.get(id);
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const user = usersStore.get(id);
  if (!user) return undefined;
  
  const updated = { ...user, ...updates, updatedAt: new Date() };
  usersStore.set(id, updated);
  return updated;
}

export function getAllUsers(): User[] {
  return Array.from(usersStore.values());
}
