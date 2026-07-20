import connectDB from "./db/database.js";
import { app } from "./app.js";
import { initSocket } from "./sockets/socket.js";
import { startNotificationJob } from "./services/notificationService.js";
import http from "http";
import "./services/scheduleService.js";
import { downloadMedicineVectors } from "./utils/downloadMedicineVectors.js";
import { initializeLanceDB } from "./services/rag/lanceClient.js";

export default async function startServer() {
  try {
    await connectDB();
    await downloadMedicineVectors();

    await initializeLanceDB();

    const server = http.createServer(app);
    initSocket(server);
    

    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
      startNotificationJob();

      console.log("Notification job started.");
    });
  } catch (err) {
    console.error("Server start failed:", err);
    process.exit(1);
  }
}
