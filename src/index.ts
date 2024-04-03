import * as mongoose from "mongoose";
import { app } from "./app";
import config from "./config/config";
import Logger from "./utils/logger";

const main = async () => {
  let server: any;
  const logger = new Logger();
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(config.mongoose.url)
    .then(() => {
      console.log("--database connection successful--");
    })
    .catch((err) => {
      console.log("--error connecting to database---", err);
    });

  // eslint-disable-next-line prefer-const
  server = app.listen(8080, () => {
    logger.info(`Listening to port 8080`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: any) => {
    logger.error("unexpectedErrorHandler", error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

main();
