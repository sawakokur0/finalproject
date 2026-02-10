const { verifyToken } = require("../middlewares/authJwt");
const controller = require("../controllers/booking.controller");

module.exports = function(app) {
  // Protected: Any logged in user
  app.post("/api/bookings", [verifyToken], controller.bookClass);
  app.get("/api/users/bookings", [verifyToken], controller.getMyBookings);
};