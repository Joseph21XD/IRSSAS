//funcion que solicita al backend un json con riesgos
//refresca el mapa 
// se utiliza por el menu lateral
function changeComponent(tipo, id){
	layers[2].setStyle(null);
	var parameters = { "id": id, "tipo": tipo};
	$.get('/getComponente',parameters,function(data) {
      jsonsites = data;
     }).done(function(res){     	
		layers[2].setStyle(styleFunction);
		});
}
