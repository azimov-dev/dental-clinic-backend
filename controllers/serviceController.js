const { Service } = require('../models');

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) { next(err); }
};
exports.createService = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const servicesData = req.body;

      const createdServices = [];
      for (const item of servicesData) {
        const { name, price } = item;
        if (!name || price === undefined) {
          return res.status(400).json({ message: 'name and price required in all items' });
        }
        const s = await Service.create({ name, price });
        createdServices.push(s);
      }
      return res.status(201).json(createdServices);

    } else if (typeof req.body === 'object' && req.body !== null) {
      const { name, price } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'name and price required' });
      }
      const s = await Service.create({ name, price });
      return res.status(201).json(s);

    } else {
      return res.status(400).json({ message: 'Invalid request body' });
    }
  } catch (err) {
    next(err);
  }
};


exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const s = await Service.findByPk(id);
    if (!s) return res.status(404).json({message:'Service not found'});
    const { name, price } = req.body;
    s.name = name || s.name;
    s.price = price || s.price;
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const s = await Service.findByPk(id);
    if (!s) return res.status(404).json({message:'Service not found'});
    await s.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
