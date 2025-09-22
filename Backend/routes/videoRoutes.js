const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

function safeParseThumbnails(thumbnails) {
  if (!thumbnails) return null;

  if (typeof thumbnails === "object") {
    return thumbnails; // already parsed
  }

  if (typeof thumbnails === "string") {
    try {
      return JSON.parse(thumbnails);
    } catch (e) {
      console.error("Thumbnail parse error:", e.message);
      return null;
    }
  }

  return null;
}

router.get("/", (req, res) => {
  db.query("SELECT * FROM videos ORDER BY publishedAt DESC", (err, results) => {
    if (err) {
      console.error("Error fetching videos:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const parsedResults = results.map(video => ({
      ...video,
      thumbnails: safeParseThumbnails(video.thumbnails)
    }));

    res.json(parsedResults);
  });
});

// ✅ Search videos by title or description
router.get("/search", (req, res) => {
  const { q } = req.query; // ?q=keyword
  if (!q) return res.status(400).json({ error: "Missing search query" });

  const sql = `
    SELECT * FROM videos
    WHERE title LIKE ? OR description LIKE ?
    ORDER BY publishedAt DESC
  `;

  db.query(sql, [`%${q}%`, `%${q}%`], (err, results) => {
    if (err) {
      console.error("Error searching videos:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const parsedResults = results.map(video => {
      let thumbs = video.thumbnails;
      if (typeof thumbs === "string") {
        try {
          thumbs = JSON.parse(thumbs);
        } catch (e) {
          console.error("Thumbnail parse error:", e.message);
          thumbs = null;
        }
      }
      return { ...video, thumbnails: thumbs };
    });

    res.json(parsedResults);
  });
});

module.exports = router;
