const container = document.getElementById("hotelsContainer");

const searchInput = document.getElementById("searchInput");
const maxPriceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sortSelect");
const clearBtn = document.getElementById("clearBtn");

let allHotels = [];

function renderHotels(list) {
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No hotels found.</p>";
    return;
  }

  list.forEach((h) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <img class="card-img" src="http://localhost:3000${h.image}">
  <h3>${h.name}</h3>
  <p>⭐ ${h.rating}</p>
  <p>₹${h.pricePerNight} / night</p>
  <button onclick="deleteHotel(${h.id})">Delete</button>
`;

    container.appendChild(card);
  });
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(maxPriceInput.value);
  const sort = sortSelect.value;

  let filtered = allHotels.filter((h) => {
    const nameMatch = h.name?.toLowerCase().includes(q);
    const priceMatch = !maxPriceInput.value || h.pricePerNight <= maxPrice;
    return nameMatch && priceMatch;
  });

  if (sort === "rating-desc") {
    filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (sort === "price-asc") {
    filtered.sort((a, b) => (a.pricePerNight ?? 0) - (b.pricePerNight ?? 0));
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => (b.pricePerNight ?? 0) - (a.pricePerNight ?? 0));
  }

  renderHotels(filtered);
}

async function init() {
  try {
    const res = await fetch("http://localhost:3000/api/hotels");
    if (!res.ok) throw new Error("API error: " + res.status);

    allHotels = await res.json();
    renderHotels(allHotels);

    // Re-filter on any change
    searchInput.addEventListener("input", applyFilters);
    maxPriceInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      maxPriceInput.value = "";
      sortSelect.value = "";
      renderHotels(allHotels);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:red;">Failed to load hotels.</p>`;
  }
}

window.addEventListener("DOMContentLoaded", init);