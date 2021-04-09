const { query }= require("express");
var multer= require("multer");

exports.login=function(req,res){
    var message = "";
    var sess=req.session;
    var md5 = require("md5");

    if(req.method=="POST"){        
        var name= req.body.username;
        var password= md5(req.body.password);

        req.getConnection(function(err, connect){
            var sql="SELECT * FROM admin_tbl where username='"+name+"' and password='"+password+"' ";
            var query= connect.query(sql, function(err,result){
                if(err){
                    console.log(err);
                }
                if(result.length){
                    req.session.adminId=result[0].id_admin;
                    req.session.admin=result[0];
                    console.log(result[0].id_admin);
                    res.redirect("/admin/product");
                }else{
                    message="username dan password incorrect";
                    res.render("./admin/login", {
                        message:message
                    });
                }
            });
        });        
    }else{
        res.render("./admin/login",{
            message: message
        });
    }    
}

exports.product=function(req, res){
    var admin=req.session.admin; var adminId=req.session.adminId; console.log("id admin= " + adminId);
    if(adminId==null){
        res.redirect("/admin/login"); return;
    }

    req.getConnection(function(err, connect){
        var sql="SELECT * FROM product ORDER BY id_product DESC";
        var query= connect.query(sql, function(err, result){
            if(err){
                console.log(err);
            }
            res.render("./admin/index",{
                pathname: "product",
                data: result
            });
        });
    });    
}

exports.add_product=function(req, res){
    var admin=req.session.admin; var adminId=req.session.adminId; console.log("ID admin= "+adminId);
    if(adminId==null){ res.redirect("/admin/login"); return; }
    res.render("./admin/index",{
        pathname: "add_product"
    });    
}

exports.add_product_submit=function(req, res){
    var storage=multer.diskStorage({
        destination: "./public/images",
        filename: function(req, file, callback){
            callback(null, file.originalname);
        }
    });
    var upload= multer({ storage: storage }).single("gambar");
    var date= new Date(Date.now());

    upload(req, res, function(err){
        if(err){
            return res.end("Error upload image");
        }
        console.log(req.file); console.log(req.body);
        req.getConnection(function(err, connect){
            var post={
                nama_produk: req.body.nama,
                gambar_produk: req.file.filename,
                harga_product: req.body.harga,
                des_product: req.body.deskripsi,
                createdate: date
            }; console.log(post);

            var sql="INSERT INTO product set ?";
            var query= connect.query(sql, post, function(err,result){
                if(err){
                    console.log("Error insert data: %s", err);
                }
                req.flash("info","Success add product");
                res.redirect("/admin/product");
            });
        });
    });
}

exports.edit_product=function(req, res){
    var admin= req.session.admin; var adminId=req.session.adminId; console.log("id admin= "+adminId);
    if(adminId==null){
        res.redirect("/admin/login"); return;
    }
    var id_product=req.params.id;

    req.getConnection(function(err, connect){
        var sql="SELECT * FROM product where id_product= ?";
        var query=connect.query(sql, id_product, function(err,result){
            if(err){
                console.log(err);
            }
            res.render("./admin/index",{
                id_product: id_product,
                pathname: "edit_product",
                data: result
            });
        });
    });
}

exports.edit_product_submit=function(req, res){    
    var id_product=req.params.id;
    var storage= multer.diskStorage({
        destination: "./public/images",
        filename: function(req, file, callback){
            callback(null, file.originalname);
        }
    });
    var upload= multer({ storage:storage }).single("gambar"); var date= new Date(Date.now());

    upload(req, res, function(err){
        if(err){
            var gambar=req.body.gambar_lama; console.log("error upload image");
        }else if(req.file == undefined){
            var gambar=req.body.gambar_lama;
        }else{
            var gambar=req.file.filename;
        }
        console.log(req.file); console.log(req.body);

        req.getConnection(function(err,connect){
            var post={
                nama_produk: req.body.nama,
                gambar_produk: gambar,
                harga_product: req.body.harga,
                des_product: req.body.deskripsi,
                createdate: date
            }
            var sql="UPDATE product set ? where id_product=?";
            var query= connect.query(sql,[post,id_product], function(err,result){
                if(err){
                    console.log("update error: ", err);
                }
                req.flash("info", "success update data");
                res.redirect("/admin/product");
            });
        });

    });
}

exports.delete_product=function(req,res){
    id_product=req.params.id;

    req.getConnection(function(err,connect){
        var sql="DELETE FROM product where id_product=?";
        var query= connect.query(sql, id_product, function(err, result){
            if(err){
                console.log("error delete data:",err);
            }
            req.flash("info","Success delete data");
            res.redirect("/admin/product");
        });
    });
}

exports.logout=function(req,res){
    req.session.destroy(function(err){
        res.redirect("/admin/login");
    });
}

