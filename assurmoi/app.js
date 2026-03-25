const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");
const initRoutes = require("./routes");

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://example.com", "*"], // whitelist
  }),
);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

module.exports = app;
