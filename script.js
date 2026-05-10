const equippedState = {
  background: "", wings: "", body: "Assets/Body/Body1.png",
  undies: "Assets/Body/Undies.png", eyes: "Assets/Eyes/Eyes1.png",
  eyelashes: "Assets/Eyes/Eyelashes.png", bottom: "", dress: "",
  top1: "", top2: "", belt: "", jacket: "",
  necklace: "", shoe: "", hair: "Assets/Hair/Wavy/Wavy4.png", headband: ""
};

const layers = [
  { id: "background", src: "", z: 0 },
  { id: "frame", src: "Assets/frame.png", z: 1 },
  { id: "wings", src: "", z: 2 },
  { id: "body", src: "Assets/Body/Body1.png", z: 3 },
  { id: "undies", src: "Assets/Body/Undies.png", z: 4 },
  { id: "eyes", src: "Assets/Eyes/Eyes1.png", z: 5 },
  { id: "eyelashes", src: "Assets/Eyes/Eyelashes.png", z: 6 },
  { id: "shoe", src: "", z: 7 },
  { id: "bottom", src: "", z: 8 },
  { id: "top1", src: "", z: 9 },
  { id: "top2", src: "", z: 10 },
  { id: "dress", src: "", z: 11 },
  { id: "belt", src: "", z: 12 },
  { id: "jacket", src: "", z: 13 },
  { id: "necklace", src: "", z: 14 },
  { id: "hair", src: "Assets/Hair/Wavy/Wavy4.png", z: 15 },
  { id: "headband", src: "", z: 16 }
];

const doll = document.getElementById("doll");
layers.forEach(layer => {
  const img = document.createElement("img");
  img.id = layer.id;
  img.src = layer.src;
  img.style.zIndex = layer.z;
  doll.appendChild(img);
});

function changeItem(slot, src) {
  document.getElementById(slot).src = src;
  equippedState[slot] = src;
}

function removeItem(slot) {
  document.getElementById(slot).src = "";
  equippedState[slot] = "";
}

function getSlotForItem(src) {
  if (src.includes("Wings")) return "wings";
  if (src.includes("/Body/")) return "body";
  if (src.includes("Eyelashes")) return "eyelashes";
  if (src.includes("/Eyes/")) return "eyes";
  if (src.includes("/Bottoms/")) return "bottom";
  if (src.includes("FairyDress")) return "dress";
  if (src.includes("/Dresses/")) return "dress";
  if (src.includes("Mermaid-Top")) return null;
  if (src.includes("/Tops/")) return null;
  if (src.includes("Tail")) return "bottom";
  if (src.includes("Belt")) return "belt";
  if (src.includes("/Jackets/")) return "jacket";
  if (src.includes("Necklace")) return "necklace";
  if (src.includes("/Shoes/")) return "shoe";
  if (src.includes("/Hair/")) return "hair";
  if (src.includes("Headband")) return "headband";
  if (src.includes("/Background/")) return "background";
  return null;
}

function isTop(src) {
  return src.includes("/Tops/") || src.includes("Mermaid-Top");
}

function getSrc(el) {
  return el.dataset.src;
}

function handleTopClick(src, img) {
  if (img.classList.contains("equipped")) {
    if (equippedState.top1 === src) {
      removeItem("top1");
      if (equippedState.top2 !== "") {
        changeItem("top1", equippedState.top2);
        removeItem("top2");
      }
    } else if (equippedState.top2 === src) {
      removeItem("top2");
    }
    img.classList.remove("equipped");
    return;
  }

  if (equippedState.top1 === "") {
    changeItem("top1", src);
  } else if (equippedState.top2 === "") {
    changeItem("top2", src);
  } else {
    // Both full — replace top2
    document.querySelectorAll(".menuItem.equipped").forEach(other => {
      if (isTop(getSrc(other)) && equippedState.top2 === getSrc(other)) {
        other.classList.remove("equipped");
      }
    });
    changeItem("top2", src);
  }

  img.classList.add("equipped");
}

const baseSlots = new Set(["body", "eyes"]);

const menu = document.getElementById("menu");
const tabBar = document.createElement("div");
tabBar.id = "tabBar";
const itemGrid = document.createElement("div");
itemGrid.id = "itemGrid";

Object.keys(items).forEach((category, index) => {
  const tab = document.createElement("button");
  tab.textContent = category;
  tab.classList.add("tab");
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadCategory(category);
  });
  tabBar.appendChild(tab);
  if (index === 0) tab.classList.add("active");
});

menu.appendChild(tabBar);
menu.appendChild(itemGrid);

function loadCategory(category) {
  itemGrid.innerHTML = "";
  items[category].forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.dataset.src = src; // store short path here
    img.classList.add("menuItem");

    if (isTop(src)) {
      if (equippedState.top1 === src || equippedState.top2 === src) {
        img.classList.add("equipped");
      }
    } else {
      const slot = getSlotForItem(src);
      if (slot && equippedState[slot] === src) {
        img.classList.add("equipped");
      }
    }

    img.addEventListener("click", () => {
      if (isTop(src)) {
        handleTopClick(src, img);
        return;
      }

      const slot = getSlotForItem(src);
      if (!slot) return;

      if (baseSlots.has(slot)) {
        if (img.classList.contains("equipped")) return;
        document.querySelectorAll(".menuItem.equipped").forEach(other => {
          if (getSlotForItem(getSrc(other)) === slot) other.classList.remove("equipped");
        });
        changeItem(slot, src);
        img.classList.add("equipped");
        return;
      }

      if (img.classList.contains("equipped")) {
        removeItem(slot);
        img.classList.remove("equipped");
      } else {
        document.querySelectorAll(".menuItem.equipped").forEach(other => {
          if (getSlotForItem(getSrc(other)) === slot) other.classList.remove("equipped");
        });
        changeItem(slot, src);
        img.classList.add("equipped");
      }
    });

    itemGrid.appendChild(img);
  });
}

loadCategory(Object.keys(items)[0]);