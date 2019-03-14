const router = require("express").Router();
const controlers = require("../Controllers/main_ctrl");
const auth_ctrl = require("../Controllers/auth_ctrl");
const routeSecure = require("../middleware/route_secure");

router.get("/", routeSecure, controlers.homePage);

router.get("/signup", auth_ctrl.signup_get);
router.post("/signup", auth_ctrl.signup_post);

router.get("/login", auth_ctrl.loginGet);
router.post("/login", auth_ctrl.loginPost);

router.get("/passwordrecover", auth_ctrl.remindPasswordGet);
router.post("/passwordrecover", auth_ctrl.remindPasswordPost);

router.get("/reset/:resetToken", auth_ctrl.newPassGet);
router.post("/reset", auth_ctrl.newPassPost);

router.post("/deleteItem", controlers.deleteItemPost);

router.get(
  "/categories/:year/:month/:category",
  routeSecure,
  controlers.category
);

router.post("/logout", routeSecure, auth_ctrl.logoutGet);

router.get("/items/categories/:month", routeSecure);

router.get("/additem", routeSecure, controlers.addItemGet);
router.post("/additem", routeSecure, controlers.addItemPost);

router.post("/additem/filter", routeSecure, controlers.filterItems);

module.exports = router;
