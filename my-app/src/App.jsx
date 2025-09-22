import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";

const { Search } = Input;

const App = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

 
const fetchVideos = async (query = "") => {
  setLoading(true);
  try {
    const url = query
      ? `http://localhost:5000/videos/search?q=${query}`
      : `http://localhost:5000/videos`;
    const res = await axios.get(url);

    // ✅ No JSON.parse here
    setVideos(res.data);
  } catch (err) {
    console.error("Error fetching videos:", err);
  }
  setLoading(false);
};

  useEffect(() => {
    fetchVideos();
  }, []);

console.log(videos);
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnails",
      key: "thumbnail",
      render: (thumbs) => (
        <img
          src={thumbs?.default?.url}
          alt="thumb"
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      key: "publishedAt",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>YouTube Video Dashboard</h2>
      <Search
        placeholder="Search videos..."
        enterButton
        allowClear
        onSearch={(value) => fetchVideos(value)}
        style={{ marginBottom: 20, width: 400 }}
      />
      <Table
        dataSource={videos}
        columns={columns}
        rowKey="videoId"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default App;
