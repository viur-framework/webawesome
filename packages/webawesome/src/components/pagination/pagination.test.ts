import { elementUpdated, expect, html } from '@open-wc/testing';
import { fixtures } from '../../internal/test/fixture.js';
import type WaPagination from './pagination.js';

describe('<wa-pagination>', () => {
  for (const fixture of fixtures) {
    describe(`with "${fixture.type}" rendering`, () => {
      it('should render a component', async () => {
        const el = await fixture(html` <wa-pagination></wa-pagination> `);

        expect(el).to.exist;
      });

      describe('accessibility', () => {
        it('should have role="navigation" and an aria-label on the base element', async () => {
          const el = await fixture<WaPagination>(html`<wa-pagination total="100"></wa-pagination>`);
          const base = el.shadowRoot!.querySelector('[part~="base"]')!;

          expect(base.getAttribute('role')).to.equal('navigation');
          expect(base.getAttribute('aria-label')).to.not.be.empty;
        });

        it('should have an aria-label on the prev and next buttons', async () => {
          const el = await fixture<WaPagination>(html`<wa-pagination total="100"></wa-pagination>`);
          const prev = el.shadowRoot!.querySelector('#wa-pagination-prev')!;
          const next = el.shadowRoot!.querySelector('#wa-pagination-next')!;

          expect(prev.getAttribute('aria-label')).to.not.be.empty;
          expect(next.getAttribute('aria-label')).to.not.be.empty;
        });

        it('should have a live region that announces the page after navigating', async () => {
          const el = await fixture<WaPagination>(html`<wa-pagination total="100" page-size="10" value="1"></wa-pagination>`);
          const liveRegion = el.shadowRoot!.querySelector('[role="status"]')!;

          // Starts as a zero-width space, not '', so the SSR-hydrated text binding has a real node to
          // reattach to — an empty initial value breaks hydration for this binding (see pagination.ts).
          expect(liveRegion.textContent).to.equal('\u200B');

          el.goToPage(5);
          await elementUpdated(el);

          expect(liveRegion.textContent).to.not.be.empty;
          expect(liveRegion.textContent).to.contain('5');
        });
      });
    });
  }
});
