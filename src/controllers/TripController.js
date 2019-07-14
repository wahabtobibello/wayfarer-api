import Trip from '../models/Trip';

export default class TripController {
  static async create(req, res) {
    const {
      origin, destination, fare, trip_date, bus_id,
    } = req.body;
    const record = await Trip.create({
      origin,
      destination,
      fare,
      trip_date,
      bus_id,
    });
    return res.status(201)
      .json(record);
  }
}
