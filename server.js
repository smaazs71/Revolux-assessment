import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// connectMongoDB();

const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1/products", productRoutes);

// app.use("/", (req, res) => {
//   res.send("Welcome");
// });

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server running on port: " + port);
});
