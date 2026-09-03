const { products } = require('./data');

module.exports = {
  Query: {
    products: () => products,
    product: (_parent, { id }) => products.find((p) => p.id === id) ?? null,
  },
  Product: {
    // Called by the router whenever another subgraph's data needs to be
    // merged onto a Product by its key (id). This is the heart of entity
    // resolution in Apollo Federation.
    __resolveReference(reference) {
      return products.find((p) => p.id === reference.id) ?? null;
    },
  },
};
