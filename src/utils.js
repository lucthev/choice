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

var toArray = exports.toArray = function (val) {
  return Array.prototype.slice.call(val)
}

exports.isText = function (node) {
  return node && node.nodeType === Node.TEXT_NODE
}

exports.isElem = function (node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

/**
 * getLiChild(elem, index) is kind of like elem.childNodes,
 * expect that <ol>/<ul>s are replaced with their children.
 *
 * @param {Element} elem
 * @return {Array}
 */
exports.flattenLists = function (elem) {
  var children = toArray(elem.childNodes),
      listItems,
      child,
      i

  for (i = 0; i < children.length; i += 1) {
    child = children[i]

    if (/^[OU]L$/.test(child.nodeName)) {
      listItems = toArray(child.childNodes)
      listItems.unshift(i, 1)

      i += listItems.length - 3

      children.splice.apply(children, listItems)
    }
  }

  return children
}

/**
 * listIndex(elem, index) is like elem.childNodes[i], but using
 * flattenLists.
 *
 * @param {Element} elem
 * @param {Int} index
 * @return {Element}
 */
exports.listIndex = function (elem, index) {
  var children = exports.flattenLists(elem)

  if (index < 0 || index >= children.length)
    throw new Error('Invalid index given to utils#listIndex')

  return children[index]
}
