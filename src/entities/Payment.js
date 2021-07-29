const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({

    //_id 
    key: {type: String}, 
    name: { type: String },
    codeCompta: {type: String}, 
    wl: { type: Number},

},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Payment', paymentSchema);
