import React from 'react'
import numeral from 'numeral'

var TaxLotProfile = React.createClass({
  render() {
    if(this.props.data.features) {
     var d = this.props.data.features[0].properties
      return(
        <div>
          <h1>{d.address}</h1>
          <h5>{boroLookup(d.borough)}</h5>

          <hr/>

          {/*<Panel title={'General'}/>
          <Panel title={'Owner'}/>
          <Panel title={'Zoning'}/>
          <Panel title={'Buildings'}/>*/}
          <Panel 
            title={'Taxes'}
            data={d}
            fields={[
              'assessland',
              'assesstot'
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
              return <KeyValue name={field} value={self.props.data[field]}/>
            })
          }
        </div>
      </div>
    )
  }
})

var KeyValue = React.createClass({
  render() {
    return (
      <div className="row">
        <div className='col-md-6 text-right'>
          <strong>{mapField(this.props.name)}</strong>
        </div>
        <div className='col-md-6'>
          {numeral(this.props.value).format('($0.0 a)')}
        </div>
      </div>
    )
  }
})

function mapField(field) {
  return field == 'assessland' ? 'Land Assessed Value' :
   field == 'assesstot' ? 'Total Assessed Value' : null
}