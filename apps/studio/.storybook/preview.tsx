import type { Preview } from '@storybook/react-vite';
import { KaiwenProvider } from '@imthekaiwen/ui-web';
import '@imthekaiwen/ui-web/styles.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <KaiwenProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </KaiwenProvider>
    ),
  ],
  parameters: { a11y: { test: 'error' }, controls: { expanded: true } },
};
export default preview;
