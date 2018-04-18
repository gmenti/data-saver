const axios = require('axios')

module.exports = class Client {
  constructor (baseURL) {
    this.instance = axios.create({ baseURL })
  }
  async all () {
    return (await this.instance.get('/')).data
  }
  async save (data) {
    await this.instance.post('/', data)
  }
}
