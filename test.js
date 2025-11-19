// test.js
const express = require("express");
const app = express(); // <-- you need this

// Example route
app.get("/test", async (req, res) => {
  res.send("Backend is working!");
});

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
