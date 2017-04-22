// do an API call for all facilities ids, compose a sitemap.txt file with one url per line

const fs = require('fs');
const request = require('request');

let count = 0;

function createSitemap(rows) {
  // set up export file
  const sitemap = fs.createWriteStream(`../public/sitemap/sitemap_${count}.txt`);

  rows.forEach((row) => {
    console.log(row); // eslint-disable-line
    const bbl = row.bbl.toString();
    const address = row.address;

    const boro = bbl.substring(0, 1);
    const block = bbl.substring(1, 6);
    const lot = bbl.substring(6, 10);
    const slug = (address === null) ? '' : address.replace(/\s+/g, '-').toLowerCase();

    sitemap.write(`https://plutopages.com/bbl/${boro}/${block}/${lot}/${slug}\n`);
  });

  count += 1;
  if (rows.length === 50000) getData(count); // eslint-disable-line
}

function getData() {
  const offset = 50000 * count;
  const sql = `SELECT bbl, address FROM pluto16v2 LIMIT 50000 OFFSET ${offset}`;

  const apiCall = `https://cwhong.carto.com/api/v2/sql?q=${sql}&format=json`;

  console.log(sql); // eslint-disable-line

  request(apiCall, (err, response, body) => {
    const data = JSON.parse(body);
    console.log(`Got ${data.rows.length} rows of data, building sitemap`) // eslint-disable-line
    createSitemap(data.rows);
  });
}


getData(count);
