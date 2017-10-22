const _ = require('lodash')
const dotize = require('dotize')
const i18nBackend = require('i18next-node-fs-backend')
const i18next = require('i18next')
const path = require('path')
const Promise = require('bluebird')

/* global wiki */

module.exports = {
  engine: null,
  namespaces: ['common', 'admin', 'auth', 'errors', 'git'],
  init() {
    this.engine = i18next
    this.engine.use(i18nBackend).init({
      load: 'languageOnly',
      ns: this.namespaces,
      defaultNS: 'common',
      saveMissing: false,
      preload: [wiki.config.site.lang],
      lng: wiki.config.site.lang,
      fallbackLng: 'en',
      backend: {
        loadPath: path.join(wiki.SERVERPATH, 'locales/{{lng}}/{{ns}}.json')
      }
    })
    return this
  },
  getByNamespace(locale, namespace) {
    if (this.engine.hasResourceBundle(locale, namespace)) {
      let data = this.engine.getResourceBundle(locale, namespace)
      return _.map(dotize.convert(data), (value, key) => {
        return {
          key,
          value
        }
      })
    } else {
      throw new Error('Invalid locale or namespace')
    }
  },
  loadLocale(locale) {
    return Promise.fromCallback(cb => {
      return this.engine.loadLanguages(locale, cb)
    })
  },
  setCurrentLocale(locale) {
    return Promise.fromCallback(cb => {
      return this.engine.changeLanguage(locale, cb)
    })
  }
}
