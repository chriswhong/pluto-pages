import React, { PropTypes } from 'react';

const App = React.createClass({ // eslint-disable-line
  propTypes: {
    children: PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  },
});

module.exports = App;
