const { Router } = require("express");
const WhatsappRouter = require("./asset/index");
const LaporanRouter = require("./laporan_panen/index");
const MobileRouter = require("./panen_mobile/index");
const LandingPage = require("./landingPage");

const MainRouter = Router();

MainRouter.use('/whatsapp', WhatsappRouter);
MainRouter.use('/laporan', LaporanRouter);
MainRouter.use('/api/v1', MobileRouter);
MainRouter.use('/', LandingPage);

module.exports = MainRouter;
