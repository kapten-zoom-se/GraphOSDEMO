const { users } = require('./data');

module.exports = {
  Query: {
    me: () => users[0],
    user: (_parent, { id }) => users.find((u) => u.id === id) ?? null,
    users: () => users,
  },
  User: {
    __resolveReference(reference) {
      return users.find((u) => u.id === reference.id) ?? null;
    },
  },
};
