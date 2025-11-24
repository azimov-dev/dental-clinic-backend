const { Service, ServiceCategory } = require("../models");

// GET /api/services
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      include: [{ model: ServiceCategory, as: "category" }],
      order: [["id", "ASC"]],
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// POST /api/services (single OR array)
exports.createService = async (req, res, next) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const created = [];
    for (const item of payload) {
      const {
        name,
        price,
        category_id,
        material_cost = 0,
        is_active = true,
      } = item;

      if (!name || price == null) {
        return res
          .status(400)
          .json({ message: "name and price are required for each service" });
      }

      const s = await Service.create({
        name,
        price,
        category_id: category_id || null,
        material_cost,
        is_active,
      });

      created.push(s);
    }

    if (Array.isArray(req.body)) res.status(201).json(created);
    else res.status(201).json(created[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/services/:id
exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const s = await Service.findByPk(id);
    if (!s) return res.status(404).json({ message: "Service not found" });

    const { name, price, category_id, material_cost, is_active } = req.body;

    if (name !== undefined) s.name = name;
    if (price !== undefined) s.price = price;
    if (category_id !== undefined) s.category_id = category_id;
    if (material_cost !== undefined) s.material_cost = material_cost;
    if (is_active !== undefined) s.is_active = is_active;

    await s.save();
    res.json(s);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const s = await Service.findByPk(id);
    if (!s) return res.status(404).json({ message: "Service not found" });
    await s.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
