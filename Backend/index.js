const express= require ('express')
const cors = require ('cors');

const {complainModel} = require ('./model/complainModel.js')
const {botModel}= require ('./model/botModel.js')

const botRoute = require ('./routes/botRoute.js')
const complainRoute = require('./routes/complainRoute.js')
const botAccessRoute=require('./routes/botAccessRoute.js')

require('dotenv').config();

const app = express();
// Allow CORS for all origins or specific domains
app.use(cors({
  origin: '*', // Replace * with your client domains for more security
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({extended: true})) 




// VERY IMPORTANT: allow embedding in iframes
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL"); // or set to specific domain
  res.setHeader("Content-Security-Policy", "frame-ancestors *"); // or specify allowed parent sites
  next();
});


// ─────────Routes────────────────────────────────────────────────
app.use("/chat",botRoute)
app.use("/complain",complainRoute)
app.use("/website",botAccessRoute)
app.use('/bot',botAccessRoute); //check is website exisit


complainModel.sync({force: false}) 
botModel.sync({alter: true}) 

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));
