console.log("signup.js loaded ✅");

const form = document.getElementById("signupForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // ✅ stop page refresh

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  msg.textContent = "Creating account...";
  msg.style.color = "black";

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("register response:", res.status, data);

    if (!res.ok) {
      msg.textContent = data.message || "Signup failed ❌";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "✅ Signup success! Now login.";
    msg.style.color = "green";

    // optional: clear form
    form.reset();

  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Network error (backend not running?)";
    msg.style.color = "red";
  }
});
