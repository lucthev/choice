'use strict';

function isText (node) {
  return node && node.nodeType === Node.TEXT_NODE
}

function isElem (node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

function textBefore (root, node) {
  var length = 0

  while (node && node !== root) {

    if (!node.previousSibling) {
      node = node.parentNode
      continue
    }

    node = node.previousSibling

    while (isElem(node) && node.lastChild) {
      node = node.lastChild
    }

    if (isText(node))
      length += node.data.length
    else if (node.nodeName === 'BR') {
      // <br>s count as a newline character.

      length += 1
    }
  }

  return length
}

function encodePosition (root, node, offset) {
  var children = Array.prototype.slice.call(root.childNodes),
      child = node,
      textIndex,
      childIndex

  while (child.parentNode && child.parentNode !== root)
    child = child.parentNode

  childIndex = children.indexOf(child)

  // If the selection is not in the root's tree, do nothing.
  if (childIndex < 0) return false

  while (node) {
    if (isText(node) || node.nodeName === 'BR')
      break
    else if (offset < node.childNodes.length) {
      node = node.childNodes[offset]
      offset = 0
    } else if (!node.childNodes.length) {
      offset = 0
      break
    } else {
      node = node.lastChild

      if (isText(node))
        offset = node.data.length
      else if (node.nodeName === 'BR')
        offset = 1
      else
        offset = node.childNodes.length
    }
  }

  textIndex = textBefore(child, node) + offset

  return [childIndex, textIndex]
}

module.exports = encodePosition
