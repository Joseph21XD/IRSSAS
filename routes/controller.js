module.exports = {
    //Función de inicio, carga el mapa
    getHomePage: (req, res) => {
    	if(req.session.value==1){
			res.redirect('/main');   		
    	}
    	else{
        req.session.value= 0;
        res.render('pages/index.ejs',{"error":""});}
    },

    grafico: (req, res) => {
    	if(req.session.value==1){
        let query = "select a.ID, a.Nombre from Asada a;";
        db.query(query, function(err,rows,fields){
        	res.render('pages/grafArana.ejs',{"usuario": req.session.usuario, "asadas":rows });
        });
        }
        else
        	res.redirect('/');
    },

    //Función enviar datos del mapa al script map.js del frontend
    getSites: (req,res) => {
        let query = "select C.codigo, avg(t.valor) as valor from Asada A, distrito C, Canton Ca, provincia P,"+
        "(select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from indicadorxasada s, indicador i "+
        "where s.Indicador_ID=i.ID  group by (s.Asada_ID)) t where A.DISTRITO_ID=C.codigo and "+
        "C.CANTON_ID=Ca.ID and C.PROVINCIA_ID=P.ID and A.id=t.asada_id group by(c.codigo);";

        let query2="SELECT s.Asada_ID, SUM(s.valor * i.valor) * 100 AS valor, a.Latitud, a.Longitud FROM "+
        " indicadorxasada s, indicador i, Asada a WHERE s.Indicador_ID = i.ID and s.Asada_ID=a.ID GROUP BY (s.Asada_ID);";

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
            db.query(query2, function(err2,rows2,fields2){

                for (var i = rows2.length - 1; i >= 0; i--) {
                x= 4-(Math.floor(rows2[i].valor/20));
                if(x > 4) x=4;
                if(x < 0) x=0;
                rows2[i].valor = x;
                }
                var jsonsites = { "sitios": dictionary, "valores": values, "asadas": rows2 }
                res.send(jsonsites);
            });
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
                req.session.usuario = rows[0];
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
        let query = "select A.id, A.nombre, C.Nombre as distrito,Ca.Nombre as canton,P.Nombre as provincia "+
                    "from Asada A, distrito C, Canton Ca, provincia P where A.DISTRITO_ID=C.Codigo and C.CANTON_ID=Ca.ID "+
                    "and C.PROVINCIA_ID=P.ID and Ca.PROVINCIA_ID=P.ID;";
        // execute query
        res.render('pages/main.ejs', {"usuario": req.session.usuario});
        }
        else
            res.redirect('/');
    },

    // obtiene asadas y riesgos de un componentes o subcomponente
    getComponente: (req,res) =>{
        var id = req.query.id;
        var tipo = req.query.tipo;
        var s = "";
        var k = "";
        if(tipo == "IRSSAS"){
            s= "select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from indicadorxasada s, indicador i where s.Indicador_ID=i.ID  group by (s.Asada_ID)";
            k= "select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor, a.Latitud, a.Longitud from indicadorxasada s, indicador i, Asada a where s.Indicador_ID=i.ID and s.Asada_ID=a.ID  group by (s.Asada_ID)";
        }
        else if(tipo == "SubComponente"){
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) AS valor FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.id= "+id+" GROUP BY (s.Asada_ID) ";
            k = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) AS valor, a.Latitud, a.Longitud FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c, Asada a WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.id= "+id+" and s.Asada_ID=a.ID GROUP BY (s.Asada_ID) ";
        }
        else{
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.Componente_ID= "+id+" GROUP BY (s.Asada_ID)";
            k = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor, a.Latitud, a.Longitud FROM indicadorxasada s, indicador i, "+
                "subcomponente d, componente c, Asada a WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.Componente_ID= "+id+" and s.Asada_ID=a.ID GROUP BY (s.Asada_ID)";
        }

        let query = "select C.codigo, avg(t.valor) as valor from Asada A, distrito C, Canton Ca, provincia P, ("+s+") t"+
        " where A.DISTRITO_ID=C.codigo and "+
        " C.CANTON_ID=Ca.ID and C.PROVINCIA_ID=P.ID and A.id=t.asada_id group by(c.codigo)";


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
            db.query(k, function(err2,rows2,fields2){

                for (var i = rows2.length - 1; i >= 0; i--) {
                x= 4-(Math.floor(rows2[i].valor/20));
                if(x > 4) x=4;
                if(x < 0) x=0;
                rows2[i].valor = x;
                }
                var jsonsites = { "sitios": dictionary, "valores": values, "asadas": rows2 }
                res.send(jsonsites);
            });
        }
        else{
            console.log('Error while performing Query.');
            res.send({});
            }

        });

    },	

    // logout
    logout: (req,res) =>{
        req.session.value=0;
        console.log("Logout");
        res.redirect('/');
    },

    selected: (req,res) =>{
        console.log("Jiji");
        console.log(req.query.id);
    },

    getRiesgo: (req,res) =>{
    	console.log(req.query.id);
        console.log("Jaja Saludos");
        let query= "SELECT a.Nombre as asada, c.Nombre, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor FROM indicadorxasada s, indicador i, "+
        "subcomponente d, componente c, asada a WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
        "and s.Asada_ID="+req.query.id+" and s.Asada_ID=a.ID GROUP BY a.Nombre, c.Nombre;";
        db.query(query, function(err,rows,fields){
            if(!err){
                componentes = [];
                valores = [];
                for (var i = rows.length - 1; i >= 0; i--) {
                    componentes.push(rows[i].Nombre);
                    valores.push(parseFloat(rows[i].valor));
                }
                res.send({"nombre": rows[0].asada, "componentes": componentes, "valores": valores});
            }
            else{
                res.redirect('/');
            }

        });
    }





};