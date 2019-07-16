import Booking from '../models/Booking';

export default class TripController {
  static async create(req, res) {
    const {
      trip_id,
    } = req.body;
    const { user } = req.data;
    const { id: user_id } = user;
    const record = await Booking.create({
      user_id,
      trip_id,
    });
    return res.status(201)
      .json({
        status: 'success',
        data: record,
      });
  }

  static async fetch(req, res) {
    const { user } = req.data;
    const { is_admin, user_id } = user;
    let records;
    if (is_admin) {
      records = await Booking.findAll();
    } else {
      records = await Booking.findAll('user_id', user_id);
    }
    return res.status(200)
      .json({
        status: 'success',
        data: records,
      });
  }

  static async delete(req, res) {
    const {
      bookingId,
    } = req.params;
    const record = await Booking.delete(bookingId);
    return res.status(200)
      .json(record);
  }
}
