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
    aranna(value,"INDICADORXASADA",0)

};

function presentarAsada(){
    
    var asada = document.getElementById("listAsada").value;
    var values_list = asada.split(",");
    console.log(values_list);
    
    $("div.present").html(
        "<br><h4>" + values_list[0] + "</h4><br>" + 
        "<h4>UBICACIÓN: " + values_list[1] + ", " + values_list[2] + ", " + values_list[3] + "</h4><br>" + 
        "<h4>SEÑAS ADICIONALES: " + values_list[4] + "</h4><br>" + 
        "<h4>TELÉFONO: " + values_list[5] + "</h4><br>" +
        "<h4>URL: " + values_list[6] + "</h4><br>" 
    );
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
    var tipo = ((tipo == "actual") ? 'INDICADORXASADA' : 'HISTORICORESPUESTA');
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


function comparar(){
  layers[2].setStyle(null);
  layers2[2].setStyle(null);
  var parameters = { "tipo": "2", "anno": document.getElementById("anno1").value,  "anno2": document.getElementById("anno2").value};
  $.get('/getSites',parameters,function(data) {
      jsonsites = data.jsonsites1;
      jsonsites2 = data.jsonsites2;
     }).done(function(res){       
        layers[2].setStyle(styleFunction);
        layers2[2].setStyle(styleFunction2);
    });
};