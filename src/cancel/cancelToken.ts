import { Canceler, cancelExecutor, CancelTokenSource } from '../types'
import Cancel from './cancel'
interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  
  constructor(executor: cancelExecutor) {
    this.promise = new Promise<Cancel>(resolve => {
      let resolvePromise: ResolvePromise
      
      executor(message => {
        if (this.reason) {
          return
        }
        this.reason = new Cancel(message)
        resolvePromise(this.reason)
      })
    })
  }
  
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }
  
  static source():CancelTokenSource {
    let cancel!:Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
