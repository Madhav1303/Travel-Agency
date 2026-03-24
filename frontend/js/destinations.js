const container = document.getElementById("destinationsContainer");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/destinations");
    if (!res.ok) throw new Error("API error: " + res.status);

    const destinations = await res.json();
    container.innerHTML = "";

    destinations.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img class="card-img" src="http://localhost:3000${d.image}" alt="${d.name}">
        <div class="card-body">
          <h3>${d.location},${d.country}</h3>
          <p><b>Starting ₹${d.price}</b></p>
          <p>${d.description}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Failed to load destinations.</p>";
  }
});
