const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM videos ORDER BY publishedAt DESC", (err, results) => {
    if (err) {
      console.error("Error fetching videos:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const parsedResults = results.map(video => {
      let thumbs = video.thumbnails;

      try {
        if (typeof thumbs === "string") {
          thumbs = JSON.parse(thumbs);
        }
      } catch (e) {
        console.error("Thumbnail parse error:", e.message);
        thumbs = null;
      }

      return { ...video, thumbnails: thumbs };
    });

    res.json(parsedResults);
  });
});

router.post("/", (req, res) => {
  const { title, url } = req.body;
  db.query(
    "INSERT INTO videos (title, url) VALUES (?, ?)",
    [title, url],
    (err, result) => {
      if (err) {
        console.error("Error inserting video:", err.message);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json({ id: result.insertId, title, url });
      }
    }
  );
});

module.exports = router;
