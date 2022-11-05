const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const routes = require('./routes');
const schedule = require('node-schedule');
const { pushPlan } = require('./controllers/push');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes); //라우터

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
