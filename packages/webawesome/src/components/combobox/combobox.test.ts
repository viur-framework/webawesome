import { expect, fixture, html } from '@open-wc/testing';

describe('<wa-combobox>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <wa-combobox></wa-combobox> `);

    expect(el).to.exist;
  });
});
