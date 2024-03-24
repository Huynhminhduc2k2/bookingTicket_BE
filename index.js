import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import env from 'dotenv';

//APP SETUP
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Database setup
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

//GET METHOD
app.get('/', (req, res) => {
  res.send('Hello world');
});

//POST METHOD

//APP LISTEN
app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
