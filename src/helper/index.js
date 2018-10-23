import moment from 'moment'
import numeral from 'numeral'

export * from './constants'

export const Utils = {
  isEmpty (val) {
    if (val === null || val === void (0) || val === '') {
      return true
    } else {
      return false
    }
  },

  toLocalTimeString (str) {
    return moment(str).calendar(null, {
      lastDay: '[Yesterday,] LT',
      sameDay: '[Today,] LT',
      nextDay: '[Tomorrow,] LT',
      lastWeek: '[Last] dddd[,] LT',
      nextWeek: 'dddd[,] LT',
      sameElse: 'L'
    })
  },

  parseJSON (str) {
    let val
    try {
      val = JSON.parse(str)
    } catch (e) {
      val = {}
    }
    return val
  },

  getFilenameWithExtension (filename) {
    const allowedExtensions = /(\.mp3|\.mpa|\.wav)$/i
    if (allowedExtensions.exec(filename)) {
      return filename
    } else {
      return filename + '.mp3'
    }
  },

  downloadFile (url, name = '') {
    var a = document.createElement('A')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export const Log = {
  put () {
    if (process.env.NODE_ENV !== 'production') {
      console.log.apply(console, arguments)
    }
  }
}

export const Storage = {
  set (key, value) {
    localStorage.setItem(key, value)
  },

  get (key) {
    return localStorage.getItem(key) || null
  },

  remove (key) {
    localStorage.removeItem(key)
  },

  removeAll () {
    localStorage.clear()
  }
}

export const Filter = {
  formatDate (value) {
    if (value) {
      return moment(String(value)).format('MMM DD, YYYY')
    }
  },

  formatDateFromNow (value) {
    if (value) {
      moment.lang('en')
      return moment(String(value)).fromNow()
    }
  },

  // #TODO rename it formatDecimal
  formatNumber (value) {
    return numeral(value / 100).format('0.00') // displaying other groupings/separators is possible, look at the docs
  },

  formatNumberWithComma (value) {
    return numeral(value).format('0,0')
  },

  // #REF https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
  formatLargeNumber: num => {
    if (num === null || num === undefined || num === 0) { return '0' } // terminate early
    const fixed = 0 // number of decimal places to show
    let b = (num).toPrecision(2).split('e') // get power
    let k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3) // floor at decimals, ceiling at trillions
    let c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed) // divide by power
    let d = c < 0 ? c : Math.abs(c) // enforce -0 is 0
    let e = d + ['', 'K', 'M', 'B', 'T'][k] // append power
    return e
  },

  formatFullUrl (value) {
    if (/http(s?):\/\//gi.test(value)) {
      return value
    } else {
      return `http://${value}`
    }
  },

  timeInHours (value) {
    let hours = parseInt(Math.floor(value / 3600))
    let minutes = parseInt(Math.floor((value - (hours * 3600)) / 60))
    let seconds = parseInt((value - ((hours * 3600) + (minutes * 60))) % 60)

    let dHours = (hours > 9 ? hours : '0' + hours)
    let dMins = (minutes > 9 ? minutes : '0' + minutes)
    let dSecs = (seconds > 9 ? seconds : '0' + seconds)

    return hours === 0 ? `${dMins}:${dSecs}` : `${dHours}:${dMins}:${dSecs}`
  },

  capitalize (value) {
    if (!value) return ''
    value = value.toString().toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },

  titleize (value) {
    let stringArr = value.split(' ')
    stringArr = stringArr.map(function (str) {
      return Filter.capitalize(str)
    })
    return stringArr.join(' ')
  }
}

export const CollaboratorRoleTypes = [
  'Additional Production',
  'Album Artwork',
  'Arranger',
  'Choreography',
  'Composer',
  'Creative Direction',
  'Engineer',
  'Executive Producer',
  'Mastering',
  'Musician - Bass',
  'Musician - Brass',
  'Musician - Drums',
  'Musician - Electronics',
  'Musician - Guitar',
  'Musician - Keys',
  'Musician - Orchestral',
  'Musician - Percussion',
  'Musician - Strings',
  'Musician - Vocals',
  'Producer',
  'Remixer',
  'Stylist',
  'Video DP',
  'Video Director',
  'Video Producer',
  'Vocalist',
  'Writer'
]

export const CollaboratorProfitShareTypes = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95
]
