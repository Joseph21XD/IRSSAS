module.exports = {
    // crear nueva asada
    getCrudComponente: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from componente;";
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

        console.log(req.query);

        if(!(borrados === undefined)){
        borrados.forEach(function(element) {
            db.query("delete from componente where id="+element+" ;");
        });
        }

        if(!(actualizados === undefined)){

            actualizados.forEach(function(element) {
            db.query("update componente set nombre='"+element.nombre+"', valor="+element.valor+" where id= "+element.id+";");
        });
        }

        if(!(nuevos === undefined)){
        nuevos.forEach(function(element) {
            db.query("insert into componente(nombre, valor) values('"+element.nombre+"',"+element.valor+" );");
        });
        }

        db.query("update indicador i, subcomponente s, componente c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");

        }
    },

    getCrudSubcomponente: (req,res) =>{
        if(req.session.value==1){

        let query = "select s.*,c.nombre as Componente from subcomponente s inner join componente c on s.componente_ID=c.ID;";
        let query2 = "select * from componente;"
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

        console.log(req.query);

        if(!(borrados === undefined)){
        borrados.forEach(function(element) {
            db.query("delete from subcomponente where id="+element+" ;");
        });
        }

        if(!(actualizados === undefined)){

            actualizados.forEach(function(element) {
            db.query("update subcomponente set nombre='"+element.nombre+"', valor="+element.valor+", componente_ID="+element.componente+" where id= "+element.id+";");
        });
        }

        if(!(nuevos === undefined)){
        nuevos.forEach(function(element) {
            db.query("insert into subcomponente(nombre, valor, componente_ID) values('"+element.nombre+"',"+element.valor+", "+element.componente+"  );");
        });
        }

        db.query("update indicador i, subcomponente s, componente c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    getCrudIndicador: (req,res) =>{
        if(req.session.value==1){

        let query = "select i.ID, i.Codigo, i.Nombre, i.Valor*100 as Valor ,"+
        "s.Nombre as Subcomponente from indicador i inner join subcomponente s on i.Subcomponente_ID=s.ID order by 2 ASC;";   
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
         " i.Valor*100 as Valor , i.ID from indicador i inner join subcomponente s on i.Subcomponente_ID=s.ID inner join "+
         " medida m on i.Medida_ID=m.ID left join indicadorinfo c on c.Indicador_ID=i.ID where i.id= "+req.params.id+" ;";
        // execute query
        let query2 = "select * from subcomponente;"

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
            db.query("update subcomponente, indicador i inner join subcomponente s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID="+element+" ;");
            db.query("delete from indicador where id="+element+" ;");
        });
        }

        db.query("update indicador i, subcomponente s, componente c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    updateIndicador: (req,res) =>{
        if(req.session.value==1){
        
        var actualizacion = req.query.actualizacion;
        var valores = req.query.valores;
        var id = req.query.indicador;
        var aux;
        console.log("_____");
        console.log(req.query);
        console.log("_____");

        if(!(actualizacion === undefined)){            

            for(var i = actualizacion.length - 1; i >= 0; i--) {
                aux= valores[i];
                if(actualizacion[i]=="Nombre")
                    db.query("update indicador set "+actualizacion[i]+"= '"+valores[i]+"' where ID="+id+" ;");

                else if(actualizacion[i]=="Subcomponente"){

                    console.log("JAJA_"+valores[i]);
                    db.query("select i.Codigo, s.ID from indicador i inner join subcomponente s on i.Subcomponente_ID=s.ID where s.ID="+valores[i]+" order by 1 DESC;", 
                        function(err,rows,fields){
                        if(!err){
                            if(rows.length!=0){
                                console.log("Hola "+rows[0].ID);
                                console.log(rows[0]);
                                var k = rows[0].Codigo.split("-");
                                db.query("update indicador set Codigo= '"+k[0]+"-"+(parseInt(k[1])+1)+"' where ID="+id+" ;");
                                return true;
                            }
                            else{
                                console.log("sexo con licho "+aux);
                                db.query("select Siglas from subcomponente where ID="+aux+" ;", function(err2,rows2,fields2){
                                    if(!err2){
                                        db.query("update indicador set Codigo= '"+rows2[0].Siglas+"-1' where ID="+id+" ;");      
                                    }
                                });
                            }
                                
                        }else{

                        }
                    });

                    db.query("update subcomponente, indicador i inner join subcomponente s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID="+id+" ;");
                    db.query("update indicador set Subcomponente_ID= '"+valores[i]+"' where ID="+id+" ;");
                    db.query("update subcomponente set cantpreguntas= cantpreguntas+1 where id="+valores[i]+" ;");
                }

                else{
                    db.query("update indicadorinfo set "+actualizacion[i]+"= '"+valores[i]+"' where Indicador_ID="+id+" ;");
                }
            }
            
        }

        db.query("update indicador i, subcomponente s, componente c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    newIndicador: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from medida ;";
        let query2 = "select * from subcomponente;"

        db.query(query, function(err, rows, fields) {
        if (!err){
                    db.query(query2,function(err2,rows2,fields2){
                        if(!err2){
                            res.render('pages/crudIndicadoresC.ejs', {"usuario": req.session.usuario, "subs":rows2, "meds":rows});
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

    createIndicador: (req,res) =>{
        var codigo="";
        var aux= req.body.Subcomponente_ID.split("-");
        function getCode(aux, cb){
        db.query("select i.Codigo, s.ID from indicador i inner join subcomponente s on i.Subcomponente_ID=s.ID where s.ID="+aux[1]+" order by 1 DESC;", 
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
            db.query("insert into indicador(Codigo,Subcomponente_ID,Medida_ID,Nombre,Valor) values('"+code+"',"+aux[1]+","+req.body.Medida_ID+",'"+req.body.Nombre+"',0);", function(err,rows,fields){
                if(req.body.Medida_ID!="1")
                    db.query("insert into Lineal(Indicador_ID,Pendiente,Ordenada) select ID,"+req.body.Pendiente+","+req.body.Ordenada+" from indicador where Codigo='"+code+"' ;");
                if(req.body.Medida_ID=="4"){
                    var x= parseInt(req.body.contador);
                    for(var i=1; i<=x; i++){
                        db.query("insert into Nominal(Indicador_ID,Simbolo,Valor,Porcentaje) select ID,'"+req.body["Nominal-1-"+i]+"',"+req.body["Nominal-2-"+i]+","+req.body["Nominal-3-"+i]+" from indicador where Codigo='"+code+"' ;");
                    }
                }
                var query = "insert into IndicadorInfo(Indicador_ID,Descripcion,Formula,Fuente,URL,Responsable,Periodo,Observaciones,Frecuencia) "+ 
                " select ID,'"+req.body.Descripcion+"','"+req.body.Formula+"','"+req.body.Fuente+"','"+req.body.Url+"','"+req.body.Responsable+"','"+req.body.Periodo+"','"+req.body.Observaciones+"','"+req.body.Frecuencia+"' "+ 
                " from indicador where Codigo='"+code+"' ;"
                db.query(query);
                db.query("update subcomponente set cantpreguntas=cantpreguntas+1 where ID="+aux[1]+" ;", function(err2,rows2,fields2){
                    if(!err2){
                        db.query("update indicador i, subcomponente s, componente c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
                    }
                });

            });
        });
        res.redirect('/indicador');
    }

};