import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// route imports
import loginRoutes from './routes/login-callback.route.js';
import portfolioRoutes from './routes/portfolio.route.js';

import auth from './middleware/auth.middleware.js';

const app = express();

// CORS setup
const corsOptions = {
    origin: [process.env.FRONT_END, process.env.BACK_END],
    methods: ['GET', 'PUT', 'POST'],
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions));

// Append routes here
app.use('/login', loginRoutes);
app.use('/portfolio', portfolioRoutes);

const CONNECTION_URL = process.env.MONGO_URL;
const PORT = process.env.PORT|| 5000;

// connects mongoose + express
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);