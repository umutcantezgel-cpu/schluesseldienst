// Build-Datum: Ein Release ohne Commit-Datum (Kopie ohne .git) und ohne --datum bricht ab, bevor etwas
// geschrieben wird; ein ungültiges --datum ebenso (Befund der Release-Prüfung).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BAUEN = fileURLToPath(new URL('../bau/bauen.mjs', import.meta.url));

function bauen(extra, env = {}) {
  const tmp = mkdtempSync(join(tmpdir(), 'bau-datum-'));
  const aus = join(tmp, 'aus');
  const r = spawnSync(process.execPath, [BAUEN, '--release', '--ziel=apache', `--aus=${aus}`, ...extra], { encoding: 'utf8', timeout: 60000, env: { ...process.env, ...env } });
  const angelegt = existsSync(aus);
  rmSync(tmp, { recursive: true, force: true });
  return { ...r, angelegt };
}

test('Release ohne Commit-Datum und ohne --datum bricht ab und nennt --datum', () => {
  const r = bauen([], { GIT_DIR: join(tmpdir(), 'kein-git-vorhanden') });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--datum/);
  assert.doesNotMatch(r.stderr, /fatal: not a git repository/);
  assert.equal(r.angelegt, false);
});

test('ungültiges --datum bricht vor dem Schreiben ab', () => {
  const r = bauen(['--datum=2026-13-40']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--datum=2026-13-40/);
  assert.equal(r.angelegt, false);
});
