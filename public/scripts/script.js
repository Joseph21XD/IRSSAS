//funcion que solicita al backend un json con riesgos
//refresca el mapa 
// se utiliza por el menu lateral
function changeComponent(tipo, id, nombre){
	layers[2].setStyle(null);
	var parameters = { "id": id, "tipo": tipo};
	$.get('/getComponente',parameters,function(data) {
      jsonsites = data;
     }).done(function(res){     	
		layers[2].setStyle(styleFunction);
		if(tipo=="SubComponente"){
			var z= document.getElementById(nombre).parentNode.parentNode.parentNode.firstChild.innerHTML;
			$("#mycomponent").html(z+" - "+nombre);
		}
		else{
			$("#mycomponent").html(nombre);
		}
		
		});
};

function graficoAranna(){

	var value= document.getElementById("listAsada").value;

	var parameters = { "id": value};
	$.get('/getRiesgo',parameters,function(data) {
		new Chart(document.getElementById("radar-chart"), {
        type: 'radar',
        data: {
        labels: data.componentes,
        datasets: [
            {
            label: data.nombre,
            fill: true,
            backgroundColor: "rgba(25,61,102,0.2)",
            borderColor: "rgba(25,61,102,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(179,181,198,1)",
            data: data.valores
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Nivel de Riesgo de la ASADA'
        }
        }
    });

      
     });

}
