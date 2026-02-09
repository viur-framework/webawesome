import { expect, fixture, html } from '@open-wc/testing';

describe('<wa-pagination>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <wa-pagination></wa-pagination> `);

    expect(el).to.exist;
  });
});
