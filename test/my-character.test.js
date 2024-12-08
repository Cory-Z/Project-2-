import { html, fixture, expect } from '@open-wc/testing';
import "../rpg-me.js";

describe("MyCharacter test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <my-character
        title="title"
      ></my-character>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
