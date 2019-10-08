import { Canceler, cancelExecutor, CancelTokenSource } from '../types'

interface ResolvePromise {
  (reason?: string): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: string
  
  constructor(executor: cancelExecutor) {
    this.promise = new Promise<string>(resolve => {
      let resolvePromise: ResolvePromise
      
      this.promise = new Promise<string>(resolve => {
        resolvePromise = resolve
      })
      
      executor(message => {
        if (this.reason) {
          return
        }
        this.reason = message
        resolvePromise(this.reason)
      })
    })
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
