const Koa = require('koa');
const mongo = require('koa-mongo');
const views = require('koa-views');

const { mongodbConfig } = require('./src/configs/mongodbConfig');

const app = new Koa();

const port = 8110;

app.use(
  mongo({
    ...mongodbConfig,
  }),
);

app.use(
  views(__dirname + '/src/views', {
    extension: 'pug',
    map: {
      pug: 'pug',
    },
  }),
);

app.use(async ctx => {
  const moviesData = await ctx.mongo
    .db('doubanMovies')
    .collection('movies')
    .find()
    .sort({ start: -1 })
    .toArray();
  console.log(moviesData);
  await ctx.render('movies', {
    moviesData,
  });
});

app.listen(port, () => {
  console.log(`doubanMovie Backend start at http://localhost:${port} success`);
});
