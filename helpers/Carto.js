const Carto = {
  getNamedMapTileUrl(template_name) {
    return new Promise((resolve, reject) => {
      $.ajax({ // eslint-disable-line no-undef
        type: 'POST',
        url: 'https://cwhong.carto.com/api/v1/map/named/pluto16v2',
        contentType: 'application/json',
        success(data) {
          const layergroupid = data.layergroupid;
          const template = `https://cwhong.carto.com/api/v1/map/${layergroupid}/0/{z}/{x}/{y}.mvt`;
          resolve(template);
        },
      })
      .fail(() => reject());
    });
  },
};

export default Carto;
