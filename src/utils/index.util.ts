import { useAppStore } from "../store/index.store";

const API_KEY = '85c07831-a242-4ace-8494-17720aa97736';
// const API_URL = `${import.meta.env.VITE_API_URL}/proxy`;
// const API_URL = "http://proxy.soouu.com/"
const API_URL = "http://localhost:3000/api/proxy"

const REAL_API_URL  = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"

/**
 * @description 获取代币价格
 * @param tokens 
 * @returns
 */
export async function fetchTokensPrice(tokens:string[] = []) {
  const res:Record<string,number> = {
    'BSC-USD':1
  }
  const params = new URLSearchParams({
    symbol: tokens.join(','),
    convert: 'USDT',
  })
  const reqURl = `${REAL_API_URL}?${params.toString()}`;
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-proxy-target':reqURl,
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      },
    }); 
    const data = await response.json();
    if (data.status.error_code === 0) {
      tokens.forEach((item) => {
        const price = data.data[item]?.quote?.USDT.price as number || 0;
        if(!res[item]) {
          res[item] = price
        }
      })
    } else {
      console.error('API 错误:', data.status);
    }
  } catch (err) {
    console.error('请求失败:', err);
  }
  console.log('----------【res】', res);
  const appStore = useAppStore()
  appStore.setPriceMap(res)
}


/**
 * 计算交易量 usdt
 * @param transactions  
 * @param priceMap
 * @returns 
 */
export const getAmountByTransactions = (transactions: any[]) => {
  const { washTradeSwitch,priceMap } = useAppStore()
  if(!washTradeSwitch) {
    return transactions.reduce((acc, item) => {
      const all = item.tokens?.['BSC-USD']?.outflow || 0
      return acc + all
    }, 0) * 2
  }
  return transactions.reduce((acc, item) => {
    Object.entries(item.tokens).forEach(([key, value]:[key:string,value:any]) => {
      if(key === 'BSC-USD') return
      const price = priceMap[key] || 0
      const outflow = value?.inflow || 0 
      const amount = outflow * price
      acc += amount
    })
    return acc
  }, 0) * 2
}
