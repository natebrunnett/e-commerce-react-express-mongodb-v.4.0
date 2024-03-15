const express = require('express'), 
app = express(),
mongoose = require('mongoose');

//console.log prints to gitbash terminal 
mongoose.set('debug',true)
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//get req.body
const cors = require('cors')
app.use(cors())

require('dotenv').config({ path: './.env' });

const PORT = process.env.PORT || 3030;
mongoose.set('strictQuery', false);

async function connecting(){
try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to the DB')
} catch ( error ) {
    console.log('ERROR: Seems like your DB is not running, please start it up !!!');
}
}
connecting()

app.use('/payment', require('./routes/payment.route.js'));
app.use('/Guest', require('./routes/guestRoutes.js'));
app.use('/Products', require('./routes/productRoutes.js'));
const path = require('path');

//images are stored in server folder not client
app.use('/assets', express.static(path.join(__dirname, 'static')))

/*cyclic start*/
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
/*cyclic end*/

app.listen(PORT, () => console.log(`listening on port ${PORT}`))