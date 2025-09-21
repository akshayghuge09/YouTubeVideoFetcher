const express = require("express");
const videoRoutes = require("./routes/videoRoutes.js");
const startFetcher = require("./services/fetcher.js");
const db = require("./config/db.js");

const app = express();
app.use(express.json());


db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("MySQL connected");
    connection.release();
  }
});


app.use("/videos", videoRoutes);


startFetcher();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
