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
				}]
			});
		});
	}
};

function graficoAranna(){

	var value= document.getElementById("listAsada").value;
    aranna(value,"INDICADORXASADA",0)
};

function presentarAsada(){
    
    var asada = document.getElementById("listAsada").value;
    var values_list = asada.split(",");
    //console.log(values_list);
    
    $("div.present").html(
        "<br><h4>" + values_list[0] + "</h4><br>" + 
        "<h4>UBICACIÓN: " + values_list[1] + ", " + values_list[2] + ", " + values_list[3] + "</h4><br>" + 
        "<h4>SEÑAS ADICIONALES: " + values_list[4] + "</h4><br>" + 
        "<h4>TELÉFONO: " + values_list[5] + "</h4><br>" +
        "<h4>URL: " + values_list[6] + "</h4><br>" 
    );
};

function cambiarTipoInforme(){

    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
        $("#agregarAsada").hide();
        $("#borrarAsada").hide();
        $("#asadasInforme").hide();
    }
    else{
        $("#agregarAsada").show();        
        $("#borrarAsada").show();
        $("#asadasInforme").show();
    }
    
};

function addAsadaToList(){
    var asada = document.getElementById("listAsada").value;
	
	if ($("#listaAsadas").val() != "")
		$("#listaAsadas").val($("#listaAsadas").val() + "|" + asada);
	else
		$("#listaAsadas").val(asada);
	
    var values_list = asada.split(",");
	values_list[1] = values_list[1].trim(values_list[1]);	

	if (!$("#asadasInforme").val().includes(values_list[1]))
		$("#asadasInforme").val($("#asadasInforme").val() + values_list[1] + "\n");

};

function deleteAsadaFromList(){
    var asada = document.getElementById("listAsada").value;
    var values_list = asada.split(",");

	if ($("#listaAsadas").val().split("|").length > 1)
		$("#listaAsadas").val($("#listaAsadas").val().replace("|" + asada, ""));
	else
		$("#listaAsadas").val("");

	values_list[1] = values_list[1].trim(values_list[1]);
	$("#asadasInforme").val($("#asadasInforme").val().replace(values_list[1] + "\n", ""));
	
};

function generarPDF(){
	
    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
    
        var asada = document.getElementById("listAsada").value;
        var values_list = asada.split(",");

        $("#prueba").html(
            "<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
            "<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
            "<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
            "<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
            "<p>Población: " + values_list[8] + "</p><br>" + 
            "<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
            "<p>Teléfono: " + values_list[10] + "</p><br>" + 
            "<p>URL: " + values_list[11] + "</p><br>" +
            "<div id=\"ID_DIV\"> <canvas id=\"radar-chart\"></canvas></div>"
        );

        var incluirGraf = $("input[name='grafico']:checked")[0];
        var incluirHist = $("input[name='hist']:checked")[0];

        var pdfdoc = new jsPDF();

        if (incluirGraf != null){

			var parameters = { "id": parseInt(values_list[0])};
			$.get('/getRiesgo',parameters,function(data) {
				new Chart(document.getElementById("radar-chart"), {
					type: 'radar',
					data: {
						labels: data.componentes,
						datasets: [{
								label: data.nombre,
								fill: true,
								backgroundColor: "rgba(25,61,102,0.2)",
								borderColor: "rgba(25,61,102,1)",
								pointBorderColor: "#fff",
								pointBackgroundColor: "rgba(179,181,198,1)",
								data: data.valores
						}]
					},
					options: {
						title: {
							display: true,
							text: 'Nivel de Riesgo de la ASADA'
						}
					}
				});
			});

			var canvas = document.getElementById("radar-chart");
			
			var canvasImg = canvas.toDataURL('image/jpeg', 1.0);
			pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);
		
		}

        /*
        if (incluirHist != null)
            pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);    
        */


        var specialElementHandlers = {
            '#ignoreContent': function (element, renderer) {
                return true;
            }
        };

        $(document).ready(function(){
        pdfdoc.fromHTML($("#prueba").html(), 10, 10, {
            'width': 500,
            'elementHandlers': specialElementHandlers
        });

        pdfdoc.save('Informe - ASADA ' + values_list[0] +'.pdf');
        });
    }
    else{
		var lista = $("#listaAsadas").val().split("|");

		$("#prueba").html("");

		for (var i = 0; i < lista.length; i++){
			values_list = lista[i].split(",");
			
			for (var j = 0; j < values_list.length; j++){
				values_list[j] = values_list[j].trim(values_list[j]);	
			}

			$("#prueba").append(
				"<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
				"<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
				"<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
				"<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
				"<p>Población: " + values_list[8] + "</p><br>" + 
				"<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
				"<p>Teléfono: " + values_list[10] + "</p><br>" + 
				"<p>URL: " + values_list[11] + "</p><br>" +
				"<div id=\"ID_DIV\"> <canvas id=\"radar-chart\"></canvas></div>"
			);
			
			var pdfdoc = new jsPDF();

			var incluirGraf = $("input[name='grafico']:checked")[0];
			var incluirHist = $("input[name='hist']:checked")[0];

			if (incluirGraf != null){
				var parameters = { "id": parseInt(values_list[0])};
				$.get('/getRiesgo',parameters,function(data) {
					new Chart(document.getElementById("radar-chart"), {
						type: 'radar',
						data: {
							labels: data.componentes,
							datasets: [{
									label: data.nombre,
									fill: true,
									backgroundColor: "rgba(25,61,102,0.2)",
									borderColor: "rgba(25,61,102,1)",
									pointBorderColor: "#fff",
									pointBackgroundColor: "rgba(179,181,198,1)",
									data: data.valores
							}]
						},
						options: {
							title: {
								display: true,
								text: 'Nivel de Riesgo de la ASADA'
							}
						}
					});
				});

				var canvas = document.getElementById("radar-chart");
				var canvasImg = canvas.toDataURL('image/jpeg', 1.0);
				pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);
			}

			var specialElementHandlers = {
				'#ignoreContent': function (element, renderer) {
					return true;
				}
			};

			$(document).ready(function(){
				pdfdoc.fromHTML($("#prueba").html(), 10, 10, {
					'width': 500,
					'elementHandlers': specialElementHandlers
				});
			});	
		
		}
		
		var file_name = 'Informe - ASADAS ';
		
		for (var i = 0; i < lista.length; i++){
			var temp = lista[i].split(",");
			if (i != lista.length - 1)
				file_name += temp[0] + ", ";
			else
				file_name += temp[0];				
		}

		pdfdoc.save(file_name + '.pdf');
		
	}
};

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
