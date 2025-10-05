const { Patient } = require('../models');

exports.createPatient = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const patientsData = req.body;
    
      const createdPatients = [];
      for (const item of patientsData) {
        const { first_name, last_name, phone, birth_date, address } = item;
        if (!first_name || !last_name) {
          return res.status(400).json({ message: 'first_name and last_name required in all items' });
        }
        const p = await Patient.create({ first_name, last_name, phone, birth_date, address });
        createdPatients.push(p);
      }
      return res.status(201).json(createdPatients);
    } else if (typeof req.body === 'object' && req.body !== null) {
      const { first_name, last_name, phone, birth_date, address } = req.body;
      if (!first_name || !last_name) {
        return res.status(400).json({ message: 'first_name and last_name required' });
      }
      const p = await Patient.create({ first_name, last_name, phone, birth_date, address });
      return res.status(201).json(p);
    } else {
      return res.status(400).json({ message: 'Invalid request body' });
    }
  } catch (err) {
    next(err);
  }
};


exports.getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      const { Op, ARRAY } = require('sequelize');
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const patients = await Patient.findAll({ where, order: [['id', 'DESC']] });
    res.json(patients);
  } catch (err) { next(err); }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = await Patient.findByPk(id);
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    res.json(p);
  } catch (err) { next(err); }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = await Patient.findByPk(id);
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    const { first_name, last_name, phone, dob, address } = req.body;
    p.first_name = first_name || p.first_name;
    p.last_name = last_name || p.last_name;
    p.phone = phone || p.phone;
    p.dob = dob || p.dob;
    p.address = address || p.address;
    await p.save();
    res.json(p);
  } catch (err) { next(err); }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = await Patient.findByPk(id);
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    await p.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
