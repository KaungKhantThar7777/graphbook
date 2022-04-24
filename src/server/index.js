import express, { application } from "express";
import path from "path";
import db from "./database";

// middlewares
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// services
import servicesLoader from "./services";

const utils = {
  db,
};

const services = servicesLoader(utils);

const root = path.join(__dirname, "../../");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      },
    })
  );
  app.use(
    helmet.referrerPolicy({
      policy: "same-origin",
    })
  );
}

app.use(compression());
app.use(cors());

app.use("/", express.static(path.join(root, "/dist/client")));
app.use("/uploads", express.static(path.join(root, "/uploads")));

const serviceNames = Object.keys(services);

for (let name of serviceNames) {
  if (name === "graphql") {
    (async () => {
      await services[name].start();
      services[name].applyMiddleware({ app });
    })();
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.get("/", (req, res) =>
  res.sendFile(path.join(root, "/dist/client/index.html"))
);
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on port ${port}`));
