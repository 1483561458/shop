import { trim, isType } from "@/utils";

const doc = null;
// const doc = window.document;

function get(key) {
  if (!key || !_has(key)) {
    return null;
  }
  return uni.getStorageSync(key)
}

function all() {
  return uni.getStorageInfoSync()
}

function set(key, data, time) {
  if (!key) {
    return;
  }
  uni.setStorageSync(key, data)
}

function remove(key) {
  if (!key || !_has(key)) {
    return;
  }
  uni.removeStorageSync(key)
}

function clearAll() {
  uni.clearStorage()
}

function _has(key) {
  if (!key) {
    return
  }
  let value = uni.getStorageSync(key)
  if (value) {
    return true
  }
  return false
}

export default {
  get,
  all,
  set,
  remove,
  clearAll,
  has: _has
};
