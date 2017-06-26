// 쓰지 않는 코드

var express = require('express');
var router = express.Router();
var dbSequelize = require('../../config/db/dbConfig(sequelize)');

router.get('/test', function (req, res) {
    console.log(dbSequelize);
    dbSequelize.user.findAll({
        where:{
            id:'1234'
        }
    })  // "SELECT * from user where id='1234'"
    .then(rows => {
        console.log(rows);
        res.json(rows);
    });
});