// authorId references User.id from the users subgraph.
// productId references Product.id from the products subgraph.
const reviews = [
  {
    id: 'r1',
    rating: 5,
    comment: 'Battery life is unreal — lasted my entire flight to Tokyo and back.',
    createdAt: '2024-02-11',
    authorId: '1',
    productId: '1',
  },
  {
    id: 'r2',
    rating: 4,
    comment: 'Great sound, though the ear cups run a little warm after a few hours.',
    createdAt: '2024-03-02',
    authorId: '2',
    productId: '1',
  },
  {
    id: 'r3',
    rating: 5,
    comment: 'Held up great on a three-day backpacking trip. No leaks at all.',
    createdAt: '2024-01-20',
    authorId: '3',
    productId: '2',
  },
  {
    id: 'r4',
    rating: 3,
    comment: 'Comfortable to wear but the bladder is annoying to refill mid-hike.',
    createdAt: '2024-04-15',
    authorId: '4',
    productId: '2',
  },
  {
    id: 'r5',
    rating: 5,
    comment: 'Switches feel amazing and swapping them out took two minutes.',
    createdAt: '2023-12-05',
    authorId: '1',
    productId: '3',
  },
  {
    id: 'r6',
    rating: 4,
    comment: 'Beautiful glaze, and the coffee genuinely tastes better out of the mug.',
    createdAt: '2024-05-19',
    authorId: '3',
    productId: '4',
  },
  {
    id: 'r7',
    rating: 2,
    comment: 'One of the wheels started sticking after my second trip.',
    createdAt: '2024-06-01',
    authorId: '2',
    productId: '5',
  },
  {
    id: 'r8',
    rating: 5,
    comment: 'USB port is a game changer at the airport. Highly recommend.',
    createdAt: '2024-06-22',
    authorId: '4',
    productId: '5',
  },
];

module.exports = { reviews };
