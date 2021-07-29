const router = require("express").Router();

const listCtrl = require("../controllers/v1/ListController");


router.get("/:id", listCtrl.get);
//Get lists by section, wl and language
router.get("/:section/:wl/:lang", listCtrl.getBySectionAndWlAndLang);
//Add list data
router.post("/data/:id", listCtrl.addData);
//Edit list data
router.put("/data/:id", listCtrl.editData);
//Delete list data
router.put("/data/rm/:id", listCtrl.removeData);
/*router.delete('/:id', listCtrl.deleteList); */

module.exports = router;
