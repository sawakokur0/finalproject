// auth.js - Логика авторизации и работы с API

const API_BASE_URL = "http://localhost:8080/api";

// --- 1. ПРОВЕРКА СТАТУСА ПРИ ЗАГРУЗКЕ ---
document.addEventListener("DOMContentLoaded", () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.accessToken) {
        // Пользователь вошел
        $("#nav-login, #nav-signup").addClass("d-none");
        $("#nav-profile, #nav-logout").removeClass("d-none");
        
        // Если мы на странице профиля, заполняем данные
        if (window.location.pathname.includes("profile.html")) {
            $("#profile-welcome").text(`Welcome, ${user.username}!`);
            $("#profile-name").text(user.username);
            $("#profile-email").text(user.email);
            loadMyBookings(user.accessToken);
        }
    } else {
        // Гость
        $("#nav-login, #nav-signup").removeClass("d-none");
        $("#nav-profile, #nav-logout").addClass("d-none");
        
        // Если неавторизованный пытается зайти в профиль
        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "login.html";
        }
    }

    // Обработчик кнопки выхода
    $("#nav-logout, #profile-logout-btn").on("click", (e) => {
        e.preventDefault();
        logout();
    });
});

// --- 2. РЕГИСТРАЦИЯ ---
$("#signup-form").on("submit", async function(e) {
    e.preventDefault();
    
    const username = $("#signup-name").val();
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();

    // Очистка сообщений
    $("#signup-error").addClass("d-none");
    $("#signup-success").addClass("d-none");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            $("#signup-success").text(data.message).removeClass("d-none");
            setTimeout(() => window.location.href = "login.html", 2000);
        } else {
            $("#signup-error").text(data.message || "Error occurred").removeClass("d-none");
        }
    } catch (error) {
        console.error("Error:", error);
        $("#signup-error").text("Server connection failed").removeClass("d-none");
    }
});

// --- 3. ВХОД (LOGIN) ---
$("#login-form").on("submit", async function(e) {
    e.preventDefault();

    const email = $("#login-email").val();
    const password = $("#login-password").val();

    $("#login-error").addClass("d-none");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем пользователя и токен
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "profile.html";
        } else {
            $("#login-error").text(data.message || "Invalid credentials").removeClass("d-none");
        }
    } catch (error) {
        console.error("Error:", error);
        $("#login-error").text("Server connection failed").removeClass("d-none");
    }
});

// --- 4. ВЫХОД ---
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// --- 5. ЗАГРУЗКА БРОНИРОВАНИЙ (Для профиля) ---
async function loadMyBookings(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/bookings`, {
            method: "GET",
            headers: { "x-access-token": token }
        });
        
        const bookings = await response.json();
        const container = $("#my-bookings-list"); // Убедитесь, что этот ID есть в profile.html
        
        if (container.length) {
            container.empty();
            if (bookings.length === 0) {
                container.append('<li class="list-group-item">No bookings yet.</li>');
                return;
            }

            bookings.forEach(b => {
                // Проверка на удаленный класс
                if(!b.class) return; 

                const date = new Date(b.class.date).toLocaleString();
                container.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${b.class.title}</strong> with ${b.class.trainer}
                            <br>
                            <small class="text-muted">${date}</small>
                        </div>
                        <span class="badge bg-success rounded-pill">Active</span>
                    </li>
                `);
            });
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}