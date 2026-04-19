const Subscription = require("../models/subscription.model");

exports.saveSubscription = async (req, res) => {
  try {
    await Subscription.create(req.body);
    res.status(201).json({ message: "Subscription saved" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
