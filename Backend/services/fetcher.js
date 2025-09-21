const axios = require("axios");
const db = require("../config/db.js");

const apiKeys = ['AIzaSyCqmsleD5VZ-MBCCjVXAscJfhOqaVD2Eu8'];
let currentKeyIndex = 0;

const query = "cricket";

async function fetchVideos() {
  try {
    const apiKey = apiKeys[currentKeyIndex];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&q=${query}&key=${apiKey}&maxResults=10`;

    const res = await axios.get(url);
    const videos = res.data.items;

    videos.forEach(item => {
      const videoData = {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: new Date(item.snippet.publishedAt),
        thumbnails: JSON.stringify(item.snippet.thumbnails)
      };

      db.query(
        `INSERT INTO videos (videoId, title, description, publishedAt, thumbnails)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=?, description=?, publishedAt=?, thumbnails=?`,
        [
          videoData.videoId, videoData.title, videoData.description, videoData.publishedAt, videoData.thumbnails,
          videoData.title, videoData.description, videoData.publishedAt, videoData.thumbnails
        ],
        (err) => {
          if (err) {
            console.error("DB insert error:", err.message);
          }
        }
      );
    });

    console.log("Videos fetched and stored.");
  } catch (err) {
    console.error("Fetcher error:", err.message);
  }
}

function startFetcher() {
  setInterval(fetchVideos, 10000); 
  fetchVideos(); 
}

module.exports = startFetcher;
