const { Router } = require("express");
const {
    sendMessage,
} = require("../../controllers/aset/asset_alert_controller");

const AssetAlertRouter = Router();

AssetAlertRouter.all("/asset-alert", sendMessage);


module.exports = AssetAlertRouter;
