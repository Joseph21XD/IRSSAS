
var nuevos=[];
var actualizados=[];
var borrados=[];
var delcont = 0;

function addComponent(){
	var table = document.getElementById("componenttable");
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;

	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	nuevos.push(lastRow);

	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="COMPONENTE NUEVO">';
	cell3.innerHTML = '<input type="number" class="form-control hideinput" name="value-'+lastRow+'" value="0">';
	cell4.innerHTML = '<i class="glyphicon glyphicon-trash" onclick="deleteComponent(this,'+lastRow+');"></i>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function deleteComponent(element, id){
	element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
	if(!nuevos.includes(id)){
		borrados.push(id);
		if(actualizados.includes(id)){
			actualizados.splice(actualizados.indexOf(id),1);	
		}
	}
	else
		nuevos.splice(nuevos.indexOf(id),1);
	document.getElementById("savebutton").style.visibility = "visible";
}

function updateComponent(id){
	if(!actualizados.includes(id))
		actualizados.push(id);
	document.getElementById("savebutton").style.visibility = "visible";
}

function contador(){
	var cont = 0;
	var table = document.getElementById("componenttable");
	for (var i = table.rows.length - 1; i >= 0; i--) {
		cont+= parseInt(table.rows[i].cells[2].childNodes[0].value);
	}
	if(cont==100)
		return true;
	else
		return false;
}

function saveComponent(){
	if(contador()){
	news=[];
	updates=[];
	var table = document.getElementById("componenttable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		valor = parseInt(table.rows[i].cells[0].innerHTML);
		if(nuevos.includes(valor)){
			news.push({"id": valor, "nombre": table.rows[i].cells[1].childNodes[0].value, "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
		}
		else if(actualizados.includes(valor)){
			updates.push({"id": valor, "nombre": table.rows[i].cells[1].childNodes[0].value, "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
		}
	}
	
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados};
	$.get('/saveComponente',parameters,function(data) {
      jsonsites = data;
     }).done(function(res){     	
		});
     return true;
 	}
 	else{
 		document.getElementById("error").innerHTML="Error, la suma de porcentajes debe dar 100";
 		return false;
 	}
}