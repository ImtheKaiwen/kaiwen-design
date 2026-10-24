import { useMemo, useState } from 'react';
import { Button, Input, Select } from '@imthekaiwen/ui-web';
import {
  componentManifest,
  type ComponentManifestEntry,
} from './componentManifest';

const categoryLabels: Readonly<Record<string, string>> = {
  action: 'Eylem',
  data: 'Veri',
  feedback: 'Geri bildirim',
  input: 'Girdi',
  layout: 'Yerleşim',
  loading: 'Yükleme',
  navigation: 'Navigasyon',
  overlay: 'Overlay',
  pattern: 'Pattern',
  preferences: 'Tercihler',
  surface: 'Yüzey',
};

function RegistryEntry({ component }: { component: ComponentManifestEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <details
        className="registry-entry"
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary>
          <span>
            <strong>{component.name}</strong>
            <small>
              {categoryLabels[component.category] ?? component.category}
            </small>
          </span>
          <span className="registry-entry__meta">
            {component.props.length} prop · {component.stories.length} story
          </span>
        </summary>
        {open ? (
          <div className="registry-entry__body">
            <div className="registry-import">
              <span>Import</span>
              <code>{`import { ${component.exportName} } from '${component.importPath}'`}</code>
            </div>
            <div className="registry-entry__columns">
              <div>
                <h4>Props</h4>
                {component.props.length > 0 ? (
                  <ul className="registry-props">
                    {component.props.map((prop) => (
                      <li key={prop.name}>
                        <code>{prop.name}</code>
                        {prop.required ? <span>zorunlu</span> : null}
                        <small>{prop.type}</small>
                        {prop.description ? <p>{prop.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Ek bileşen prop’u yok.</p>
                )}
              </div>
              <div>
                <h4>Stories</h4>
                <div className="registry-chips">
                  {component.states.map((state) => (
                    <code key={state}>{state}</code>
                  ))}
                </div>
                <h4>Tokens</h4>
                <div className="registry-chips">
                  {component.tokens.map((token) => (
                    <code key={token}>{token}</code>
                  ))}
                </div>
              </div>
            </div>
            <footer className="registry-entry__references">
              <span>v{component.since}</span>
              <code>{component.propsReference}</code>
            </footer>
          </div>
        ) : null}
      </details>
    </li>
  );
}

export function ComponentRegistry() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const categories = useMemo(
    () =>
      [...new Set(componentManifest.components.map((item) => item.category))]
        .sort()
        .map((value) => ({
          value,
          label: categoryLabels[value] ?? value,
        })),
    [],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
  const visibleComponents = componentManifest.components.filter((component) => {
    const matchesCategory =
      category === 'all' || component.category === category;
    const searchable = [
      component.name,
      component.exportName,
      component.importPath,
      component.category,
      ...component.props.map((prop) => prop.name),
      ...component.states,
    ]
      .join(' ')
      .toLocaleLowerCase('tr-TR');
    return matchesCategory && searchable.includes(normalizedQuery);
  });
  const hasActiveFilter = normalizedQuery.length > 0 || category !== 'all';
  const renderedComponents =
    hasActiveFilter || showAll
      ? visibleComponents
      : visibleComponents.slice(0, 12);

  return (
    <section className="registry-panel panel" aria-labelledby="registry-title">
      <header className="registry-header">
        <div>
          <span className="doc-number">04</span>
          <h3 id="registry-title">Component registry</h3>
          <p>
            TypeScript API, Storybook durumları ve CSS tokenlarından üretilen
            aranabilir katalog.
          </p>
        </div>
        <div className="registry-stats" aria-label="Registry özeti">
          <strong>{componentManifest.components.length}</strong>
          <span>bileşen · schema v{componentManifest.schemaVersion}</span>
        </div>
      </header>
      <div className="registry-controls">
        <Input
          label="Bileşen ara"
          placeholder="Button, loading, motion…"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Select
          label="Kategori"
          value={category}
          options={[{ value: 'all', label: 'Tüm kategoriler' }, ...categories]}
          onValueChange={setCategory}
        />
      </div>
      <p className="registry-result" role="status" aria-live="polite">
        {renderedComponents.length === visibleComponents.length
          ? `${visibleComponents.length} bileşen gösteriliyor`
          : `${renderedComponents.length} / ${visibleComponents.length} bileşen gösteriliyor`}
      </p>
      {visibleComponents.length > 0 ? (
        <>
          <ul className="registry-list">
            {renderedComponents.map((component) => (
              <RegistryEntry component={component} key={component.name} />
            ))}
          </ul>
          {!hasActiveFilter && visibleComponents.length > 12 ? (
            <div className="registry-more">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll((current) => !current)}
              >
                {showAll
                  ? 'Özet görünümü göster'
                  : `Tüm ${visibleComponents.length} bileşeni göster`}
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="registry-empty">
          Bu arama ve kategoriyle eşleşen bileşen yok.
        </div>
      )}
    </section>
  );
}

export default ComponentRegistry;
