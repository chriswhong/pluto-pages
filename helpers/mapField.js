import numeral from 'numeral'

//for a given field name, return object with pretty-printed name and display function
var mapField = function(field) {
  switch (field) {

    case 'assessland':
      return {
        name: 'Land Assessed Value',
        display: currency
      }
      break;

    case 'assesstot':
      return {
        name: 'Total Assessed Value',
        display: currency
      }
      break;

    case 'cd':
      return {
        name: 'Community District',
        display: cd
      }
      break;

    case 'condono':
      return {
        name: 'Condo Number',
        display: condono
      }
      break;

    case 'lotarea':
      return {
        name: 'Lot Area',
        display: function(value) {
          return numeric(value) + ' square feet'
        }
      }
      break;

    case 'lotdepth':
      return {
        name: 'Lot Depth',
        display: function(value) {
          return numeric(value) + ' feet'
        }
      }
      break;

    case 'lotfront':
      return {
        name: 'Lot Frontage',
        display: function(value) {
          return numeric(value) + ' feet'
        }
      }
      break;

    case 'lottype':
      return {
        name: 'Lot Type',
        display: lottype
      }
      break;

    case 'ownername':
      return {
        name: 'Owner Name'
      }
      break;

    case 'ownertype':
      return {
        name: 'Owner Type'
      }
      break;

    case 'policeprct':
      return {
        name: 'Police Precinct'
      }
      break;

    default:
      return {
        name: field,
        display: function(value) {
          return(value)
        }
      }

    
  }
}

module.exports=mapField;

// explicit field mapping functions
function cd(value) {
  var borocd = value.toString();

  var borocode = borocd[0];
  var cd = parseInt(borocd.substr(1,2));

  var boro = boroMap(borocode);

  return boro + ' CD ' + cd
}

function lottype(value) {
  switch(value) {
    case '0':
      return 'Mixed or Unknown'
      break;
    case '1':
      return 'Block Assemblage Lot'
      break;
    case '2':
      return 'Waterfront Lot'
      break;
    case '3':
      return 'Corner Lot'
      break;
    case '4':
      return 'Through Lot'
      break;
    case '5':
      return 'Inside Lot'
      break;
    case '6':
      return 'Interior Lot'
      break;
    case '7':
      return 'Island Lot'
      break;
    case '8':
      return 'Alley Lot'
      break;
    case '9':
      return 'Submerged Land Lot'
      break;
    default:
      return 'lookup error'
  }
}




// helper functions
function currency(value) {
  return numeral(value).format('($0.0 a)')
}

function condono(value) {
  return (value == 0) ? 'n/a' : value
}

function numeric(value) {
  return numeral(value).format('(0.0 a)')
}

function boroMap(borocode) {
  return (borocode=='1') ? 'Manhattan' :
    (borocode=='2') ? 'Bronx' :
    (borocode=='3') ? 'Brooklyn' :
    (borocode=='4') ? 'Queens':
    (borocode=='5') ? 'Staten Island': null;

}