require("dotenv").config();
console.log("Mongo URI is:", process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder (Frontend)
app.use(express.static('public'));

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

// Routes
require("./app/routes/auth.routes")(app);
require("./app/routes/class.routes")(app);
require("./app/routes/booking.routes")(app);

// Simple route for testing
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});