const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Hey its me");
})

module.exports = router;