'use strict';

/**
 * isNum(...) determines if all of its arguments are numbers.
 *
 * @param {* [, ... ]}
 * @return {Boolean}
 */
exports.isNum = function () {
  var allNums = true,
      i

  for (i = 0; i < arguments.length; i += 1)
    allNums = allNums && typeof arguments[i] === 'number'

  return allNums
}

/**
 * isArray(...) determines if all of its arguments are arrays.
 *
 * @param {* [, ... ]}
 * @return {Boolean}
 */
exports.isArray = function () {
  var allArray = true,
      i

  for (i = 0; i < arguments.length; i += 1)
    allArray = allArray && Array.isArray(arguments[i])

  return allArray
}

exports.toArray = function (val) {
  return Array.prototype.slice.call(val)
}

exports.isText = function (node) {
  return node && node.nodeType === Node.TEXT_NODE
}

exports.isElem = function (node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}
