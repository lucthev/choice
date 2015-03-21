'use strict'

var blocks = require('block-elements').map(function (block) {
  return block.toUpperCase()
})

if (blocks.indexOf('LI') < 0) {
  blocks.push('LI')
}

exports.toArray = function (val) {
  return [].slice.call(val)
}

exports.isText = function (node) {
  return node && node.nodeType === window.Node.TEXT_NODE
}

var isElem = exports.isElem = function (node) {
  return node && node.nodeType === window.Node.ELEMENT_NODE
}

var blockRegex = new RegExp('^(' + blocks.join('|') + ')$')

/**
 * isBlock(elem) determines if an element is a visual block according
 * to the above RegExp.
 *
 * @param {Node} elem
 * @return {Boolean}
 */
exports.isBlock = function (elem) {
  return isElem(elem) && blockRegex.test(elem.nodeName)
}
