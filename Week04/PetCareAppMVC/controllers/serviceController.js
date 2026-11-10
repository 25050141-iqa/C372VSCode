const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

function getLocalDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60000));
  return localDate.toISOString().slice(0, 10);
}

function isValidBookingDate(dateString) {
  if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const parsedDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const normalized = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
  if (normalized !== dateString) {
    return false;
  }

  return dateString >= getLocalDateString();
}

function formatBookingDate(dateValue) {
  if (!dateValue) return '';

  if (dateValue instanceof Date) {
    return getLocalDateString(dateValue);
  }

  if (typeof dateValue === 'string') {
    return dateValue.slice(0, 10);
  }

  return String(dateValue).slice(0, 10);
}

function listServices(req, res) {
  const userId = req.session.user.id;

  petModel.getPetsByOwner(userId, (petErr, pets) => {
    if (petErr) {
      console.error('Error loading pets for services:', petErr);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceErr, services) => {
      if (serviceErr) {
        console.error('Error loading active services:', serviceErr);
        return res.status(500).send('Unable to load services.');
      }

      let selectedPetId = '';
      if (req.query.petId) {
        const requestedPetId = String(req.query.petId);
        const matchedPet = pets.find((pet) => String(pet.id) === requestedPetId);
        if (matchedPet) {
          selectedPetId = requestedPetId;
        }
      }

      res.render('services', {
        pets,
        services,
        selectedPetId,
        today: getLocalDateString(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const userId = req.session.user.id;
  const rawPetId = Number(req.body.petId);
  const rawServiceId = Number(req.body.serviceId);
  const bookingDate = req.body.bookingDate;

  if (!Number.isInteger(rawPetId) || rawPetId <= 0 || !Number.isInteger(rawServiceId) || rawServiceId <= 0 || !bookingDate || !isValidBookingDate(bookingDate)) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(userId, rawPetId, rawServiceId, bookingDate, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      req.flash('error', 'Unable to create the booking. Please try again.');
      return res.redirect(`/services?petId=${rawPetId}`);
    }

    if (!result) {
      req.flash('error', 'That pet or service is unavailable for booking.');
      return res.redirect('/services');
    }

    req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
    return res.redirect('/bookings');
  });
}

function listBookings(req, res) {
  const userId = req.session.user.id;

  serviceBookingModel.getBookingsByOwner(userId, (err, bookings) => {
    if (err) {
      console.error('Error loading booking history:', err);
      return res.status(500).send('Unable to load booking history.');
    }

    const formattedBookings = (bookings || []).map((booking) => ({
      ...booking,
      booking_date: formatBookingDate(booking.booking_date)
    }));

    res.render('bookings', {
      bookings: formattedBookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = {
  listServices,
  createBooking,
  listBookings
};
