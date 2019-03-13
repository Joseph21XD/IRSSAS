//variables globales
var parameters = { 'id': 0 };
var jsonsites;

// array de colores
var colores=['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];


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
/*var shapestyles = [new ol.style.Style({
        image: new ol.style.RegularShape(({
          fill: fill,
            stroke: stroke,
            points: 3,
            radius: 10,
            rotation: Math.PI / 4,
            angle: 0
        }))
      })]*/

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
$.get('/getSites',function(data) {
      jsonsites = data;
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
                  params: {'LAYERS': 'limiteprovincial_5k', 'TILED': true},
                  serverType: 'geoserver',
                  transition: 0
                })
              }))

//en proceso

     /* var madrid = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-85.3868195,10.5685225])),
      });

      var stroke = new ol.style.Stroke({color: 'black', width: 2});
      var fill = new ol.style.Fill({color: 'red'});

      madrid.setStyle();


      var vectorSource = new ol.source.Vector({
        features: [madrid]
      });

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });

      layers.push(vectorLayer);*/

// carga en mapa
var map = new ol.Map({
            target: 'map',
            layers: layers,
            view: new ol.View({
              center: ol.proj.fromLonLat([-84.097118,9.934691]),
              zoom: 8
            })
          });
  });