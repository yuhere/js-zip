import { UNDEFINED_TYPE, FUNCTION_TYPE } from "../constants.js";
import { random } from "./codecs/sjcl.js";
const GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;
const ERR_INVALID_PASSWORD = "Invalid password";
const ERR_INVALID_SIGNATURE = "Invalid signature";
const ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
function getRandomValues(array) {
  if (GET_RANDOM_VALUES_SUPPORTED) {
    return crypto.getRandomValues(array);
  } else {
    return random.getRandomValues(array);
  }
}
export {
  ERR_ABORT_CHECK_PASSWORD,
  ERR_INVALID_PASSWORD,
  ERR_INVALID_SIGNATURE,
  getRandomValues
};
