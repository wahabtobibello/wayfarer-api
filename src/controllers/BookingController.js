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
    return res.status(501)
      .json({});
  }

  static async delete(req, res) {
    return res.status(501)
      .json({});
  }
}
