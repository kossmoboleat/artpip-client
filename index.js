const wallpaper = require('wallpaper');
const axios = require('axios');
const fs = require('fs');

const download = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

const query = (dateIsoString) => axios.get(`https://www.artpip.com/api/featured_for_day/${dateIsoString}`)

const main = async () => {
  console.log('querying image');

  const dateIsoString = new Date().toISOString().slice(0,10);

  const result = await query(dateIsoString);
  const imageUrl = result.data.artwork.images.print;
  console.log(imageUrl);
  
  const filePath = `/Users/tim/Pictures/Wallpapers/${dateIsoString}.jpg`;
  await download(imageUrl, filePath);
  await wallpaper.set(filePath, {screen: 'all'});
};

main()
.then(() => {})
.catch((e) => {
  console.error('main()', e);
});