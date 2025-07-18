import { expect, fixture, html } from '@open-wc/testing';

describe('<wa-accordion>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <wa-accordion></wa-accordion> `);

    expect(el).to.exist;
  });
});
