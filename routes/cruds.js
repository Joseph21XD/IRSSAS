module.exports = {
    // crear nueva asada

    getCrudAsadasR: (req,res) =>{
        if(req.session.value==1){

        let query = "select a.ID,a.Nombre,p.Nombre as Provincia,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/crudAsadasR.ejs', {"rows":rows, "usuario": req.session.usuario})}
        else{
            console.log('Error while performing Query.');
            res.redirect('/');
            }

        });

        }
        else
            res.redirect('/');
    },

    getCrudAsadasU: (req,res) =>{
        if(req.session.value==1){

        let query = 'select a.ID,a.Latitud,a.Longitud,a.Nombre,p.Nombre as Provincia, a.Distrito_id,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion,ai.Telefono,ai.Poblacion,ai.Url,ai.cantAbonados ' +
                    ' from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on '+
                    ' p.ID=c.Provincia_ID where d.Provincia_ID=p.ID and a.ID='+ req.params.id +' ;';
        let query2 = ' select concat(p.Nombre, " - ", c.Nombre, " - ", d.Nombre) as Distrito, d.Codigo from DISTRITO d inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;';
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){

            db.query(query2, function(err2, rows2, fields2) {
            if (!err2){
                res.render('pages/crudAsadasU.ejs', {"asada":rows[0], "distritos":rows2, "usuario": req.session.usuario})


            }
            else{
                console.log('Error while performing Query.');
                res.redirect('/');
                }

            });


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

    
    getPresentAsada: (req,res)=>{

        let query = "select a.ID,a.Nombre,p.Nombre as Provincia,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion,ai.Telefono,ai.Url from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;"; 
        // execute query
        db.query(query, function(err, rows, fields) {
            if (!err){
                res.render('pages/presentacionAsadas.ejs', {"asadas":rows, "usuario": req.session.usuario})
            }
            else{
                console.log('Error while performing Query.');
                res.redirect('/');
            }
        });

    },

    saveAsada: (req,res) =>{
        if(req.session.value==1){

            var actualizados = req.query.actualizados;
            var updates = req.query.updates;
            var id_asada = req.query.id;

            let updateAsada;
            //hago los querys, valido si es int o varchar, se hace inner join al update, para trabajar lo 2 al mismo tiempo
            for(var i= 0; i<actualizados.length;i++){                
                updateAsada = "update ASADA a, ASADAINFO ai set ";
                updateAsada = updateAsada + actualizados[i] + " = '" + updates[i] + "' where a.ID = "+ id_asada + " and ai.Asada_ID= " + id_asada + " ;";
                db.query(updateAsada);
            }

            

        }
        else
            res.redirect('/');
    },




    getCrudComponente: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from COMPONENTE;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/crudComponentes.ejs', {"rows":rows, "usuario": req.session.usuario})}
        else{
            console.log('Error while performing Query.');
            res.redirect('/');
            }

        });

        }
        else
            res.redirect('/');
    },

    saveComponente: (req,res) =>{
        if(req.session.value==1){
        
        var nuevos = req.query.nuevos;
        var actualizados = req.query.actualizados;
        var borrados = req.query.borrados;


        if(!(borrados === undefined)){
        borrados.forEach(function(element) {
            db.query("delete from COMPONENTE where id="+element+" ;");
        });
        }

        if(!(actualizados === undefined)){

            actualizados.forEach(function(element) {
            db.query("update COMPONENTE set nombre='"+element.nombre+"', valor="+element.valor+" where id= "+element.id+";");
        });
        }

        if(!(nuevos === undefined)){
        nuevos.forEach(function(element) {
            db.query("insert into COMPONENTE(nombre, valor) values('"+element.nombre+"',"+element.valor+" );");
        });
        }

        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");

        }
    },

    getCrudSubcomponente: (req,res) =>{
        if(req.session.value==1){

        let query = "select s.*,c.nombre as Componente from SUBCOMPONENTE s inner join COMPONENTE c on s.componente_ID=c.ID;";
        let query2 = "select * from COMPONENTE;"
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            db.query(query2, function(err2, rows2, fields2){
                if(!err){
                    res.render('pages/crudSubcomponentes.ejs', {"rows":rows, "usuario": req.session.usuario, "comps": rows2});}
                else{
                    console.log('Error while performing Query.');
                    res.redirect('/');
                }        
            });
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

    saveSubComponente: (req,res) =>{
        if(req.session.value==1){
        
        var nuevos = req.query.nuevos;
        var actualizados = req.query.actualizados;
        var borrados = req.query.borrados;


        if(!(borrados === undefined)){
        borrados.forEach(function(element) {
            db.query("delete from subcomponente where id="+element+" ;");
        });
        }

        if(!(actualizados === undefined)){

            actualizados.forEach(function(element) {
            db.query("update SUBCOMPONENTE set nombre='"+element.nombre+"', valor="+element.valor+", componente_ID="+element.componente+", siglas='"+element.siglas+"' where id= "+element.id+";");
        });
        }

        if(!(nuevos === undefined)){
        nuevos.forEach(function(element) {
            db.query("insert into SUBCOMPONENTE(nombre, valor, componente_ID, siglas, cantpreguntas) values('"+element.nombre+"',"+element.valor+", "+element.componente+", '"+element.siglas+"', 0  );");
        });
        }

        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    getCrudIndicador: (req,res) =>{
        if(req.session.value==1){

        let query = "select i.ID, i.Codigo, i.Nombre, i.Valor*100 as Valor ,"+
        "s.Nombre as Subcomponente from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID order by 2 ASC;";   
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
                    res.render('pages/crudIndicadoresR.ejs', {"rows":rows, "usuario": req.session.usuario});

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

    getIndicador: (req, res) =>{
        if(req.session.value==1){

        let query = "select c.*,s.Nombre as Subcomponente, m.Nombre as Medida , i.Codigo, i.Nombre, i.Subcomponente_ID,"+
         " i.Valor*100 as Valor , i.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID inner join "+
         " MEDIDA m on i.Medida_ID=m.ID left join INDICADORINFO c on c.Indicador_ID=i.ID where i.id= "+req.params.id+" ;";
        // execute query
        let query2 = "select s.* from SUBCOMPONENTE s;"

        db.query(query, function(err, rows, fields) {
        if (!err){
                    db.query(query2,function(err2,rows2,fields2){
                        if(!err2){
                            res.render('pages/crudIndicadoresU.ejs', {"indicador":rows[0], "usuario": req.session.usuario, "subs":rows2});
                        }else{
                            console.log('Error while performing Query.');
                            res.redirect('/');
                        }
                    });
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

    deleteIndicador: (req,res) =>{
        if(req.session.value==1){
        
        var borrados = req.query.borrados;
        if(!(borrados === undefined)){            
        borrados.forEach(function(element) {
            db.query("update SUBCOMPONENTE, INDICADOR i inner join SUBCOMPONENTE s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID="+element+" ;");
            db.query("delete from indicador where id="+element+" ;");
        });
        }

        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    updateIndicador: (req,res) =>{
        if(req.session.value==1){
        
        var actualizacion = req.query.actualizacion;
        var valores = req.query.valores;
        var id = req.query.indicador;
        var aux;
        

        if(!(actualizacion === undefined)){            

            for(var i = actualizacion.length - 1; i >= 0; i--) {
                aux= valores[i];
                if(actualizacion[i]=="Nombre")
                    db.query("update INDICADOR set "+actualizacion[i]+"= '"+valores[i]+"' where ID="+id+" ;");

                else if(actualizacion[i]=="Subcomponente"){

                    
                    db.query("select i.Codigo, s.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID where s.ID="+valores[i]+" order by 1 DESC;", 
                        function(err,rows,fields){
                        if(!err){
                            if(rows.length!=0){
                                
                                var k = rows[0].Codigo.split("-");
                                db.query("update INDICADOR set Codigo= '"+k[0]+"-"+(parseInt(k[1])+1)+"' where ID="+id+" ;");
                                return true;
                            }
                            else{
                                
                                db.query("select Siglas from SUBCOMPONENTE where ID="+aux+" ;", function(err2,rows2,fields2){
                                    if(!err2){
                                        db.query("update INDICADOR set Codigo= '"+rows2[0].Siglas+"-1' where ID="+id+" ;");      
                                    }
                                });
                            }
                                
                        }else{

                        }
                    });

                    db.query("update SUBCOMPONENTE, INDICADOR i inner join SUBCOMPONENTE s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID="+id+" ;");
                    db.query("update INDICADOR set Subcomponente_ID= '"+valores[i]+"' where ID="+id+" ;");
                    db.query("update SUBCOMPONENTE set cantpreguntas= cantpreguntas+1 where id="+valores[i]+" ;");
                }

                else{
                    db.query("update IndicadorInfo set "+actualizacion[i]+"= '"+valores[i]+"' where Indicador_ID="+id+" ;");
                }
            }
            
        }

        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    newIndicador: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from MEDIDA ;";
        let query2 = "select * from SUBCOMPONENTE;"

        db.query(query, function(err, rows, fields) {
        if (!err){
                    db.query(query2,function(err2,rows2,fields2){
                        if(!err2){
                            res.render('pages/crudIndicadoresC.ejs', {"usuario": req.session.usuario, "subs":rows2, "meds":rows});
                        }else{
                            
                            res.redirect('/');
                        }
                    });
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

    createIndicador: (req,res) =>{
        var codigo="";
        var aux= req.body.Subcomponente_ID.split("-");
        function getCode(aux, cb){
        db.query("select i.Codigo, s.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID where s.ID="+aux[1]+" order by 1 DESC;", 
                        function(err,rows,fields){
                        if(!err){
                            if(rows.length!=0){
                                var k = rows[0].Codigo.split("-");
                                cb(k[0]+"-"+(parseInt(k[1])+1));
                            }
                            else{
                                cb(aux[0].replace("\r\n","")+"-1");
                            }
                                
                        }else{

                        }
                    });
        }
        getCode(aux, function(code){
            db.query("insert into INDICADOR(Codigo,Subcomponente_ID,Medida_ID,Nombre,Valor) values('"+code+"',"+aux[1]+","+req.body.Medida_ID+",'"+req.body.Nombre+"',0);", function(err,rows,fields){
                if(req.body.Medida_ID!="1")
                    db.query("insert into LINEAL(Indicador_ID,Pendiente,Ordenada) select ID,"+req.body.Pendiente+","+req.body.Ordenada+" from INDICADOR where Codigo='"+code+"' ;");
                if(req.body.Medida_ID=="4"){
                    var x= parseInt(req.body.contador);
                    for(var i=1; i<=x; i++){
                        db.query("insert into NOMINAL(Indicador_ID,Simbolo,Valor,Porcentaje) select ID,'"+req.body["Nominal-1-"+i]+"',"+req.body["Nominal-2-"+i]+","+req.body["Nominal-3-"+i]+" from INDICADOR where Codigo='"+code+"' ;");
                    }
                }
                var query = "insert into INDICADORINFO(Indicador_ID,Descripcion,Formula,Fuente,URL,Responsable,Periodo,Observaciones,Frecuencia) "+ 
                " select ID,'"+req.body.Descripcion+"','"+req.body.Formula+"','"+req.body.Fuente+"','"+req.body.Url+"','"+req.body.Responsable+"','"+req.body.Periodo+"','"+req.body.Observaciones+"','"+req.body.Frecuencia+"' "+ 
                " from INDICADOR where Codigo='"+code+"' ;"
                db.query(query);
                db.query("update SUBCOMPONENTE set cantpreguntas=cantpreguntas+1 where ID="+aux[1]+" ;", function(err2,rows2,fields2){
                    if(!err2){
                        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
                    }
                });

            });
        });
        res.redirect('/indicador');
    },
	
	getCrudUsuario: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from USUARIO;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            res.render('pages/crudUsuarios.ejs', {"rows":rows, "usuario": req.session.usuario})}
        else{
            console.log('Error while performing Query.');
            res.redirect('/');
            }

        });

        }
        else
            res.redirect('/');
        },

        newAsada: (req,res) => {
            if(req.session.value==1){

            let query = "select concat(p.Nombre, ' - ', c.Nombre, ' - ', d.Nombre) as Distrito, d.Codigo from DISTRITO d inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on  p.ID=c.Provincia_ID where d.Provincia_ID=p.ID ;";

            db.query(query, function(err, rows, fields) {
            if (!err){
                    res.render('pages/crudAsadasC.ejs', {"usuario": req.session.usuario, "distritos":rows});
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


        createAsada: (req,res) =>{
            let query= "insert into ASADA(ID,Nombre,Distrito_ID,Latitud,Longitud) values("+req.body.ID+",'"+req.body.Nombre+"',"+req.body.Distrito_ID+",'"+req.body.Latitud+"','"+req.body.Longitud+"') ;";            
            db.query(query, function(err,rows,fields){
                if(!err){
                    let query2= "insert into ASADAINFO(Asada_ID,Ubicacion,Telefono,Poblacion,Url,cantAbonados) values("+req.body.ID+",'"+req.body.Ubicacion+"',"+
                    "'"+req.body.Telefono+"','"+req.body.Poblacion+"','"+req.body.Url+"','"+req.body.cantAbonados+"') ;";
                    db.query(query2);
                }
                else{
                    console.log('Error while performing Query.');
                    res.redirect('/asadas');
                }
            });
            res.redirect('/asadas');
        },


        deleteAsada: (req,res) =>{
            if(req.session.value==1){
        
            var borrados = req.query.borrados;
            if(!(borrados === undefined)){            
            borrados.forEach(function(element) {
                db.query("delete from ASADA where id="+element+" ;");
            });
            }
            }
        },



        crudFormularios: (req,res) =>{
            if(req.session.value==1){
                let query="select * from INDICADOR;";
                let query2="select * from NOMINAL;";
                let query3="select * from ASADA"
                if(req.session.usuario.Tipo==2)
                    query3+=" where asada.ID="+req.session.usuario.Asada_ID+" ;";
                db.query(query,function(err,rows,fields){
                    if(!err){
                        db.query(query2,function(err2,rows2,fields2){
                            if(!err2){
                                db.query(query3,function(err3,rows3,fields3){
                                    if(!err3){
                                        res.render('pages/crudFormularios.ejs',{"usuario": req.session.usuario, "indicadores":rows, "nominales":rows2, "asadas":rows3});
                                    }else{
                                        res.redirect('/');        
                                    }
                                });
                                
                            }else{
                                res.redirect('/');
                            }
                        });
                    }else{
                        res.redirect('/');
                    }
                });
            }else{
                res.redirect('/');
            }
        },

        sendForm: (req, res) =>{
            var contador=0.0;
            db.query("select * from LINEAL;", function(err,rows,fields){
                if(!err){
                IDs=[];
                var lista= req.body.ocultos.split(",");
                rows.forEach(function(row){
                    IDs.push(row.Indicador_ID+"");
                })
                keys = Object.keys(req.body);
                keys.pop();
                keys.pop();
                keys.pop();

                for (var i=0; i< keys.length; i++) {
                    var x= IDs.indexOf(keys[i]);
                    if(x != -1){
                        var exp= parseFloat(req.body[keys[i]])*parseFloat(rows[x].Pendiente) + parseFloat(rows[x].Ordenada)
                        db.query("delete from HISTORICORESPUESTA where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+" and año='"+req.body.anno+"' limit 1 ;");
                        db.query("insert into HISTORICORESPUESTA select * from indicadorxasada where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+"  ;");
                        db.query("delete from INDICADORXASADA where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+" limit 1 ;");
                        db.query("insert into INDICADORXASADA(año,Indicador_ID,Asada_ID,Valor,Texto) values('"+req.body.anno+"','"+keys[i]+"','"+req.body.asada+"','"+(1/(1 + Math.pow(Math.E,exp)))+"','"+lista[i+1]+"');");
                            
                    }
                    else{
                        db.query("delete from HISTORICORESPUESTA where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+" and año='"+req.body.anno+"' limit 1 ;");
                        db.query("insert into HISTORICORESPUESTA select * from indicadorxasada where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+"  ;");
                        db.query("delete from INDICADORXASADA where Indicador_ID="+keys[i]+" and Asada_ID="+req.body.asada+" limit 1 ;");
                        db.query("insert into INDICADORXASADA(año,Indicador_ID,Asada_ID,Valor,Texto) values('"+req.body.anno+"','"+keys[i]+"','"+req.body.asada+"','"+req.body[keys[i]]+"','"+lista[i+1]+"');");

                    }
                }
                }
                else{
                    res.redirect('/');
                }
            });
            res.redirect("/main");
    },
	
    saveUsuario: (req,res) =>{
        if(req.session.value==1){
			var nuevos = req.query.nuevos;
			var actualizados = req.query.actualizados;
			var borrados = req.query.borrados;
			
			if(!(borrados === undefined)){
			borrados.forEach(function(element) {
				db.query("delete from USUARIO where id= "+element+";");
			});
			}

			if(!(actualizados === undefined)){
				actualizados.forEach(function(element) {
				db.query("update USUARIO set nombre='"+element.nombre+"', usuario='"+element.usuario+"', contrasenna='"+element.contrasenna+"', tipo='"+element.tipo+"' where id= "+element.id+";");
			});
			}

			if(!(nuevos === undefined)){
				nuevos.forEach(function(element) {
				db.query("insert into USUARIO(nombre, usuario, contrasenna, tipo) values('"+element.nombre+"', '"+element.usuario+"', '"+element.contrasenna+"', '"+element.tipo+"');");
			});
			}			
        }
    },

    getUsuariosAsadas: (req,res) =>{
        if(req.session.value==1){
            db.query("select u.*,ua.Asada_ID,a.Nombre as Asada from USUARIO u left join USUARIOXASADA ua on u.ID=ua.Usuario_ID left join ASADA a on ua.Asada_ID=a.ID where u.tipo=2;", function(err,rows,fields){
                if(!err){
                db.query("select a.ID, a.Nombre from ASADA a;",function(err2,rows2,fields2){
                    res.render('pages/crudUsuariosAsadas.ejs',{"usuario": req.session.usuario, "usuarios":rows, "asadas":rows2});
                });
                }else{
                    console.log("Error while performing Query.")
                    res.redirect("/");
                }
            });
        }else{
            res.redirect("/");
        }
    },

    setUsuariosAsada: (req,res) =>{
        function cargar(usuario,asada){
            db.query("insert into USUARIOXASADA values ("+usuario+","+asada+");", function(err,rows,fields){
                if(err){
                    let query = "update USUARIOXASADA set Asada_ID="+asada+" where Usuario_ID="+usuario+" ;";
                    db.query(query, function(err2,rows2,fields2){
                    });
                }
            });
        }
        var rows= req.query.UsuarioAsada;
        for(var i=0; i<rows.length; i++){
            var usuario = rows[i].Usuario_ID;
            var asada = rows[i].Asada_ID;
            cargar(usuario,asada);
        }
    }





};