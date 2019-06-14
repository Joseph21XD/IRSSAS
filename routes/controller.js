module.exports = {
    //Función de inicio, carga el mapa
    getHomePage: (req, res) => {
    	if(req.session.value==1){
			res.redirect('/main');   		
    	}
    	else{
        req.session.value= 0;

        let query= "SELECT p.* from PROVINCIA p;"
        db.query(query,function(err,rows,fields){
            if(!err){
                res.render('pages/index.ejs', {"rows":rows, "error":""});
            }
        });

        }
    },

    grafico: (req, res) => {
    	if(req.session.value==1){
			let query = "select a.ID, a.Nombre from ASADA a";
			if(req.session.usuario.Tipo=="2")
				query+=" where a.ID="+req.session.usuario.Asada_ID+" ;";
			db.query(query, function(err,rows,fields){
				res.render('pages/grafArana.ejs',{"usuario": req.session.usuario, "asadas":rows });
			});
        }
        else
        	res.redirect('/');
    },
    
    getInfoGeneral: (req, res) => {
        res.render('pages/infoGeneral.ejs',{"rows":[], "usuario": req.session.usuario});
    },
	
	generarInforme: (req, res) => {
		if(req.session.value==1){
			let query = "select a.*,p.Nombre as Provincia,c.Nombre as Canton,d.Nombre as Distrito,  ai.Ubicacion,ai.Telefono,ai.Poblacion,ai.Url,ai.cantAbonados from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;";
			db.query(query, function(err,rows,fields){
				if(!err){
					res.render('pages/generarInforme.ejs',{"usuario": req.session.usuario, "asadas":rows });
				}
				else{
					console.log('Error while performing Query.');
					res.redirect('/');
				}
			});
		}
		else
			res.redirect('/');
	},
	


        
    //Función enviar datos del mapa al script map.js del frontend
    getSites: (req,res) => {


        let tipo= req.query.tipo;

        let s = " select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from INDICADORXASADA s, INDICADOR i "+
        "where s.Indicador_ID=i.ID  group by (s.Asada_ID) ";

        let k="";

        var l="";
        if(req.query.provincia!=0){
            l+=" and C.Provincia_ID="+req.query.provincia+" ";
            if(req.query.canton!=0){
                l+=" and C.Canton_ID="+req.query.canton+" ";
                if(req.query.distrito!=0){
                    l+=" and C.ID="+req.query.distrito+" ";
                }
            }
        }

        if(req.query.tipo=="2"){
            s= " SELECT distinct(s.Asada_ID), SUM(s.valor * i.valor) * 100 AS valor FROM HISTORICORESPUESTA s, INDICADOR i WHERE s.Indicador_ID = i.ID and s.Año='"+req.query.anno+"' GROUP BY (s.Asada_ID) union "+
            " SELECT distinct(s.Asada_ID), SUM(s.valor * i.valor) * 100 AS valor FROM INDICADORXASADA s, INDICADOR i WHERE s.Indicador_ID = i.ID and s.Año='"+req.query.anno+"' GROUP BY (s.Asada_ID) ";
            k= " SELECT distinct(s.Asada_ID), SUM(s.valor * i.valor) * 100 AS valor FROM HISTORICORESPUESTA s, INDICADOR i WHERE s.Indicador_ID = i.ID and s.Año='"+req.query.anno2+"' GROUP BY (s.Asada_ID) union "+
            " SELECT distinct(s.Asada_ID), SUM(s.valor * i.valor) * 100 AS valor FROM INDICADORXASADA s, INDICADOR i WHERE s.Indicador_ID = i.ID and s.Año='"+req.query.anno2+"' GROUP BY (s.Asada_ID) ";
        }

        let query = "select C.codigo, avg(t.valor) as valor from ASADA A, DISTRITO C, CANTON Ca, PROVINCIA P, "+
        "("+s+") t where A.DISTRITO_ID=C.codigo and "+
        "C.CANTON_ID=Ca.ID and C.PROVINCIA_ID=P.ID and A.id=t.asada_id "+l+" group by(C.codigo);";

        let query2="SELECT s.Asada_ID, a.Nombre, SUM(s.valor * i.valor) * 100 AS valor, a.Latitud, a.Longitud FROM "+
        "INDICADORXASADA s, INDICADOR i, ASADA a, DISTRITO C WHERE s.Indicador_ID = i.ID and s.Asada_ID=a.ID and a.Distrito_ID=C.Codigo "+l+" GROUP BY (s.Asada_ID);";
        //let query2="SELECT s.Asada_ID, a.Nombre, SUM(s.valor * i.valor) * 100 AS valor, a.Latitud, a.Longitud FROM  INDICADORXASADA s, INDICADOR i, ASADA a, DISTRITO C "
        //" WHERE s.Indicador_ID = i.ID and s.Asada_ID=a.ID and a.Distrito_ID=C.Codigo "+l+" GROUP BY (s.Asada_ID);";

        if(req.query.tipo=="2"){
            query2 = "select C.codigo, avg(t.valor) as valor from ASADA A, DISTRITO C, CANTON Ca, PROVINCIA P, "+
            "("+k+") t where A.DISTRITO_ID=C.codigo and "+
            "C.CANTON_ID=Ca.ID and C.PROVINCIA_ID=P.ID and A.id=t.asada_id "+l+" group by(C.codigo);";            
        }


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

                var jsonsites;
                if(tipo=="1"){
            

                jsonsites = { "jsonsites1": {"sitios": dictionary, "valores": values, "asadas": rows2}, "jsonsites2":{"sitios": dictionary, "valores": values, "asadas": rows2} };
                
                }else{
                    var dictionary2 = [];
                    var values2 = [];
                    var x2= 0;
                    for (var i = rows2.length - 1; i >= 0; i--) {
                        dictionary2.push(rows2[i].codigo);
                        x2= 4-(Math.floor(rows2[i].valor/20));
                        if(x2 > 4) x2=4;
                        if(x2 < 0) x2=0;
                        values2.push(x2);
                    }

                jsonsites = { "jsonsites1": {"sitios": dictionary, "valores": values, "asadas": rows2}, "jsonsites2":{"sitios": dictionary2, "valores": values2, "asadas": rows2} };
                }
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

            let query= "SELECT p.* from PROVINCIA p;"
            db.query(query,function(err,rows,fields){
                if(!err){
                    res.render('pages/visor.ejs',{"error":"", "rows":rows});
                }
            });

        }else
            res.redirect('/');
    },

    // login
    login: (req, res, next) => {
        let query = "select u.*,ua.Asada_ID from USUARIO u left join USUARIOXASADA ua on u.ID=ua.Usuario_ID where usuario= '"+ req.body.usr+"' and contrasenna= '"+req.body.pwd+"'";
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
                    "from ASADA A, DISTRITO C, CANTON Ca, PROVINCIA P where A.DISTRITO_ID=C.Codigo and C.CANTON_ID=Ca.ID "+
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

        var l="";
        if(req.query.provincia!=0){
            l+=" and c.PROVINCIA_ID="+req.query.provincia+" ";
            if(req.query.canton!=0){
                l+=" and c.CANTON_ID="+req.query.canton+" ";
                if(req.query.distrito!=0){
                    l+=" and c.ID="+req.query.distrito+" ";
                }
            }
        }

        if(tipo == "IRSSAS"){
            s= "select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor from INDICADORXASADA s, INDICADOR i where s.Indicador_ID=i.ID  group by (s.Asada_ID)";
            k= "select s.Asada_ID, SUM(s.valor*i.valor)*100 as valor, a.Latitud, a.Longitud from INDICADORXASADA s, INDICADOR i, ASADA a where s.Indicador_ID=i.ID and s.Asada_ID=a.ID  group by (s.Asada_ID)";
        }
        else if(tipo == "SubComponente"){
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) as valor FROM INDICADORXASADA s, INDICADOR i, "+
                "SUBCOMPONENTE d, COMPONENTE c WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.id= "+id+" GROUP BY (s.Asada_ID) ";
            k = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) as valor, a.Latitud, a.Longitud FROM INDICADORXASADA s, INDICADOR i, "+
                "SUBCOMPONENTE d, COMPONENTE c, ASADA a WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.id= "+id+" and s.Asada_ID=a.ID GROUP BY (s.Asada_ID) ";
        }
        else{
            s = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor FROM INDICADORXASADA s, INDICADOR i, "+
                "SUBCOMPONENTE d, COMPONENTE c WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.Componente_ID= "+id+" GROUP BY (s.Asada_ID)";
            k = "SELECT s.Asada_ID, (SUM(s.valor * i.valor) * 10000) / c.valor  AS valor, a.Latitud, a.Longitud FROM INDICADORXASADA s, INDICADOR i, "+
                "SUBCOMPONENTE d, COMPONENTE c, ASADA a WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
                "and d.Componente_ID= "+id+" and s.Asada_ID=a.ID GROUP BY (s.Asada_ID)";
        }

        let query = "select c.codigo, avg(t.valor) as valor from ASADA a, DISTRITO c, CANTON ca, PROVINCIA p, ("+s+") t"+
        " where a.DISTRITO_ID=c.codigo and "+
        " c.CANTON_ID=ca.ID and c.PROVINCIA_ID=p.ID and a.id=t.asada_id "+l+" group by(c.codigo)";


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
        res.redirect('/');
    },

    getRiesgo: (req,res) =>{
        let s = "";
        if(req.query.tipo=="HISTORICORESPUESTA")
            s=" and s.año= '"+req.query.anno+"' ";
        let query= "SELECT a.Nombre as asada, c.Nombre, (SUM(s.valor * i.valor) * 10000) / c.valor  as valor FROM "+req.query.tipo+" s, INDICADOR i, "+
        "SUBCOMPONENTE d, COMPONENTE c, ASADA a WHERE s.Indicador_ID = i.ID  and i.Subcomponente_ID=d.ID and d.Componente_ID= c.ID "+
        "and s.Asada_ID="+req.query.id+" "+s+" and s.Asada_ID=a.ID GROUP BY a.Nombre, c.Nombre;";
        db.query(query, function(err,rows,fields){
            if(!err){
                componentes = [];
                valores = [];
                for (var i = rows.length - 1; i >= 0; i--) {
                    componentes.push(rows[i].Nombre);
                    valores.push(parseFloat(rows[i].valor));
                }
                if(rows.length!=0)
                    res.send({"nombre": rows[0].asada, "componentes": componentes, "valores": valores});
                else
                    res.send({"nombre": "No existen datos de esta ASADA", "componentes": componentes, "valores": valores});
            }
            else{
                res.redirect('/');
            }

        });
    },

    histFormulario: (req,res) =>{
        if(req.session.value==1){
            let query = "select a.ID, a.Nombre from ASADA a";
            if(req.session.usuario.Tipo=="2")
                query+=" where a.ID="+req.session.usuario.Asada_ID+" ;";
            db.query(query, function(err,rows,fields){
                if(!err){
                    res.render('pages/histFormulario.ejs',{"usuario": req.session.usuario, "asadas": rows});
                }
            });
        }else{
            res.redirect('/');
        }
    },

    getAnno: (req,res) =>{
        if(req.session.value=1){
            let query = "select distinct(Año) as anno from HISTORICORESPUESTA where Asada_ID = "+req.query.asada+" ;"
            db.query(query, function(err,rows,fields){
                if(!err){
                    let query2 = "select distinct(Año) as anno from INDICADORXASADA where Asada_ID = "+req.query.asada+" limit 1 ;"
                    db.query(query2,function(err2,rows2,fields2){
                        if(rows2.length!=0)
                            res.send({"annos": rows, "anno": rows2[0].anno});
                        else
                            res.send({"annos": rows, "anno": 0});
                    })
                }
            });

        }
    },

    
    getRespuestas: (req,res) =>{
        if(req.session.value=1){
            let query = "select h.texto as respuesta, i.Nombre as pregunta from "+req.query.tipo+" h inner join INDICADOR i on h.Indicador_ID=i.ID where h.Año like '"+req.query.anno+"' and h.Asada_ID="+req.query.asada+" ;"
            db.query(query, function(err,rows,fields){
                if(!err){
                    res.send({"preguntas": rows});
                }
            });
        }
    },

    comparaMapas: (req,res) =>{
        if(req.session.value==1){
            let query = "SELECT distinct(i.Año) as anno from INDICADORXASADA i union select distinct(h.Año) as anno from HISTORICORESPUESTA h";
            db.query(query,function(err,rows,fields){
                if(!err)
                    res.render('pages/comparaMapas.ejs',{"usuario": req.session.usuario, "annos": rows});
            });
        }else
            res.redirect('/');
    },
	
	getAsada: (req, res) => {
		if(req.session.value==1){

		let query = 'select a.ID, a.Nombre, p.Nombre as Provincia, a.Distrito_id, c.Nombre as Canton, d.Nombre as Distrito, ai.Ubicacion, ai.Telefono, ai.Poblacion, ai.Url, ai.cantAbonados ' +
		'from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID and a.ID='+ req.params.id +' ;';

		db.query(query, function(err, rows, fields) {
		if (!err){
			res.render('pages/tarjetasAsadas.ejs', {"asada":rows[0], "usuario": req.session.usuario})
		}
		else{
			console.log('Error while performing Query.');
			res.redirect('/');
		}
		
		});
		
		}
        else
            res.redirect('/');

    },
    
    statsComponentes:(req,res)=>{
        if(req.session.value == 1){

            let query= "SELECT p.* from PROVINCIA p;"
            db.query(query,function(err,rows,fields){
                if(!err){
                    res.render('pages/statsComponentes2.ejs', {"rows":rows, "usuario": req.session.usuario})
                }
            });

        }
        else{
                res.redirect('/');
        }


    },
    getCantones:(req,res)=>{

            let query= "SELECT c.* from CANTON c where c.Provincia_ID="+req.query.provincia+" ;";
            db.query(query,function(err,rows,fields){
                if(!err){
                    res.send({"rows":rows})
                }
            });


    },

    getDistritos:(req,res)=>{

            let query= "SELECT c.* from DISTRITO c where c.Provincia_ID="+req.query.provincia+" and c.Canton_ID="+req.query.canton+" ;";
            db.query(query,function(err,rows,fields){
                if(!err){
                    res.send({"rows":rows})
                }
            });


    },

    getEstadisticas:(req,res)=>{
        if(req.session.value == 1){
            var s="";
            if(req.query.provincia!=0){
                s+=" where k.Provincia_ID="+req.query.provincia+" ";
                if(req.query.canton!=0){
                    s+=" and k.Canton_ID="+req.query.canton+" ";
                    if(req.query.distrito!=0){
                        s+=" and k.Distrito_ID="+req.query.distrito+" ";
                    }
                }
            }
            let query = "SELECT * FROM (SELECT c2.Asada_ID, c2.Nombre, c1.* , c2.valor FROM (SELECT  s.Asada_ID, a.Nombre, "+ 
            "SUM(s.valor * i.valor) * 100 AS valor, a.Distrito_id FROM INDICADORXASADA s, INDICADOR i, ASADA a WHERE s.Indicador_ID = i.ID and a.ID=s.Asada_ID "+
            "GROUP BY (s.Asada_ID)) AS c2 INNER JOIN (select p.ID as Provincia_ID, p.Nombre as Provincia , c.ID as Canton_ID, c.Nombre as Canton, d.ID as Distrito_ID, d.Nombre as Distrito, d.Codigo from DISTRITO d inner join "+
            "CANTON c on d.Canton_ID=c.ID  inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID) AS c1 ON c2.Distrito_id = c1.Codigo) k "+s+" order by 10 "+req.query.orden+"; ";
            db.query(query,function(err,rows,fields){
                if(!err){
                    res.send({"rows":rows})
                }
            });

        }
        else{
                res.redirect('/');
        }

    },



    statsSubcomponentes:(req,res)=>{
        if(req.session.value == 1){
            
            let query = "SELECT s.Asada_ID, a.Nombre, c.Nombre as NombreComponente, d.Nombre as NombreSubComponente" + 
            ", (SUM(s.valor * i.valor) * 1000000) / (d.valor * c.valor) AS valor FROM INDICADORXASADA s, INDICADOR i" + 
            ", SUBCOMPONENTE d, COMPONENTE c, ASADA a WHERE s.Indicador_ID = i.ID and i.Subcomponente_ID=d.ID and d." + 
            "Componente_ID= c.ID and a.ID = s.Asada_ID and s.Asada_ID = " +  req.params.id + " GROUP BY c.Nombre, d." + 
            "Nombre, s.Asada_ID ; ";

            // execute query
            db.query(query, function(err, rows, fields) {
            if (!err){
                res.render('pages/statsSubcomponentes.ejs', {"rows":rows, "usuario": req.session.usuario})}
            else{
                console.log('Error while performing Query.');
                res.redirect('/');
                }

            });
        }
        else{
                res.redirect('/');
        }
    }





};
