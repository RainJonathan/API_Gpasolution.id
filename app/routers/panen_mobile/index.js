// whatsapp_routers.js
const { Router } = require("express");
const pemanenRoutes = require("./pemanen");
const kebunRoutes = require("./kebun");
const afdelingRoutes = require("./afdeling");
const blokRoutes = require("./blok");
const authRoutes = require("./auth");
const pengawasRoutes = require("./pengawas");
const LandingPage = require("./landing_page.js");

const MobilePanen = Router();

MobilePanen.use('/pemanen', pemanenRoutes);
MobilePanen.use('/kebun', kebunRoutes);
MobilePanen.use('/afdeling', afdelingRoutes);
MobilePanen.use('/blok', blokRoutes);
MobilePanen.use('/auth', authRoutes);
MobilePanen.use('/pengawas', pengawasRoutes);
MobilePanen.use('/', LandingPage);

module.exports = MobilePanen;
