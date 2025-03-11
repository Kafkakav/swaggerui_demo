const express = require('express');
const fs = require('fs');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const jsYaml = require('js-yaml');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const OpenApiValidator = require('express-openapi-validator');

const OPENAPI_YAML_FILE = 'petstore_swagger.yaml'

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10MB' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const openApiYaml = path.join(__dirname, OPENAPI_YAML_FILE);
swaggerSchema = jsYaml.load(fs.readFileSync(openApiYaml));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSchema));

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiYaml,
    operationHandlers: path.join(__dirname),
    validateRequests: true,
    validateResponses: false,
  }),
);

app.post('/v2/pet', (req, res) => {
    // If validation passes, req.body will contain the validated data
    res.status(201).json({ message: 'User created', data: req.body });
});
app.post('/v2/users', (req, res) => {
    // If validation passes, req.body will contain the validated data
    res.status(201).json({ message: 'User created', data: req.body });
});

// Error handler (required by express-openapi-validator)
app.use((err, req, res, next) => {
  console.log("Error: err.message:", err.messag)
  res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
  });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/api-docs');
});
