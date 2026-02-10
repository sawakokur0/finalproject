const { verifyToken } = require("../middlewares/authJwt");
const controller = require("../controllers/booking.controller");

module.exports = function(app) {
  app.post("/api/bookings", [verifyToken], controller.bookClass);
  app.get("/api/users/bookings", [verifyToken], controller.getMyBookings);
};