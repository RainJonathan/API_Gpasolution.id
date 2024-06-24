const { Router } = require("express");
const WhatsappRouter = require("./whatsapp");

const Documentation = Router();

Documentation.use('/whatsapp', WhatsappRouter);

module.exports = Documentation;
