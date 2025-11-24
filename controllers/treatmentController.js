// controllers/treatmentController.js
const {
  Treatment,
  Patient,
  User,
  Appointment,
  Payment,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// GET /api/treatments/my
// Doctor sees own treatments
exports.getMyTreatments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to, status, search } = req.query;

    const where = { doctor_id: doctorId };

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.treatment_date = {};
      if (from) where.treatment_date[Op.gte] = new Date(from);
      if (to) where.treatment_date[Op.lte] = new Date(to);
    }

    const patientWhere = {};
    if (search) {
      patientWhere[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const treatments = await Treatment.findAll({
      where,
      include: [
        {
          model: Patient,
          as: "patient",
          where: Object.keys(patientWhere).length ? patientWhere : undefined,
        },
      ],
      order: [["treatment_date", "DESC"]],
    });

    res.json(treatments);
  } catch (err) {
    next(err);
  }
};

// GET /api/treatments/my-debts
// Only treatments with remaining debt
exports.getMyDebtTreatments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;

    const treatments = await Treatment.findAll({
      where: { doctor_id: doctorId },
      include: [{ model: Patient, as: "patient" }],
      order: [["treatment_date", "DESC"]],
    });

    const withDebt = treatments.filter((t) => {
      const total = t.total_amount || 0;
      const discount = t.discount_amount || 0;
      const paid = t.paid_amount || 0;
      return total - discount - paid > 0;
    });

    res.json(
      withDebt.map((t) => ({
        ...t.toJSON(),
        debt_amount:
          (t.total_amount || 0) -
          (t.discount_amount || 0) -
          (t.paid_amount || 0),
      })),
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/treatments
exports.createTreatment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const doctorId = req.user.id;
    const {
      patient_id,
      appointment_id,
      treatment_date,
      total_amount,
      discount_amount,
      notes,
    } = req.body;

    if (!patient_id) {
      await t.rollback();
      return res.status(400).json({ message: "patient_id required" });
    }
    if (!treatment_date) {
      await t.rollback();
      return res.status(400).json({ message: "treatment_date required" });
    }
    if (!total_amount && total_amount !== 0) {
      await t.rollback();
      return res.status(400).json({ message: "total_amount required" });
    }

    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      await t.rollback();
      return res.status(404).json({ message: "Patient not found" });
    }

    const treatment = await Treatment.create(
      {
        patient_id,
        doctor_id: doctorId,
        appointment_id: appointment_id || null,
        treatment_date,
        status: "new",
        total_amount,
        discount_amount: discount_amount || 0,
        paid_amount: 0,
        notes,
      },
      { transaction: t },
    );

    await t.commit();
    res.status(201).json(treatment);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// PATCH /api/treatments/:id
exports.updateTreatment = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    const { treatment_date, status, total_amount, discount_amount, notes } =
      req.body;

    const treatment = await Treatment.findByPk(id);
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    if (treatment.doctor_id !== doctorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (treatment_date) treatment.treatment_date = treatment_date;
    if (status) treatment.status = status;
    if (total_amount !== undefined) treatment.total_amount = total_amount;
    if (discount_amount !== undefined)
      treatment.discount_amount = discount_amount;
    if (notes !== undefined) treatment.notes = notes;

    await treatment.save();
    res.json(treatment);
  } catch (err) {
    next(err);
  }
};
