const log4js = require("log4js");
const config = require("config");
const logger = log4js.getLogger("ListService");

const { cache, getCache, getCachePattern, getCacheOrFetch } = require('../utils/CacheUtil');

logger.level = config.get("log.level");

const VatRate = require("../entities/VatRate");
const ResponseUtils = require("../utils/ResponseUtil");
const { json } = require("express");


module.exports = {
	findOne: async function (id) {
		const fetchFunction = async (id) => {
			return await VatRate.findById(id);
		}
		return getCacheOrFetch('vat', 'get', id, fetchFunction(id));
	},
	findByWl: async function (wl) {
		const fetchFunction = async (wl) => {
			return await VatRate.where("wl").equals(wl);
		}
		return getCacheOrFetch('vat', 'byWl', wl, fetchFunction(wl));
	},
	store: async function (data) {
		try {
			const newItem = await VatRate.create(data);
			cache.set(getCache('vat','get',newItem._id), JSON.stringify(newItem));
			cache.del(getCachePattern('vat','byWl'));
			return newItem;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsConflict(error);
		}
	},
	edit: async function (id, request) {

		try {
			const vatRate = await VatRate.findById(id);
			if (!vatRate) {
				throw new Error("empty");
			}

			vatRate.wl = request.wl ? request.wl : vatRate.wl;
            vatRate.rate = request.rate ? request.rate : vatRate.rate;
            vatRate.codeCompta = request.codeCompta ? request.codeCompta : vatRate.codeCompta;

			const updated = await vatRate.save();

			cache.set(getCache('vat','get',updated._id), JSON.stringify(updated));
			cache.del(getCachePattern('vat','byWl'));
			
			return updated;
		} catch (error) {
			logger.debug(error);
			ResponseUtils.errorsNotFound();
		}
	},
	destroy: async function (id) {
		try {
			cache.del(getCache('vat','get',id));
			cache.del(getCachePattern('vat','byWl'));
			return await VatRate.deleteOne({ _id: id })
		} catch (error) {
			logger.debug('destroy method',error)
			ResponseUtils.errorsNotFound();
		}
	},
};
