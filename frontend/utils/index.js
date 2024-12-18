export const shortenAddress = (address) => {
    return address == undefined ? "":`${address?.slice(0, 6)}....${address?.slice(address.length - 4)}`;
}
export const parseErrorMsg = (e) => {
    const json = JSON.parse(JSON.stringify(e));
    return json.reason || json?.erros?.message;
}