import React from 'react';
import Carto from '../helpers/Carto';

const HomePage = React.createClass({
  getInitialState() {
    return ({
      data: {},
    });
  },

  componentDidMount() {
    const self = this;

    this.map = new mapboxgl.Map({ // eslint-disable-line no-undef
      container: 'mapContainer',
      style: 'data/style.json',
      center: [-74.0001, 40.7067],
      zoom: 13.24,
      minZoom: 13,
      hash: true,
    });

    Carto.getNamedMapTileUrl('pluto16v2')
      .then((tileUrl) => {
        self.addPlutoLayer(tileUrl);
      });
  },

  addPlutoLayer(tileUrl) {
    console.log(this.map.getStyle());
    this.map.addSource('pluto', {
      type: 'vector',
      tiles: [tileUrl],
      minzoom: 12,
    });

    this.map.addLayer({
      id: 'pluto',
      source: 'pluto',
      'source-layer': 'layer0',
      type: 'fill',
      paint: {
        'fill-color': {
          property: 'type',
          stops: [
            [0, 'rgba(67, 114, 222, 1)'],
            [1, 'rgba(56, 98, 193, 1)'],
            [2, 'rgba(48, 85, 167, 1)'],
            [3, 'rgba(41, 72, 142, 1)'],
            [4, 'rgba(34, 60, 119, 1)'],
          ],
        },
        'fill-opacity': 0.7,
        'fill-outline-color': {
          stops: [
            [
              15,
              'rgba(247, 247, 247, 0)',
            ],
            [
              16,
              'rgba(247, 247, 247, 1)',
            ],
          ],
        },
        'fill-antialias': true,
      },
    }, 'waterway');
  },

  render() {
    return (
      <div className="main-container">
        <div id="mapContainer" />
      </div>
    );
  },
});

export default HomePage;
