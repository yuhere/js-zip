// https://mochajs.org/#configuring-mocha-nodejs

const e = require("./mocha.config");
// workaround for es config file.
module.exports = e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
