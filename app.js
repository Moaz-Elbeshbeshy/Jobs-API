require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const authMiddleware = require('./middleware/authentication')
const sanitize = require('./middleware/manual-xss')

// Security packages
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

// routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)   // if the code will be deployed which I will, allow it to trust the proxy.
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }))  //limit each IP to 100 requests per windowsMs
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(sanitize)

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
