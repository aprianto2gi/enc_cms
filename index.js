const express = require("express");
const app = express();
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
var flash= require("express-flash");

var ecommerce = require("./routes/ecom");
var admin = require("./routes/admin");

var conn = require("express-myconnection");
var mysql = require("mysql");

app.set('port', process.env.port || 8000);
app.set('view engine','ejs');

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(conn(
    mysql,{
        host:"localhost",
        user:"root",
        password:"",
        database:"exercises3_db"
    }, "single"
));

app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true,
    cookie:{ maxAge: 120000 }
}));

app.get("/",ecommerce.home);
app.get("/detail/:id",ecommerce.detail);

app.get("/admin",admin.login);
app.get("/admin/login",admin.login);
app.post("/admin/login",admin.login);
app.get("/admin/product",admin.product);

app.get("/admin/add_product", admin.add_product);
app.post("/admin/add_product", admin.add_product_submit);

app.get("/admin/edit_product/:id", admin.edit_product);
app.post("/admin/edit_product/:id", admin.edit_product_submit);

app.get("/admin/delete_product/:id", admin.delete_product);

app.get("/admin/logout", admin.logout);

app.listen(app.get('port'),function(){
    console.log("berjalan di port " + app.get('port'));
});