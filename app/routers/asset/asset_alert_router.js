const { Router } = require("express");
const {
    sendMessage,
} = require("../../controllers/aset/asset_alert_controller");

const AssetAlertRouter = Router();

AssetAlertRouter.post("/asset-alert", sendMessage);


module.exports = AssetAlertRouter;
