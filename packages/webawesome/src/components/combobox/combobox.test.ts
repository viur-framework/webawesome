import { expect, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { fixtures } from '../../internal/test/fixture.js';
import type WaCombobox from './combobox.js';
import type { SuggestionSource } from './combobox.js';

describe('<wa-combobox>', () => {
  for (const fixture of fixtures) {
    describe(`with "${fixture.type}" rendering`, () => {
      it('should render a component', async () => {
        const el = await fixture(html` <wa-combobox></wa-combobox> `);

        expect(el).to.exist;
      });

      describe('highlightSearchTextInSuggestions', () => {
        it('should highlight a plain-text match', async () => {
          const el = await fixture<WaCombobox>(html` <wa-combobox></wa-combobox> `);
          const result = el.highlightSearchTextInSuggestions([{ text: 'foobar', value: 'foobar' }], 'foo');

          expect(result[0].text).to.equal('<span class="highlight">foo</span>bar');
        });

        it('should not throw when the search text contains regex special characters', async () => {
          const el = await fixture<WaCombobox>(html` <wa-combobox></wa-combobox> `);

          expect(() =>
            el.highlightSearchTextInSuggestions([{ text: 'foo(bar', value: 'foo(bar' }], 'foo('),
          ).to.not.throw();
        });

        it('should treat regex special characters in the search text as literal', async () => {
          const el = await fixture<WaCombobox>(html` <wa-combobox></wa-combobox> `);
          const result = el.highlightSearchTextInSuggestions([{ text: 'foo(bar', value: 'foo(bar' }], 'foo(');

          expect(result[0].text).to.equal('<span class="highlight">foo(</span>bar');
        });
      });

      describe('accessibility', () => {
        it('should announce the number of suggestions in the live region', async () => {
          const source: SuggestionSource = async () => [
            { text: 'test', value: 'test' },
            { text: 'test2', value: 'test2' },
          ];
          const el = await fixture<WaCombobox>(html`<wa-combobox></wa-combobox>`);
          el.source = source;
          const liveRegion = el.shadowRoot?.querySelector('[role="status"]')!;

          el.displayInput.focus();
          await sendKeys({ type: 't' });

          expect(liveRegion.textContent).to.contain('2');
        });

        it('should announce the empty message in the live region when there are no suggestions', async () => {
          const source: SuggestionSource = async () => [];
          const el = await fixture<WaCombobox>(html`<wa-combobox></wa-combobox>`);
          el.source = source;
          const liveRegion = el.shadowRoot?.querySelector('[role="status"]')!;

          el.displayInput.focus();
          await sendKeys({ type: 'a' });

          expect(liveRegion.textContent).to.contain(el.emptyMessage);
        });
      });
    });
  }
});
