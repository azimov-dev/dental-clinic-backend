// controllers/paymentController.js
const { Payment, Treatment, Patient, sequelize } = require("../models");
const { Op } = require("sequelize");

// GET /api/payments/my
// Doctor sees own payment history
exports.getMyPayments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { from, to, type, search } = req.query;

    const where = { doctor_id: doctorId };

    if (type) where.payment_type = type;

    if (from || to) {
      where.paid_at = {};
      if (from) where.paid_at[Op.gte] = new Date(from);
      if (to) where.paid_at[Op.lte] = new Date(to);
    }

    const patientWhere = {};
    if (search) {
      patientWhere[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: Patient,
          as: "patient",
          where: Object.keys(patientWhere).length ? patientWhere : undefined,
        },
      ],
      order: [["paid_at", "DESC"]],
    });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// POST /api/payments
exports.createPayment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const doctorId = req.user.id;
    const { treatment_id, amount, payment_type, paid_at, comment } = req.body;

    if (!treatment_id) {
      await t.rollback();
      return res.status(400).json({ message: "treatment_id required" });
    }
    if (!amount && amount !== 0) {
      await t.rollback();
      return res.status(400).json({ message: "amount required" });
    }
    if (!payment_type) {
      await t.rollback();
      return res.status(400).json({ message: "payment_type required" });
    }

    const treatment = await Treatment.findByPk(treatment_id, {
      transaction: t,
    });
    if (!treatment) {
      await t.rollback();
      return res.status(404).json({ message: "Treatment not found" });
    }
    if (treatment.doctor_id !== doctorId && req.user.role !== "admin") {
      await t.rollback();
      return res.status(403).json({ message: "Forbidden" });
    }

    const payment = await Payment.create(
      {
        treatment_id,
        patient_id: treatment.patient_id,
        doctor_id: treatment.doctor_id,
        amount,
        payment_type,
        paid_at: paid_at ? new Date(paid_at) : new Date(),
        comment,
      },
      { transaction: t },
    );

    // update treatment paid_amount and status
    treatment.paid_amount = (treatment.paid_amount || 0) + amount;

    const debt =
      (treatment.total_amount || 0) -
      (treatment.discount_amount || 0) -
      (treatment.paid_amount || 0);

    if (debt <= 0) {
      treatment.status = "paid";
    }

    await treatment.save({ transaction: t });

    await t.commit();
    res.status(201).json({ payment, treatment });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
