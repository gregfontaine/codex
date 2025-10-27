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
    quickFacts: ["Night markets", "Tea culture", "Hot springs"],
    coords: { lat: 25.033, lng: 121.5654 }
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
    quickFacts: ["Iconic skyline", "Art museums", "Riverside picnics"],
    coords: { lat: 48.8566, lng: 2.3522 }
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
    quickFacts: ["Coastal drives", "Wildlife", "Wine estates"],
    coords: { lat: -33.9249, lng: 18.4241 }
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
    quickFacts: ["Museums", "Markets", "Music"],
    coords: { lat: 51.5072, lng: -0.1276 }
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
    quickFacts: ["Culinary adventures", "Design", "Nightlife"],
    coords: { lat: 35.6762, lng: 139.6503 }
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
    quickFacts: ["Lake life", "Boutique villas", "Aperitivo"],
    coords: { lat: 46.016, lng: 9.257 }
  }
};

const state = {
  pinned: new Set(),
  active: null
};

const discoverCards = document.querySelectorAll(".destination-card");
const viewSections = document.querySelectorAll(".view");
const navTabs = document.querySelectorAll(".nav-tab");
const pinnedList = document.getElementById("pinned-list");
const activeName = document.getElementById("active-destination-name");
const activeDescription = document.getElementById("active-destination-description");
const activeHighlights = document.getElementById("active-destination-highlights");
const globeElement = document.querySelector(".globe");
const pinLayer = document.querySelector(".globe-pin-layer");
const globeCanvas = document.getElementById("earth-canvas");

const pinButtons = new Map();
const placeAnchors = {};

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
  pinButtons.forEach((button, placeId) => {
    button.classList.toggle("is-pinned", state.pinned.has(placeId));
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

function latLongToVector(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
}

function initializeGlobe() {
  if (!globeElement || !pinLayer || !globeCanvas || typeof THREE === "undefined") {
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: globeCanvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 3.2;

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const loader = new THREE.TextureLoader();
  const surfaceTexture = loader.load("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg");
  const normalTexture = loader.load("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-normal.jpg");

  const globeMaterial = new THREE.MeshStandardMaterial({
    map: surfaceTexture,
    normalMap: normalTexture,
    metalness: 0.18,
    roughness: 0.9
  });

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 128), globeMaterial);
  earthGroup.add(sphere);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x5dade2, transparent: true, opacity: 0.18, side: THREE.BackSide })
  );
  earthGroup.add(atmosphere);

  scene.add(new THREE.AmbientLight(0x27364d, 0.65));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
  keyLight.position.set(5, 3, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.45);
  rimLight.position.set(-4, -2, -5);
  scene.add(rimLight);

  Object.entries(places).forEach(([id, place]) => {
    if (!place.coords) return;

    const anchor = new THREE.Object3D();
    anchor.position.copy(latLongToVector(place.coords.lat, place.coords.lng, 1.02));
    earthGroup.add(anchor);
    placeAnchors[id] = anchor;

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "globe-pin";
    pin.dataset.place = id;
    pin.setAttribute("aria-label", `Pin ${place.name}`);
    pin.addEventListener("click", () => {
      state.active = id;
      togglePin(id);
    });
    pinLayer.appendChild(pin);
    pinButtons.set(id, pin);
  });

  const worldPosition = new THREE.Vector3();
  const projectedPosition = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();

  function updatePinPositions() {
    const width = globeElement.clientWidth;
    const height = globeElement.clientHeight;

    pinButtons.forEach((button, placeId) => {
      const anchor = placeAnchors[placeId];
      if (!anchor) return;

      anchor.getWorldPosition(worldPosition);
      cameraPosition.copy(worldPosition).applyMatrix4(camera.matrixWorldInverse);
      const visible = cameraPosition.z < 0;
      projectedPosition.copy(worldPosition).project(camera);

      const x = (projectedPosition.x * 0.5 + 0.5) * width;
      const y = (-projectedPosition.y * 0.5 + 0.5) * height;

      if (Number.isFinite(x) && Number.isFinite(y)) {
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
      }

      button.classList.toggle("is-visible", visible);
      if (!visible) {
        button.blur();
      }
    });
  }

  function resizeRenderer() {
    const { clientWidth, clientHeight } = globeElement;
    if (clientWidth && clientHeight) {
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  let isDragging = false;
  let lastPointer = { x: 0, y: 0 };
  let inertia = { x: 0, y: 0 };
  const maxTilt = Math.PI / 2.2;

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    isDragging = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    inertia = { x: 0, y: 0 };
    if (globeCanvas.setPointerCapture) {
      globeCanvas.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerMove(event) {
    if (!isDragging) return;
    const deltaX = event.clientX - lastPointer.x;
    const deltaY = event.clientY - lastPointer.y;

    lastPointer = { x: event.clientX, y: event.clientY };

    earthGroup.rotation.y += deltaX * 0.005;
    earthGroup.rotation.x = THREE.MathUtils.clamp(
      earthGroup.rotation.x + deltaY * 0.003,
      -maxTilt,
      maxTilt
    );

    inertia = {
      x: deltaX * 0.0009,
      y: deltaY * 0.0007
    };
  }

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    if (event.pointerId !== undefined && globeCanvas.hasPointerCapture && globeCanvas.hasPointerCapture(event.pointerId)) {
      globeCanvas.releasePointerCapture(event.pointerId);
    }
  }

  globeCanvas.addEventListener("pointerdown", handlePointerDown);
  globeCanvas.addEventListener("pointermove", handlePointerMove);
  globeCanvas.addEventListener("pointerup", endDrag);
  globeCanvas.addEventListener("pointerleave", endDrag);
  globeCanvas.addEventListener("pointercancel", endDrag);

  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      earthGroup.rotation.y += 0.0015 + inertia.x;
      earthGroup.rotation.x = THREE.MathUtils.clamp(
        earthGroup.rotation.x + inertia.y,
        -maxTilt,
        maxTilt
      );
      inertia.x *= 0.95;
      inertia.y *= 0.92;
    }

    renderer.render(scene, camera);
    updatePinPositions();
  }

  resizeRenderer();
  updatePinPositions();
  animate();

  window.addEventListener("resize", () => {
    resizeRenderer();
    updatePinPositions();
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

initializeGlobe();
renderPins();
renderActiveDestination();
renderPinnedList();
