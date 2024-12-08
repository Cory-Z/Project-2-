import { LitElement, html, css } from "lit";
import { WiredInput, WiredSlider, WiredCheckbox, WiredButton } from "wired-elements";
import "@haxtheweb/rpg-character/rpg-character.js";

class CharacterBuilder extends LitElement {
  static get tag() {
    return "character-builder";
  }

  static get properties() {
    return {
      characterSettings: { type: Object },
      seed: { type: String },
    };
  }

  constructor() {
    super();
    this.characterSettings = {
      accessories: 0,
      base: 1,
      face: 0,
      faceitem: 0,
      hair: 0,
      pants: 0,
      shirt: 0,
      skin: 0,
      hat: "none",
      hatcolor: 0,
      fire: false,
      walking: false,
      circle: false,
    };
    this.seed = "1111111111"; // Default seed
    this.updateCharacterFromSeed();
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        font-family: "Arial", sans-serif;
        padding: 20px;
      }

      .character-preview {
        flex: 1;
        max-width: 400px;
        text-align: center;
      }

      .controls {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      wired-slider,
      wired-input,
      wired-checkbox,
      wired-button {
        display: block;
        margin: 10px 0;
      }

      .seed-display {
        margin-top: 10px;
        font-size: 1rem;
        font-weight: bold;
        color: #333;
      }
    `;
  }

  render() {
    return html`
      <div class="character-preview">
        <rpg-character
          id="rpg-character"
          .accessories="${this.characterSettings.accessories}"
          .base="${this.characterSettings.base}"
          .face="${this.characterSettings.face}"
          .faceitem="${this.characterSettings.faceitem}"
          .hair="${this.characterSettings.hair}"
          .pants="${this.characterSettings.pants}"
          .shirt="${this.characterSettings.shirt}"
          .skin="${this.characterSettings.skin}"
          .hat="${this.characterSettings.hat}"
          .hatcolor="${this.characterSettings.hatcolor}"
          .fire="${this.characterSettings.fire}"
          .walking="${this.characterSettings.walking}"
          .circle="${this.characterSettings.circle}"
        ></rpg-character>
        <div class="seed-display">Seed: ${this.seed}</div>
      </div>

      <div class="controls">
        ${this.renderInputs()}
        <wired-button @click="${this.generateShareLink}">Share Character</wired-button>
      </div>
    `;
  }

  renderInputs() {
    const settings = [
      { label: "Accessories", key: "accessories", type: "slider", min: 0, max: 9 },
      { label: "Base", key: "base", type: "slider", min: 1, max: 5 },
      { label: "Face", key: "face", type: "slider", min: 0, max: 5 },
      { label: "Face Item", key: "faceitem", type: "slider", min: 0, max: 9 },
      { label: "Hair", key: "hair", type: "slider", min: 0, max: 9 },
      { label: "Pants", key: "pants", type: "slider", min: 0, max: 9 },
      { label: "Shirt", key: "shirt", type: "slider", min: 0, max: 9 },
      { label: "Skin", key: "skin", type: "slider", min: 0, max: 9 },
      { label: "Hat Color", key: "hatcolor", type: "slider", min: 0, max: 9 },
      { label: "Hat", key: "hat", type: "select", options: ["none", "bunny", "coffee", "construction"] },
      { label: "On Fire", key: "fire", type: "checkbox" },
      { label: "Walking", key: "walking", type: "checkbox" },
    ];

    return settings.map((setting) => {
      if (setting.type === "slider") {
        return html`
          <label>${setting.label}</label>
          <wired-slider
            .value="${this.characterSettings[setting.key]}"
            min="${ifDefined(setting.min)}"
            max="${ifDefined(setting.max)}"
            @change="${(e) => this.updateSetting(setting.key, e.target.value)}"
          ></wired-slider>
        `;
      } else if (setting.type === "checkbox") {
        return html`
          <label>${setting.label}</label>
          <wired-checkbox
            .checked="${this.characterSettings[setting.key]}"
            @change="${(e) => this.updateSetting(setting.key, e.target.checked)}"
          ></wired-checkbox>
        `;
      } else if (setting.type === "select") {
        return html`
          <label>${setting.label}</label>
          <select
            @change="${(e) => this.updateSetting(setting.key, e.target.value)}"
          >
            ${setting.options.map(
              (option) => html`<option value="${option}" ?selected="${this.characterSettings[setting.key] === option}">${option}</option>`
            )}
          </select>
        `;
      }
    });
  }

  updateSetting(key, value) {
    this.characterSettings[key] = value;
    this.generateSeedFromSettings();
    this.requestUpdate();
  }

  generateSeedFromSettings() {
    const {
      accessories,
      base,
      face,
      faceitem,
      hair,
      pants,
      shirt,
      skin,
      hatcolor,
    } = this.characterSettings;
    this.seed = `${accessories}${base}${face}${faceitem}${hair}${pants}${shirt}${skin}${hatcolor}`;
  }

  updateCharacterFromSeed() {
    const values = this.seed.split("").map(Number);
    [
      this.characterSettings.accessories,
      this.characterSettings.base,
      this.characterSettings.face,
      this.characterSettings.faceitem,
      this.characterSettings.hair,
      this.characterSettings.pants,
      this.characterSettings.shirt,
      this.characterSettings.skin,
      this.characterSettings.hatcolor,
    ] = values;
    this.requestUpdate();
  }

  generateShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("seed", this.seed);
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert("Link copied to clipboard!");
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("seed")) {
      this.seed = urlParams.get("seed");
      this.updateCharacterFromSeed();
    }
  }
}

customElements.define(CharacterBuilder.tag, CharacterBuilder);