import React, { PropTypes } from 'react';
import Carto from '../helpers/Carto';


const LotProfile = React.createClass({
  propTypes: {
    match: PropTypes.object.isRequired,
  },

  getInitialState() {
    return ({
      data: null,
      bbl: this.urlToBBL(this.props.match.url),
    });
  },

  componentDidMount() {
    this.getBBLData(this.state.bbl);
  },

  componentWillReceiveProps(nextProps) {
    const self = this;

    if (nextProps.match.url !== this.props.match.url) {
      this.setState({
        bbl: this.urlToBBL(nextProps.match.url),
        data: null,
      }, () => {
        setTimeout(() => {
          self.getBBLData(this.state.bbl);
        }, 450);
      });
    }
  },

  getBBLData(bbl) {
    const self = this;
    const query = `SELECT borough,block,lot,cd,ct2010,cb2010,schooldist,council,zipcode,firecomp,policeprct,healtharea,sanitboro,sanitdistr,sanitsub,address,zonedist1,zonedist2,zonedist3,zonedist4,overlay1,overlay2,spdist1,spdist2,spdist3,ltdheight,splitzone,bldgclass,landuse,easements,ownertype,ownername,lotarea,bldgarea,comarea,resarea,officearea,retailarea,garagearea,strgearea,factryarea,otherarea,areasource,numbldgs,numfloors,unitsres,unitstotal,lotfront,lotdepth,bldgfront,bldgdepth,ext,proxcode,irrlotcode,lottype,bsmtcode,assessland,assesstot,exemptland,exempttot,yearbuilt,yearalter1,yearalter2,histdist,landmark,builtfar,residfar,commfar,facilfar,borocode,bbl,condono,tract2010,xcoord,ycoord,zonemap,zmcode,sanborn,taxmap,edesignum,appbbl,appdate,plutomapid,version,mappluto_f,shape_leng,shape_area FROM pluto16v2 WHERE bbl = '${bbl}'`;
    Carto.SQL(query, 'json')
      .then((data) => {
        self.setState({ data: data[0] });
      });
  },

  urlToBBL(url) {
    const urlParts = url.split('/');
    return `${urlParts[2]}${urlParts[3]}${urlParts[4]}`;
  },

  render() {
    const d = this.state.data;

    const attributeList = [];

    for (const key in d) { //eslint-disable-line
      if (Object.prototype.hasOwnProperty.call(d, key)) {
        const value = d[key];

        attributeList.push(
          <div className="attribute-list-item" key={key}>
            <p className="key">{key}</p>
            <p className="value">{value}</p>
          </div>,
        );
      }
    }

    return (
      <div
        className="lot-profile"
        style={{
          transform: d ? 'translate(0px, 0px)' : 'translate(320px, 0px)',
        }}
      >
        { d && (
          <div className="header">
            <p>BBL {d.bbl}</p>
            <h3>{d.address}</h3>
          </div>
        )}

        { d && (
          <div className="attribute-list">
            {attributeList}
          </div>
        )}
      </div>
    );
  },
});

export default LotProfile;
