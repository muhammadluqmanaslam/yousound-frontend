import moment from 'moment'
import numeral from 'numeral'

export * from './constants'

export const Utils = {
  isEmpty(val) {
    if (val === null || val === void 0 || val === '') {
      return true
    } else {
      return false
    }
  },

  toLocalTimeString(str) {
    return moment(str).calendar(null, {
      lastDay: '[Yesterday,] LT',
      sameDay: '[Today,] LT',
      nextDay: '[Tomorrow,] LT',
      // lastWeek: '[Last] dddd[,] LT',
      // nextWeek: 'dddd[,] LT',
      lastWeek: 'LLLL',
      nextWeek: 'LLLL',
      sameElse: 'LLLL',
    })
  },

  parseJSON(str) {
    let val
    try {
      val = JSON.parse(str)
    } catch (e) {
      val = {}
    }
    return val
  },

  getFilenameWithExtension(filename) {
    const allowedExtensions = /(\.mp3|\.mpa|\.wav)$/i
    if (allowedExtensions.exec(filename)) {
      return filename
    } else {
      return filename + '.mp3'
    }
  },

  downloadFile(url, name = '') {
    var a = document.createElement('A')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  },
}

export const Log = {
  put() {
    if (process.env.NODE_ENV !== 'production') {
      console.log.apply(console, arguments)
    }
  },
}

export const Storage = {
  set(key, value) {
    localStorage.setItem(key, value)
  },

  get(key) {
    return localStorage.getItem(key) || null
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  removeAll() {
    localStorage.clear()
  },
}

export const Filter = {
  formatSlashedDate(value) {
    if (value) {
      return moment(value).format('DD/MM/YYYY')
    }
  },

  formatDate(value) {
    if (value) {
      return moment(String(value)).format('MMM DD, YYYY')
    }
  },

  formatDateFromNow(value) {
    if (value) {
      moment.locale('en')
      return moment(String(value)).fromNow()
    }
  },

  formatDateFromNowShort(value) {
    if (value) {
      moment.locale('en')
      const ago = moment(String(value)).fromNow(true)
      const splitAgo = ago.split(' ')

      return `${splitAgo[0]}${splitAgo[1][0]}`
    }
  },

  // #TODO rename it formatDecimal
  formatNumber(value) {
    return numeral(value / 100).format('0,0.00') // displaying other groupings/separators is possible, look at the docs
  },

  formatNumberWithComma(value) {
    return numeral(value).format('0,0')
  },

  // #REF https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
  formatLargeNumber: (num) => {
    if (num === null || num === undefined || num === 0) {
      return '0'
    } // terminate early
    const fixed = 0 // number of decimal places to show
    let b = num.toPrecision(2).split('e') // get power
    let k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3) // floor at decimals, ceiling at trillions
    let c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed) // divide by power
    let d = c < 0 ? c : Math.abs(c) // enforce -0 is 0
    let e = d + ['', 'K', 'M', 'B', 'T'][k] // append power
    return e
  },

  formatFullUrl(value) {
    if (/http(s?):\/\//gi.test(value)) {
      return value
    } else {
      return `http://${value}`
    }
  },

  getTime(value) {
    return moment(String(value)).format('hh:mm A')
  },
  timeInHours(value) {
    let hours = parseInt(Math.floor(value / 3600))
    let minutes = parseInt(Math.floor((value - hours * 3600) / 60))
    let seconds = parseInt((value - (hours * 3600 + minutes * 60)) % 60)

    let dHours = hours > 9 ? hours : '0' + hours
    let dMins = minutes > 9 ? minutes : '0' + minutes
    let dSecs = seconds > 9 ? seconds : '0' + seconds

    return hours === 0 ? `${dMins}:${dSecs}` : `${dHours}:${dMins}:${dSecs}`
  },

  timeInMinutes(value) {
    const minutes = Math.floor(value / 60) || 0
    const seconds = value - minutes * 60 || 0

    const dMins = minutes.toString()
    const dSecs = seconds > 9 ? seconds : '0' + seconds

    return `${dMins}:${dSecs}`
  },

  capitalize(value) {
    if (!value) return ''
    value = value.toString().toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },

  truncateInMiddle(str, len) {
    console.log('truncateInMiddle', str, len)
    if (str.length > len) {
      return (
        str.substr(0, len - 5) + '...' + str.substr(str.length - 5, str.length)
      )
    } else {
      return str
    }
  },

  titleize(value) {
    let stringArr = value.split(' ')
    stringArr = stringArr.map(function (str) {
      return Filter.capitalize(str)
    })
    return stringArr.join(' ')
  },

  pluralize(value, len = 0) {
    if (!len) return value
    let str = len > 1 ? `${value}s` : value
    return str || ''
  },
}

export const Stripe = {
  calculateFee: (amount) => {
    return amount > 50
      ? Math.round(((amount + 30) / 0.971 - amount) * 100) / 100
      : 0
  },
  calculateSubFee: (amount) => {
    let fee = (parseFloat(amount) * (2.9 / 100));
    return fee
  },
}
