// import { avalanche } from "thirdweb/chains";
// import { getNFTs } from "thirdweb/extensions/erc721";
// import { createThirdwebClient, getContract } from "thirdweb";
import { setDefaultStartColor } from "./colorUtils";
import { on } from "kontra";
import { GameEvent } from "./GameEvent";

let levelSelected = false;
export async function initThirdweb() {
  const divEl = document.createElement("div");
  divEl.id = "w";
  divEl.style.position = "absolute";
  divEl.style.bottom = "20vh";
  divEl.style.zIndex = "99";
  divEl.style.height = "0px";
  divEl.style.width = "100vw";
  divEl.style.display = "flex";
  divEl.style.alignItems = "flex-end";
  divEl.style.justifyContent = "space-evenly";

  // Create and style spinner element
  const spinner = document.createElement("div");
  spinner.style.border = "16px solid #fff";
  spinner.style.borderTop = "16px solid #1aa";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "120px";
  spinner.style.height = "120px";
  spinner.style.transform = "rotate(0deg)";
  spinner.style.transition = "transform 2s linear";
  setTimeout(() => {
    spinner.style.transform = "rotate(360deg)";
  }, 0);
  divEl.appendChild(spinner);
  document.body.appendChild(divEl);

  const ThirdWebProm = import(
    // @ts-ignore
    /* @vite-ignore */ new URL("https://esm.sh/thirdweb@5.50.0")
  );

  const chainsProm = import(
    // @ts-ignore
    /* @vite-ignore */ new URL("https://esm.sh/thirdweb@5.50.0/chains")
  );
  const erc721Prom = import(
    // @ts-ignore
    /* @vite-ignore */ new URL(
      "https://esm.sh/thirdweb@5.50.0/extensions/erc721"
    )
  );

  const [ThirdWeb, chains, erc721] = await Promise.all([
    ThirdWebProm,
    chainsProm,
    erc721Prom,
  ]);

  levelSelected = false;
  on(GameEvent.selectLevel, () => {
    levelSelected = true;
    document.getElementById("w")?.remove();
    document.getElementById("c")?.remove();
  });
  const client = ThirdWeb.createThirdwebClient({
    // use `secretKey` for server side or script usage
    clientId: "1208e5a68330be8540c30917e7065d4d",
  });

  const contract = ThirdWeb.getContract({
    client,
    address: "0xCf91B99548b1C17dD1095c0680E20de380635e20",
    chain: chains.avalanche,
  });
  const chikinMsgEl = document.createElement("div");
  chikinMsgEl.id = "c";
  chikinMsgEl.style.position = "absolute";
  chikinMsgEl.style.bottom = "11vh";
  chikinMsgEl.style.zIndex = "99";
  chikinMsgEl.style.width = "100vw";
  chikinMsgEl.style.display = "flex";
  chikinMsgEl.style.alignItems = "flex-end";
  chikinMsgEl.style.justifyContent = "center";
  chikinMsgEl.style.color = "white";
  chikinMsgEl.innerHTML = "";

  const chikns: any[] = await erc721.getNFTs({
    contract,
    start: Math.floor(Math.random() * 11000),
    count: 3,
  });
  if (levelSelected) return;
  document.body.appendChild(chikinMsgEl);

  const chikinImgEls: HTMLImageElement[] = [];

  divEl.removeChild(spinner);

  chikns.forEach((chikn) => {
    const imgEl = document.createElement("img");
    imgEl.src = chikn?.metadata?.image as string;
    imgEl.width = 1000;
    imgEl.height = 1000;
    imgEl.style.width = "10vw";
    imgEl.style.height = "auto";
    imgEl.setAttribute(
      "r",
      JSON.stringify({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      })
    );

    // Add click listener to log metadata
    imgEl.addEventListener("click", () => {
      console.log(chikn.metadata);
      for (let i = 0; i < chikinImgEls.length; i++) {
        const chikinImgEl: HTMLImageElement = chikinImgEls[i];
        chikinImgEl.style.border = "none";
      }
      imgEl.style.border = "2px solid #fff";
      chikinMsgEl.innerHTML = `I, ${
        chikn.metadata?.name as string
      }, give you the power of color!`;
      setDefaultStartColor(JSON.parse(imgEl.getAttribute("r") as string));
    });
    divEl.appendChild(imgEl);
    chikinImgEls.push(imgEl);
  });

  document.body.appendChild(divEl);
}
