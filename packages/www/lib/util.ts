export function addressIsAdmin(address: string) {
  const adminAccounts = ['0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0', '0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54']
  return adminAccounts.includes(address)
}

export function getServer() {
  const domain = window.location.href.split('/').slice(0, 3).join('/')
  return domain
}
