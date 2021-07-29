const log4js = require("log4js");
const config = require("config");
const logger = log4js.getLogger("ListService");
logger.level = config.get("log.level");

const Attribute = require("../entities/Attribute");
const ResponseUtils = require("../utils/ResponseUtil");
const {
	getCacheOrFetch,
	cache,
	getCache,
	getCachePattern,
} = require("../utils/CacheUtil");

const fetchFunctionfindByWlAndLang = async (wl, lang) => {
	return await Attribute.where("wl").equals(wl).where("lang").equals(lang);
};

const fetchFunction = async (id) => {
	return await Attribute.findById(id);
};

module.exports = {
	findByWlAndLang: async function (wl, lang) {
		return getCacheOrFetch(
			"attribute",
			"byWL_Lang",
			`${wl}_${lang}`,
			fetchFunctionfindByWlAndLang(wl, lang)
		);
	},
	findOne: async function (id) {
		
		return getCacheOrFetch("attribute", "get", id, fetchFunction(id));
	},
	store: async function (data) {
		try {
			const newItem = await Attribute.create(data);
			cache.set(
				getCache("attribute", "get", newItem._id),
				JSON.stringify(newItem)
			);
			cache.del(getCachePattern("attribute", "byWL_Lang"));
			return newItem;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsConflict(error);
		}
	},
	edit: async function (id, request) {
		try {
			const attribute = await Attribute.findById(id);
			if (!attribute) {
				throw new Error("empty");
			}

			attribute.name = request.name ? request.name : attribute.name;
			//attribute.lang = request.lang ? request.lang : attribute.lang;
			attribute.typeData = request.typeData
				? request.typeData
				: attribute.typeData;
			attribute.datas = request.datas ? request.datas : attribute.datas;
			attribute.unity = request.unity ? request.unity : attribute.unity;

			await attribute.save();

			cache.set(
				getCache("attribute", "get", attribute._id),
				JSON.stringify(attribute)
			);
			cache.del(getCachePattern("attribute", "byWL_Lang"));
			return attribute;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsNotFound();
		}
	},
	destroy: async function (id) {
		try {
			cache.del(getCache("attribute", "get", id));
			cache.del(getCachePattern("attribute", "byWL_Lang"));
			return await Attribute.deleteOne({ _id: id });
		} catch (error) {
			logger.debug("destroy method", error);
			ResponseUtils.errorsNotFound();
		}
	},
};
