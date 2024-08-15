import { init, Sprite, GameLoop } from "kontra";
import { avalanche } from "thirdweb/chains";
// 1. import the extension you want to use
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { createThirdwebClient, getContract } from "thirdweb";

const client = createThirdwebClient({
  // use `secretKey` for server side or script usage
  clientId: "1208e5a68330be8540c30917e7065d4d",
});

let { canvas } = init();

let sprite = Sprite({
  x: 100, // starting x,y position of the sprite
  y: 80,
  color: "red", // fill color of the sprite rectangle
  width: 20, // width and height of the sprite rectangle
  height: 40,
  dx: 2, // move the sprite 2px to the right every frame
});

let loop = GameLoop({
  // create the main game loop
  update: function () {
    // update the game state
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width;
    }
  },
  render: function () {
    // render the game state
    sprite.render();
  },
});

console.log("start");
loop.start(); // start the game

// 2. get the contract
const contract = getContract({
  client,
  address: "0xCE4Fee23Ab35D0d9A4b6b644881dDD8aDEBeb300",
  chain: avalanche,
});

// 3. call the extension function
const ownedNFTs = await getOwnedNFTs({
  contract,
  owner: "0xdB808bF85Aab6E8e66b94B816b54DB1B071A650f",
});

console.log(ownedNFTs);
