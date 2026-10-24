import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const packageFolders = ['tokens', 'icons', 'motion', 'ui-web'];
const temporaryRoot = await mkdtemp(join(tmpdir(), 'kaiwen-consumer-'));
const packDirectory = join(temporaryRoot, 'packs');
await mkdir(packDirectory);

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result.stdout.trim();
}

try {
  for (const folder of packageFolders) {
    const packageRoot = join(root, 'packages', folder);
    const dryRun = JSON.parse(
      run('npm', ['pack', '--dry-run', '--json'], packageRoot),
    );
    if (!dryRun[0]?.files?.some((file) => file.path.startsWith('dist/'))) {
      throw new Error(`${folder} dry-run tarball does not contain dist output`);
    }
    run(
      'npm',
      ['pack', '--json', '--pack-destination', packDirectory],
      packageRoot,
    );
  }

  await writeFile(
    join(temporaryRoot, 'package.json'),
    JSON.stringify({
      name: 'kaiwen-consumer-smoke',
      private: true,
      type: 'module',
    }),
  );
  const tarballs = packageFolders.map((folder) => {
    const version = run('node', [
      '-e',
      `console.log(require('./packages/${folder}/package.json').version)`,
    ]);
    return join(packDirectory, `imthekaiwen-${folder}-${version}.tgz`);
  });
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      'react@19.3.1',
      'react-dom@19.3.1',
      ...tarballs,
    ],
    temporaryRoot,
  );

  await writeFile(
    join(temporaryRoot, 'consumer.mjs'),
    `
      import React from 'react';
      import { renderToString } from 'react-dom/server';
      import {
        Button, Card, Drawer, KaiwenProvider, Modal, Switch,
        ToastProvider
      } from '@imthekaiwen/ui-web';
      import { PieChart } from '@imthekaiwen/ui-web/data';
      import { Wizard } from '@imthekaiwen/ui-web/patterns';
      import { createRequire } from 'node:module';
      const require = createRequire(import.meta.url);
      require.resolve('@imthekaiwen/ui-web/styles.css');
      const html = renderToString(
        React.createElement(KaiwenProvider, null,
          React.createElement(ToastProvider, null,
            React.createElement(Card, null,
              React.createElement(Button, null, 'Save'),
              React.createElement(Switch, { label: 'Enabled' }),
              React.createElement(Modal, { ariaLabel: 'Modal smoke' }, null),
              React.createElement(Drawer, { ariaLabel: 'Drawer smoke' }, null)
            )
          )
        )
      );
      if (!html.includes('Save') || !PieChart || !Wizard) process.exit(1);
      console.log('Packed consumer smoke passed');
    `,
  );
  const smokeResult = run('node', ['consumer.mjs'], temporaryRoot);
  console.log(smokeResult);
  console.log(
    `Validated ${packageFolders.length} dry-run and installed tarballs.`,
  );
} finally {
  const resolvedTemporaryRoot = resolve(temporaryRoot);
  const resolvedSystemTemp = resolve(tmpdir());
  if (!resolvedTemporaryRoot.startsWith(`${resolvedSystemTemp}\\`)) {
    throw new Error(
      `Refusing to remove unexpected path: ${resolvedTemporaryRoot}`,
    );
  }
  await rm(resolvedTemporaryRoot, { recursive: true, force: true });
}
