const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMessage");

// Mostrar senha
document.getElementById("showPassword").addEventListener("change", function () {
    const password = document.getElementById("password");
    password.type = this.checked ? "text" : "password";
});

// Submit do login
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    errorMsg.textContent = "";

    // loading
    btn.classList.add("loading");
    btn.textContent = "Entrando...";

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro no login");
        }

        // salva token
        localStorage.setItem("token", data.token);

        // redireciona
        window.location.href = "/dashboard.html";

    } catch (error) {
        errorMsg.textContent = "Email ou senha inválidos";
    }

    // remove loading
    btn.classList.remove("loading");
    btn.textContent = "Entrar";
});