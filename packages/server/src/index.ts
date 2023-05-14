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

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin(requestOrigin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://manpriya-client.vercel.app",
      ];
      if (!requestOrigin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(requestOrigin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.urlencoded({ extended: true }));
const PORT = Number(process.env.PORT) || 3001;

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

  console.log("clients", clients);
  console.log("currentDate", currentDate);
  console.log("nextFiveDays", nextFiveDays);

  clients.forEach(async (client) => {
    const emailText = createEmailText(
      client.invoice,
      client.name,
      client.billduedate
    );
    const mailOptions: MailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: "Invoice Reminder",
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
