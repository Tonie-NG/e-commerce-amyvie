const Review = require("../models/review_model");

const post_review = async (req, res) => {
  const ReviewDetails = req.data; //this information is gotten from the jwt verification middleware
  try {
    const { star, desc } = req.body;
    const { productId } = req.params;

    if (!productId || !star || !desc) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const newReview = new Review({
      productId,
      ReviewId: ReviewDetails._id,
      star,
      desc,
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update_review = async (req, res) => {
  try {
    const { id } = req.params;
    const { star, desc } = req.body;
    if (!id || !star || !desc) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.status(200).json(updatedReview);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const get_review = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "review not found" });
    }
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const get_all_ReviewDetails = async (req, res) => {
  try {
    const product = req.params.id;
    const ReviewDetails = product
      ? await Review.find({ productId: product }).sort({ date: -1 })
      : await Review.find();
    if (!ReviewDetails) {
      return res.status(404).json({ error: "No ReviewDetails found" });
    }

    return res.status(200).json(ReviewDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const delete_review = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).json("review has been deleted...");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  post_review,
  update_review,
  get_review,
  get_all_ReviewDetails,
  delete_review,
};
