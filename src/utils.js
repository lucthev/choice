import blockElements from 'block-elements'

export function toArray (val) {
  return [].slice.call(val)
}

export function isText (node) {
  return node && node.nodeType === window.Node.TEXT_NODE
}

export function isElem (node) {
  return node && node.nodeType === window.Node.ELEMENT_NODE
}

let blocks = { LI: true }
blockElements.forEach(function (name) {
  blocks[name.toUpperCase()] = true
})

/**
 * isBlock(elem) determines if an element is a visual block.
 *
 * @param {Node} elem
 * @return {Boolean}
 */
export function isBlock (node) {
  return node && blocks[node.nodeName]
}
