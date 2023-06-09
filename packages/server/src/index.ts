import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { appRouter } from "./router";
import { createContext } from "./context";
import cron from "node-cron";
import transporter from "./mail/transport";
import { prisma } from "./db";
import { createEmailText } from "./mail/createEmailText";
import { MailOptions } from "nodemailer/lib/json-transport";
import dayjs from "dayjs";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin:
      "https://manpriya-client.tupite.ga" ||
      "https://manpriya-client.vercel.app" ||
      "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
const PORT = Number(process.env.SERVERPORT) || 3001;

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);

cron.schedule("0 12 * * *", async () => {
  // cron.schedule("*/30 * * * * *", async () => {
  const currentDate = new Date();
  const nextFiveDays = new Date();
  nextFiveDays.setDate(currentDate.getDate() + 5);

  const clients = await prisma.client.findMany({
    where: {
      billduedate: {
        gte: currentDate,
        lte: nextFiveDays,
      },
      sendemail: true,
    },
  });
  const invoiceDueInDays = clients.map((client) => {
    const billDueDate = dayjs(client.billduedate);
    const currentDate = dayjs();
    const diff = billDueDate.diff(currentDate, "day");
    return diff;
  });

  console.log("clients", clients);
  console.log("currentDate", currentDate);
  console.log("nextFiveDays", nextFiveDays);

  clients.forEach(async (client, index) => {
    const emailText = createEmailText(
      client.invoice,
      client.name,
      client.billduedate
    );
    const mailOptions: MailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: `Invoice ${client.invoice} due in ${
        invoiceDueInDays[index] + 1
      } days`,
      html: emailText,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
});

export type AppRouter = typeof appRouter;
