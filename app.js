require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const path = require('path');

// db
const connectDB = require('./db/connect');

// extra packages
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const xssCleaner = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// config
const origin = require('./config/origin');

// Middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');


const rateLimit = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});




app.set('trust proxy', 4);
app.use(helmet());
// app.use(cors({ credentials: true, origin }));
app.use(xssCleaner());
app.use(mongoSanitize());


app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use('/api/v1', rateLimit);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/api/v1/ip', (req, res) => {
    res.status(200).json(req.ip);
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

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