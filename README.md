# Apollo GraphOS Federation Demo

A minimal but realistic federated graph with **3 subgraphs** that share
**2 entities**, meant for demoing GraphOS composition, entity resolution,
and computed fields.

```
subgraph-products  → owns Product
subgraph-users      → owns User
subgraph-reviews    → owns Review, and EXTENDS Product + User
                       (adds `reviews` to both, plus `averageRating`
                       on Product — computed from mock data no other
                       subgraph has)
```

This mirrors the classic Apollo demo shape (products/users/reviews) and
is a good story to tell live: "Reviews doesn't own users or products,
but it can attach data to both — and the router stitches it all
together into one schema."

## 1. Install dependencies

```bash
cd subgraph-products && npm install && cd ..
cd subgraph-users && npm install && cd ..
cd subgraph-reviews && npm install && cd ..
```

## 2. Start the subgraphs

Open three terminals:

```bash
cd subgraph-products && npm start   # http://localhost:4001/graphql
cd subgraph-users && npm start      # http://localhost:4002/graphql
cd subgraph-reviews && npm start    # http://localhost:4003/graphql
```

Each is a standalone GraphQL server you can query directly — useful for
showing that they work independently before federating them.

## 3. Compose + run the supergraph locally (no GraphOS account needed)

Install the Rover CLI if you don't have it:

```bash
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

Then, with all three subgraphs running, use `rover dev` — it composes
the supergraph from `supergraph.yaml`, spins up a local router, and
re-composes automatically whenever a subgraph schema changes:

```bash
rover dev --supergraph-config ./supergraph.yaml
```

This opens Apollo Sandbox in your browser against the composed
supergraph, typically at `http://localhost:4000`.

If you'd rather compose once and run the router yourself:

```bash
rover supergraph compose --config ./supergraph.yaml --output supergraph.graphql
router --config router.yaml --supergraph supergraph.graphql
```

## 4. Publish to GraphOS Studio (full platform demo)

To show off GraphOS itself (schema checks, managed federation, metrics):

1. Create a free account and a new federated Graph at
   https://studio.apollographql.com
2. Grab the graph ref (`your-graph@current`) and an `APOLLO_KEY` from
   Studio's Settings page.
3. Publish each subgraph:

```bash
export APOLLO_KEY=service:your-graph:xxxxxxxx

rover subgraph publish your-graph@current \
  --name products --schema ./subgraph-products/schema.graphql \
  --routing-url http://localhost:4001/graphql

rover subgraph publish your-graph@current \
  --name users --schema ./subgraph-users/schema.graphql \
  --routing-url http://localhost:4002/graphql

rover subgraph publish your-graph@current \
  --name reviews --schema ./subgraph-reviews/schema.graphql \
  --routing-url http://localhost:4003/graphql
```

4. Run the router in managed federation mode, which pulls the composed
   schema from GraphOS automatically:

```bash
export APOLLO_GRAPH_REF=your-graph@current
router --config router.yaml
```

## 5. Deploy on a single DigitalOcean Droplet with Docker Compose

This repo now includes a simple single-host deployment for small demos:

- `products`, `users`, and `reviews` run as separate containers on the
  Droplet's private Docker network.
- `router` is the only public container and listens on port `4000`.
- The router image composes the supergraph at build time using
  `supergraph.compose.yaml`, so you do not need GraphOS for this setup.

On the Droplet:

```bash
git clone <your-repo-url>
cd graphos-demo
docker compose up -d --build
```

Then open:

```text
http://YOUR_DROPLET_IP:4000
```

Useful commands:

```bash
docker compose ps
docker compose logs -f router
docker compose logs -f reviews
docker compose down
```

Notes:

- `docker-compose.yml` exposes only the router to the internet.
- `supergraph.compose.yaml` uses Docker service names instead of
  `localhost`, which is required for inter-container routing.
- The top-level `router` binary in this repo is a local macOS artifact
  and is not used by the Linux deployment.

## Example queries to run in Sandbox

**Cross-subgraph fetch — products, their reviews, and each reviewer's name**
(touches all three subgraphs in one request):

```graphql
query ProductsWithReviews {
  products {
    id
    name
    price
    averageRating
    reviews {
      rating
      comment
      author {
        username
      }
    }
  }
}
```

**Starting from a user, reaching into reviews and products:**

```graphql
query UserActivity {
  user(id: "1") {
    name
    email
    reviews {
      rating
      comment
      product {
        name
        price
      }
    }
  }
}
```

**Querying a subgraph in isolation (e.g. products on :4001) to show it
has no idea reviews exist — it's the router that adds that field:**

```graphql
query {
  products {
    id
    name
  }
}
```

## Mock data notes

- Users: 4 people (`ids "1"`–`"4"`)
- Products: 5 items across Electronics/Outdoors/Home/Travel (`ids "1"`–`"5"`)
- Reviews: 8 reviews cross-referencing the above by `authorId` /
  `productId` — every product has at least one review, and
  `averageRating` is computed on the fly in the reviews subgraph.
