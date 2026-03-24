const msg = document.getElementById("msg");
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}

    if (!res.ok) {
      msg.textContent = data.message || "Login failed";
      msg.style.color = "red";
      return;
    }

    localStorage.setItem("token", data.token);
    msg.textContent = "Login success ✅";
    msg.style.color = "green";

    window.location.href = "./dashboard.html";
  } catch (err) {
    msg.textContent = "Server error ❌";
    msg.style.color = "red";
  }
});