const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const contentTypeRoute = require("./content_type.route");
const contentDataRoute = require("./content_data.route");
const contentMediaRoute = require("./content_media.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/content-type",
    route: contentTypeRoute,
  },
  {
    path: "/content-data",
    route: contentDataRoute,
  },
  {
    path: "/content-media",
    route: contentMediaRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
