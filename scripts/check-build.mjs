import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { parse } from 'yaml';

const { expo } = JSON.parse(await readFile('app.json', 'utf8'));
for (const path of [expo.icon, expo.android.adaptiveIcon.foregroundImage, expo.web.favicon]) await access(path);
assert.equal(expo.android.package, 'com.tipplease.calculator');
assert.ok(expo.android.blockedPermissions.includes('android.permission.ACCESS_BACKGROUND_LOCATION'));
const workflow = parse(await readFile('.github/workflows/android.yml', 'utf8'));
assert.ok(workflow.on.workflow_dispatch !== undefined);
assert.ok(workflow.jobs.build.steps.some(step => step.run?.includes('assembleRelease')));
assert.equal(workflow.jobs.release.permissions.contents, 'write');
const eas = JSON.parse(await readFile('eas.json', 'utf8'));
assert.equal(eas.build.preview.android.buildType, 'apk');
assert.equal(eas.build.production.android.buildType, 'app-bundle');
console.log('App assets, permissions, GitHub APK workflow, and store build profiles are valid.');