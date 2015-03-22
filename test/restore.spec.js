/*eslint-env jasmine */
'use strict'

describe('Choice#restore', function () {
  var placeCursor = window.placeCursor
  var choice
  var elem

  beforeEach(setup)
  afterEach(teardown)

  it('should restore the selection', function () {
    placeCursor(elem, '<p>|One</p>')

    // Just save and restore.
    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  it('should restore the selection (2)', function () {
    placeCursor(elem, '<p>One|</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (3)', function () {
    placeCursor(elem, '<p>One <b>tw|o</b> three</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[1].firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(2)
  })

  it('should restore the selection (4)', function () {
    placeCursor(elem, '<p>One |<em>two</em> three</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (5)', function () {
    placeCursor(elem, '<p>One <strong>two</strong>| three</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[1].firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (6)', function () {
    placeCursor(elem, '<p>One <strong>two</strong> three|</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[2]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(6)
  })

  it('should restore the selection (7)', function () {
    placeCursor(elem, '<p>The |<span></span>Big Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (8)', function () {
    // The cursor cannot be placed in collapsed elements, so no
    // need to check that case.
    placeCursor(elem, '<p>The <span></span>|Big Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (9)', function () {
    placeCursor(elem, '<p>The <span></span>Big |Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[2]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (9)', function () {
    placeCursor(elem, '<p>The |<em><strong>Big</strong></em> Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[0]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (10)', function () {
    placeCursor(elem, '<p>The <em>|<strong>Big</strong></em> Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[0]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (11)', function () {
    placeCursor(elem, '<p>The <em><strong>|Big</strong></em> Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[0]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(4)
  })

  it('should restore the selection (12)', function () {
    placeCursor(elem, '<p>The <em><strong id="s">Big|</strong></em> Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#s').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (13)', function () {
    placeCursor(elem, '<p>The <em><strong id="s">Big</strong>|</em> Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#s').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (14)', function () {
    placeCursor(elem, '<p>The <em><strong id="s">Big</strong></em>| Short</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#s').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (15)', function () {
    placeCursor(elem, '<p>|<br></p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  it('should restore the selection (16)', function () {
    placeCursor(elem, '<p>Line One<br>|<br></p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(2)
  })

  it('should restore the selection (17)', function () {
    placeCursor(elem, '<p>Line One<br>|Line Two</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.childNodes[2]

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  it('should restore the selection (18)', function () {
    placeCursor(elem,
      '<h2>Jacob Streilein</h2>' +
      '<p>There\'s a <em id="e">man in|<br></em>the woods.</p>'
    )

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#e').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(6)
  })

  it('should restore the selection (19)', function () {
    placeCursor(elem,
      '<h2>Jacob Streilein</h2>' +
      '<p>There\'s a <em id="e">man in<br>|</em>the woods.</p>'
    )

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#e').nextSibling

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  it('should restore the selection (20)', function () {
    placeCursor(elem,
      '<h2>Jacob Streilein</h2>' +
      '<p>There\'s a <em id="e">man in<br></em>|the woods.</p>'
    )

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = document.querySelector('#e').nextSibling

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  it('should restore the selection (21)', function () {
    placeCursor(elem, '<p>One</p><p>Two|<br><br></p><p>Three</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.childNodes[1].firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should restore the selection (22)', function () {
    placeCursor(elem, '|<p>A</p><p>B</p>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var target = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(target)
    expect(sel.anchorOffset).toEqual(0)
  })

  /**
   * Non-collapsed selections, now. Just a few tricky cases.
   */

  it('should restore non-collapsed selections', function () {
    placeCursor(elem, '|<p>One</p><p>Two</p><p>Three</p>|')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = elem.firstChild.firstChild
    var end = elem.lastChild.firstChild

    expect(sel.isCollapsed).toBe(false)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(0)
    expect(sel.focusNode).toEqual(end)
    expect(sel.focusOffset).toEqual(5)
  })

  it('should restore non-collapsed selections (2)', function () {
    placeCursor(elem, '<h2>|<br>|<br></h2>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = elem.firstChild
    var end = elem.firstChild

    expect(sel.isCollapsed).toBe(false)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(0)
    expect(sel.focusNode).toEqual(end)
    expect(sel.focusOffset).toEqual(1)
  })

  it('should restore non-collapsed selections (3)', function () {
    placeCursor(elem,
      '<h2>Thi|ngs</h2>' +
      '<p><code>Words</code></p>' +
      '<ul><li id="li">List <em>|item</em></li></ul>', true)

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li').firstChild
    var end = elem.firstChild.firstChild

    expect(sel.isCollapsed).toBe(false)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(5)
    expect(sel.focusNode).toEqual(end)
    expect(sel.focusOffset).toEqual(3)
  })

  /**
   * Lists
   */

  it('should consider list items as blocks', function () {
    placeCursor(elem, '<ul><li>One</li><li id="li">|Two</li><li>Three</li></ul>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(0)

    placeCursor(elem, '<ul><li>One</li><li id="li">Two|</li><li>Three</li></ul>')

    choice.restore(choice.getSelection())

    sel = window.getSelection()
    start = document.querySelector('#li').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(3)
  })

  it('should consider list items as blocks (2)', function () {
    placeCursor(elem, '<ul><li>One</li><li id="li">Line 1<br>|<br></li><li>Three</li></ul>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li')

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(2)
  })

  it('should consider list items as blocks (3)', function () {
    placeCursor(elem, '<ol></ol><ul><li>One</li><li id="li">Line 1<br>|<br></li><li>Three</li></ul>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li')

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(2)
  })

  it('should consider list items as blocks (4)', function () {
    placeCursor(elem,
      '<ol><li>Things</li></ol>' +
      '<ul><li>One</li><li id="li">T|wo</li></ul>')

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(1)
  })

  it('should consider list items as blocks (5)', function () {
    placeCursor(elem,
      '|<ol><li id="li1">Things</li></ol>' +
      '<p>Random paragraph.</p>' +
      '<ul><li>One</li><li id="li2">Two</li></ul>|', true)

    choice.restore(choice.getSelection())

    var sel = window.getSelection()
    var start = document.querySelector('#li2').firstChild
    var end = document.querySelector('#li1').firstChild

    expect(sel.isCollapsed).toBe(false)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(3)
    expect(sel.focusNode).toEqual(end)
    expect(sel.focusOffset).toEqual(0)
  })

  it('should consider list items as blocks (6)', function () {
    placeCursor(elem,
      '<ul><li>One item</li></ul>' +
      '<p>1.|Will be a list item</p>')

    var s = choice.getSelection()

    placeCursor(elem,
      '<ul><li>One item</li>' +
      '<li id="li">Will be a list item</li></ul>')

    // Because we've gotten rid of the the '1.'
    s.start[1] -= 2

    choice.restore(s)

    var sel = window.getSelection()
    var start = document.querySelector('#li').firstChild

    expect(sel.isCollapsed).toBe(true)
    expect(sel.anchorNode).toEqual(start)
    expect(sel.anchorOffset).toEqual(0)
  })

  function setup () {
    elem = document.createElement('article')
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
