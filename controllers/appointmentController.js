const {
  Appointment,
  AppointmentItem,
  Service,
  Patient,
  User,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

async function isDoctor(userId) {
  const user = await User.findOne({ where: { id: userId, role: "doctor" } });
  return !!user; // doctor bo‘lsa true, aks holda false
}

// create appointment with items (services)
exports.createAppointment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { patient_id, doctor_id, appointment_date, items } = req.body;

    if (!patient_id)
      return res.status(400).json({ message: "patient_id required" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items (services) are required" });
    }

    // Agar doctor_id berilgan bo‘lsa, roli doctor ekanligini tekshiramiz
    let validDoctorId = null;
    if (doctor_id) {
      const doctorExists = await isDoctor(doctor_id);
      if (!doctorExists) {
        return res
          .status(400)
          .json({ message: "Invalid doctor_id or user is not a doctor" });
      }
      validDoctorId = doctor_id;
    }

    // create appointment
    const appointment = await Appointment.create(
      {
        patient_id,
        doctor_id: validDoctorId,
        appointment_date,
        status: "pending",
      },
      { transaction: t },
    );

    // fetch services to compute price_at_time
    const serviceIds = items.map((i) => i.service_id);
    const services = await Service.findAll({ where: { id: serviceIds } });

    const serviceMap = {};
    services.forEach((s) => {
      serviceMap[s.id] = s;
    });

    let total_price = 0;
    const createdItems = [];
    for (const it of items) {
      const svc = serviceMap[it.service_id];
      if (!svc) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Service id ${it.service_id} not found` });
      }
      const qty =
        it.quantity && parseInt(it.quantity) > 0 ? parseInt(it.quantity) : 1;
      const price = parseFloat(svc.price);
      const itemTotal = price * qty;
      total_price += itemTotal;

      const created = await AppointmentItem.create(
        {
          appointment_id: appointment.id,
          service_id: svc.id,
          price_at_time: price,
          quantity: qty,
        },
        { transaction: t },
      );

      createdItems.push(created);
    }

    await t.commit();

    const doctor_share = parseFloat((total_price * 0.05).toFixed(2));

    const result = {
      appointment,
      items: createdItems,
      total_price: total_price.toFixed(2),
      doctor_share,
    };

    res.status(201).json(result);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.appointment_date = { [Op.between]: [start, end] };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: "patient" },
        {
          model: User,
          as: "doctor",
          attributes: ["id", "full_name", "phone"],
          where: { role: "doctor" },
          required: false,
        },
        {
          model: AppointmentItem,
          as: "items",
          include: [{ model: Service, as: "service" }],
        },
      ],
      order: [["appointment_date", "ASC"]],
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: "patient" },
        {
          model: User,
          as: "doctor",
          attributes: ["id", "full_name", "phone"],
          where: { role: "doctor" },
          required: false,
        },
        {
          model: AppointmentItem,
          as: "items",
          include: [{ model: Service, as: "service" }],
        },
      ],
    });
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, doctor_id } = req.body;

    const appt = await Appointment.findByPk(id);
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });

    if (doctor_id) {
      const doctorExists = await isDoctor(doctor_id);
      if (!doctorExists) {
        return res
          .status(400)
          .json({ message: "Invalid doctor_id or user is not a doctor" });
      }
      appt.doctor_id = doctor_id;
    }

    if (status) appt.status = status;

    await appt.save();
    res.json(appt);
  } catch (err) {
    next(err);
  }
};

// GET /api/doctor/queue?date=YYYY-MM-DD
// if no date -> today
exports.getMyQueue = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { date, status } = req.query;

    const where = { doctor_id: doctorId };

    const targetDate = date || new Date().toISOString().slice(0, 10);
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    where.appointment_date = { [Op.between]: [start, end] };
    if (status) where.status = status;

    const appointments = await Appointment.findAll({
      where,
      include: [{ model: Patient, as: "patient" }],
      order: [["appointment_date", "ASC"]],
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};
