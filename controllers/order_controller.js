const Order = require("../models/order_schema");

//get_order
const create_order = async (req, res) => {
  const user = req.data;
  try {
    const { productId } = req.params.id;
    const { amount, quantity, address } = req.body;

    if ((!amount, !quantity, address)) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const newOrder = new Order({
      userId: user.id,
      products: [
        {
          productId,
          quantity,
        },
      ],
      amount,
      address,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).send(savedOrder);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  create_order,
};
