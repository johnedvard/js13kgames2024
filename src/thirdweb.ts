import { avalanche } from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc721";
import { createThirdwebClient, getContract } from "thirdweb";

export async function initThirdweb() {
  const client = createThirdwebClient({
    // use `secretKey` for server side or script usage
    clientId: "1208e5a68330be8540c30917e7065d4d",
  });

  const contract = getContract({
    client,
    address: "0xCf91B99548b1C17dD1095c0680E20de380635e20",
    chain: avalanche,
  });

  const chikinz = await getNFTs({
    contract,
    start: 10000,
    count: 3,
  });

  const metadata: string[] = [];
  chikinz.forEach((chik: any) => {
    if (chik?.metadata?.attributes?.length > 0) {
      const txt = chik?.metadata?.attributes?.map((attr: any) => attr?.value);
      metadata.push(txt);
    }
  });
}
