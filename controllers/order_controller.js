const Order = require("../models/order_schema");
const Message = require("../models/message_schema");

//get_order
const create_order = async (req, res) => {
  const user = req.data; //getting the user information from the verifytoken middleware
  try {
    const { price, quantity, address, products } = req.body;
    //products should be an array of objects which will include product Id, quantity and amount per product

    if ((!price, !quantity, !address)) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const newOrder = new Order({
      userId: user.id,
      products,
      price,
      address,
    });

    const newMessage = new Message({
      userId: user.id,
      orderId: newOrder.id,
      message: "Your order has been created and it's now pending",
    });

    const savedOrder = await newOrder.save();
    const savedMessage = await newMessage.save();

    return res.status(201).send({ savedOrder, savedMessage });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_orders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });

    if (!orders) {
      return res.status(404).json({ error: "No Orders found" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_order = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const delete_order = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    await Message.find({ orderId: req.params.id }).deleteMany();
    res.status(204).json("Order has been deleted...");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const update_order = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(201).json(updatedOrder);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  create_order,
  get_orders,
  get_order,
  update_order,
  delete_order,
};
