/*eslint-env jasmine */
'use strict'

describe('Choice#getSelection', function () {
  var Selection = window.Choice.Selection
  var placeCursor = window.placeCursor
  var choice
  var elem

  beforeEach(setup)
  afterEach(teardown)

  it('should detect when the selection is collapsed', function () {
    placeCursor(elem, '<p>Photo|graph</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 5]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('collapsed selection (2)', function () {
    placeCursor(elem, '<p>|Things</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 0]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('collapsed selection (3)', function () {
    placeCursor(elem, '<p>Things</p><h2>Words|</h2>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 5]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('collapsed selection (4)', function () {
    placeCursor(elem, '<p>One <span></span>two |three</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 8]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('collapsed selection (5)', function () {
    placeCursor(elem, '<p>One <span></span>two |three</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 8]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('collapsed selection (6)', function () {
    placeCursor(elem, '<h1>Title</h1><p>Once <strong>upon| a</strong> time')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 9]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should treat <br>s as newlines (collapsed selection)', function () {
    placeCursor(elem, '<p>Birds in<br>|the sky</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 9]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('<br>s, collapsed selection (2)', function () {
    placeCursor(elem, '<p>Birds in|<br>the sky</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 8]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('<br>s, collapsed selection (3)', function () {
    placeCursor(elem,
      '<h1>A title</h1>' +
      '<h2>A subtitle</h2>' +
      '<p><em>Birds</em> in<br>the<span></span> sky|</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([2, 16]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should return the start and end points when selection is not collapsed', function () {
    placeCursor(elem, '<p>|One</p><p>Two|</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 0], [1, 3]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(false)
  })

  it('not collapsed (2)', function () {
    // Make the same selection, but backwards.
    placeCursor(elem, '<p>|One</p><p>Two|</p>', true)

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 3], [0, 0]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  it('not collapsed (3)', function () {
    placeCursor(elem, '<h2>A ti|tle</h2><p>Ho<br>|hum</p>', true)

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 3], [0, 4]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  it('not collapsed (4)', function () {
    placeCursor(elem, '<h1>Things</h1><p>Words|<br>|Stuff</p><p>More</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 5], [1, 6]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(false)

    placeCursor(elem, '<h1>Things</h1><p>Words|<br>|Stuff</p><p>More</p>', true)

    sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 6], [1, 5]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  xit('should account for edge cases', function () {
    // This test is failing; it has something to do with the space before 'three'.
    placeCursor(elem, '<p>One <strong><em>two<br>|</em></strong> three|</p>', true)

    var sel = choice.getSelection()

    expect(sel)
      .toEqual(new Selection([0, 14], [0, 8]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  it('edge cases (2)', function () {
    // This kind of behaviour can occur in Firefox.
    placeCursor(elem, '|<p>One</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 0]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)

    placeCursor(elem, '<p>One</p><p>Two</p>|')

    sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 3]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('edge cases (3)', function () {
    placeCursor(elem, '|<p>One</p><p>Two</p>|', true)

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 3], [0, 0]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  it('edge cases (4)', function () {
    placeCursor(elem, '<p>A <strong><em>b|</em></strong> c</p>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 3]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)

    placeCursor(elem, '<p>A <strong><em>b</em>|</strong> c</p>')

    sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 3]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)

    placeCursor(elem, '<p>A <strong><em>b</em></strong>| c</p>')

    sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 3]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('Firefox selectall', function () {
    placeCursor(elem, '|<p><br></p>|')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 0]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('Firefox selectall (2)', function () {
    // Firefox often leaves trailing <br>s.
    placeCursor(elem, '|<p>Stuff<br></p>|')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([0, 0], [0, 5]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(false)
  })

  it('should return null when the cursor is not in the selection', function () {
    placeCursor(elem, '<p>Stuff</p>')

    expect(choice.getSelection()).toBe(null)
  })

  it('return null (2)', function () {
    placeCursor(elem, '<p>Things</p>')

    var input = document.createElement('input')
    input.type = 'text'

    document.body.appendChild(input)
    input.focus()

    expect(document.activeElement).toEqual(input)

    expect(choice.getSelection()).toBe(null)

    document.body.removeChild(input)
  })

  it('return null (3)', function () {
    placeCursor(elem, '<p>Things</p>')

    var input = document.createElement('div')
    input.setAttribute('contenteditable', true)
    document.body.appendChild(input)

    // Checking about non-collapsed selections this time.
    placeCursor(input, '<p>W|he|e</p>')

    expect(document.activeElement).toEqual(input)

    expect(choice.getSelection()).toBe(null)

    document.body.removeChild(input)
  })

  it('return null (4)', function () {
    placeCursor(elem, '<p>A</p>St|uff<p>B</p>')

    expect(choice.getSelection()).toEqual(null)
  })

  it('should consider list items as blocks', function () {
    placeCursor(elem, '<ul><li>One</li><li>|Two</li><li>Three</li></ul>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 0]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)

    placeCursor(elem, '<ul><li>One</li><li>Two|</li><li>Three</li></ul>')

    sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 3]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should consider list items as blocks (2)', function () {
    placeCursor(elem, '<ul><li>One</li><li>Line 1<br>|<br></li><li>Three</li></ul>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 7]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should consider list items as blocks (3)', function () {
    placeCursor(elem, '<ol></ol><ul><li>One</li><li>Line 1<br>|<br></li><li>Three</li></ul>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([1, 7]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should consider list items as blocks (4)', function () {
    placeCursor(elem,
      '<ol><li>Things</li></ol>' +
      '<ul><li>One</li><li>T|wo</li></ul>')

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([2, 1]))
    expect(sel.isCollapsed).toBe(true)
    expect(sel.isBackwards).toBe(false)
  })

  it('should consider list items as blocks (5)', function () {
    placeCursor(elem,
      '|<ol><li>Things</li></ol>' +
      '<p>Random paragraph.</p>' +
      '<ul><li>One</li><li>Two</li></ul>|', true)

    var sel = choice.getSelection()

    expect(sel).toEqual(new Selection([3, 3], [0, 0]))
    expect(sel.isCollapsed).toBe(false)
    expect(sel.isBackwards).toBe(true)
  })

  function setup () {
    elem = document.createElement('div')
    elem.setAttribute('contenteditable', true)
    document.body.appendChild(elem)

    choice = new window.Choice(elem, function () {
      return window.flattenLists(elem)
    })
  }

  function teardown () {
    document.body.removeChild(elem)
  }
})
