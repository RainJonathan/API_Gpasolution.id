// Controller methods
const get = (req, res) => {
    // Assuming 'example' is the name of your EJS file (example.ejs)
    res.render('landingPage', { data: 'anyDataYouWantToPass' });
};

module.exports = {
    get,
};
