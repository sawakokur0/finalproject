require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // Импортируем модуль для работы с путями
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- НАСТРОЙКА СТАТИЧЕСКИХ ФАЙЛОВ ---
// Создаем абсолютный путь к папке public
const publicPath = path.join(__dirname, 'public');

// Выводим путь в консоль для проверки (посмотрите это в терминале при запуске!)
console.log("📂 Сервер ищет файлы здесь:", publicPath);

// Указываем Express использовать эту папку
app.use(express.static(publicPath));

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
const db = require("./app/models");
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// --- МАРШРУТЫ API ---
require("./app/routes/auth.routes")(app);
require("./app/routes/class.routes")(app);
require("./app/routes/booking.routes")(app);

// --- ГЛАВНАЯ СТРАНИЦА ---
// Отдаем index.html при заходе на корень сайта
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// ... (ваш код выше)

// --- ОТЛАДКА: ПРОВЕРКА ФАЙЛОВ ---
const fs = require('fs');
const imagesPath = path.join(publicPath, 'images');

console.log("🔍 Проверяем папку:", imagesPath);

fs.readdir(imagesPath, (err, files) => {
  if (err) {
    console.log("❌ Ошибка! Папка images не найдена или недоступна.");
    console.log(err);
  } else {
    console.log("✅ Найдены файлы в папке images:");
    files.forEach(file => {
      console.log(`   - "${file}"`); // Кавычки покажут, нет ли лишних пробелов
    });
  }
});

// app.listen ... (ваш код ниже)