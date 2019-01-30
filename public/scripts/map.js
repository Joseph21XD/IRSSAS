var parameters = { 'id': 0 };
var jsonsites;


var colores=['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)']

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
                })]

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
              }),
            ]

$.get('/getSites',function(data) {
      jsonsites = data;
     }).done(function(res){

 layers.push(    new ol.layer.Vector({
                source: new ol.source.Vector({
                  url: 'geojson/Example.geojson',
                  format: new ol.format.GeoJSON()
                }),
                style: styleFunction
              }))


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

var map = new ol.Map({
            target: 'map',
            layers: layers,
            view: new ol.View({
              center: ol.proj.fromLonLat([-84.097118,9.934691]),
              zoom: 8
            })
          });
  });