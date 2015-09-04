# Changelog

## 2.0.0

This major release brings about a few API changes and wider browser support.

API changes are limited to Choice.Selection; the `absoluteStart`, `absoluteEnd`, `isCollapsed`, and `isBackwards` methods have instead been turned into getters. This means that the following code:

```js
var c = new Choice(someElement)
var s = c.getSelection()

var isCollapsed = s.isCollapsed()
var isBackwards = s.isBackwards()
var absoluteStart = s.absoluteStart()
var absoluteEnd = s.absoluteEnd()
```

Should, in `v2` onwards, be written as:

```js
var c = new Choice(someElement)
var s = c.getSelection()

var isCollapsed = s.isCollapsed // Not a function call
var isBackwards = s.isBackwards
var absoluteStart = s.absoluteStart
var absoluteEnd = s.absoluteEnd
```

Additionally, Choice now works in browsers without the native `Selection#extend` method (namely, Internet Explorer).

## 1.4.0

- Added `Selection#absoluteStart()` and `Selection#absoluteEnd()`.

## 1.3.0

- Added the static function `Selection.equals()`.

## 1.2.0

- When there is no selection, `Choice#getSelection` now returns `null` (it previously returned `false`). You may have to update your code if you’ve been explicitly comparing against `false`.
- Choice now uses the [`block-elements`](https://github.com/webmodules/block-elements) module; this provides a more complete list of block elements than the one Choice previously relied on.

## 1.1.0

- Added a `Selection.clone()` method. This method takes no arguments and returns a selection identical to the one it was called on.

## 1.0.0

This release introduces no changes, and was primarily to avoid oddities in the SemVer spec regarding `0.x.y` versioning.

## 0.2.0

- Choice now ignores non-editable elements (elements with `contenteditable=false`).
- Added a `Selection#equals` method for comparing two selections.

## 0.1.4

- Minor tweaks to error messages to make them clearer.

## 0.1.3

- Added a `Selection#isBackwards` method; this method returns true when the selection it is called on represents a right-to-left selection.

## 0.1.2

- Fixed issue [#1](https://github.com/lucthev/choice/issues/1); trailing `<br>` elements are no longer included in the selection.

## 0.1.1

- Fixed an issue with the default `getChildren` function using the root element instead of the root element’s children.

## 0.1.0

v0.1.0 was the first stable release of Choice.
