// Select elements
const character = document.getElementById("rpg-character");
const seedDisplay = document.getElementById("character-seed");
const inputs = {
  accessories: document.getElementById("accessories"),
  base: document.getElementById("base"),
  face: document.getElementById("face"),
  hair: document.getElementById("hair"),
  shirt: document.getElementById("shirt"),
  skin: document.getElementById("skin"),
  hat: document.getElementById("hat"),
  fire: document.getElementById("fire"),
  walking: document.getElementById("walking"),
};

// Update character preview
function updateCharacter() {
  const seed =
    inputs.accessories.value +
    inputs.base.value +
    inputs.face.value +
    inputs.hair.value +
    inputs.shirt.value +
    inputs.skin.value;
  
  character.setAttribute("seed", seed);
  character.setAttribute("hat", inputs.hat.selected);
  character.setAttribute("fire", inputs.fire.checked);
  character.setAttribute("walking", inputs.walking.checked);
  
  seedDisplay.textContent = seed;
}

// Add event listeners to inputs
Object.values(inputs).forEach((input) =>
  input.addEventListener("change", updateCharacter)
);

// Share character link
document.getElementById("share").addEventListener("click", () => {
  const params = new URLSearchParams({
    seed: character.getAttribute("seed"),
    hat: character.getAttribute("hat"),
    fire: character.getAttribute("fire"),
    walking: character.getAttribute("walking"),
  });
  
  const shareURL = `${window.location.origin}${window.location.pathname}?${params}`;
  
  navigator.clipboard.writeText(shareURL).then(() => {
    alert(`Character URL copied to clipboard: ${shareURL}`);
  });
});

// Load character from URL parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("seed")) {
  character.setAttribute("seed", urlParams.get("seed"));
  inputs.hat.selected = urlParams.get("hat") || "none";
  inputs.fire.checked = urlParams.get("fire") === "true";
  inputs.walking.checked = urlParams.get("walking") === "true";
  seedDisplay.textContent = urlParams.get("seed");
}