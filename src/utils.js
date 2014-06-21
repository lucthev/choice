'use strict';

exports.toArray = function (val) {
  return Array.prototype.slice.call(val)
}

exports.isText = function (node) {
  return node && node.nodeType === Node.TEXT_NODE
}

var isElem = exports.isElem = function (node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

// NOTE: these represent 'visual' blocks, not necessarily block elements.
var blocks = ['address', 'aside', 'blockquote', 'figure', 'figcaption',
      'footer', 'h[1-6]', 'header', 'li', 'p', 'pre'],
    blockRegex = new RegExp('^(' + blocks.join('|') + ')$', 'i')

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
