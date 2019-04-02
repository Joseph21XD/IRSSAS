
var nuevos=[];
var actualizados=[];
var borrados=[];
var delcont = 0;

function addComponent(){
	var table = document.getElementById("componenttable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

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

function subcontador(){
	var vals=[];
	var conts=[];
	var table = document.getElementById("componenttable");
	for (var i = table.rows.length - 1; i >= 0; i--) {

		if(vals.includes(table.rows[i].cells[2].childNodes[0].value)){
			conts[vals.indexOf(table.rows[i].cells[2].childNodes[0].value)]+= parseInt(table.rows[i].cells[3].childNodes[0].value);
		}else{
			vals.push(table.rows[i].cells[2].childNodes[0].value);
			conts.push(parseInt(table.rows[i].cells[3].childNodes[0].value));
		}
	}
	for (var i = conts.length - 1; i >= 0; i--) {
		if(conts[i]!=100)
			return false;
	}
	return true;
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
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			news.push({"id": valor, "nombre": x , "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
		}
		else if(actualizados.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			updates.push({"id": valor, "nombre": x , "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
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

function addSubComponent(){
	var table = document.getElementById("componenttable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);

	nuevos.push(lastRow);

	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="COMPONENTE NUEVO">';
	cell3.innerHTML = document.getElementById("selectlist").innerHTML;
	cell4.innerHTML = '<input type="number" class="form-control hideinput" name="value-'+lastRow+'" value="0">';
	cell5.innerHTML = '<i class="glyphicon glyphicon-trash" onclick="deleteComponent(this,'+lastRow+');"></i>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function saveSubComponent(){
	if(subcontador()){
	news=[];
	updates=[];
	var table = document.getElementById("componenttable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		valor = parseInt(table.rows[i].cells[0].innerHTML);
		if(nuevos.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			news.push({"id": valor, "nombre": x , "componente": table.rows[i].cells[2].childNodes[0].value , "valor": parseInt(table.rows[i].cells[3].childNodes[0].value)});
		}
		else if(actualizados.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			updates.push({"id": valor, "nombre": x , "componente": table.rows[i].cells[2].childNodes[0].value, "valor": parseInt(table.rows[i].cells[3].childNodes[0].value)});
		}
	}
	
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados};
	$.get('/savesubcomponente',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;
 	}
 	else{
 		document.getElementById("error").innerHTML="Error, la suma de porcentajes debe dar 100";
 		return false;
 	}
}

function deleteIndicador(){
	
	var parameters = { "borrados": borrados};
	$.get('/deleteindicador',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;
}

function updateIndicador(id){
	updates=[];
	textareas=["Nombre","Descripcion","Observaciones"];
	var table = document.getElementById("componenttable");
	var valor = 0;
	
	for (var i = 0; i < actualizados.length;  i++) {
			updates.push(document.getElementById(actualizados[i]).value);
	}
	
	var parameters = { "indicador": id,  "actualizacion": actualizados, "valores": updates};
	$.get('/updateindicador',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;

}

function cambiarMedida(id){
	if(id=="1"){
		document.getElementById("Nominal").style.display = "none";
		document.getElementById("Lineal").style.display = "none";
	}else{
		document.getElementById("Nominal").style.display = "none";
		document.getElementById("Lineal").style.display = "block";
	}
	if(id=="4")
		document.getElementById("Nominal").style.display = "block";

}

function agregarNominal(){
	$("#irss").html("Canadá");
	var table = document.getElementById("tableNominalBody");
	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);

	var cont = parseInt(document.getElementById("contador").value)+1;

	cell1.innerHTML = '<select id="Nominal-1-'+cont+'" name="Nominal-1-'+cont+'"><option value=">">></option><option value="<"><</option><option value="=">=</option></select>';
	cell2.innerHTML = '<input id="Nominal-2-'+cont+'" name="Nominal-2-'+cont+'" type="Number" min="0" max="100" step="1" class="form-control"  placeholder="Entero entre 0 y 100" value="">';
	cell3.innerHTML = '<input id="Nominal-3-'+cont+'" name="Nominal-3-'+cont+'" type="Number" min="0" max="1" step="any" class="form-control"  placeholder="Decimal entre 0 y 1" value="">';

	document.getElementById("contador").value = parseInt(document.getElementById("contador").value)+1;
	document.getElementById("borranominal").style.display = "inline-block";
	
}

function eliminarNominal(){
	var table = document.getElementById("tableNominalBody");
	var node= document.getElementById("Nominal-1-"+document.getElementById("contador").value);
	node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
	document.getElementById("contador").value= parseInt(document.getElementById("contador").value)-1;
	if(document.getElementById("contador").value == "1")
		document.getElementById("borranominal").style.display = "none";


}

function addUser(){
	var table = document.getElementById("usertable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	nuevos.push(lastRow);

	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="USUARIO NUEVO">';
	cell3.innerHTML = '<input type="text" class="form-control hideinput" name="user-'+lastRow+'" value="new_user">';
	cell4.innerHTML = '<input type="password" class="form-control hideinput" name="pass-'+lastRow+'" value="12345">';
	cell5.innerHTML = '<select class="form-control hideinput" name="type-'+lastRow+'"> <option name="type-1" value=1>Superusuario</option> <option name="type-2" value=2>Administrador</option> </select>';
	cell6.innerHTML = '<i class="glyphicon glyphicon-trash" onclick="deleteUser(this,'+lastRow+');"></i>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function updateUser(id){
	if(!actualizados.includes(id))
		actualizados.push(id);
	document.getElementById("savebutton").style.visibility = "visible";
}

function deleteUser(element, id){
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
};

function saveUser(){
	news=[];
	updates=[];
	var table = document.getElementById("usertable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		usuario = parseInt(table.rows[i].cells[0].innerHTML);
		if(nuevos.includes(usuario)){
			news.push({"id": usuario, 
					   "nombre": table.rows[i].cells[1].childNodes[0].value, 
					   "usuario": table.rows[i].cells[2].childNodes[0].value, 
					   "contrasenna": table.rows[i].cells[3].childNodes[0].value,
					   "tipo": table.rows[i].cells[4].childNodes[0].value
					  });
		}
		else if(actualizados.includes(usuario)){
			updates.push({"id": usuario, 
						  "nombre": table.rows[i].cells[1].childNodes[0].value, 
						  "usuario": table.rows[i].cells[2].childNodes[0].value, 
						  "contrasenna": table.rows[i].cells[3].childNodes[0].value,
						  "tipo": table.rows[i].cells[4].childNodes[0].value
					     });
		}
	}
	
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados, "length": table.rows.length};
	$.get('/saveUsuario',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;
}

