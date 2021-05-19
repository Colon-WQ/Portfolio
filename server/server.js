import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { FRONT_END, BACK_END, SIGN_COOKIE_SECRET, MONGO_URL, PORT } from './utils/config.js';

// route imports
import loginRoutes from './routes/login-callback.route.js';
import portfolioRoutes from './routes/portfolio.route.js';
import logoutRoutes from './routes/logout.route.js'

import auth from './middleware/auth.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser(SIGN_COOKIE_SECRET));

// CORS setup
const corsOptions = {
    origin: [ FRONT_END, BACK_END ],
    methods: ['GET', 'PUT', 'POST', 'DELETE' ],
    optionsSuccessStatus: 204,
    credentials: true
}
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     const allowedOrigins = [ FRONT_END, BACK_END ];
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     next();
// });

// Append routes here
app.use('/login', loginRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/logout', logoutRoutes)

const CONNECTION_URL = MONGO_URL;
const PORT_CONFIG = PORT || 5000;

console.log(MONGO_URL)
console.log(FRONT_END);

app.listen(PORT_CONFIG, () => console.log(`Server Running on Port: http://localhost:${PORT_CONFIG}`));

// connects mongoose + express
// mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Mongoose server started."))
//   .catch((error) => console.log(`${error} did not connect`));
// mongoose.set('useFindAndModify', false);


