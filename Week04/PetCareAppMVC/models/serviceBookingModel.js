const connection = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  connection.beginTransaction((beginErr) => {
    if (beginErr) {
      return callback(beginErr);
    }

    const rollbackAndFail = (err) => {
      connection.rollback(() => callback(err));
    };

    connection.query(
      'SELECT id FROM pets WHERE id = ? AND owner_id = ?',
      [petId, ownerId],
      (petErr, petRows) => {
        if (petErr) return rollbackAndFail(petErr);

        if (!petRows || petRows.length === 0) {
          return connection.rollback(() => callback(null, null));
        }

        connection.query(
          'SELECT id, price FROM services WHERE id = ? AND is_active = 1',
          [serviceId],
          (serviceErr, serviceRows) => {
            if (serviceErr) return rollbackAndFail(serviceErr);

            if (!serviceRows || serviceRows.length === 0) {
              return connection.rollback(() => callback(null, null));
            }

            const bookedPrice = serviceRows[0].price;

            connection.query(
              'INSERT INTO service_bookings (pet_id, service_id, booking_status, booked_price, booking_date) VALUES (?, ?, ?, ?, ?)',
              [petId, serviceId, 'pending', bookedPrice, bookingDate],
              (bookingErr, bookingResult) => {
                if (bookingErr) return rollbackAndFail(bookingErr);

                const bookingId = bookingResult.insertId;

                connection.query(
                  'INSERT INTO payments (booking_id, amount, payment_status, payment_reference) VALUES (?, ?, ?, NULL)',
                  [bookingId, bookedPrice, 'pending'],
                  (paymentErr, paymentResult) => {
                    if (paymentErr) return rollbackAndFail(paymentErr);

                    connection.commit((commitErr) => {
                      if (commitErr) {
                        return rollbackAndFail(commitErr);
                      }

                      callback(null, {
                        bookingId,
                        paymentId: paymentResult.insertId
                      });
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      sb.id AS booking_id,
      sb.booking_date,
      p.name AS pet_name,
      s.name AS service_name,
      sb.booked_price,
      sb.booking_status,
      pay.payment_status,
      pay.payment_reference,
      sb.created_at
    FROM service_bookings sb
    JOIN pets p ON p.id = sb.pet_id
    JOIN services s ON s.id = sb.service_id
    LEFT JOIN payments pay ON pay.booking_id = sb.id
    WHERE p.owner_id = ?
    ORDER BY sb.created_at DESC, sb.id DESC
  `;

  connection.query(sql, [ownerId], callback);
}

module.exports = {
  createPendingBooking,
  getBookingsByOwner
};
