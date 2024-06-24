const { Router } = require('express');
const { checkAuth } = require('../middlewares/sessionAuthentication'); // Adjust the path as necessary
const WhatsappRouter = require('./asset/index');
const LaporanRouter = require('./laporan_panen/index');
const MobileRouter = require('./panen_mobile/index');
const DocumentationRouter = require('./documentation/index');
const LandingPage = require('./landingPage');

const MainRouter = Router();

// Apply checkAuth middleware only to the /documentation route
MainRouter.use('/documentation', checkAuth, DocumentationRouter);

MainRouter.use('/whatsapp', WhatsappRouter);
MainRouter.use('/laporan', LaporanRouter);
MainRouter.use('/api/v1', MobileRouter);
MainRouter.use('/', LandingPage);

module.exports = MainRouter;
