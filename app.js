const places = {
  taipei: {
    name: "Taipei, Taiwan",
    description:
      "Between mountain trails and neon-lit lanes, Taipei offers a seamless blend of ancient temples, sizzling street food, and design-forward cafés.",
    highlights: [
      "Ride the glass-floor gondola up Maokong for sunset tea ceremonies.",
      "Eat your way through Shilin Night Market&apos;s street food legends.",
      "Discover creative boutiques in the Songshan Cultural Park warehouses."
    ],
    quickFacts: ["Night markets", "Tea culture", "Hot springs"]
  },
  paris: {
    name: "Paris, France",
    description:
      "All-day art crawls, golden-hour picnics by the Seine, and indie fashion dens tucked behind wrought-iron balconies—Paris is pure inspiration.",
    highlights: [
      "Watch the Eiffel Tower sparkle from the Trocadéro gardens at dusk.",
      "Treat yourself to fresh pastries and people-watching in Le Marais.",
      "Bike the Left Bank to discover hidden bookshops and gallery pop-ups."
    ],
    quickFacts: ["Iconic skyline", "Art museums", "Riverside picnics"]
  },
  capeTown: {
    name: "Cape Town, South Africa",
    description:
      "This coastal gem mixes dramatic Table Mountain hikes, penguin-dotted beaches, and wine estates with award-winning cuisine and design hotels.",
    highlights: [
      "Hike Lion&apos;s Head for sunrise and a 360° ocean panorama.",
      "Meet the Boulders Beach penguin colony up close.",
      "Sip Sauvignon Blanc in the Constantia vineyards just minutes from town."
    ],
    quickFacts: ["Coastal drives", "Wildlife", "Wine estates"]
  },
  london: {
    name: "London, United Kingdom",
    description:
      "Heritage landmarks share the skyline with sky gardens, street food halls, and pop-up performances—London rewrites itself every weekend.",
    highlights: [
      "Visit the Tate Modern before sunset cocktails at the Sky Garden.",
      "Snack your way through Borough Market&apos;s global food stalls.",
      "Explore colorful mews and murals in Notting Hill and Shoreditch."
    ],
    quickFacts: ["Museums", "Markets", "Music"]
  },
  tokyo: {
    name: "Tokyo, Japan",
    description:
      "From tranquil Shinto shrines to futuristic neighborhoods of neon, Tokyo keeps energy high and aesthetics impeccable in every district.",
    highlights: [
      "Catch the first light at Senso-ji Temple before the crowds arrive.",
      "Sip artisan coffee in Daikanyama then browse design studios.",
      "Sing karaoke in Golden Gai after a sushi omakase dinner."
    ],
    quickFacts: ["Culinary adventures", "Design", "Nightlife"]
  },
  lagoComo: {
    name: "Lago di Como, Italy",
    description:
      "Bell towers, cypress gardens, and mountains plunging into mirror-still waters—Lake Como is the definition of cinematic daydreaming.",
    highlights: [
      "Cruise between Bellagio and Varenna for pastel-perfect harbor views.",
      "Tour the botanical wonders of Villa del Balbianello.",
      "Enjoy aperitivo hour as the alpenglow hits the surrounding Alps."
    ],
    quickFacts: ["Lake life", "Boutique villas", "Aperitivo"]
  }
};

const state = {
  pinned: new Set(),
  active: null
};

const discoverCards = document.querySelectorAll(".destination-card");
const viewSections = document.querySelectorAll(".view");
const navTabs = document.querySelectorAll(".nav-tab");
const globePins = document.querySelectorAll(".globe-pin");
const pinnedList = document.getElementById("pinned-list");
const activeName = document.getElementById("active-destination-name");
const activeDescription = document.getElementById("active-destination-description");
const activeHighlights = document.getElementById("active-destination-highlights");

function toggleView(targetId) {
  viewSections.forEach((section) => {
    section.classList.toggle("is-visible", section.id === targetId);
  });

  navTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.target === targetId);
  });
}

function togglePin(placeId) {
  if (!places[placeId]) return;

  if (state.pinned.has(placeId)) {
    state.pinned.delete(placeId);
    if (state.active === placeId) {
      state.active = null;
    }
  } else {
    state.pinned.add(placeId);
    state.active = placeId;
  }

  renderPins();
  renderActiveDestination();
  renderPinnedList();
}

function renderPins() {
  globePins.forEach((pin) => {
    const placeId = pin.dataset.place;
    pin.classList.toggle("is-pinned", state.pinned.has(placeId));
  });

  discoverCards.forEach((card) => {
    const placeId = card.dataset.place;
    card.classList.toggle("is-selected", state.pinned.has(placeId));
  });
}

function renderActiveDestination() {
  const activeId = state.active;
  if (!activeId || !places[activeId]) {
    activeName.textContent = "Select a destination";
    activeDescription.textContent = "Tap a pin on the globe to see why travelers rave about it.";
    activeHighlights.innerHTML = "";
    return;
  }

  const { name, description, highlights } = places[activeId];
  activeName.textContent = name;
  activeDescription.textContent = description;
  activeHighlights.innerHTML = "";
  highlights.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    activeHighlights.appendChild(li);
  });
}

function renderPinnedList() {
  pinnedList.innerHTML = "";

  if (!state.pinned.size) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No pins yet—tap a city to start crafting your itinerary.";
    pinnedList.appendChild(empty);
    return;
  }

  state.pinned.forEach((placeId) => {
    const place = places[placeId];
    if (!place) return;

    const card = document.createElement("article");
    card.className = "pinned-card";

    const header = document.createElement("header");
    const title = document.createElement("h4");
    title.textContent = place.name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.className = "remove-pin";
    remove.addEventListener("click", () => {
      state.pinned.delete(placeId);
      if (state.active === placeId) {
        state.active = null;
      }
      renderPins();
      renderActiveDestination();
      renderPinnedList();
    });

    header.appendChild(title);
    header.appendChild(remove);
    card.appendChild(header);

    const subtitle = document.createElement("span");
    subtitle.textContent = place.description.split(".")[0] + ".";
    card.appendChild(subtitle);

    const factList = document.createElement("ul");
    place.quickFacts.forEach((fact) => {
      const pill = document.createElement("li");
      pill.textContent = fact;
      factList.appendChild(pill);
    });

    card.appendChild(factList);
    pinnedList.appendChild(card);
  });
}

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    toggleView(tab.dataset.target);
  });
});

discoverCards.forEach((card) => {
  card.addEventListener("click", () => {
    state.active = card.dataset.place;
    togglePin(card.dataset.place);
    toggleView("assistant");
  });
});

globePins.forEach((pin) => {
  pin.addEventListener("click", () => {
    state.active = pin.dataset.place;
    togglePin(pin.dataset.place);
  });
});

renderPins();
renderPinnedList();
