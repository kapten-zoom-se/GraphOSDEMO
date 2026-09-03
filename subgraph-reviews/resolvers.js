const { reviews } = require('./data');

function averageRatingFor(productId) {
  const productReviews = reviews.filter((r) => r.productId === productId);
  if (productReviews.length === 0) return null;
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / productReviews.length) * 10) / 10;
}

module.exports = {
  Query: {
    reviews: () => reviews,
    review: (_parent, { id }) => reviews.find((r) => r.id === id) ?? null,
  },
  Review: {
    // These resolve to *stub* entity representations. The router takes
    // it from here, fetching the rest of each type's fields from
    // whichever subgraph owns them (products / users).
    author: (review) => ({ __typename: 'User', id: review.authorId }),
    product: (review) => ({ __typename: 'Product', id: review.productId }),
  },
  User: {
    // No lookup needed here since we only received/need the id.
    __resolveReference: (reference) => reference,
    reviews: (user) => reviews.filter((r) => r.authorId === user.id),
  },
  Product: {
    __resolveReference: (reference) => reference,
    reviews: (product) => reviews.filter((r) => r.productId === product.id),
    averageRating: (product) => averageRatingFor(product.id),
  },
};
