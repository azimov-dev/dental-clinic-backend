// controllers/doctorController.js
const { Appointment, Treatment, Patient, sequelize } = require("../models");
const { Op } = require("sequelize");

// ---------- Dashboard Stats ---------- //
// GET /api/doctor/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to } = req.query;

    const dateWhere = {};
    if (from) dateWhere[Op.gte] = new Date(from);
    if (to) dateWhere[Op.lte] = new Date(to);

    // total revenue = sum(treatments.total - discount)
    const treatments = await Treatment.findAll({
      where: {
        doctor_id: doctorId,
        ...(from || to ? { treatment_date: dateWhere } : {}),
      },
    });

    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDebt = 0;

    for (const t of treatments) {
      const revenue = t.total_amount - t.discount_amount;
      const paid = t.paid_amount;
      totalRevenue += revenue;
      totalPaid += paid;
      totalDebt += revenue - paid;
    }

    return res.json({
      totalRevenue,
      totalPaid,
      totalDebt,
    });
  } catch (err) {
    next(err);
  }
};

// ---------- Calendar List (count per day) ---------- //
// GET /api/doctor/calendar?from=2025-11-01&to=2025-11-30
exports.getCalendarSummary = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to required" });
    }

    const appointments = await Appointment.findAll({
      where: {
        doctor_id: doctorId,
        date: {
          [Op.gte]: new Date(from),
          [Op.lte]: new Date(to),
        },
      },
    });

    const result = {};

    for (const a of appointments) {
      const d = a.date.toISOString().split("T")[0];
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

// ---------- Get appointments of a single day (drawer) ---------- //
// GET /api/doctor/calendar/:date/appointments
exports.getDayAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const date = req.params.date;

    const items = await Appointment.findAll({
      where: {
        doctor_id: doctorId,
        date,
      },
      include: [
        {
          model: Patient,
          as: "patient",
        },
      ],
      order: [["time", "ASC"]],
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
};
