// Controller methods
const get = (req, res) => {
    // Assuming 'example' is the name of your EJS file (example.ejs)
    res.render('landing_page', { data: 'anyDataYouWantToPass' });
};

module.exports = {
    get,
};
