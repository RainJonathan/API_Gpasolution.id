// whatsapp_routers.js
const { Router } = require("express");
const MessageRouter = require("./message_router");
const SessionRouter = require("./session_router");
const AssetAlertRouter = require("./asset_alert_router");

const WhatsappRouter = Router();

WhatsappRouter.use('/', AssetAlertRouter);
WhatsappRouter.use('/', SessionRouter);
WhatsappRouter.use('/', MessageRouter);

module.exports = WhatsappRouter;
