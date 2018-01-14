const Koa = require('koa');
const mongo = require('koa-mongo');
const cors = require('@koa/cors');

const { mongodbConfig } = require('./src/configs/mongodbConfig');

const app = new Koa();

const port = 8110;

app.use(cors());

app.use(
  mongo({
    ...mongodbConfig,
  }),
);

app.use(async ctx => {
  const path = ctx.path;
  if (path === '/allMovies') {
    const query = ctx.query;

    const { page, pageSize } = query;

    const limitAmount = pageSize || 10;
    const skipAmount = (page - 1) * limitAmount || 0;

    const moviesData = await ctx.mongo
      .db('doubanMovies')
      .collection('movies')
      .find()
      .skip(skipAmount)
      .limit(limitAmount)
      .sort({ start: -1 })
      .toArray();
    const moviesTotalAmount = await ctx.mongo
      .db('doubanMovies')
      .collection('movies')
      .count();

    ctx.body = {
      moviesTotalAmount,
      moviesData,
    };
  }
});

app.on('error', err => {
  console.error(err);
});

app.listen(port, () => {
  console.log(`doubanMovie Backend start at http://localhost:${port} success`);
});
