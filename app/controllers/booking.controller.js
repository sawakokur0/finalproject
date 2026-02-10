const db = require("../models");
const Booking = db.booking;
const Class = db.class;

exports.bookClass = async (req, res) => {
  try {
    const classId = req.body.classId;
    const userId = req.userId;

    const session = await Class.findById(classId);
    if (!session) return res.status(404).send({ message: "Class not found" });
    if (session.enrolled >= session.capacity) {
      return res.status(400).send({ message: "Class is full!" });
    }

    const existingBooking = await Booking.findOne({ user: userId, class: classId });
    if (existingBooking) {
      return res.status(400).send({ message: "You already booked this class." });
    }

    const booking = new Booking({ user: userId, class: classId });
    await booking.save();

    session.enrolled += 1;
    await session.save();

    res.send({ message: "Booking successful!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getMyBookings = (req, res) => {
  Booking.find({ user: req.userId })
    .populate("class")
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};