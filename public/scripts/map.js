//variables globales
var parameters = { 'id': 0 };
var jsonsites;

// array de colores
var colores=['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];
var colores2=['rgba(156, 26, 18, 1)','rgba(130, 118, 17, 1)','rgba(35, 58, 45, 1)','rgba(10, 66, 92, 1)','rgba(9, 32, 74, 1)'];


// array de Styles de OL
var styles = [new ol.style.Style({
                    fill: new ol.style.Fill({
                          color: 'rgba(255, 255, 255, 0.0)'
                    }),
                    stroke: new ol.style.Stroke({
                          color: 'rgba(255, 255, 255, 0.0)'

                    })
                }),new ol.style.Style({
                    fill: new ol.style.Fill({
                          color: 'rgba(254, 0, 2, 0.7)'
                    }),
                    stroke: new ol.style.Stroke({
                          color: 'rgba(254, 0, 2, 0.7)'

                    })
                })];

// en proceso

function shapestyles(valor) {
  return new ol.style.Style({
        image: new ol.style.RegularShape(({
            fill: new ol.style.Fill({color: colores[valor]}),
            stroke: new ol.style.Stroke({color: colores2[valor] , width: 1}),
            points: 4,
            radius: 5,
            angle: Math.PI
        }))
      });
}

// Función toma codigo de distrito y busca en jsonsites si existe riesgo en el, de no ser asi lo pinta transparente
var styleFunction = function(feature) {
        var id =parseInt(feature.get('CODIGO'));
        var index = jsonsites.sitios.indexOf(id);

        if(index == -1)
          return styles[0];
        else
          return new ol.style.Style({
                    fill: new ol.style.Fill({
                          color: colores[jsonsites.valores[index]]
                    }),
                    stroke: new ol.style.Stroke({
                          color: colores[jsonsites.valores[index]]

                    })
                });
      };

// Array de capas por defecto, capas OSM y urbano 5000
var layers = [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              }),
              new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
                  params: {'LAYERS': 'urbano_5000', 'TILED': true},
                  serverType: 'geoserver',
                  transition: 0
                })
              })
            ]

// funcion jquery para obtener datos de riesgo de asadas
var parameters= {"tipo": "1"};
$.get('/getSites',parameters,function(data) {
      jsonsites = data.jsonsites1;
     }).done(function(res){

 // Carga capa de distritos, llama a función stylefunction
 layers.push(    new ol.layer.Vector({
                source: new ol.source.Vector({
                  url: 'geojson/District.geojson',
                  format: new ol.format.GeoJSON()
                }),
                style: styleFunction
              }))

// Carga capas de distritos y provincial para sobreponerlas
layers.push(new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
                  params: {'LAYERS': 'limitedistrital_5k', 'TILED': true},
                  serverType: 'geoserver',
                  transition: 0
                })
              }))

layers.push(new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
                  params: {'LAYERS': 'limitecantonal_5k', 'TILED': true},
                  serverType: 'geoserver',
                  transition: 0
                })
              }))

layers.push(new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
                  params: {'LAYERS': 'limiteprovincial_5k', 'TILED': true},
                  serverType: 'geoserver',
                  transition: 0
                })
              }))

//en proceso

      puntos = [];

      var x;
      for(var i= 0; i< jsonsites.asadas.length; i++){

        x= 4-(Math.floor(jsonsites.asadas[i].valor/20));
        if(x > 4) x=4;
        if(x < 0) x=0;

        puntos.push(new ol.Feature({
        type: 'click',
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(jsonsites.asadas[i].Latitud),parseFloat(jsonsites.asadas[i].Longitud)])),
        name: jsonsites.asadas[i].Nombre,
        id: jsonsites.asadas[i].Asada_ID,
        riesgo: jsonsites.asadas[i].valor,
        color: (["Muy Alto", "Alto", "Intermedio", "Bajo", "Nulo"])[x]
        }));


        //puntos[i].setStyle(shapestyles(jsonsites.asadas[i].valor));
      }

      

      var vectorSource = new ol.source.Vector({
        features: puntos
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });
      layers.push(vectorLayer);


/*var select_interaction = new ol.interaction.Select({
  condition: ol.events.condition.click
});

select_interaction.on('select', function (e) {
    var parameters = { "id": e.selected[0].getProperties()};
    $.get('/selected',parameters,function(data) {
     });
});*/

// carga en mapa

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
});

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


var map = new ol.Map({
            target: 'map',
            overlays: [overlay],
            layers: layers,
            view: new ol.View({
              center: ol.proj.fromLonLat([-84.097118,9.934691]),
              zoom: 8
            })
          });

map.on('click', function(evt) {
    var f = map.forEachFeatureAtPixel(
        evt.pixel,
        function(ft, layer){return ft;}
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();
        content.innerHTML = '<p><b>'+f.get("name")+'</b></p><p><b>ID: </b> '+f.get("id")+' <b>Riesgo: </b>'+f.get("riesgo")+' <b>Nivel de Riesgo: </b>'+f.get("color")+' </p>';        
        overlay.setPosition(coord);
        
    }
    
});
//map.addInteraction(select_interaction);

  });