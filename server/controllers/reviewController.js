const Review = require('../models/Review');
const Service = require('../models/Service');

// Helper to calculate service stats
const calculateServiceStats = async (serviceId) => {
  try {
    const reviews = await Review.find({ serviceId });
    const reviewCount = reviews.length;
    const averageRating = reviewCount === 0 ? 0 : 
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;

    await Service.findByIdAndUpdate(serviceId, {
      reviewCount,
      averageRating: Number(averageRating.toFixed(1))
    });
  } catch (error) {
    console.error('Error calculating service stats:', error);
  }
};

// Get reviews for a service
exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const reviews = await Review.find({ serviceId })
      .populate('userId', 'name')
      .populate('replies.userId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Add a review to a service
exports.addReview = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, comment } = req.body;

    // Check if user is a customer
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can write reviews' });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user has already reviewed this service
    const existingReview = await Review.findOne({
      serviceId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      serviceId,
      userId: req.user._id,
      rating,
      comment
    });

    await review.save();
    
    // Populate user details
    await review.populate('userId', 'name');

    // Update service stats
    await calculateServiceStats(serviceId);
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    await review.populate('userId', 'name');

    // Update service stats
    await calculateServiceStats(review.serviceId);
    
    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    // Update service stats
    await calculateServiceStats(review.serviceId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('serviceId', 'title category')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
};

// Add a reply
exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.replies.push({
      userId: req.user._id,
      comment
    });

    await review.save();
    
    // Populate to return full structure
    await review.populate('userId', 'name');
    await review.populate('replies.userId', 'name');

    res.json(review);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Error adding reply' });
  }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check ownership (admin or reply author)
    if (reply.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    reply.deleteOne();
    await review.save();

    await review.populate('userId', 'name');
    await review.populate('replies.userId', 'name');

    res.json(review);
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ message: 'Error deleting reply' });
  }
};

// Toggle Like
exports.toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if already liked
    const likeIndex = review.likes.indexOf(userId);
    const dislikeIndex = review.dislikes.indexOf(userId);

    if (likeIndex === -1) {
      // Not liked yet, add like
      review.likes.push(userId);
      // Remove from dislikes if present
      if (dislikeIndex !== -1) review.dislikes.splice(dislikeIndex, 1);
    } else {
      // Already liked, remove like
      review.likes.splice(likeIndex, 1);
    }

    await review.save();
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// Toggle Dislike
exports.toggleDislike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if already disliked
    const dislikeIndex = review.dislikes.indexOf(userId);
    const likeIndex = review.likes.indexOf(userId);

    if (dislikeIndex === -1) {
      // Not disliked yet, add dislike
      review.dislikes.push(userId);
      // Remove from likes if present
      if (likeIndex !== -1) review.likes.splice(likeIndex, 1);
    } else {
      // Already disliked, remove dislike
      review.dislikes.splice(dislikeIndex, 1);
    }

    await review.save();
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    console.error('Toggle dislike error:', error);
    res.status(500).json({ message: 'Error toggling dislike' });
  }
}; 

// Update a reply
exports.updateReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const reply = review.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    // Check ownership
    if (reply.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reply' });
    }

    reply.comment = comment;
    await review.save();

    await review.populate('userId', 'name');
    await review.populate('replies.userId', 'name');

    res.json(review);
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({ message: 'Error updating reply' });
  }
};

// Toggle Reply Like
exports.toggleReplyLike = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const reply = review.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const likeIndex = reply.likes.indexOf(userId);
    const dislikeIndex = reply.dislikes.indexOf(userId);

    if (likeIndex === -1) {
      reply.likes.push(userId);
      if (dislikeIndex !== -1) reply.dislikes.splice(dislikeIndex, 1);
    } else {
      reply.likes.splice(likeIndex, 1);
    }

    await review.save();
    
    await review.populate('userId', 'name');
    await review.populate('replies.userId', 'name');

    res.json(review);
  } catch (error) {
    console.error('Toggle reply like error:', error);
    res.status(500).json({ message: 'Error toggling reply like' });
  }
};

// Toggle Reply Dislike
exports.toggleReplyDislike = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const reply = review.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const dislikeIndex = reply.dislikes.indexOf(userId);
    const likeIndex = reply.likes.indexOf(userId);

    if (dislikeIndex === -1) {
      reply.dislikes.push(userId);
      if (likeIndex !== -1) reply.likes.splice(likeIndex, 1);
    } else {
      reply.dislikes.splice(dislikeIndex, 1);
    }

    await review.save();
    
    await review.populate('userId', 'name');
    await review.populate('replies.userId', 'name');

    res.json(review);
  } catch (error) {
    console.error('Toggle reply dislike error:', error);
    res.status(500).json({ message: 'Error toggling reply dislike' });
  }
}; 
