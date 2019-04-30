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

function aranna(value, tipo, anno){
    var parameters = { "id": value, "tipo": tipo, "anno": anno};
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

function graficoAranna(){

	var value= document.getElementById("listAsada").value;
    aranna(value,"indicadorxasada",0)

}

function getAnnos(object){
    var val= object.value

    $.get('/getAnno',{"asada": val},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("anno");
        select.innerHTML="";
        jsonsites.annos.forEach(function(anno){
            select.innerHTML+="<option value='"+anno.anno+"'>"+anno.anno+"</option>";
        });
        document.getElementById("buttonAnno").value= jsonsites.anno;
     });
     var select = document.getElementById("componenttable");
     select.innerHTML="<tr></tr>";
     document.getElementById("radar-chart-div").style.visibility = "hidden";

}

function getRespuestas(val,tipo){
    if(val!="0" && val!=""){
    $("#error").html("");
    var asada= document.getElementById("asada").value
    var tipo = ((tipo == "actual") ? 'indicadorxasada' : 'historicorespuesta');
    aranna(asada,tipo,val);
    document.getElementById("radar-chart-div").style.visibility = "visible";
    $.get('/getRespuestas',{"asada": asada, "anno": val, "tipo": tipo},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr>";
        jsonsites.preguntas.forEach(function(pregunta){
            select.innerHTML+="<td>"+pregunta.pregunta+"</td><td>"+pregunta.respuesta+"</td>";
        });
        select.innerHTML+="</tr>";

     });
    }
     else{
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr></tr>";
        $("#error").html(((val == "0") ? "No existen respuestas actuales de esta Asada" : 'No existen respuestas históricas de esta Asada'));
        document.getElementById("radar-chart-div").style.visibility = "hidden";
     }
}