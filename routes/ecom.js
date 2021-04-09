exports.home=function(req,res){
    req.getConnection(function(err,connect){
        var sql=connect.query("select * from product", function(err,rows){
            if(err){
                console.log("error database index: ", err);
            }
            res.render("index", {
                data: rows
            });
        });
    }); 
}

exports.detail=function(req,res){ var id=req.params.id
    req.getConnection(function(err,connect){
        var sql=connect.query("select * from product where id_product=?",id, function(err,row){
            if(err){
                console.log("error database detail: ",err);
            }
            res.render("single",{
                data:row
            });
        });
    });
    //res.render("single");

}