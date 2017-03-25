import React from 'react';
import Autosuggest from 'react-autosuggest';

function getSuggestionValue(suggestion) {
  return suggestion.properties.label;
}

function renderSuggestion(suggestion) {
  return (
    <div><i className="fa fa-map-marker" aria-hidden="true" /><span>{suggestion.properties.label}</span></div>
  );
}

function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}

const mapzen_api_key = 'mapzen-ZyMEp5H'
const bounds = {
  minLon: -74.292297,
  maxLon: -73.618011,
  minLat: 40.477248,
  maxLat: 40.958123,
};


const SearchWidget = React.createClass({
  propTypes: {
    onSelection: React.PropTypes.func,
  },

  getInitialState() {
    return {
      value: '',
      suggestions: [],
    };
  },

  onSuggestionsFetchRequested({ value }) {
    const self = this;

    const apiCall = `https://search.mapzen.com/v1/autocomplete?text=${value}&boundary.rect.min_lon=${bounds.minLon}&boundary.rect.max_lon=${bounds.maxLon}&boundary.rect.min_lat=${bounds.minLat}&boundary.rect.max_lat=${bounds.maxLat}&api_key=${mapzen_api_key}`;

    $.getJSON(apiCall, (data) => { // eslint-disable-line no-undef
      self.setState({
        suggestions: data.features,
      });
    });
  },

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  },

  onChange(e, obj) {
    this.setState({
      value: obj.newValue,
    });
  },

  onSuggestionSelected(e, o) {
    this.setState({
      value: o.suggestionValue,
    });

    this.props.onSelection(o.suggestion);
  },

  render() {
    const inputProps = {
      placeholder: 'Search for an address',
      value: this.state.value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  },
});

module.exports = SearchWidget;
