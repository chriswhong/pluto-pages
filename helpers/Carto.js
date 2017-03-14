const Carto = {
  getNamedMapTileUrl(template_name) {
    return new Promise((resolve, reject) => {
      $.ajax({ // eslint-disable-line no-undef
        type: 'POST',
        url: `https://cwhong.carto.com/api/v1/map/named/${template_name}`,
        contentType: 'application/json',
        success(data) {
          const layergroupid = data.layergroupid;
          const template = `https://cwhong.carto.com/api/v1/map/${layergroupid}/0/{z}/{x}/{y}.png`;
          resolve(template);
        },
      })
      .fail(() => reject());
    });
  },

  generateUrlString(sql, format, filename = 'download') {
    const apiString = `https://cwhong.carto.com/api/v2/sql?q=${sql}&format=${format}&filename=${filename}`;
    return encodeURI(apiString);
  },

  SQL(sql, format) {
    format = format || 'geojson';
    const apiCall = this.generateUrlString(sql, format);

    return new Promise((resolve, reject) => {
      $.getJSON(apiCall) // eslint-disable-line no-undef
        .done((data) => {
          if (format === 'geojson') {
            resolve(data);
          } else {
            resolve(data.rows);
          }
        })
        .fail(() => reject());
    });
  },
};

export default Carto;
