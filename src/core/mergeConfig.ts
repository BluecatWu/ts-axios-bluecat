import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlanObject } from '../helpers/utils'

const strats = Object.create(null)
// 策略1  默认val2 没有val2 取 val1
function defaultStart(val1: any, val2: any):any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
// 策略2  只取val2
function fromVal2Start(val1: any, val2: any):any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
// 策略3 复杂对象

function deepMergeStrat(val1:any, val2: any): any {
  if(isPlanObject(val2)) {
    return deepMerge(val2, val2)
  } else if(typeof val2 !== 'undefined') {
    return val2
  } else if (isPlanObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}


const startKeysFromVal2 = ['url','params','data']

startKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Start
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach( key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig (config1: AxiosRequestConfig, config2?: AxiosRequestConfig) : AxiosRequestConfig{
  if(!config2) {
    config2 = {}
  }
  
  const config = Object.create(null)
  
  for(let key in config2) {
    mergeField(key)
  }
  
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  // 策略模式
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStart
    config[key] = strat(config1[key], config2![key])
  }
  
  return config
}
