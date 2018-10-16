module.exports = {
    getHomePage: (req, res) => {
        res.render('pages/index.ejs', {"var1":["Libano","San_Juan","Colorado","Las_Juntas","San_Miguel", "Rio_Naranjo", "Tilaran", "Quebrada_Grande","Sierra","Mogote","Tronadora","Tierras_Morenas","Bagaces","Nacascolo","Arancibia","Arenal","La_Fortuna","La_Union","Porozal"],"var2":[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,0,1,2,3], "error":""});  
    },

    getVisor: (req, res) => {
        res.render('pages/visor.ejs', {"var1":"error","var2":[], "error":""});  
    },

    login: (req, res, next) => {
        let query = "select * from usuario where usuario= '"+ req.body.usr+"' and contrasenna= '"+req.body.pwd+"'";
        console.log(query);
        db.query(query, function(err, rows, fields) {
        if (!err){
            if(rows.length > 0){

                next();
            }
            else{
                res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
            }
        }
        else{
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"})
        }
        });
    },

    getMain: (req, res) => {
        let query = "select A.codigo, A.nombre, C.Nombre as distrito,Ca.Nombre as canton,P.Nombre as provincia from Asada A, distrito C, Canton Ca, provincia P where A.DISTRITO_ID=C.ID and A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/main.ejs', {"rows":rows})}
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
        }
        });
    },

    getAsada: (req, res) => {
        var id = req.params.id;
        let query = "select * from asada where codigo= "+id+"";
        let query2 = "select A.nombre, Su.detalle ,S.texto from subcomponentexasada S inner join Asada A on A.codigo=S.Asada_Codigo inner join subcomponente Su on Su.ID=S.Subcomponente_ID where S.Asada_Codigo ="+id+" and Año= 2018;";
        // execute query
        db.query(query2, function(err, rows, fields) {
        if (!err){
                res.render('pages/asada.ejs', {"rows":rows,"resp":rows});
        }
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
        }
        });
    },

    getComponente: (req,res) =>{
        var id = parseInt(req.params.id);
        var var1 = ["Libano","San_Juan","Colorado","Las_Juntas","San_Miguel", "Rio_Naranjo", "Tilaran", "Quebrada_Grande","Sierra","Mogote","Tronadora","Tierras_Morenas","Bagaces","Nacascolo","Arancibia","Arenal","La_Fortuna","La_Union","Porozal"];
        var var2 = [3,2,1,3,0,2,3,1,0,4,0,1,4,3,4,0,1,2,3];
        res.render('pages/index.ejs', {"var1":var1,"var2":var2, "error":""});  

    }
};