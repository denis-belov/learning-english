const fs = require('fs');
const express = require('express');
const app = express();

// Array.prototype.shuffle = function() {
//   let i = this.length;

//   let j, temp;

//   while ( --i ) {
//      j = Math.floor(Math.random() * (i + 1));
//      temp = this[i];
//      this[i] = this[j];
//      this[j] = temp;
//   }

//   return this;
// }

// let index = 0;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// app.get('/clear', (req, res) => {
//   fs.writeFileSync('base.json', '{}');

//   res.send('Base has cleared');
// });

app.get('/add', (req, res) => {
  const new_word = {};
  const target = JSON.parse(fs.readFileSync(`${ req.query.target.trim().toLowerCase() }.json`, 'utf8'));

  const en = req.query.en.trim().toLowerCase();
  const ru = [ ...req.query.ru.trim().split(/[^a-zA-Zа-яА-Я0-9( )+]+/g) ].map((elm) => elm.trim().toLowerCase()).filter((elm) => (typeof elm === 'string' && elm.length > 0));

  target[en] = ru;

  fs.writeFileSync(`${ req.query.target.trim().toLowerCase() }.json`, JSON.stringify(target));

  res.send(target);
});

// app.get('/get_base', (req, res) => {
//   const base = JSON.parse(fs.readFileSync('base.json', 'utf8'));
//   const words = Object.keys(base);

//   res.send({ base, words });
// });

// app.get('/get_base_reverse', (req, res) => {
//   const base = JSON.parse(fs.readFileSync('base.json', 'utf8'));
//   const words = Object.keys(base).reverse();

//   res.send({ base, words });
// });

// app.get('/get_base_shuffle', (req, res) => {
//   const base = JSON.parse(fs.readFileSync('base.json', 'utf8'));
//   const words = Object.keys(base).shuffle();

//   res.send({ base, words });
// });

// app.get('/get_base_randomize', (req, res) => {
//   const base = JSON.parse(fs.readFileSync('base.json', 'utf8'));
//   const words = Object.keys(base).map((elm, index, arr) => arr[Math.floor(Math.random() * arr.length)]);

//   res.send({ base, words });
// });

app.listen(3000, () => console.log('App listening on port 3000!'));
