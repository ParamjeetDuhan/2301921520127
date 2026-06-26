const express = require("express");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Notification API Running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});