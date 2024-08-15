import { init, Sprite, GameLoop } from "kontra";
import { avalanche } from "thirdweb/chains";
// 1. import the extension you want to use
import { getNFTs } from "thirdweb/extensions/erc721";
import { createThirdwebClient, getContract } from "thirdweb";

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

async function boot() {
  console.log("start");
  loop.start(); // start the game

  const client = createThirdwebClient({
    // use `secretKey` for server side or script usage
    clientId: "1208e5a68330be8540c30917e7065d4d",
  });

  // 2. get the contract
  const contract = getContract({
    client,
    address: "0xCf91B99548b1C17dD1095c0680E20de380635e20",
    chain: avalanche,
  });

  // 3. call the extension function
  const chikinz = await getNFTs({
    contract,
    start: 10000,
    count: 3,
  });

  const chikinzEl = document.getElementById("chik");
  const metadata: string[] = [];
  chikinz.forEach((chik: any) => {
    if (chik?.metadata?.attributes?.length > 0) {
      const txt = chik?.metadata?.attributes?.map((attr: any) => attr?.value);
      metadata.push(txt);
      if (chikinzEl) {
        const chikEl = document.createElement("div");
        chikEl.innerText = JSON.stringify(txt);
        chikinzEl.appendChild(chikEl);
      }
    }
  });
}

boot();
