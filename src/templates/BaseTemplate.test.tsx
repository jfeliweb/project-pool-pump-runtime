import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import messages from '@/locales/en.json';
import { BaseTemplate } from './BaseTemplate';

describe('Base template', () => {
  describe('Render method', () => {
    it('should render children content', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate>
            <div>Test content</div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      const content = page.getByText('Test content');

      expect(content).toBeDefined();
    });

    it('should wrap content in main element', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate>
            <p>Content</p>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      const main = page.getByRole('main');
      const content = main.getByText('Content');

      expect(main).toBeDefined();
      expect(content).toBeDefined();
    });
  });
});
