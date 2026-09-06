import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransitionRules, sha256} from './transition-rules-v167.mjs';

const base = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    match /users/{userId}/private/{documentId} {
      allow read, write: if signedIn() && request.auth.uid == userId;
    }
  }
}
`;
test('only the bootstrap function insertion changes; private legacy grants stay intact', () => {
  const result = createTransitionRules(base, sha256(base));
  assert(result.rules.includes('allow read, write: if signedIn() && request.auth.uid == userId;'));
  assert(result.rules.includes("data.kind != 'employee'"));
  assert(result.rules.includes('allow get: if request.auth != null && request.auth.uid == uid;'));
  assert(result.rules.includes('allow list, write: if false;'));
  assert.equal(result.invitesAllowed, false);
  assert.equal(result.sourceSha256, sha256(base));
  assert.equal(result.transitionSha256, sha256(result.rules));
});
test('CRLF input retains CRLF without mixed line endings', () => {
  const text = base.replace(/\n/g, '\r\n');
  const result = createTransitionRules(text, sha256(text));
  assert(!/(?<!\r)\n/.test(result.rules));
});
test('changed or unverified source hash fails closed', () => {
  assert.throws(() => createTransitionRules(base, '0'.repeat(64)), /hash mismatch/);
  assert.throws(() => createTransitionRules(base), /SHA-256/);
});
test('existing Work protection is not overwritten or duplicated', () => {
  const existing = createTransitionRules(base, sha256(base)).rules;
  assert.throws(() => createTransitionRules(existing, sha256(existing)), /Unexpected signedIn|already exist/);
});
test('unknown signedIn, multiple declarations and database scopes require manual review', () => {
  for (const text of [base.replace('request.auth != null', 'false'), base + '\nfunction signedIn() { return false; }', base + '\nmatch /databases/{database}/documents {}'])
    assert.throws(() => createTransitionRules(text, sha256(text)), /Unexpected/);
});
test('a preexisting Work match or non-v2 file fails closed', () => {
  for (const text of [base.replace('service cloud.firestore', '// workspaces already tracked\nservice cloud.firestore'), base.replace("'2'", "'1'")])
    assert.throws(() => createTransitionRules(text, sha256(text)), /already exist|version 2/);
});
