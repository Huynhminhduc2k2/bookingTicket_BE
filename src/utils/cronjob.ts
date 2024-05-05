// cronjob.service.js
import cron from "node-cron";
import { cancelExpiredTickets } from "../services/ticket.service";

// Thiết lập cron job để hủy vé tự động sau mỗi phút
export const setupCronJob = () => {
    cron.schedule("* * * * *", async () => {
        await cancelExpiredTickets();
    });
};
