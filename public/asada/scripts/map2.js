var sitios = document.getElementById("var1").innerHTML;
var riesgos = document.getElementById("var2").innerHTML;
var sitios1 = sitios.split(",");
var riesgos1 = riesgos.split(",");
var colores=['rgba(254, 0, 2, 0.7)','rgba(255, 152, 1, 0.7)','rgba(253, 235, 3, 0.7)','rgba(122, 213, 73, 0.7)','rgba(0, 153, 0, 0.7)']

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

for (var i = sitios1.length - 1; i >= 0; i--) {
  layers.push(    new ol.layer.Vector({
                source: new ol.source.Vector({
                  url: 'geojson/'+sitios1[i]+'.geojson',
                  format: new ol.format.GeoJSON()
                }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                          color: colores[riesgos1[i]]
                    }),
                    stroke: new ol.style.Stroke({
                          color: colores[riesgos1[i]]

                    })
                })
              }))
}

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