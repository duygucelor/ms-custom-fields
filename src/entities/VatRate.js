const mongoose = require('mongoose');

const vatRateSchema = mongoose.Schema({

    //_id 
    rate: { type: Number },
    codeCompta: {type: String}, 
    wl: { type: Number}
},
	{
		timestamps: true,
	}
	);

module.exports = mongoose.model('VatRate', vatRateSchema);