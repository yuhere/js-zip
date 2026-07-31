import { UNDEFINED_TYPE, UNDEFINED_VALUE } from "./constants.js";
const MINIMUM_CHUNK_SIZE = 64;
let maxWorkers = 2;
try {
  if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
    maxWorkers = navigator.hardwareConcurrency;
  }
} catch {
}
const DEFAULT_CONFIGURATION = {
  maxWorkers,
  // 
  chunkSize: 64 * 1024
};
const config = Object.assign({}, DEFAULT_CONFIGURATION);
function getConfiguration() {
  return config;
}
function getChunkSize(config2) {
  return Math.max(config2.chunkSize, MINIMUM_CHUNK_SIZE);
}
function configure(configuration) {
  const {
    chunkSize,
    maxWorkers: maxWorkers2
  } = configuration;
  setIfDefined("chunkSize", chunkSize);
  setIfDefined("maxWorkers", maxWorkers2);
}
function setIfDefined(propertyName, propertyValue) {
  if (propertyValue !== UNDEFINED_VALUE) {
    config[propertyName] = propertyValue;
  }
}
export {
  configure,
  getChunkSize,
  getConfiguration
};
