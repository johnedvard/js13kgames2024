import { avalanche } from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc721";
import { createThirdwebClient, getContract, NFT } from "thirdweb";
import { setDefaultStartColor } from "./colorUtils";
import { on } from "kontra";
import { GameEvent } from "./GameEvent";

let levelSelected = false;
export async function initThirdweb() {
  levelSelected = false;
  on(GameEvent.selectLevel, () => {
    levelSelected = true;
    document.getElementById("thirdweb")?.remove();
    document.getElementById("chikin-msg")?.remove();
    console.log("remove all chikins");
  });
  const client = createThirdwebClient({
    // use `secretKey` for server side or script usage
    clientId: "1208e5a68330be8540c30917e7065d4d",
  });

  const contract = getContract({
    client,
    address: "0xCf91B99548b1C17dD1095c0680E20de380635e20",
    chain: avalanche,
  });
  const chikinMsgEl = document.createElement("div");
  chikinMsgEl.id = "chikin-msg";
  chikinMsgEl.style.position = "absolute";
  chikinMsgEl.style.bottom = "31vh";
  chikinMsgEl.style.zIndex = "99";
  chikinMsgEl.style.width = "100vw";
  chikinMsgEl.style.display = "flex";
  chikinMsgEl.style.alignItems = "flex-end";
  chikinMsgEl.style.justifyContent = "center";
  chikinMsgEl.style.color = "white";
  chikinMsgEl.innerHTML = "";

  const divEl = document.createElement("div");
  divEl.id = "thirdweb";
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
  spinner.style.border = "16px solid white";
  spinner.style.borderTop = "16px solid #0D9CA4";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "120px";
  spinner.style.height = "120px";
  spinner.style.animation = "spin 2s linear infinite";

  // Add keyframes for spinner animation
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
    styleSheet.cssRules.length
  );

  const chikns: NFT[] = await getNFTs({
    contract,
    start: Math.floor(Math.random() * 11000),
    count: 3,
  });
  if (levelSelected) return;
  document.body.appendChild(chikinMsgEl);
  divEl.appendChild(spinner);
  document.body.appendChild(divEl);

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
      "random-color",
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
      imgEl.style.border = "2px solid white";
      chikinMsgEl.innerHTML = `I, ${
        chikn.metadata?.name as string
      }, gives you the power of color!`;

      setDefaultStartColor(
        JSON.parse(imgEl.getAttribute("random-color") as string)
      );
    });
    divEl.appendChild(imgEl);
    chikinImgEls.push(imgEl);
  });

  document.body.appendChild(divEl);

  console.log(chikns);
}
