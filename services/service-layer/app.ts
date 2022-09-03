import express from "express";
import useragent from "express-useragent";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(useragent.express());

app.use(bodyParser.json());

app.use(logErrors);

app.use(router);

export { app };
