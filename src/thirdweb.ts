import { setDefaultStartColor } from "./colorUtils";
import { on } from "kontra";
import { GameEvent } from "./GameEvent";
import { addBonusLevelBtn, addBonusLevels } from "./main";

let levelSelected = false;

function createWrapper() {
  const divEl = document.createElement("div");
  divEl.id = "w";
  divEl.style.position = "absolute";
  divEl.style.bottom = "13vh";
  divEl.style.zIndex = "99";
  divEl.style.height = "0";
  divEl.style.width = "100vw";
  divEl.style.display = "flex";
  divEl.style.alignItems = "flex-end";
  divEl.style.justifyContent = "space-evenly";
  document.body.appendChild(divEl);
  return divEl;
}
function createSpinner(el: HTMLDivElement) {
  // Create and style spinner element
  const spinner = document.createElement("div");
  spinner.id += "s";
  spinner.style.border = "16px solid #fff";
  spinner.style.borderTop = "16px solid #1aa";
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
  el.appendChild(spinner);
  return spinner;
}
export async function initThirdweb() {
  if (levelSelected) return;
  on(GameEvent.selectLevel, () => {
    levelSelected = true;
    document.getElementById("w")?.remove();
    document.getElementById("c")?.remove();
    document.getElementById("s")?.remove();
  });
  const wrapperEl = createWrapper();
  const spinner = createSpinner(wrapperEl);

  const [ThirdWeb, chains, erc721, storage] = await importThirdwebSDK();

  wrapperEl.removeChild(spinner);
  if (levelSelected) return;

  const client = ThirdWeb.createThirdwebClient({
    // use `secretKey` for server side or script usage
    clientId: "1208e5a68330be8540c30917e7065d4d",
  });

  const files = await fetchBonusLevels(client, storage);
  createBonusLevels(files);
  const contract = ThirdWeb.getContract({
    client,
    address: "0xcA61C32f3912b3882fB488eBF44F8275f41faFf1", // Bubble Burst
    // address: "0xCf91B99548b1C17dD1095c0680E20de380635e20", // chikins
    chain: chains.avalanche,
  });
  createBubbleImages(contract, erc721, wrapperEl);
}

async function fetchBonusLevels(client: any, storage: any) {
  const file1 = storage.download({
    client,
    uri: "ipfs://QmaGn65fZnKw25fqYGNqpzpjsXmnLGUdRPs5cvFEkquNnQ",
  });
  const file2 = storage.download({
    client,
    uri: "ipfs://QmPHsFPjchGU2J66gS9G5uQuPaCPmc8Rx6yzFWTYtyozFB",
  });
  const file3 = storage.download({
    client,
    uri: "ipfs://QmckDTy8fDwUtWxbEHjdMjSmUS7VJV5u9zDF4jQVBfXS9P",
  });
  const file4 = storage.download({
    client,
    uri: "ipfs://QmSmJq4vTHeQvdkWX1qcCQMUJJpxWc5jTTZQRPPimmBAKn",
  });

  return Promise.all([file1, file2, file3, file4]);
}

async function createBonusLevels(files: Promise<any>[]) {
  const jsonProms = files.map((file: any) => fetch(file.url));

  await Promise.all(jsonProms)
    .then((response) => Promise.all(response.map((res) => res.json())))
    .then((data) => {
      // Note, need to have at least 2 bonus levels, and also need to have the level data array to be even (2,4,6, etc)
      addBonusLevels(data);
      addBonusLevelBtn();
    });
}

async function createBubbleImages(
  contract: any,
  erc721: any,
  wrapperEl: HTMLElement
) {
  const bubbleMsgEl = document.createElement("div");
  bubbleMsgEl.id = "c";
  bubbleMsgEl.style.position = "absolute";
  bubbleMsgEl.style.bottom = "10vh";
  bubbleMsgEl.style.zIndex = "9";
  bubbleMsgEl.style.width = "100vw";
  bubbleMsgEl.style.display = "flex";
  bubbleMsgEl.style.alignItems = "flex-end";
  bubbleMsgEl.style.justifyContent = "center";
  bubbleMsgEl.style.color = "#fff";
  bubbleMsgEl.innerHTML = "";

  const bubbleNFTs: any[] = await erc721.getNFTs({
    contract,
    start: 0,
    count: 3,
  });
  if (levelSelected) return;
  document.body.appendChild(bubbleMsgEl);

  const bubbleImgEls: HTMLImageElement[] = [];

  bubbleNFTs.forEach((nft) => {
    const imgEl = document.createElement("img");
    imgEl.src = nft?.metadata?.image as string;
    imgEl.width = 1000;
    imgEl.height = 1000;
    imgEl.style.width = "10vw";
    imgEl.style.height = "auto";
    imgEl.style.borderRadius = "50%";
    imgEl.style.animation = "spin 5s linear infinite";
    const powerColor = JSON.stringify({
      r: nft.metadata?.attributes[0].value,
      g: nft.metadata?.attributes[1].value,
      b: nft.metadata?.attributes[2].value,
    });
    imgEl.setAttribute("r", powerColor);

    // Add click listener to log metadata
    imgEl.addEventListener("click", () => {
      for (let i = 0; i < bubbleImgEls.length; i++) {
        const bubbleImgEl: HTMLImageElement = bubbleImgEls[i];
        bubbleImgEl.style.border = "none";
      }
      imgEl.style.border = "2px solid #fff";
      bubbleMsgEl.innerHTML = `I, ${nft.metadata?.name as string}, give you ${
        nft.metadata?.description
      }`;
      setDefaultStartColor(JSON.parse(imgEl.getAttribute("r") as string));
    });
    wrapperEl.appendChild(imgEl);
    bubbleImgEls.push(imgEl);
  });
}

function importThirdwebSDK() {
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
  const storageProm = import(
    // @ts-ignore
    /* @vite-ignore */ new URL("https://esm.sh/thirdweb@5.50.0/storage")
  );

  return Promise.all([ThirdWebProm, chainsProm, erc721Prom, storageProm]);
}
