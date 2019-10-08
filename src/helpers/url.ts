import { isDate , isPlanObject} from './utils'

interface URLOrigin {
  protocol:string
  host:string
}

function encode(val:string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2c/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5b/ig, '[')
    .replace(/%5d/ig, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  
  Object.keys(params).forEach((key) => {
    const val = params[key]
    if(val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    if(Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlanObject(val)){
        val = val.stringify(val)
      }
      parts.push(`${encode(key)} = ${encode(val)}`)
    })
  })
  
  let serializedParams = parts.join('&')
  
  if(serializedParams) {
    // 处理hash
    const markIndex = url.indexOf('#')
    if(markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
  url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol) && (parsedOrigin.host === currentOrigin.protocol)
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)
function resolveURL(url:string):URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host} = urlParsingNode
  return {
    protocol,
    host
  }
}
