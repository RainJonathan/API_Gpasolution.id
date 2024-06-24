const { Router } = require("express");
const {
    queryMessage,
} = require("../../controllers/aset/asset_alert_controller");

const AssetAlertRouter = Router();

AssetAlertRouter.post("/asset-alert", queryMessage);


module.exports = AssetAlertRouter;
