const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

const io = require('socket.io').listen(server);
io.set('origins', '*:*');


// Socket route declaration

// End socket route declaration

global.__basedir = __dirname;

// Connect database
connectDB();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Init Middleware
app.use(express.json({extended: false}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// API ROUTES DEFINE HERE
// app.use('/api/users', require('./routes/api/user'));
app.use('/api/admin/matches', require('./route/api/admin/matches'));
app.use('/api/admin/teams', require('./route/api/admin/teams'));
app.use('/api/admin/auth', require('./route/api/admin/auth'));

// api for teams
app.use('/matches', require('./route/api/team/matches'));

// UPLOADED MEDIA
app.get('/media/image/:filename', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'media', 'image', req.params.filename));
});


// Serve static assets in production
// process.env.NODE_ENV == 'production'


// Check session
