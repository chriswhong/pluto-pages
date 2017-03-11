import React from 'react'
import mapField from '../helpers/mapField.js'

var TaxLotProfile = React.createClass({
  render() {
    if(this.props.data.features) {
     var d = this.props.data.features[0].properties
     var boro = boroLookup(d.borough)

      return(
        <div>
          <div className='row'>
            <div className='col-md-4'>
              
            </div>
            <div className='col-md-8'>
              <h1>{d.address}</h1>
              <h5>{d.condono==0 ? 'Tax lot in ' + boro : 'Condominium Tax Lot in ' + boro}</h5>
            </div>
          </div>
          <hr/>
          <Panel
            title={'General Info'}
            data={d}
            fields={[
              'ownername',
              'ownertype',
              'lotarea',
              'lotfront',
              'lotdepth',
              'lottype',
              'condono'
            ]}
          />
          <Panel
            title={'Zoning'}
            data={d}
            fields={[
              'zonedist1',
              'zonedist2',
              'zonedist3',
              'zonedist4',
              'overlay1',
              'overlay2',
              'spdist1',
              'spdist2',
              'ltdheight',
              'allzoning1',
              'allzoning2',
              'splitzone'
            ]}
          />
          <Panel
            title={'Buildings'}
            data={d}
            fields={[
              'yearbuilt',
              'builtcode',
              'yearalter1',
              'yearalter2',
              'bldgclass',
              'bldgarea',
              'comarea',
              'resarea',
              'officearea',
              'retailarea',
              'garagearea',
              'strgearea',
              'factryarea',
              'otherarea',
              'areasource',
              'numbldgs',
              'numfloors',
              'unitsres',
              'unitstotal',
              'bldgfront',
              'bldgdepth',
              'ext',
              'proxcode',
              'irrlotcode',
              'bsmtcode',
              'builtfar',
              'residfar',
              'commfar',
              'facilfar'



            ]}
          />
          <Panel
            title={'Location'}
            data={d}
            fields={[
              'cd',
              'healtharea',
              'policeprct',
              'sanitatdistrict',
              'sanitsub',
              'histdist',
              'landmark',
              'tract2010',
              'zonemap',
              'sanborn',
              'taxmap'
            ]}
          />
          <Panel
            title={'Taxes'}
            data={d}
            fields={[
              'assessland',
              'assesstot',
              'exemptland',
              'exempttot'
            ]}
          />

        </div>
      )
    } else {
      return null;
    }

  }
})

module.exports=TaxLotProfile

function boroLookup(borough) {
  return borough == 'BK' ? 'Brooklyn' :
    borough == 'QN' ? 'Queens' :
    borough == 'MN' ? 'Manhattan' :
    borough == 'SI' ? 'Staten Island' :
    borough == 'BX' ? 'Bronx' : null;

}

var Panel = React.createClass({
  render() {
    var self=this;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.title}</h3>
        </div>
        <div className="panel-body">
          {
            this.props.fields.map(function(field) {
              return <KeyValue key={field} name={field} value={self.props.data[field]}/>
            })
          }
        </div>
      </div>
    )
  }
})

var KeyValue = React.createClass({
  render() {

    var mapped = mapField(this.props.name);

    return (
      <div className="row">
        <div className='col-xs-6 text-right'>
          <strong>{mapped.name}</strong>
        </div>
        <div className='col-xs-6'>

          {(mapped.display) ? mapped.display(this.props.value) : this.props.value}
        </div>
      </div>
    )
  }
})
