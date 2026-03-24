const $ = (id) => document.getElementById(id);

const destinationSelect = $("destinationSelect");
const hotelSelect = $("hotelSelect");

const inputs = {
  days: $("days"),
  people: $("people"),
  travelTotal: $("travelTotal"),
  foodPerPersonPerDay: $("foodPerPersonPerDay"),
  localTransportPerDay: $("localTransportPerDay"),
  activitiesTotal: $("activitiesTotal"),
};

const outputs = {
  hotelCost: $("hotelCost"),
  foodCost: $("foodCost"),
  localCost: $("localCost"),
  travelCost: $("travelCost"),
  activitiesCost: $("activitiesCost"),
  grandTotal: $("grandTotal"),
  perPerson: $("perPerson"),
  destinationPreview: $("destinationPreview"),
};

const API_BASE = "http://127.0.0.1:3000";

let allDestinations = [];
let allHotels = [];
let selectedHotelPrice = 0;

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

async function loadData() {
  try {
    const [destRes, hotelRes] = await Promise.all([
      fetch(`${API_BASE}/api/destinations`),
      fetch(`${API_BASE}/api/hotels`)
    ]);

    if (!destRes.ok) throw new Error("Destinations API error: " + destRes.status);
    if (!hotelRes.ok) throw new Error("Hotels API error: " + hotelRes.status);

    allDestinations = await destRes.json();
    allHotels = await hotelRes.json();

    // safety: ensure arrays
    if (!Array.isArray(allDestinations)) allDestinations = [allDestinations];
    if (!Array.isArray(allHotels)) allHotels = [allHotels];

    populateDestinations();
    resetHotels();
    calculate();
  } catch (err) {
    console.error("Error loading data:", err);
    destinationSelect.innerHTML = `<option value="">Failed to load</option>`;
    hotelSelect.innerHTML = `<option value="">Failed to load</option>`;
  }
}

function populateDestinations() {
  destinationSelect.innerHTML = `<option value="">Select Destination</option>`;

  allDestinations.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.location}, ${d.country}`; // uses your fields
    destinationSelect.appendChild(opt);
  });
}

function resetHotels() {
  hotelSelect.innerHTML = `<option value="">Select Hotel</option>`;
  selectedHotelPrice = 0;
}

function populateHotels(destinationId) {
  resetHotels();

  if (!destinationId) {
    calculate();
    return;
  }

  const filtered = allHotels.filter(
    (h) => String(h.destinationId) === String(destinationId)
  );

  filtered.forEach((h) => {
    const opt = document.createElement("option");
    opt.value = h.id;
    opt.dataset.price = h.pricePerNight;

    // show rating too
    opt.textContent = `${h.name} ⭐${h.rating} (₹${h.pricePerNight}/night)`;
    hotelSelect.appendChild(opt);
  });

  calculate();
}

async function deleteHotel(id) {
  if (!confirm("Are you sure you want to delete this hotel?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/hotels/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    alert(data.message);

    // reload list
    init();

  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
}

function calculate() {
  const days = Math.max(1, toNum(inputs.days.value));
  const people = Math.max(1, toNum(inputs.people.value));

  const travelTotal = Math.max(0, toNum(inputs.travelTotal.value));
  const foodPerPersonPerDay = Math.max(0, toNum(inputs.foodPerPersonPerDay.value));
  const localTransportPerDay = Math.max(0, toNum(inputs.localTransportPerDay.value));
  const activitiesTotal = Math.max(0, toNum(inputs.activitiesTotal.value));

  const hotelCost = selectedHotelPrice * days;
  const foodCost = foodPerPersonPerDay * people * days;
  const localCost = localTransportPerDay * days;

  const total = hotelCost + foodCost + localCost + travelTotal + activitiesTotal;

  outputs.hotelCost.textContent = formatINR(hotelCost);
  outputs.foodCost.textContent = formatINR(foodCost);
  outputs.localCost.textContent = formatINR(localCost);
  outputs.travelCost.textContent = formatINR(travelTotal);
  outputs.activitiesCost.textContent = formatINR(activitiesTotal);
  outputs.grandTotal.textContent = formatINR(total);
  outputs.perPerson.textContent = formatINR(total / people);

  const selectedText =
    destinationSelect.value
      ? destinationSelect.options[destinationSelect.selectedIndex].textContent
      : "—";
  outputs.destinationPreview.textContent = selectedText;
}

destinationSelect.addEventListener("change", () => {
  populateHotels(destinationSelect.value);
});

hotelSelect.addEventListener("change", () => {
  const opt = hotelSelect.options[hotelSelect.selectedIndex];
  selectedHotelPrice = opt ? toNum(opt.dataset.price) : 0;
  calculate();
});

Object.values(inputs).forEach((el) => el.addEventListener("input", calculate));


window.addEventListener("DOMContentLoaded", () => {
  loadData();
});

loadData();