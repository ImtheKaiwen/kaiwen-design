import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const components = [
  { name: 'Button', folder: 'components', category: 'action' },
  { name: 'Switch', folder: 'components', category: 'input' },
  { name: 'Checkbox', folder: 'components', category: 'input', since: '0.2.0' },
  { name: 'Card', folder: 'components', category: 'surface' },
  { name: 'Tooltip', folder: 'components', category: 'overlay' },
  { name: 'Input', folder: 'components', category: 'input' },
  { name: 'Select', folder: 'components', category: 'input' },
  { name: 'CommandPalette', folder: 'components', category: 'overlay' },
  { name: 'Modal', folder: 'components', category: 'overlay' },
  { name: 'Drawer', folder: 'components', category: 'overlay' },
  {
    name: 'DataTable',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  {
    name: 'Pagination',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  {
    name: 'BarChart',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  {
    name: 'PieChart',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  {
    name: 'GroupedBarChart',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  {
    name: 'StackedBarChart',
    folder: 'data',
    category: 'data',
    importPath: '@imthekaiwen/ui-web/data',
    since: '0.2.0',
  },
  { name: 'ThemeSwitcher', folder: 'components', category: 'preferences' },
  { name: 'LanguageSwitcher', folder: 'components', category: 'preferences' },
  { name: 'Skeleton', folder: 'components', category: 'loading' },
  { name: 'Spinner', folder: 'components', category: 'loading' },
  { name: 'Progress', folder: 'components', category: 'loading' },
  { name: 'Alert', folder: 'components', category: 'feedback' },
  { name: 'EmptyState', folder: 'components', category: 'feedback' },
  { name: 'ErrorState', folder: 'components', category: 'feedback' },
  {
    name: 'Toast',
    folder: 'components',
    category: 'feedback',
    propsName: 'ToastProviderProps',
    exportName: 'ToastProvider',
  },
  { name: 'Stack', folder: 'primitives', category: 'layout' },
  { name: 'Inline', folder: 'primitives', category: 'layout' },
  { name: 'Grid', folder: 'primitives', category: 'layout' },
  { name: 'Container', folder: 'primitives', category: 'layout' },
  { name: 'AppShell', folder: 'layouts', category: 'layout' },
  { name: 'PageHeader', folder: 'layouts', category: 'layout' },
  { name: 'Sidebar', folder: 'navigation', category: 'navigation' },
  { name: 'Wizard', folder: 'patterns', category: 'pattern' },
  { name: 'SuccessPage', folder: 'patterns', category: 'pattern' },
  { name: 'ConfirmationPage', folder: 'patterns', category: 'pattern' },
  { name: 'UploadProgress', folder: 'patterns', category: 'pattern' },
  {
    name: 'ReorderableList',
    folder: 'patterns',
    category: 'pattern',
    since: '0.2.0',
  },
];

const styles = await readFile(
  new URL('../packages/ui-web/src/styles.css', import.meta.url),
  'utf8',
);
const publicIndexSources = new Map(
  await Promise.all(
    ['@imthekaiwen/ui-web', '@imthekaiwen/ui-web/data'].map(
      async (importPath) => {
        const sourcePath =
          importPath === '@imthekaiwen/ui-web'
            ? '../packages/ui-web/src/index.ts'
            : '../packages/ui-web/src/data/index.ts';
        return [
          importPath,
          await readFile(new URL(sourcePath, import.meta.url), 'utf8'),
        ];
      },
    ),
  ),
);

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function getJsDoc(node) {
  return normalizeText(
    (node.jsDoc ?? [])
      .map((comment) =>
        typeof comment.comment === 'string' ? comment.comment : '',
      )
      .filter(Boolean)
      .join(' '),
  );
}

function getDeclaredProps(source, sourceName, propsName) {
  const sourceFile = ts.createSourceFile(
    `${sourceName}.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const declaration = sourceFile.statements.find(
    (statement) =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === propsName,
  );
  if (!declaration || !ts.isInterfaceDeclaration(declaration)) {
    throw new Error(`${sourceName} props are not documented as ${propsName}`);
  }
  return declaration.members.filter(ts.isPropertySignature).map((property) => ({
    name: property.name.getText(sourceFile).replaceAll("'", ''),
    required: !property.questionToken,
    type: normalizeText(property.type?.getText(sourceFile) ?? 'unknown'),
    description: getJsDoc(property),
  }));
}

function getStories(storySource, storyReference) {
  const sourceFile = ts.createSourceFile(
    storyReference,
    storySource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  return sourceFile.statements.flatMap((statement) => {
    if (!ts.isVariableStatement(statement)) return [];
    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) return [];
    return statement.declarationList.declarations
      .filter((declaration) => ts.isIdentifier(declaration.name))
      .map((declaration) => {
        const name = declaration.name.getText(sourceFile);
        return {
          name,
          exportName: name,
          reference: `${storyReference}#${name}`,
        };
      });
  });
}

function getTokens(componentName, source) {
  const rootClass = `.kw-${componentName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}`;
  const tokens = new Set(
    [...source.matchAll(/--kw-[a-z0-9-]+/g)].map((match) => match[0]),
  );
  for (const match of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector = '', body = ''] = match;
    if (!selector.includes(rootClass)) continue;
    for (const tokenMatch of body.matchAll(/var\((--kw-[a-z0-9-]+)/g)) {
      tokens.add(tokenMatch[1]);
    }
  }
  return [...tokens].sort();
}

const manifest = {
  schemaVersion: 2,
  package: '@imthekaiwen/ui-web',
  components: [],
};

for (const component of components) {
  const base = new URL(
    `../packages/ui-web/src/${component.folder}/${component.name}/`,
    import.meta.url,
  );
  const sourceName = component.sourceName ?? component.name;
  const sourceUrl = new URL(`${sourceName}.tsx`, base);
  const storyUrl = new URL(`${component.name}.stories.tsx`, base);
  const testUrl = new URL(`${component.name}.test.tsx`, base);
  await Promise.all([access(sourceUrl), access(storyUrl), access(testUrl)]);
  const [source, storySource] = await Promise.all([
    readFile(sourceUrl, 'utf8'),
    readFile(storyUrl, 'utf8'),
  ]);
  const propsName = component.propsName ?? `${component.name}Props`;
  const propsReference = `src/${component.folder}/${component.name}/${sourceName}.tsx`;
  const storyReference = `src/${component.folder}/${component.name}/${component.name}.stories.tsx`;
  const testReference = `src/${component.folder}/${component.name}/${component.name}.test.tsx`;
  const stories = getStories(storySource, storyReference);
  const importPath = component.importPath ?? '@imthekaiwen/ui-web';
  const exportName = component.exportName ?? component.name;
  if (!publicIndexSources.get(importPath)?.includes(exportName)) {
    throw new Error(`${exportName} is not exported from ${importPath}`);
  }
  manifest.components.push({
    name: component.name,
    package: '@imthekaiwen/ui-web',
    importPath,
    exportName,
    status: 'stable',
    platform: 'web',
    category: component.category,
    props: getDeclaredProps(source, sourceName, propsName),
    states: stories.map((story) => story.name),
    tokens: getTokens(component.name, source),
    stories,
    propsReference,
    storyReference,
    testReference,
    since: component.since ?? '0.1.0',
  });
}

const serializedManifest = `${JSON.stringify(manifest, null, 2)}\n`;
const outputs = [
  new URL('../packages/ui-web/dist/component-manifest.json', import.meta.url),
  new URL(
    '../apps/studio/src/documentation/component-manifest.generated.json',
    import.meta.url,
  ),
];

for (const output of outputs) {
  await mkdir(new URL('.', output), { recursive: true });
  await writeFile(output, serializedManifest);
}

console.log(
  `Generated schema v${manifest.schemaVersion} for ${components.length} component API/story/token mappings.`,
);
