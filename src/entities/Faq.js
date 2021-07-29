const mongoose = require("mongoose");

const FaqSchema = mongoose.Schema(
	{
		key: { type: String, unique: true, required: true }, // identifiant
		name: { type: String },
		question: { type: String },
		answer: { type: String },
		wl: { type: Number, default: 0 },
		lang: { type: String, default: "fr_FR" },
		category: {type: String, default: "Divers" }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Faq", FaqSchema);
