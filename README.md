## Need Find Tribbles

This is a js13k games entry for the 2021 Decentralized category.

**It includes:**

Image Storage both in AWS & on [nft.storage](nft.storage)
- https://github.com/js13kGames/Need-Find-Tribbles/blob/main/pre-mint-transfers/index.js

Bulk minting of NFTs after generating NEAR CLI commands
- https://github.com/js13kGames/Need-Find-Tribbles/blob/main/pre-mint-transfers/mint-nfts.js

Smart Contract for the NEAR Blockchain
- https://github.com/BenjaminWFox/need-find-tribbles-js13k2021/blob/main/near-protocol/nft/src/lib.rs

Front-end Game Files
- https://github.com/js13kGames/Need-Find-Tribbles/tree/main/src

## Webpack Base for js13kGames

### Getting started

`git clone https://github.com/BenjaminWFox/js13k-webpack-starter-2020.git`

`cd js13k-webpack-starter-2020`

`npm install`

`npm run develop`

http://localhost:8080/

### Scripts

- `develop`: Starts the webpack dev server on http://localhost:8080/
- `build`: Creates a compact, minified build in `/dist`
- `lint`: Runs eslint to check for errors. Better to set this up in your IDE to check automatically on save.

### Boilerplate

There are some files & code included as examples of function & syntax that are not meant to be included in the final bundle. You can basically remove everything from the files listed below, but the largest chunks are: 

- `index.js` - the `.scss` and `.png` import
- `main.scss` - the `.png` `background-image`
- `index.html` - the `<img>` tag
- These 3 images are in `assets/images/sprites` and can also be deleted

### js13k specific files

None of these files are included in your final bundle.

- `manifest.json` - The metadata file used when submitting your final game
- `image_large.png` - The large image that shows on the game detail page
- `image_thumbnail.png` - The thumbnail preview image that shows on the games gallery page
