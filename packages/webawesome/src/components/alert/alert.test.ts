import { expect, waitUntil } from '@open-wc/testing';
import { html } from 'lit';
import sinon from 'sinon';
import { fixtures } from '../../internal/test/fixture.js';
import type WaAlert from './alert.js';

describe('<wa-alert>', () => {
  for (const fixture of fixtures) {
    describe(`with "${fixture.type}" rendering`, () => {
      it('should be visible with the open attribute', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open>Alert</wa-alert> `);

        expect(el.hidden).to.be.false;
      });

      it('should not be visible without the open attribute', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert>Alert</wa-alert> `);

        expect(el.hidden).to.be.true;
      });

      it('should emit wa-show and wa-after-show when calling show()', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert>Alert</wa-alert> `);
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('wa-show', showHandler);
        el.addEventListener('wa-after-show', afterShowHandler);

        el.show();

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(el.hidden).to.be.false;
      });

      it('should emit wa-hide and wa-after-hide when calling hide()', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open>Alert</wa-alert> `);
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('wa-hide', hideHandler);
        el.addEventListener('wa-after-hide', afterHideHandler);

        await el.updateComplete;
        el.hide();

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(el.hidden).to.be.true;
      });

      it('should not open when preventing wa-show', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert>Alert</wa-alert> `);
        const showHandler = sinon.spy((event: Event) => event.preventDefault());

        el.addEventListener('wa-show', showHandler);
        el.open = true;

        await waitUntil(() => showHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(el.open).to.be.false;
        expect(el.hidden).to.be.true;
      });

      it('should not close when preventing wa-hide', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open>Alert</wa-alert> `);
        const hideHandler = sinon.spy((event: Event) => event.preventDefault());

        el.addEventListener('wa-hide', hideHandler);
        el.open = false;

        await waitUntil(() => hideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(el.open).to.be.true;
        expect(el.hidden).to.be.false;
      });

      it('should close when clicking the close button', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open closable>Alert</wa-alert> `);
        const closeButton = el.shadowRoot!.querySelector<HTMLElement>('[part~="close-button"]')!;
        const afterHideHandler = sinon.spy();

        el.addEventListener('wa-after-hide', afterHideHandler);
        closeButton.click();

        await waitUntil(() => afterHideHandler.calledOnce);

        expect(el.open).to.be.false;
        expect(el.hidden).to.be.true;
      });

      it('should auto-hide after the specified duration', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open duration="10">Alert</wa-alert> `);
        const afterHideHandler = sinon.spy();

        el.addEventListener('wa-after-hide', afterHideHandler);

        await waitUntil(() => afterHideHandler.calledOnce);

        expect(el.open).to.be.false;
        expect(el.hidden).to.be.true;
      });

      it('should show a duration progress bar for finite durations', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open duration="5000">Alert</wa-alert> `);

        expect(el.shadowRoot!.querySelector('[part~="progress-bar"]')).to.exist;
      });

      it('should not show a duration progress bar without a finite duration', async () => {
        const el = await fixture<WaAlert>(html` <wa-alert open>Alert</wa-alert> `);

        expect(el.shadowRoot!.querySelector('[part~="progress-bar"]')).to.not.exist;
      });
    });
  }
});
