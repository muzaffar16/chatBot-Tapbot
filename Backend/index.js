const express= require ('express')
const cors = require ('cors');
const {complainModel} = require ('./model/complainModel.js')
const botRoute = require ('./routes/botRoute.js')
const complainRoute = require('./routes/complainRoute.js')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true})) 





// ─────────Routes────────────────────────────────────────────────
app.use("/chat",botRoute)
app.use("/complain",complainRoute)


complainModel.sync({force: false}) 

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));
