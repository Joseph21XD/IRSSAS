module.exports = {
    //Función de inicio, 
    getHomePage: (req, res) => {
        req.session.value= 0;
        res.render('pages/index2.ejs',{"error":""});  
    },

    //Función enviar datos del mapa al script map.js del frontend
    getSites: (req,res) => {
        let query = "select C.codigo, avg(t.valor) as valor from Asada A, distrito C, Canton Ca, provincia P,"+
        "(select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from indicadorxasada s, indicador i "+
        "where s.Indicador_ID=i.ID  group by (s.Asada_ID)) t where A.DISTRITO_ID=C.ID and "+
        "A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID "+
        "and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID and A.id=t.asada_id group by(c.codigo);";
        db.query(query, function(err, rows, fields) {
        if (!err){
            var dictionary = [];
            var values = []
            for (var i = rows.length - 1; i >= 0; i--) {
                dictionary.push(rows[i].codigo);
                if(rows[i].valor < 20.0)
                    values.push(4);
                else if(rows[i].valor < 40.0)
                    values.push(3);
                else if(rows[i].valor < 60.0)
                    values.push(2);
                else if(rows[i].valor < 80.0)
                    values.push(1);
                else
                    values.push(0);
            }
            var jsonsites = { "sitios": dictionary, "valores": values }
            res.send(jsonsites);
        }
        else{
            console.log('Error while performing Query.');
            res.send({});
            }

        });
    },

    getVisor: (req, res, next) => {
        if(req.session.value==1){
        let query = "select distinct C.codigo from Asada A, distrito C, Canton Ca, provincia P where A.DISTRITO_ID=C.ID and A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID;";
        db.query(query, function(err, rows, fields) {
        if (!err){
            var dictionary = [];
            var values = []
            for (var i = rows.length - 1; i >= 0; i--) {
                dictionary.push(rows[i].codigo);
                values.push(Math.floor(Math.random() * (4 - 0)) + 0);
            }
            dictionary.push("7011");
            values.push(1);
            res.render('pages/visor.ejs', {"var1":dictionary ,"var2":values, "error":""});  
        }
        else{
            console.log('Error while performing Query.');
            res.redirect('/main');}

        });
        }else
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
                res.render('pages/index2.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
            }
        }
        else{
            res.render('pages/index2.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"})
        }
        });
    },

    getMain: (req, res) => {
        if(req.session.value==1){
        let query = "select A.id, A.nombre, C.Nombre as distrito,Ca.Nombre as canton,P.Nombre as provincia from Asada A, distrito C, Canton Ca, provincia P where A.DISTRITO_ID=C.ID and A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID;";
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
        let query = "select A.nombre, Su.detalle ,S.texto from indicadorxasada S inner join Asada A on A.id=S.Asada_id inner join indicador Su on Su.ID=S.indicador_id where S.Asada_id ="+id+" and Año= "+ f.getFullYear()+";";
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
        var id = req.query.id;
        var tipo = req.query.tipo;
        var s = "";
        if(tipo == "IRSSAS"){
            s= "select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from indicadorxasada s, indicador i where s.Indicador_ID=i.ID  group by (s.Asada_ID)";
        }
        else if(tipo == "SubComponente"){
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) AS valor FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.id= "+id+" GROUP BY (s.Asada_ID) ";
        }
        else{
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.Componente_ID= "+id+" GROUP BY (s.Asada_ID)";
        }

        let query = "select C.codigo, avg(t.valor) as valor from Asada A, distrito C, Canton Ca, provincia P,"+
        "("+s+") t where A.DISTRITO_ID=C.ID and "+
        "A.DISTRITO_CANTON_ID=Ca.ID and A.DISTRITO_CANTON_PROVINCIA_ID=P.ID and C.CANTON_PROVINCIA_ID=P.ID "+
        "and C.CANTON_ID=Ca.ID and Ca.PROVINCIA_ID=P.ID and A.id=t.asada_id group by(c.codigo);";

        db.query(query, function(err, rows, fields) {
        if (!err){
            var dictionary = [];
            var values = []
            for (var i = rows.length - 1; i >= 0; i--) {
                dictionary.push(rows[i].codigo);
                if(rows[i].valor < 20.0)
                    values.push(4);
                else if(rows[i].valor < 40.0)
                    values.push(3);
                else if(rows[i].valor < 60.0)
                    values.push(2);
                else if(rows[i].valor < 80.0)
                    values.push(1);
                else
                    values.push(0);
            }
            var jsonsites = { "sitios": dictionary, "valores": values }
            res.send(jsonsites);
        }
        else{
            console.log('Error while performing Query.');
            res.send({});
            }

        });

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
        let query = "insert into asada(id, nombre, DISTRITO_ID, DISTRITO_CANTON_ID, DISTRITO_CANTON_PROVINCIA_ID) values("+ident+",'"+nom+"',"+sites[0]+","+sites[1]+","+sites[2]+");";
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
    },


    getDatosAsada: (req, res) => {
        if(req.session.value==1){
        var id = req.params.id;
        var f = new Date();
        let query = "select * from Asada;";
        let query2 = "select * from indicador;"
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
                db.query(query2, function(err1, rows1, fields1) {
                if (!err1){
                    console.log(rows)
                    console.log(rows1)
                    res.render('pages/getDatosAsada.ejs',{"asadas":rows, "preguntas":rows1})
                }
                else{
                    console.log('Error while performing Query.');
                    res.redirect('/main');
                }
                });
        }
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
        }
        });
        }
        else
            res.redirect('/');
    },

    postGetDatosAsada: (req,res) => {
        if(req.session.value==1){
            
        }else
            res.redirect('/');
    }

};