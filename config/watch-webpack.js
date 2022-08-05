const webpack = require("webpack");

module.exports = (config, callback = (err, name) => {}) => 
{
	webpack(config).watch({  }, (err, stats) => 
	{
		if(err)
			console.error(err);
		else
			console.log(stats.toString("minimal"));
		
		callback(err, config.name);
	});
};