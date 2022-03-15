const camelCase = require('camelcase');
console.log(camelCase('ik-ben-aris_rosbach'));


const express = require('express')
const app = express()
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser')
const multer = require('multer')
const PORT = process.env.PORT || 8000;


const {
  utilsDB
} = require('./utils/db')

// laad variableen uit mijn .env
require('dotenv').config();

// om de database te koppelen
const {
  MongoClient
} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@blok-tech-aris.lqajs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// alle dieren die in array staan in console weergeven
utilsDB(client).then(data => {
  console.log(data)
})

// Gebruiken van hbs voor extensions
app.engine("hbs", exphbs.engine({
  defaultLayout: "main",
  extname: ".hbs",
}));

// middleware to setup hbs view engine
app.set("view engine", "hbs");

// om images en css te serven in directory "static"
app.use('/static', express.static('static'));

// middleware om omtegaan met incoming data in de body van een request. In dit geval POST
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// async geeft aan dat dit een funcite is waarin dingen langer duren, zoals data uit een database halen
// res.render() wordt gebruikt om een view te renderen en verstuurd de gerenderde HTML naar de client. 
app.get("/", async (req, res) => {

  // data uit de database wat in een array is gestopt wordt nu in de constante dieren gezet.
  const dieren = await utilsDB(client);

  // ophalen dieren database en deze weergeven op de localhost:8000
  res.render("matches", {
    dieren: dieren
  });
});

app.post("/formulier", async (req, res) => {

  const dieren = await utilsDB(client);

  console.log(req.body);

  // filter animals
  const filteredDieren = dieren.filter((dieren) => {
    // stop het item alleen in de array wanneer onderstaande regel 'true' is
    return dieren.diersoort == req.body.diersoort;
  });
  //render van localhost:8000/formulier met de gefilterde dieren
  res.render("matches", {
    dieren: filteredDieren
  });
});

app.post("/delete", async (req, res) => {

  await client.connect()

  console.log(req.body)
  console.log(req.body.asieldier)

  //het dier op naam verwijderen die overeenkomt met de naam die geklikt is
  client.db('userdb').collection('users').deleteOne({
    naam: req.body.asieldier
  }).then(hond => {
    console.log(hond);
  })

  // response is dat de home pagana opnieuw geladen wordt
  res.redirect('/')

});


// // ----------------------------------------------------------- front-end
// const slider = document.querySelector('#matches section:nth-of-type(3) ul');
// let isDown = false;
// let startX;
// let scrollLeft;

// slider.addEventListener('mousedown', e => {
//   isDown = true;
//   slider.classList.add('active');
//   startX = e.pageX - slider.offsetLeft;
//   scrollLeft = slider.scrollLeft;
// });
// slider.addEventListener('mouseleave', _ => {
//   isDown = false;
//   slider.classList.remove('active');
// });
// slider.addEventListener('mouseup', _ => {
//   isDown = false;
//   slider.classList.remove('active');
// });
// slider.addEventListener('mousemove', e => {
//   if (!isDown) return;
//   e.preventDefault();
//   const x = e.pageX - slider.offsetLeft;
//   const SCROLL_SPEED = 3;
//   const walk = (x - startX) * SCROLL_SPEED;
//   slider.scrollLeft = scrollLeft - walk;
// });


// Hiermee worden er nieuwe routes gemaak
app.get('/about', onabout)
app.get('/login', onlogin)
app.get('*', notfound)


function onabout(req, res) {
  res.send('<h1>Hier vind je alles about me!</h1>')
}

function onlogin(req, res) {
  res.send('<h1>Op deze pagina kun je inloggen</h1>')
}

function notfound(req, res) {
  res.send('<h1>404 - Not Found!</h1>')
}


// Geeft aan dat de app draait op de poort 8000
app.listen(PORT, function () {
  console.log('listening to port: ', PORT)
})