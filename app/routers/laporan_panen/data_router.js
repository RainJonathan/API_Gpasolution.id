const { Router } = require("express");
const {
    getDataByMonth,
} = require("../../controllers/laporan_panen/laporan_controller");

const DataRouter = Router();

DataRouter.all("/:kebun/:month/:year", getDataByMonth);


module.exports = DataRouter;
