const db = require("../models");
const Category = db.Category;

exports.findAll = (req, res) => {
    Category.findAll().then(data => res.send(data)).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving categories."
        });
    });
};