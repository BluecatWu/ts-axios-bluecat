const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
  
}

// export function isObject(val: any): val is Object {
//   return typeof val !== null && typeof val === 'object'
// }

export function isPlanObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extend<T,U>(to:T,from:U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function isFormData(val:any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function deepMerge(...objs:any[]):any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if( isPlanObject(val)){
          if(isPlanObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
}
