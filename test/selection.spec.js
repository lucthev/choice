/*eslint-env jasmine */
'use strict'

describe('Selection', function () {
  var Selection = window.Choice.Selection

  it('should use distinct arrays for collapsed selections', function () {
    var sel = new Selection([1, 3])

    expect(sel.end).toEqual([1, 3])

    sel.start[0] += 1

    expect(sel.end).toEqual([1, 3])
  })

  it('#clone returns a new, identical selection', function () {
    var sel = new Selection([1, 1], [2, 2])
    var clone = sel.clone()

    expect(sel === clone).toBe(false)

    sel.start[0] += 1
    expect(clone.start).toEqual([1, 1])

    sel.end = [5, 5]
    expect(clone.end).toEqual([2, 2])
  })

  it('#equals compares two selections', function () {
    var sel = new Selection([1, 1])
    var other = new Selection([1, 1], [2, 2])

    expect(Selection.equals(null, null)).toBe(true)
    expect(Selection.equals(sel, sel)).toBe(true)
    expect(Selection.equals(sel, sel.clone())).toBe(true)
    expect(Selection.equals(sel, other)).toBe(false)

    // Things that can’t be Selections should be false.
    expect(Selection.equals(true, true)).toBe(false)

    expect(sel.equals(null)).toBe(false)
    expect(sel.equals(other)).toBe(false)
    expect(sel.equals(sel)).toBe(true)
    expect(sel.equals(sel.clone())).toBe(true)
  })

  it('#absoluteStart returns the first endpoint', function () {
    var forward = new Selection([1, 2], [3, 4])
    var backward = new Selection([3, 4], [1, 2])

    expect(forward.absoluteStart).toEqual(forward.start)
    expect(backward.absoluteStart).toEqual(backward.end)
  })

  it('#absoluteEnd returns the last endpoint', function () {
    var forward = new Selection([1, 2], [3, 4])
    var backward = new Selection([3, 4], [1, 2])

    expect(forward.absoluteEnd).toEqual(forward.end)
    expect(backward.absoluteEnd).toEqual(backward.start)
  })
})
