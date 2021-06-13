import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import { FRONT_END, BACK_END, SIGN_COOKIE_SECRET, MONGO_URL, PORT } from './utils/config.js';



//swagger jsdocs imports
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// route imports
import loginRoutes from './routes/login-callback.route.js';
import portfolioRoutes from './routes/portfolio.route.js';
import logoutRoutes from './routes/logout.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for Portfol.io",
      version: "1.0.0",
      description:
        "This is a CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Chen En & Chuan Hao"
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development backend server"
      },
    ]
  },
  apis: ["./routes/*.js"],
};
  
const swaggerSpecs = await swaggerJSDoc(swaggerOptions)

const app = express();

app.use(express.json());
app.use(cookieParser(SIGN_COOKIE_SECRET));

// CORS setup
const corsOptions = {
    origin: [ FRONT_END, BACK_END ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    optionsSuccessStatus: 204,
    credentials: true
}
app.use(cors(corsOptions));

// Append routes here
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/login", loginRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/logout", logoutRoutes);


const CONNECTION_URL = MONGO_URL;
const PORT_CONFIG = PORT || 5000;


//Note this only works for on the production server. For testing purposes, this will lead to an error.
app.use(express.static(path.join(__dirname, "..", "client/deploy")))

app.get('*', function (req, res) {
    //Note: You must use path.join() to handle relative paths i.e ../
    res.sendFile(path.join(__dirname, "..", 'client/deploy/index.html'));
});

//connects mongoose + express
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log("Mongoose server started."))
  .catch((error) => console.log(error));


const connect = mongoose.connection;
// const connect = mongoose.createConnection(MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });


app.listen(PORT_CONFIG, () => console.log("server up and running at " + PORT_CONFIG));


export default connect;


