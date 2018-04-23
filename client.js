const axios = require('axios')

module.exports = class Client {
  constructor (baseURL) {
    this.instance = axios.create({ baseURL })
  }
  async get (identifier = '') {
    return (await this.instance.get(`/${identifier}`)).data
  }
  async save (identifier, data) {
    await this.instance.post(`/${identifier}`, data)
  }
}
