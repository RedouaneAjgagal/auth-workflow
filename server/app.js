require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// db
const connectDB = require('./db/connect');

// extra packages
const cookieParser = require('cookie-parser');


// Middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Sever is running on ${port}`);
        });
    } catch (error) {
        console.error(error)
    }
}

start();