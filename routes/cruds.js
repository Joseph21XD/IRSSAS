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
        var nuevos = req.query.nuevos;
        var actualizados = req.query.actualizados;
        var borrados = req.query.borrados;
        
    }




};