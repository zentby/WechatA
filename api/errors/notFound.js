
module.exports = function notFound (req, res, next) {

  // Set status code
  res.status(404);

  // Log error to console
  console.log('Sending 404 ("Not Found") response');

 res.send('404, Not Found');

};
