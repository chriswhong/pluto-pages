import React, { PropTypes } from 'react';
import bbox from '@turf/bbox';
import SearchWidget from './SearchWidget';

import Carto from '../helpers/Carto';

const dummyPoint = {  // dummy point for hover layer
  type: 'Point',
  coordinates: [0, 0],
};

const HomePage = React.createClass({

  propTypes: {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  },

  getInitialState() {
    return ({
      data: {},
      zoom: 13.24,
    });
  },

  componentDidMount() {
    const self = this;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESSTOKEN; // eslint-disable-line
    this.map = new mapboxgl.Map({ // eslint-disable-line no-undef
      container: 'mapContainer',
      style: '/data/style.json',
      center: [-74.0001, 40.7067],
      zoom: 13.24,
      minZoom: 10,
      hash: true,
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left'); // eslint-disable-line no-undef

    this.map.on('zoomend', () => {
      self.setState({ zoom: self.map.getZoom() });
    });

    this.map.on('load', () => {
      Carto.getNamedMapTileUrl('pluto16v2')
        .then((tileUrl) => {
          self.addPlutoVectorLayer(tileUrl);
          self.addPlutoRasterLayer(tileUrl);
        });

      const split = this.props.location.pathname.split('/');
      if (split[1] === 'bbl') {
        const bbl = `${split[2]}${split[3]}${split[4]}`;
        this.highlightBBL(bbl, true);
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (this.map.getLayer('highlighted')) this.map.removeLayer('highlighted');
      if (this.map.getSource('highlighted')) this.map.removeSource('highlighted');
    }
  },

  setMarker(geojson) {
    if (this.map.getSource('marker')) this.map.removeSource('marker');
    if (this.map.getLayer('marker')) this.map.removeLayer('marker');

    this.map.addSource('marker', {
      type: 'geojson',
      data: geojson,
    });

    this.map.addLayer({
      id: 'marker',
      source: 'marker',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': 'rgba(204, 255, 0, 1)',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8,
        'circle-stroke-color': 'rgba(179, 179, 179, 1)',
      },
    });


    this.map.flyTo({
      center: geojson.geometry.coordinates,
      zoom: 18,
      speed: 2,
    });
  },

  hideMarker() {
    this.map.removeLayer('marker');
  },

  addPlutoVectorLayer(tileUrl) {
    const vectorTileUrl = `${tileUrl.split('.png')[0]}.mvt`;
    const self = this;

    this.map.addSource('pluto', {
      type: 'vector',
      tiles: [vectorTileUrl],
      minzoom: 14,
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
          property: 'displaytype',
          type: 'categorical',
          stops: [
            ['0', 'rgba(67, 114, 222, 1)'],
            ['1', 'rgba(56, 98, 193, 1)'],
            ['2', 'rgba(48, 85, 167, 1)'],
            ['3', 'rgba(41, 72, 142, 1)'],
            ['4', 'rgba(34, 60, 119, 1)'],
          ],
        },
        'fill-opacity': {
          stops: [
            [14, 0],
            [15, 0.7],
          ],
        },
        'fill-outline-color': {
          stops: [
            [16, 'rgba(247, 247, 247, 0)'],
            [17, 'rgba(247, 247, 247, 1)'],
          ],
        },
        'fill-antialias': true,
      },
    }, 'waterway');

    this.map.addLayer({
      id: 'pluto-hover',
      source: 'pluto-hover',
      type: 'line',
      paint: {
        'line-color': 'rgba(228, 254, 19, 1)',
        'line-width': 3,
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
      if (features.length) {
        const feature = features[0];
        self.routeToBbl(feature.properties.bbl.toString(), feature.properties.address);
        self.addHighlighted(feature);
      }
    });

    this.map.on('dragstart', this.hideTooltip);

    // Reset the state-fills-hover layer's filter when the mouse leaves the map
    // this.map.on('mouseout', () => {
    //   this.map.setFilter('pluto-hover', ['==', 'cartodb_id', '']);
    // });
  },

  addPlutoRasterLayer(tileUrl) {
    this.map.addSource('pluto-raster', {
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256,
    });

    this.map.addLayer({
      id: 'pluto-raster',
      type: 'raster',
      source: 'pluto-raster',
      maxzoom: 15,
      paint: {
        'raster-opacity': {
          stops: [
            [
              14,
              1,
            ],
            [
              15,
              0,
            ],
          ],
        },
      },
    }, 'waterway');
  },

  routeToBbl(bbl, address) {
    const boro = bbl.substring(0, 1);
    const block = bbl.substring(1, 6);
    const lot = bbl.substring(6, 10);

    const slug = address.replace(/\s+/g, '-').toLowerCase();

    this.props.history.push(`/bbl/${boro}/${block}/${lot}/${slug}`);
  },

  showTooltip(text) {
    $('#tooltip').text(text).stop().css('opacity', 1) // eslint-disable-line no-undef
      .css('display', 'initial');
  },

  hideTooltip() {
    $('#tooltip').stop().fadeOut(100); // eslint-disable-line no-undef
  },

  highlightBBL(bbl, fitBounds) {
    const self = this;

    Carto.SQL(`SELECT the_geom from pluto16v2 WHERE bbl = ${bbl}`)
      .then((data) => {
        const feature = data.features[0];

        if (fitBounds) {
          self.map.fitBounds(bbox(feature), {
            padding: 200,
            offset: [-160, 0],
          });
        }

        self.addHighlighted(feature);
      });
  },

  addHighlighted(feature) {
    this.map.addSource('highlighted', {
      type: 'geojson',
      data: feature,
    });

    this.map.addLayer({
      id: 'highlighted',
      source: 'highlighted',
      type: 'fill',
      paint: {
        'fill-outline-color': 'orange',
        'fill-color': 'orange',
        'fill-opacity': 0.7,
        'fill-antialias': true,
      },
    });
  },

  moveTooltip(e) {
    const event = e.originalEvent;

    $('#tooltip') // eslint-disable-line no-undef
      .css('top', event.clientY - 15)
      .css('left', event.clientX + 40);
  },

  geolocate() {
    if (navigator.geolocation) {
      this.setState({ gettingLocation: true });
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ gettingLocation: false });
        const { coords } = position;
        const lngLat = [coords.longitude, coords.latitude];

        this.map.flyTo({
          center: lngLat,
          zoom: 18,
          speed: 2,
        });

        this.showMarker(lngLat);
      });
    }
  },

  showMarker(lngLat) {
    if (this.map.getSource('location')) {
      this.map.removeLayer('point');
      this.map.removeLayer('point1');
      this.map.removeSource('location');

      if (this.timer) clearTimeout(this.timer);
    }

    // animation borrowed from https://bl.ocks.org/danswick/2f72bc392b65e77f6a9c
    this.map.addSource('location', {
      type: 'geojson',
      data: {
        type: 'Point',
        coordinates: lngLat,
      },
    });

    this.map.addLayer({
      id: 'point',
      source: 'location',
      type: 'circle',
      paint: {
        'circle-radius': 8,
        'circle-radius-transition': { duration: 0 },
        'circle-opacity-transition': { duration: 0 },
        'circle-color': '#E4FE13',
      },
    });

    this.map.addLayer({
      id: 'point1',
      source: 'location',
      type: 'circle',
      paint: {
        'circle-radius': 8,
        'circle-color': '#E4FE13',
      },
    });


    this.animateMarker();
  },

  animateMarker() {
    const self = this;
    const framesPerSecond = 15;
    const initialOpacity = 1;
    let opacity = initialOpacity;
    const initialRadius = 8;
    let radius = initialRadius;
    const maxRadius = 18;

    function doAnimation() {
      self.timer = setTimeout(() => {
        requestAnimationFrame(doAnimation);

        radius += (maxRadius - radius) / framesPerSecond;
        opacity -= (0.9 / framesPerSecond);

        self.map.setPaintProperty('point', 'circle-radius', radius);
        self.map.setPaintProperty('point', 'circle-opacity', opacity < 0 ? 0 : opacity);

        if (opacity <= 0) {
          radius = initialRadius;
          opacity = initialOpacity;
        }
      }, 1000 / framesPerSecond);
    }

    doAnimation();
  },

  render() {
    const { zoom, gettingLocation } = this.state;

    const toastMessage = (zoom < 14) ?
      <p>Zoom in to select a tax lot</p> :
      <p>Click a tax lot to view data</p>;

    const geolocateClass = gettingLocation ? 'fa fa-cog fa-spin fa-fw' : 'fa fa-crosshairs';

    return (
      <div className="main-container">
        <div className="title-banner">
          <h2>Pluto Pages</h2>
          <p>NYC property data at your fingertips</p>
        </div>

        <div className="button-pane">
          <SearchWidget
            onSelection={(selection) => { this.setMarker(selection); }}
            onHide={this.hideMarker}
          />

          <a href="//github.com/chriswhong/pluto-pages"><div className="fa fa-github menu-icon" /></a>

          <div className="menu-icon" onClick={this.geolocate}>
            <i className={geolocateClass} />
          </div>
        </div>
        <div className="toast">
          { toastMessage }
        </div>
        <div id="mapContainer" />
        <div id="tooltip">Tooltip</div>
      </div>
    );
  },
});

export default HomePage;
