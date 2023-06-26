const express = require("express");
const app = express();
const morgan = require("morgan");
const postBank = require("./postBank");

const {PORT = 1337} = process.env;

app.use(morgan("dev"));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
      <div class="news-item">
      <p>
        <span class="news-position">${post.id}. ▲</span>
        <a href="/posts/${post.id}"> ${post.title}</a>
        <small>(by ${post.name})</small>
      </p>
      <small class="news-info">
        ${post.upvotes} upvotes | ${post.date}
      </small>
    </div>`
        )
        .join("")}
    </div>
  </body>
  </html>`;

  res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if(!post.id) {
    throw new Error('This one is missing :(')
  } else {

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="news-list"
      <header><img src="/logo.png" />Wizard News</header>
      <div class="news-item"
        <p>${post.title}</p>
        <p>
          <span class="news-position">${post.id}</span>
          ${post.content}
        </p>
        <p>
          <span>${post.name}</span>
          <small>${post.date}</small>
        </p>
      </div>
    </div>
  </body>
  </html>`);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(404).send("Something's not working :/ ")
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

app.use(express.static("public"));
