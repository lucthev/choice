export function toArray (val) {
  return [].slice.call(val)
}

export function isText (node) {
  return node && node.nodeType === window.Node.TEXT_NODE
}

export function isElem (node) {
  return node && node.nodeType === window.Node.ELEMENT_NODE
}
