class VueCache {
  constructor(id, options) {
    this._cache = JSON.parse(localStorage.getItem(id) || '{}')
    this.id = id
    this.expiration = 300 // seconds
    if (options.expiration) {
      this.expiration = options.expiration
    }
  }

  get(key) {
    if (this._cache[key] && this._cache[key].val) {
      let currTime = new Date().getTime() / 1000
      if (currTime - this._cache[key].time < 0) {
        self.del(key)
        return null
      }
      return this._cache[key].val
    } else {
      return null
    }
  }

  set(key, val) {
    this._cache[key] = {
      time: new Date().getTime() / 1000,
      val: val,
    }
    this.save()
  }

  del(key) {
    this._cache[key].val = null
    this._cache[key].time = null
  }

  save() {
    // save into localstorage
    localStorage.setItem(this.id, JSON.stringify(this._cache))
  }
}
export default VueCache
