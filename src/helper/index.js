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

  formatNumber (value) {
    return numeral(value / 100).format('0.00') // displaying other groupings/separators is possible, look at the docs
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
