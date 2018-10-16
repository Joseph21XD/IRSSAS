      import Map from '../ol/Map.js';
      import View from '../ol/View.js';
      import TileLayer from '../ol/layer/Tile.js';
      import OSM from '../ol/source/OSM.js';
      import TileWMS from '../ol/source/TileWMS.js';

      
      var layers = [
        new TileLayer({
          source: new OSM()
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'http://geos0.snitcr.go.cr/cgi-bin/web?map=hojas50.map&SERVICE=WMS&version=1.1.1&request=GetCapabilities',
            params: {'LAYERS': 'hojas_50', 'TILED': true},
            serverType: 'geoserver',
            transition: 0
          })
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
            params: {'LAYERS': 'limitedistrital_5k', 'TILED': true},
            serverType: 'geoserver',
            transition: 0
          })
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
            params: {'LAYERS': 'limiteprovincial_5k', 'TILED': true},
            serverType: 'geoserver',
            transition: 0
          })
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
            params: {'LAYERS': 'urbano_5000', 'TILED': true},
            serverType: 'geoserver',
            transition: 0
          })
        })

      ];
      var map = new Map({
        layers: layers,
        target: 'map',
        view: new View({
          projection: 'EPSG:4326',
          center: [-84.097118,9.934691],
          zoom: 8
        })
      });