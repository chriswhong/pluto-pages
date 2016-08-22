import React from 'react'
import TaxLotProfile from './TaxLotProfile.jsx'

var TaxLotContainer = React.createClass({
  getInitialState() {
    return ({
      data: {}
    })
  },

  componentDidMount() {
    var self=this;

    var bbl = assemblebbl(this.props.params)
    var apiCall = 'https://cwhong.cartodb.com/api/v2/sql?skipfields=cartodb_id,created_at,updated_at,name,description&format=geojson&q=SELECT * FROM pluto15v1 a WHERE bbl=' + bbl 
    console.log('Fetching data...', apiCall)
    $.getJSON(apiCall, function(data) {
      console.log(data.features[0].properties)
      self.setState({
        data: data
      })
    })

  },

  render() {
    return(
      <div>
       <TaxLotProfile data={this.state.data}/>
      </div>
    )
  }
});

module.exports=TaxLotContainer;

function assemblebbl(p) {
  return p.boro + zeroPad(p.block,5) + zeroPad(p.lot,4)
}

//from http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
