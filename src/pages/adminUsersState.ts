import type { UserProfile } from '../types';

export function removeUserFromPanel(users: UserProfile[], userId: string): UserProfile[] {
  return users.filter((user) => user.userId !== userId);
}

export function hideRemovedUsers(users: UserProfile[], removedUserIds: Set<string>): UserProfile[] {
  return users.filter((user) => !removedUserIds.has(user.userId));
}
