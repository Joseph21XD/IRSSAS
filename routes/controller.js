module.exports = {
    //Función de inicio, carga el mapa
    getHomePage: (req, res) => {
        req.session.value= 0;
        res.render('pages/index.ejs',{"error":""});  
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
            var x= 0;
            for (var i = rows.length - 1; i >= 0; i--) {
                dictionary.push(rows[i].codigo);
                x= 4-(Math.floor(rows[i].valor/20));
                if(x > 4) x=4;
                if(x < 0) x=0;
                values.push(x);
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

    //Ver visor
    getVisor: (req, res, next) => {
        if(req.session.value==1){
            res.render('pages/visor.ejs',{"error":""});
        }else
            res.redirect('/');
    },

    // login
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

    // ingreso al main
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

    // obtener una asada usando un id
    getAsada: (req, res) => {
        if(req.session.value==1){
        var id = req.params.id;
        var f = new Date();
        let query = "select A.nombre, Su.detalle ,S.texto from indicadorxasada S inner join Asada A on A.id=S.Asada_id inner join indicador Su on Su.ID=S.indicador_id where S.Asada_id ="+id+" and Año= 2018;";
        db.query(query, function(err, rows, fields) {
        if (!err){
            console.log(rows);
            res.render('pages/asada2.ejs',{"rows":rows})}
        else{
            console.log('Error while performing Query.');
            res.render('pages/index.ejs', {"var1":"error","var2":[], "error":"Usuario o contraseña invalidos"});
        }
        });
        }
        else
            res.redirect('/');
    },

    // obtiene asadas y riesgos de un componentes o subcomponente
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
            var x = 0;
            for (var i = rows.length - 1; i >= 0; i--) {
                dictionary.push(rows[i].codigo);
                x= 4-(Math.floor(rows[i].valor/20));
                if(x > 4) x=4;
                if(x < 0) x=0;
                values.push(x);

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

    // logount
    logout: (req,res) =>{
        req.session.value=0;
        console.log("Logout");
        res.redirect('/');
    },

    // crear nueva asada
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

    // insertar nueva asada
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

    // crear nuevo formulario
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

    // insertar nuevo formulario
    postGetDatosAsada: (req,res) => {
        if(req.session.value==1){
            // aun no se que poner
        }else
            res.redirect('/');
    }

};