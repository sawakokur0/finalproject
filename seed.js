// seed.js - Скрипт для заполнения базы данных тестовыми занятиями
require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./app/models");
const Class = db.class;

// Данные для добавления (можете изменить даты на актуальные!)
const initialClasses = [
  {
    title: "Morning Yoga",
    trainer: "Anna",
    date: new Date(new Date().setHours(new Date().getHours() + 24)), // Завтра
    description: "Start your day with energy.",
    capacity: 15,
    enrolled: 5
  },
  {
    title: "HIIT Training",
    trainer: "Alina",
    date: new Date(new Date().setHours(new Date().getHours() + 26)), // Завтра + 2 часа
    description: "Intense cardio workout.",
    capacity: 10,
    enrolled: 0
  },
  {
    title: "Pilates",
    trainer: "Sarah",
    date: new Date(new Date().setHours(new Date().getHours() + 48)), // Послезавтра
    description: "Core strength and flexibility.",
    capacity: 12,
    enrolled: 12 // Полная группа (для теста кнопки Full)
  },
  {
    title: "Strength Training",
    trainer: "Maria",
    date: new Date(new Date().setHours(new Date().getHours() + 50)), // Послезавтра + 2 часа
    description: "Basic strength training techniques.",
    capacity: 20,
    enrolled: 3
  }
];

// Подключение к БД и добавление данных
mongoose
  .connect(db.url)
  .then(async () => {
    console.log("Connected to MongoDB...");
    
    // Очистить старые данные (чтобы не дублировать при повторном запуске)
    await Class.deleteMany({});
    console.log("Old classes removed.");

    // Добавить новые
    await Class.insertMany(initialClasses);
    console.log(`✅ Successfully added ${initialClasses.length} classes into database!`);
    
    process.exit();
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit();
  });