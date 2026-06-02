import type { UserProfile } from '../types';

export function removeUserFromPanel(users: UserProfile[], userId: string): UserProfile[] {
  return users.filter((user) => user.userId !== userId);
}
