const log4js = require("log4js");
const config = require("config");
const logger = log4js.getLogger("ListService");
logger.level = config.get("log.level");
var ObjectID = require("mongodb").ObjectID;

const List = require("../entities/List");
const ResponseUtils = require("../utils/ResponseUtil");
const {
	getCacheOrFetch,
	cache,
	getCache,
	getCachePattern,
} = require("../utils/CacheUtil");

module.exports = {
	findOne: async function (id) {
		const fetchFunction = async (id) => {
			return await List.findById(id);
		};
		return getCacheOrFetch("list", "get", id, fetchFunction(id));
	},
	findBySectionAndWlAndLang: async function (params) {
		const fetchFunction = async (params) => {
			return await List.find({
				section: params.section,
				wl: params.wl,
				lang: params.lang,
			});
		};
		return getCacheOrFetch(
			"list",
			"byS_WL_Lang",
			`${params.section}_${params.wl}_${params.lang}`,
			fetchFunction(params)
		);
	},
	addListData: async function (id, data) {
		try {
			const list = await List.findByIdAndUpdate(
				{ _id: ObjectID(id) },
				{ $push: { datas: data } },
				{ new: true }
			);
			cache.set(getCache("list", "get", id), list);
			cache.del(getCachePattern("list", "byS_WL_Lang"));
			return list;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsNotFound();
		}
	},
	editListData: async function (id, data) {
		try {
			const list = await List.findOneAndUpdate(
				{
					_id: ObjectID(id),
					"datas._id": ObjectID(data._id),
				},
				{ $set: { "datas.$.text": data.text } },
				{ new: true }
			);
			cache.set(getCache("list", "get", id), list);
			cache.del(getCachePattern("list", "byS_WL_Lang"));
			return list;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsNotFound();
		}
	},
	removeListData: async function (id, data) {
		try {
			const list = await List.findByIdAndUpdate(
				{ _id: ObjectID(id) },
				{ $pull: { datas: { _id: ObjectID(data._id) } } },
				{ new: true }
			);
			cache.set(getCache("list", "get", id), list);
			cache.del(getCachePattern("list", "byS_WL_Lang"));
			return list;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsNotFound();
		}
	},
};
