// A narrowly scoped, temporary bridge for the v165 -> v167 client cutover.
// This module has no network calls and does not publish or write any files.
import {createHash} from 'node:crypto';

export const sha256 = text => createHash('sha256').update(text, 'utf8').digest('hex');
const oldFunction = /function\s+signedIn\s*\(\s*\)\s*\{\s*return\s+request\.auth\s*!=\s*null\s*;\s*\}/g;
const newFunction = `function signedIn() {
      return request.auth != null
        && (!exists(/databases/$(database)/documents/workIdentities/$(request.auth.uid))
          || get(/databases/$(database)/documents/workIdentities/$(request.auth.uid)).data.kind != 'employee');
    }`;
const bridge = `

    // TEMPORARY v167 client bootstrap bridge. Do not issue employee invitations
    // until the final v167 API/client/download/Rules cutover is verified.
    // Only the authenticated user's own identity marker can be fetched.
    match /workIdentities/{uid} {
      allow get: if request.auth != null && request.auth.uid == uid;
      allow list, write: if false;
    }
    match /workspaces/{document=**} { allow read, write: if false; }
    match /workInvitations/{document=**} { allow read, write: if false; }
    match /employeePrivate/{document=**} { allow read, write: if false; }`;

export function createTransitionRules(published, expectedSha256) {
  if (typeof published !== 'string' || !/^[a-f0-9]{64}$/i.test(expectedSha256 || ''))
    throw new Error('Exact published Rules text and its SHA-256 are required.');
  const actual = sha256(published);
  if (actual !== expectedSha256.toLowerCase()) throw new Error('Published Rules hash mismatch; stop and retrieve the current version.');
  if (!/^\s*rules_version\s*=\s*'2'\s*;/m.test(published)) throw new Error('Expected Firestore Rules version 2.');
  if ((published.match(/match\s+\/databases\/\{database\}\/documents\s*\{/g) || []).length !== 1)
    throw new Error('Unexpected database match; manual review required.');
  if ((published.match(/function\s+signedIn\s*\(/g) || []).length !== 1 || [...published.matchAll(oldFunction)].length !== 1)
    throw new Error('Unexpected signedIn implementation; do not overwrite existing protections.');
  if (/\b(?:workIdentities|workspaces|workInvitations|employeePrivate)\b/.test(published))
    throw new Error('Work paths already exist; a bridge must not duplicate or weaken them.');
  const original = [...published.matchAll(oldFunction)][0][0];
  const eol = published.includes('\r\n') ? '\r\n' : '\n';
  const replacement = (newFunction + bridge).replace(/\n/g, eol);
  const rules = published.replace(original, replacement);
  // Every byte outside this single signedIn function insertion stays unchanged.
  if (rules.replace(replacement, original) !== published) throw new Error('Unexpected unrelated Rules change.');
  return {
    rules,
    sourceSha256: actual,
    transitionSha256: sha256(rules),
    phase: 'temporary-client-bootstrap-only',
    invitesAllowed: false,
    consultLegacyWritePreserved: true,
    warning: 'Not final v167 protection. Keep employee invitations disabled until final Rules are published; old clients require an update before final Consult enforcement.'
  };
}
