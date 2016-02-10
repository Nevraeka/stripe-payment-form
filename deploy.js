var ghpages = require('gh-pages');

ghpages.publish(__dirname, function(err){ console.log(err); });
