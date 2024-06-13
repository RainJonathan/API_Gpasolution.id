// whatsapp_routers.js
const { Router } = require("express");
const DataRouter = require("./data_router");

const LaporanRouter = Router();

LaporanRouter.use('/', DataRouter);

module.exports = LaporanRouter;
