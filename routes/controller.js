module.exports = {
    getHomePage: (req, res) => {
        req.session.value= 0;
        res.render('pages/index.ejs', {"var1":["Libano","San_Juan","Colorado","Las_Juntas","San_Miguel", "Rio_Naranjo", "Tilaran", "Quebrada_Grande","Sierra","Mogote","Tronadora","Tierras_Morenas","Bagaces","Nacascolo","Arancibia","Arenal","La_Fortuna","La_Union","Porozal"],"var2":[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,0,1,2,3], "error":""});  
    },

    getVisor: (req, res, next) => {
        if(req.session.value==1)
        res.render('pages/visor.ejs', {"var1":["Libano","San_Juan","Colorado","Las_Juntas","San_Miguel", "Rio_Naranjo", "Tilaran", "Quebrada_Grande","Sierra","Mogote","Tronadora","Tierras_Morenas","Bagaces","Nacascolo","Arancibia","Arenal","La_Fortuna","La_Union","Porozal"],"var2":[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,0,1,2,3], "error":""});
        else
            res.redirect('/');

    },

    login: (req, res, next) => {
        let query = "select * from usuario where usuario= '"+ req.body.usr+"' and contrasenna= '"+req.body.pwd+"'";
        db.query(query, function(err, rows, fields) {
        if (!err){
            if(rows.length > 0){
                req.session.value= 1;
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
        if(req.session.value==1){
        let query = "select A.codigo, A.nombre, C.Nombre as distrito,Ca.Nombre as canton,P.Nombre as provincia from Asada A, distrito C, Canton Ca, provincia P where A.DISTRITO_ID=C.ID and A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/main.ejs', {"rows":rows})}
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});}

        });
        }
        else
            res.redirect('/');

    },

    getAsada: (req, res) => {
        if(req.session.value==1){
        var id = req.params.id;
        var f = new Date();
        let query = "select A.nombre, Su.detalle ,S.texto from subcomponentexasada S inner join Asada A on A.codigo=S.Asada_Codigo inner join subcomponente Su on Su.ID=S.Subcomponente_ID where S.Asada_Codigo ="+id+" and Año= "+ f.getFullYear()+";";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/asada.ejs',{"rows":rows})}
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
        }
        });
        }
        else
            res.redirect('/');
    },

    getComponente: (req,res) =>{
        var id = req.params.id;
        var var1 = ["Libano","San_Juan","Colorado","Las_Juntas","San_Miguel", "Rio_Naranjo", "Tilaran", "Quebrada_Grande","Sierra","Mogote","Tronadora","Tierras_Morenas","Bagaces","Nacascolo","Arancibia","Arenal","La_Fortuna","La_Union","Porozal"];
        var var2 = [3,2,1,3,0,2,3,1,0,4,0,1,4,3,4,0,1,2,3];
        if(req.session.value==0)
            res.render('pages/index.ejs', {"var1":var1,"var2":var2, "error":""});  
        else
            res.render('pages/visor.ejs', {"var1":var1,"var2":var2, "error":""});  

    },

    logout: (req,res) =>{
        req.session.value=0;
        console.log("Logout");
        res.redirect('/');
    },

    getnewAsada: (req,res) =>{
        if(req.session.value==1){
        let query = "select C.ID as idd ,Ca.ID as idc ,P.ID as idp, C.Nombre as distrito ,Ca.Nombre as canton ,P.Nombre as provincia from distrito C, Canton Ca, provincia P where C.CANTON_ID=Ca.ID and C.CANTON_PROVINCIA_ID=P.ID and Ca.PROVINCIA_ID=P.ID order by 4;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/addAsada.ejs', {"rows":rows})}
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});}

        });
        }
        else
            res.redirect('/');
    },

    postnewAsada: (req,res) =>{
        if(req.session.value==1){
        var nom = req.body.nom;
        var ident = req.body.ident;
        var site = req.body.site;
        var sites = site.split("-");
        let query = "insert into asada(codigo, nombre, DISTRITO_ID, DISTRITO_CANTON_ID, DISTRITO_CANTON_PROVINCIA_ID) values("+ident+",'"+nom+"',"+sites[0]+","+sites[1]+","+sites[2]+");";
        // execute query
        db.query(query, function(err, result) {
        if (!err){
            res.redirect('/main');}

        else{
            console.log('Error while performing Query.');
            res.redirect('/main');}
        }
        );
        }
        else
            res.redirect('/');
    }

};