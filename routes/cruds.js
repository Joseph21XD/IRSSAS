module.exports = {
    // crear nueva asada
    getCrudComponente: (req,res) =>{
        if(req.session.value==1){

        let query = "select * from componente;";
        // execute query
        db.query(query, function(err, rows, fields) {
        if (!err){
            console.log(rows);
            res.render('pages/crudComponentes.ejs', {"rows":rows, "usuario": req.session.usuario})}
        else{
            console.log('Error while performing Query.');
            res.redirect('/');
            }

        });

        }
        else
            res.redirect('/');
    }




};