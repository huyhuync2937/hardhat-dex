import Liquidity from "../abis/LiquidityToken.json"
import USD from "../abis/USD.json"
import Token from "../abis/Token.json"
import Pool from "../abis/Pool.json"
import PoolFactory from "../abis/PoolFactory.json"
import Vault from "../abis/Vault.json"

export const getLiquidityAbi = () => Liquidity.abi;
export const getUSDAbi = () => USD.abi;
export const getTokenAbi = () => Token.abi;
export const getPoolAbi = () => Pool.abi;
export const getPoolFactoryAbi = () => PoolFactory.abi;
export const getVaultAbi = () => Vault.abi;