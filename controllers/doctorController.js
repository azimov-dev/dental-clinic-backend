// controllers/doctorController.js
const { Appointment, Treatment, Patient } = require("../models");
const { Op } = require("sequelize");

// GET /api/doctor/dashboard
// Stats for logged-in doctor (total revenue, paid, debt)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to } = req.query;

    const where = { doctor_id: doctorId };

    if (from || to) {
      where.treatment_date = {};
      if (from) {
        where.treatment_date[Op.gte] = new Date(from);
      }
      if (to) {
        // include the whole "to" day
        const toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        where.treatment_date[Op.lt] = toDate;
      }
    }

    const treatments = await Treatment.findAll({ where });

    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDebt = 0;

    for (const t of treatments) {
      const total = t.total_amount || 0;
      const discount = t.discount_amount || 0;
      const paid = t.paid_amount || 0;

      const revenue = total - discount;
      totalRevenue += revenue;
      totalPaid += paid;
      totalDebt += revenue - paid;
    }

    res.json({
      totalRevenue,
      totalPaid,
      totalDebt,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/doctor/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns [{ date: '2025-11-24', count: 5 }, ...]
exports.getCalendarSummary = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to required" });
    }

    const where = {
      doctor_id: doctorId,
      appointment_date: {},
    };

    // from day start
    where.appointment_date[Op.gte] = new Date(from);
    // to day end (exclusive next day)
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    where.appointment_date[Op.lt] = toDate;

    const appointments = await Appointment.findAll({ where });

    const result = {}; // { '2025-11-24': 3, ... }

    for (const a of appointments) {
      const d = a.appointment_date.toISOString().split("T")[0];
      if (!result[d]) result[d] = 0;
      result[d]++;
    }

    const final = Object.entries(result).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(final);
  } catch (err) {
    next(err);
  }
};

// GET /api/doctor/calendar/:date/appointments
// date = 'YYYY-MM-DD', returns list of appointments of that day with patient info
exports.getDayAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const dateStr = req.params.date; // '2025-11-24'

    // from 00:00 of that day to 00:00 of next day
    const start = new Date(`${dateStr}T00:00:00.000Z`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const items = await Appointment.findAll({
      where: {
        doctor_id: doctorId,
        appointment_date: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      include: [
        {
          model: Patient,
          as: "patient",
        },
      ],
      order: [["appointment_date", "ASC"]],
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
};
