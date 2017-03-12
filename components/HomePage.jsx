import React from 'react';
import Carto from '../helpers/Carto';

const dummyPoint = {  // dummy point for hover layer
  type: 'Point',
  coordinates: [0, 0],
};

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
      style: '/data/style.json',
      center: [-74.0001, 40.7067],
      zoom: 13.24,
      minZoom: 13,
      hash: true,
    });

    this.map.addControl(new mapboxgl.Navigation({ position: 'bottom-right' })); // eslint-disable-line no-undef

    this.map.on('load', () => {
      Carto.getNamedMapTileUrl('pluto16v2')
        .then((tileUrl) => {
          self.addPlutoLayer(tileUrl);
        });
    });
  },

  addPlutoLayer(tileUrl) {
    const self = this;

    this.map.addSource('pluto', {
      type: 'vector',
      tiles: [tileUrl],
      minzoom: 12,
    });

    this.map.addSource('pluto-hover', {
      type: 'geojson',
      data: dummyPoint,
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
              16,
              'rgba(247, 247, 247, 0)',
            ],
            [
              17,
              'rgba(247, 247, 247, 1)',
            ],
          ],
        },
        'fill-antialias': true,
      },
    }, 'waterway');

    this.map.addLayer({
      id: 'pluto-hover',
      source: 'pluto-hover',
      'source-layer': 'layer0',
      type: 'fill',
      paint: {
        'fill-color': 'rgba(228, 254, 19, 1)',
        'fill-opacity': 0.7,
        'fill-antialias': true,
      },
    }, 'waterway');

    this.map.on('mousemove', (e) => {
      this.moveTooltip(e);

      const features = this.map.queryRenderedFeatures(e.point, { layers: ['pluto'] });
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';

      if (features.length) {
        self.map.getSource('pluto-hover').setData(features[0]);
        self.showTooltip(features[0].properties.address);
      } else {
        self.map.getSource('pluto-hover').setData(dummyPoint);
        self.hideTooltip();
      }
    });

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['pluto'] });
      if (features.length) self.routeToBbl(features[0].properties.bbl.toString());
    });

    this.map.on('dragstart', this.hideTooltip);

    // Reset the state-fills-hover layer's filter when the mouse leaves the map
    // this.map.on('mouseout', () => {
    //   this.map.setFilter('pluto-hover', ['==', 'cartodb_id', '']);
    // });
  },

  routeToBbl(bbl) {
    console.log(bbl)
    const boro = bbl.substring(0, 1);
    const block = bbl.substring(1, 6);
    const lot = bbl.substring(6, 10);
    console.log(boro, block, lot);

    this.props.history.push(`/bbl/${boro}/${block}/${lot}`);
  },

  showTooltip(text) {
    $('#tooltip').text(text).stop().css('opacity', 1) // eslint-disable-line no-undef
      .css('display', 'initial');
  },

  hideTooltip() {
    $('#tooltip').stop().fadeOut(100); // eslint-disable-line no-undef
  },

  moveTooltip(e) {
    const event = e.originalEvent;

    $('#tooltip') // eslint-disable-line no-undef
      .css('top', event.clientY - 15)
      .css('left', event.clientX + 40);
  },

  render() {
    return (
      <div className="main-container">
        <div id="mapContainer" />
        <div id="tooltip">Tooltip</div>
      </div>
    );
  },
});

export default HomePage;
