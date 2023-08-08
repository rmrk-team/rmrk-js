export const chainNameMapping: Record<string, string> = {
  eth: "homestead",
  moonbeam: "moonbeam",
  polygon: "matic",
  "eth-sepolia": "sepolia",
  "moonbase-alpha": "moonbase-alpha",
  "polygon-mumbai": "maticmum",
}

export const RMRKRenderUtilsAddressMapping: Record<string, `0x${string}`> = {
  eth: "0x8AB00B66F80A9bBE45503ae2a387E6049063C97e",
  moonbeam: "0xa86453b5c7fbd3b5206abfb8f4e27a996d4999b3",
  polygon: "0xc02e411A71da33d1E5767dF87E2a4c263e35a8ef",
  "eth-sepolia": "0x8f9d442d4AD80a506fD623C2FF1Fc5173C4A10Aa",
  "moonbase-alpha": "0x29dC0CAd59fe3403aeD0E377C4bc181f12240710",
  "polygon-mumbai": "0xe20A4EEe684eEc517bE688b19F320D0DF7b02293",
}

export function isIpfs(link: string) {
  return link.startsWith("ipfs://")
}

export function getCIDFromIpfsLink(link: string) {
  return link.replace(/ipfs:\/\/(ipfs\/)?/, "")
}

/**
 * @desc refer https://docs.ipfs.tech/concepts/ipfs-gateway/#subdomain
 */
export function getLinkWithGateway(
  cidAndPath: string,
  gateway: string = "ipfs.io",
  isSubdomain: boolean = false
) {
  let cid, path
  const firstSeperatorIdx = cidAndPath.indexOf("/")
  cid = cidAndPath.slice(0, firstSeperatorIdx)
  path = firstSeperatorIdx > -1 ? cidAndPath.slice(firstSeperatorIdx) : ""

  return isSubdomain
    ? `https://${cid}.ipfs.${gateway}${path}`
    : `https://${gateway}/ipfs/${cidAndPath}`
}

export function convertIpfs(ipfsLike: string, gateway?: string) {
  return isIpfs(ipfsLike)
    ? getLinkWithGateway(getCIDFromIpfsLink(ipfsLike), gateway)
    : ipfsLike
}
