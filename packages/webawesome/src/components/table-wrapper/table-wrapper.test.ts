import { expect, fixture, html } from '@open-wc/testing';

describe('<wa-table-wrapper>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <wa-table-wrapper></wa-table-wrapper> `);

    expect(el).to.exist;
  });
});
