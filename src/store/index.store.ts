import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state:() => ({
    priceMap: {},
    washTradeSwitch:false
  }),
  actions:{
    setPriceMap(map:Record<string,number>) {
      this.priceMap = map
    },
    setWashTradeSwitch(value:boolean) {
      this.washTradeSwitch = value
    }
  },
  persist: {
    storage: window.sessionStorage, // 默认是 localStorage
    pick: ['washTradeSwitch'],        // 只持久化特定字段
  }
})