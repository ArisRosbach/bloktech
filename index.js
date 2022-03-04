const camelCase = require('camelcase');
console.log(camelCase('ik-ben-aris_rosbach'));


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const PORT = 8000

const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");


app.use('/static', express.static('static'))


app.get("/", (req, res) => {
  res.render("matches");
});


app.get('/', onhome)
app.get('/about', onabout)
app.get('/login', onlogin)
app.get('*', notfound)

function onhome(req, res) {
  res.send('<h1>Dit is de homepagina!</h1>')
}

function onabout(req, res) {
  res.send('<h1>Hier vind je alles about me!</h1>')
}

function onlogin(req, res) {
  res.send('<h1>Op deze pagina kun je inloggen</h1>')
}

function notfound(req, res) {
  res.send('<h1>404 - Not Found!</h1>')
}

app.listen(PORT, function () {
  console.log('listening to port: ', PORT)
})



