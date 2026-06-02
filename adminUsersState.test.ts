import assert from 'node:assert/strict';
import { test } from 'node:test';

import { removeUserFromPanel } from './src/pages/adminUsersState.ts';
import type { UserProfile } from './src/types/index.ts';

const users: UserProfile[] = [
  {
    userId: 'owner-1',
    email: 'owner@example.com',
    displayName: 'Owner',
    role: 'owner',
    status: 'active',
  },
  {
    userId: 'inactive-1',
    email: 'inactive@example.com',
    displayName: 'Inactive',
    role: 'user',
    status: 'inactive',
  },
];

test('removes a deleted account from the admin panel list', () => {
  assert.deepEqual(
    removeUserFromPanel(users, 'inactive-1').map((user) => user.userId),
    ['owner-1']
  );
});

test('keeps the current list unchanged when the account is not found', () => {
  assert.deepEqual(removeUserFromPanel(users, 'missing'), users);
});
