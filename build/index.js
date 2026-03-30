/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createCache)
/* harmony export */ });
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Parser.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Middleware.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");





var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.token)(character)) {
      break;
    }

    (0,stylis__WEBPACK_IMPORTED_MODULE_4__.next)();
  }

  return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.slice)(begin, stylis__WEBPACK_IMPORTED_MODULE_4__.position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(stylis__WEBPACK_IMPORTED_MODULE_4__.position - 1, points, index);
        break;

      case 2:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_4__.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_2__.from)(character);
    }
  } while (character = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.dealloc)(toRules((0,stylis__WEBPACK_IMPORTED_MODULE_4__.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value;
  var parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule' || cache.compat) return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses) {
      var isNested = !!element.parent; // in nested rules comments become children of the "auto-inserted" rule and that's always the `element.parent`
      //
      // considering this input:
      // .a {
      //   .b /* comm */ {}
      //   color: hotpink;
      // }
      // we get output corresponding to this:
      // .a {
      //   & {
      //     /* comm */
      //     color: hotpink;
      //   }
      //   .b {}
      // }

      var commentContainer = isNested ? element.parent.children : // global rule at the root level
      children;

      for (var i = commentContainer.length - 1; i >= 0; i--) {
        var node = commentContainer[i];

        if (node.line < element.line) {
          break;
        } // it is quite weird but comments are *usually* put at `column: element.column - 1`
        // so we seek *from the end* for the node that is earlier than the rule's `element` and check that
        // this will also match inputs like this:
        // .a {
        //   /* comm */
        //   .b {}
        // }
        //
        // but that is fine
        //
        // it would be the easiest to change the placement of the comment to be the first child of the rule:
        // .a {
        //   .b { /* comm */ }
        // }
        // with such inputs we wouldn't have to search for the comment at all
        // TODO: consider changing this comment placement in the next major version


        if (node.column < element.column) {
          if (isIgnoringComment(node)) {
            return;
          }

          break;
        }
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.hash)(value, length)) {
    // color-adjust
    case 5103:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
    // order

    case 6165:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(\w+).+(:[^]+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, '-grow', '') + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /([^-])(transform)/g, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(zoom-|grab)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(image-set\([^]*)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)(flex-)?(.*)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+)-inline(.+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.strlen)(value) - 1 - length > 6) switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~(0,stylis__WEBPACK_IMPORTED_MODULE_2__.indexof)(value, 'stretch') ? prefix((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, (0,stylis__WEBPACK_IMPORTED_MODULE_2__.strlen)(value) - 3 - (~(0,stylis__WEBPACK_IMPORTED_MODULE_2__.indexof)(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, ':', ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case stylis__WEBPACK_IMPORTED_MODULE_1__.DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case stylis__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
        value: (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(element.value, '@', '@' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)
      })], callback);

    case stylis__WEBPACK_IMPORTED_MODULE_1__.RULESET:
      if (element.length) return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.combine)(element.props, function (value) {
        switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.match)(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(read-\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var defaultStylisPlugins = [prefixer];
var getSourceMap;

{
  var sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

  getSourceMap = function getSourceMap(styles) {
    var matches = styles.match(sourceMapPattern);
    if (!matches) return;
    return matches[matches.length - 1];
  };
}

var createCache = function createCache(options) {
  var key = options.key;

  if (!key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }

      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' ');

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [stylis__WEBPACK_IMPORTED_MODULE_5__.stringify, function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== stylis__WEBPACK_IMPORTED_MODULE_1__.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } ];
    var serializer = (0,stylis__WEBPACK_IMPORTED_MODULE_6__.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)((0,stylis__WEBPACK_IMPORTED_MODULE_3__.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if (getSourceMap) {
        var sourceMap = getSourceMap(serialized.styles);

        if (sourceMap) {
          currentSheet = {
            insert: function insert(rule) {
              sheet.insert(rule + sourceMap);
            }
          };
        }
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};




/***/ },

/***/ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js"
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/emotion-hash.esm.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ murmur2)
/* harmony export */ });
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}




/***/ },

/***/ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}




/***/ },

/***/ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js"
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js ***!
  \*****************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hoistNonReactStatics)
/* harmony export */ });
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);


// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks

var hoistNonReactStatics = (function (targetComponent, sourceComponent) {
  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(targetComponent, sourceComponent);
});




/***/ },

/***/ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js"
/*!**********************************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CacheProvider),
/* harmony export */   E: () => (/* binding */ Emotion$1),
/* harmony export */   T: () => (/* binding */ ThemeContext),
/* harmony export */   _: () => (/* binding */ __unsafe_useEmotionCache),
/* harmony export */   a: () => (/* binding */ ThemeProvider),
/* harmony export */   b: () => (/* binding */ withTheme),
/* harmony export */   c: () => (/* binding */ createEmotionProps),
/* harmony export */   h: () => (/* binding */ hasOwn),
/* harmony export */   u: () => (/* binding */ useTheme),
/* harmony export */   w: () => (/* binding */ withEmotionCache)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js */ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");










var EmotionCacheContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
  key: 'css'
}) : null);

{
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

var CacheProvider = EmotionCacheContext.Provider;
var __unsafe_useEmotionCache = function useEmotionCache() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
};

var withEmotionCache = function withEmotionCache(func) {
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

var ThemeContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext({});

{
  ThemeContext.displayName = 'EmotionThemeContext';
}

var useTheme = function useTheme() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
};

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ((mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ((theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (outerTheme) {
  return (0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {
    value: theme
  }, props.children);
};
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';
  var WithTheme = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function render(props, ref) {
    var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
      theme: theme,
      ref: ref
    }, props));
  });
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0,_isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_4__["default"])(WithTheme, Component);
}

var hasOwn = {}.hasOwnProperty;

var getLastPart = function getLastPart(functionName) {
  // The match may be something like 'Object.createEmotionProps' or
  // 'Loader.prototype.render'
  var parts = functionName.split('.');
  return parts[parts.length - 1];
};

var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
  // V8
  var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
  if (match) return getLastPart(match[1]); // Safari / Firefox

  match = /^([A-Za-z0-9$.]+)@/.exec(line);
  if (match) return getLastPart(match[1]);
  return undefined;
};

var internalReactFunctionNames = /* #__PURE__ */new Set(['renderWithHooks', 'processChild', 'finishClassComponent', 'renderToString']); // These identifiers come from error stacks, so they have to be valid JS
// identifiers, thus we only need to replace what is a valid character for JS,
// but not for CSS.

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
  if (!stackTrace) return undefined;
  var lines = stackTrace.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var functionName = getFunctionNameFromStackTraceLine(lines[i]); // The first line of V8 stack traces is just "Error"

    if (!functionName) continue; // If we reach one of these, we have gone too far and should quit

    if (internalReactFunctionNames.has(functionName)) break; // The component name is the first function in the stack that starts with an
    // uppercase letter

    if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
  }

  return undefined;
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {
  if (typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

  var newProps = {};

  for (var _key in props) {
    if (hasOwn.call(props, _key)) {
      newProps[_key] = props[_key];
    }
  }

  newProps[typePropName] = type; // Runtime labeling is an opt-in feature because:
  // - It causes hydration warnings when using Safari and SSR
  // - It can degrade performance if there are a huge number of elements
  //
  // Even if the flag is set, we still don't compute the label if it has already
  // been determined by the Babel plugin.

  if (typeof globalThis !== 'undefined' && !!globalThis.EMOTION_RUNTIME_AUTO_LABEL && !!props.css && (typeof props.css !== 'object' || !('name' in props.css) || typeof props.css.name !== 'string' || props.css.name.indexOf('-') === -1)) {
    var label = getLabelFromStackTrace(new Error().stack);
    if (label) newProps[labelPropName] = label;
  }

  return newProps;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_7__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_6__.serializeStyles)(registeredStyles, undefined, react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext));

  if (serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_6__.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var _key2 in props) {
    if (hasOwn.call(props, _key2) && _key2 !== 'css' && _key2 !== typePropName && (_key2 !== labelPropName)) {
      newProps[_key2] = props[_key2];
    }
  }

  newProps.className = className;

  if (ref) {
    newProps.ref = ref;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Insertion, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrappedComponent, newProps));
});

{
  Emotion.displayName = 'EmotionCssPropInternal';
}

var Emotion$1 = Emotion;




/***/ },

/***/ "./node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CacheProvider: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.C),
/* harmony export */   ClassNames: () => (/* binding */ ClassNames),
/* harmony export */   Global: () => (/* binding */ Global),
/* harmony export */   ThemeContext: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.T),
/* harmony export */   ThemeProvider: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.a),
/* harmony export */   __unsafe_useEmotionCache: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__._),
/* harmony export */   createElement: () => (/* binding */ jsx),
/* harmony export */   css: () => (/* binding */ css),
/* harmony export */   jsx: () => (/* binding */ jsx),
/* harmony export */   keyframes: () => (/* binding */ keyframes),
/* harmony export */   useTheme: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   withEmotionCache: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.w),
/* harmony export */   withTheme: () => (/* reexport safe */ _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.b)
/* harmony export */ });
/* harmony import */ var _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emotion-element-489459f2.browser.development.esm.js */ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8__);












var isDevelopment = true;

var pkg = {
	name: "@emotion/react",
	version: "11.14.0",
	main: "dist/emotion-react.cjs.js",
	module: "dist/emotion-react.esm.js",
	types: "dist/emotion-react.cjs.d.ts",
	exports: {
		".": {
			types: {
				"import": "./dist/emotion-react.cjs.mjs",
				"default": "./dist/emotion-react.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				worker: {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				browser: {
					module: "./dist/emotion-react.browser.development.esm.js",
					"import": "./dist/emotion-react.browser.development.cjs.mjs",
					"default": "./dist/emotion-react.browser.development.cjs.js"
				},
				module: "./dist/emotion-react.development.esm.js",
				"import": "./dist/emotion-react.development.cjs.mjs",
				"default": "./dist/emotion-react.development.cjs.js"
			},
			"edge-light": {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			worker: {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			workerd: {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			browser: {
				module: "./dist/emotion-react.browser.esm.js",
				"import": "./dist/emotion-react.browser.cjs.mjs",
				"default": "./dist/emotion-react.browser.cjs.js"
			},
			module: "./dist/emotion-react.esm.js",
			"import": "./dist/emotion-react.cjs.mjs",
			"default": "./dist/emotion-react.cjs.js"
		},
		"./jsx-runtime": {
			types: {
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				worker: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				browser: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.js"
				},
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.js"
			},
			"edge-light": {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			worker: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			workerd: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			browser: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.js"
			},
			module: "./jsx-runtime/dist/emotion-react-jsx-runtime.esm.js",
			"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
			"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
		},
		"./_isolated-hnrs": {
			types: {
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				worker: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				browser: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.js"
				},
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.js"
			},
			"edge-light": {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			worker: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			workerd: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			browser: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.js"
			},
			module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.esm.js",
			"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
			"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
		},
		"./jsx-dev-runtime": {
			types: {
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				worker: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				browser: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.js"
				},
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.js"
			},
			"edge-light": {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			worker: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			workerd: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			browser: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.js"
			},
			module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.esm.js",
			"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
			"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
		},
		"./package.json": "./package.json",
		"./types/css-prop": "./types/css-prop.d.ts",
		"./macro": {
			types: {
				"import": "./macro.d.mts",
				"default": "./macro.d.ts"
			},
			"default": "./macro.js"
		}
	},
	imports: {
		"#is-development": {
			development: "./src/conditions/true.ts",
			"default": "./src/conditions/false.ts"
		},
		"#is-browser": {
			"edge-light": "./src/conditions/false.ts",
			workerd: "./src/conditions/false.ts",
			worker: "./src/conditions/false.ts",
			browser: "./src/conditions/true.ts",
			"default": "./src/conditions/is-browser.ts"
		}
	},
	files: [
		"src",
		"dist",
		"jsx-runtime",
		"jsx-dev-runtime",
		"_isolated-hnrs",
		"types/css-prop.d.ts",
		"macro.*"
	],
	sideEffects: false,
	author: "Emotion Contributors",
	license: "MIT",
	scripts: {
		"test:typescript": "dtslint types"
	},
	dependencies: {
		"@babel/runtime": "^7.18.3",
		"@emotion/babel-plugin": "^11.13.5",
		"@emotion/cache": "^11.14.0",
		"@emotion/serialize": "^1.3.3",
		"@emotion/use-insertion-effect-with-fallbacks": "^1.2.0",
		"@emotion/utils": "^1.4.2",
		"@emotion/weak-memoize": "^0.4.0",
		"hoist-non-react-statics": "^3.3.1"
	},
	peerDependencies: {
		react: ">=16.8.0"
	},
	peerDependenciesMeta: {
		"@types/react": {
			optional: true
		}
	},
	devDependencies: {
		"@definitelytyped/dtslint": "0.0.112",
		"@emotion/css": "11.13.5",
		"@emotion/css-prettifier": "1.2.0",
		"@emotion/server": "11.11.0",
		"@emotion/styled": "11.14.0",
		"@types/hoist-non-react-statics": "^3.3.5",
		"html-tag-names": "^1.1.2",
		react: "16.14.0",
		"svg-tag-names": "^1.1.1",
		typescript: "^5.4.5"
	},
	repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
	publishConfig: {
		access: "public"
	},
	"umd:main": "dist/emotion-react.umd.min.js",
	preconstruct: {
		entrypoints: [
			"./index.ts",
			"./jsx-runtime.ts",
			"./jsx-dev-runtime.ts",
			"./_isolated-hnrs.ts"
		],
		umdName: "emotionReact",
		exports: {
			extra: {
				"./types/css-prop": "./types/css-prop.d.ts",
				"./macro": {
					types: {
						"import": "./macro.d.mts",
						"default": "./macro.d.ts"
					},
					"default": "./macro.js"
				}
			}
		}
	}
};

var jsx = function jsx(type, props) {
  // eslint-disable-next-line prefer-rest-params
  var args = arguments;

  if (props == null || !_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.h.call(props, 'css')) {
    return react__WEBPACK_IMPORTED_MODULE_1__.createElement.apply(undefined, args);
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = _emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.E;
  createElementArgArray[1] = (0,_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.c)(type, props);

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  }

  return react__WEBPACK_IMPORTED_MODULE_1__.createElement.apply(null, createElementArgArray);
};

(function (_jsx) {
  var JSX;

  (function (_JSX) {})(JSX || (JSX = _jsx.JSX || (_jsx.JSX = {})));
})(jsx || (jsx = {}));

var warnedAboutCssPropForGlobal = false; // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

var Global = /* #__PURE__ */(0,_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.w)(function (props, cache) {
  if (!warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // I don't really want to add it to the type since it shouldn't be used
  'className' in props && props.className || 'css' in props && props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;
  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)([styles], undefined, react__WEBPACK_IMPORTED_MODULE_1__.useContext(_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.T));
  // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything


  var sheetRef = react__WEBPACK_IMPORTED_MODULE_1__.useRef();
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectWithLayoutFallback)(function () {
    var key = cache.key + "-global"; // use case of https://github.com/emotion-js/emotion/issues/2675

    var sheet = new cache.sheet.constructor({
      key: key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy
    });
    var rehydrating = false;
    var node = document.querySelector("style[data-emotion=\"" + key + " " + serialized.name + "\"]");

    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }

    if (node !== null) {
      rehydrating = true; // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s

      node.setAttribute('data-emotion', key);
      sheet.hydrate([node]);
    }

    sheetRef.current = [sheet, rehydrating];
    return function () {
      sheet.flush();
    };
  }, [cache]);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectWithLayoutFallback)(function () {
    var sheetRefCurrent = sheetRef.current;
    var sheet = sheetRefCurrent[0],
        rehydrating = sheetRefCurrent[1];

    if (rehydrating) {
      sheetRefCurrent[1] = false;
      return;
    }

    if (serialized.next !== undefined) {
      // insert keyframes
      (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.insertStyles)(cache, serialized.next, true);
    }

    if (sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }

    cache.insert("", serialized, sheet, false);
  }, [cache, serialized.name]);
  return null;
});

{
  Global.displayName = 'EmotionGlobal';
}

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)(args);
}

function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name;
  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
}

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            if (arg.styles !== undefined && arg.name !== undefined) {
              console.error('You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n' + '`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.');
            }

            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serializedArr = _ref.serializedArr;
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectAlwaysWithSyncFallback)(function () {

    for (var i = 0; i < serializedArr.length; i++) {
      (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.insertStyles)(cache, serializedArr[i], false);
    }
  });

  return null;
};

var ClassNames = /* #__PURE__ */(0,_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.w)(function (props, cache) {
  var hasRendered = false;
  var serializedArr = [];

  var css = function css() {
    if (hasRendered && isDevelopment) {
      throw new Error('css can only be used during render');
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)(args, cache.registered);
    serializedArr.push(serialized); // registration has to happen here as the result of this might get consumed by `cx`

    (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.registerStyles)(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var cx = function cx() {
    if (hasRendered && isDevelopment) {
      throw new Error('cx can only be used during render');
    }

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return merge(cache.registered, css, classnames(args));
  };

  var content = {
    css: css,
    cx: cx,
    theme: react__WEBPACK_IMPORTED_MODULE_1__.useContext(_emotion_element_489459f2_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_0__.T)
  };
  var ele = props.children(content);
  hasRendered = true;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Insertion, {
    cache: cache,
    serializedArr: serializedArr
  }), ele);
});

{
  ClassNames.displayName = 'EmotionClassNames';
}

{
  var isBrowser = typeof document !== 'undefined'; // #1727, #2905 for some reason Jest and Vitest evaluate modules twice if some consuming module gets mocked

  var isTestEnv = typeof jest !== 'undefined' || typeof vi !== 'undefined';

  if (isBrowser && !isTestEnv) {
    // globalThis has wide browser support - https://caniuse.com/?search=globalThis, Node.js 12 and later
    var globalContext = typeof globalThis !== 'undefined' ? globalThis // eslint-disable-line no-undef
    : isBrowser ? window : globalThis;
    var globalKey = "__EMOTION_REACT_" + pkg.version.split('.')[0] + "__";

    if (globalContext[globalKey]) {
      console.warn('You are loading @emotion/react when it is already loaded. Running ' + 'multiple instances may cause problems. This can happen if multiple ' + 'versions are used, or if multiple builds of the same version are ' + 'used.');
    }

    globalContext[globalKey] = true;
  }
}




/***/ },

/***/ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializeStyles: () => (/* binding */ serializeStyles)
/* harmony export */ });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");




var isDevelopment = true;

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

{
  var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  var componentSelector = interpolation;

  if (componentSelector.__emotion_styles !== undefined) {
    if (String(componentSelector) === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return componentSelector;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        var keyframes = interpolation;

        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }

        var serializedStyles = interpolation;

        if (serializedStyles.styles !== undefined) {
          var next = serializedStyles.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = serializedStyles.styles + ";";
          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (_match, _p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(matched, ["`" + replaced + "`"]).join('\n') + "\n\nYou should wrap it with `css` like this:\n\ncss`" + replaced + "`");
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  var asString = interpolation;

  if (registered == null) {
    return asString;
  }

  var cached = registered[asString];
  return cached !== undefined ? cached : asString;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value !== 'object') {
        var asString = value;

        if (registered != null && registered[asString] !== undefined) {
          string += key + "{" + registered[asString] + "}";
        } else if (isProcessableValue(asString)) {
          string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
        }
      } else {
        if (key === 'NO_COMPONENT_SELECTOR' && isDevelopment) {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g; // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list

var cursor;
function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    var asTemplateStringsArr = strings;

    if (asTemplateStringsArr[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += asTemplateStringsArr[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      var templateStringsArr = strings;

      if (templateStringsArr[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += templateStringsArr[i];
    }
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + match[1];
  }

  var name = (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  {
    var devStyles = {
      name: name,
      styles: styles,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
    return devStyles;
  }
}




/***/ },

/***/ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyleSheet: () => (/* binding */ StyleSheet)
/* harmony export */ });
var isDevelopment = true;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/

function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  } // this function should always return with a value
  // TS can't understand it though so we make it stop complaining here


  return undefined;
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? !isDevelopment : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }

      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (!/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    this.tags.forEach(function (tag) {
      var _tag$parentNode;

      return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ },

/***/ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js"
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unitlessKeys)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};




/***/ },

/***/ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js"
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js ***!
  \***********************************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInsertionEffectAlwaysWithSyncFallback: () => (/* binding */ useInsertionEffectAlwaysWithSyncFallback),
/* harmony export */   useInsertionEffectWithLayoutFallback: () => (/* binding */ useInsertionEffectWithLayoutFallback)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var syncFallback = function syncFallback(create) {
  return create();
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : false;
var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
var useInsertionEffectWithLayoutFallback = useInsertionEffect || react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;




/***/ },

/***/ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js"
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredStyles: () => (/* binding */ getRegisteredStyles),
/* harmony export */   insertStyles: () => (/* binding */ insertStyles),
/* harmony export */   registerStyles: () => (/* binding */ registerStyles)
/* harmony export */ });
var isBrowser = true;

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else if (className) {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ },

/***/ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ weakMemoize)
/* harmony export */ });
var weakMemoize = function weakMemoize(func) {
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // Use non-null assertion because we just checked that the cache `has` it
      // This allows us to remove `undefined` from the return value
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};




/***/ },

/***/ "./src/custom-blocks/hmg-svg/svg/crest.svg"
/*!*************************************************!*\
  !*** ./src/custom-blocks/hmg-svg/svg/crest.svg ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgCrest),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path, _path2, _path3, _path4, _path5, _path6, _path7, _path8, _path9, _path0, _path1, _path10, _path11, _path12, _path13, _path14, _path15, _path16, _path17, _path18, _path19, _path20, _path21, _path22, _path23, _path24;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgCrest = function SvgCrest(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 130,
    fill: "currentColor",
    className: "crest_svg__royal-crest",
    viewBox: "0 0 702.47 624.08"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "m628.36 340.31-1.67-.2-4.44-12.05c2.08-2.67 3.2-6.95-.08-9.11-4.34-1.71-16.56-15.69-20.18-6.64-1.56.56-11.24 1.11-11.99 2.91-4.65-7.35-8.58-15.17-11.47-23.85 1.88-10.09 28.58-22.66 28.58-22.66s-7.58-10.9-10.61-17.04c-1.34 3-2.57 1.72-5.5 3.05 14.83-26.35 17.98-61.01-1.64-85.9-2.01-4.32-1.09-10.02-3.06-14.25-3.4-4.49-5.75-13.33-11.77-14.27-.03 7.82-.83 15.48 2.95 22.74 4.03 5.05-5.49 9.33-8.45 5.34 5.68-.65 6.64-1.79 4.68-5-24.5-5.49-38.19 11.72-61.56 14.42-2.06-.02-3.9.71-5.05 2.59-14.39 19.4 17.91 6.16 20.73 19.02-5.4 4.45-6.14 1.52-11.2.23-7.28.28-14.33 2.55-5.25 8.7-5.54 8.7-5.27 11.77-16.54 12.51 4.89 6.9 3.84 16.88 5.11 24.7-8.03 1.51-13.49 5.38-13.65 13.96-3.62.81-7.51-1.08-10.08 2.82-5.06-4.19-10.86-4.95-16.92-5.05-2.92-2.19-10.09-7.34-17.79-11.3 1.52-5.69 2.97-11.03 4.34-16.02 2.25-1.43 10.35-6.58 12.45-7.92l-6.51-13.14c14.43-49.66 19.12-52.44 26.42-53.52l.39-1.38-26.7-8.55-.47 1.74c6.74 4.9 8.93 13.02 5.86 22.55-7.13-3.08-11.2-9.84-10.43-15.87l-1.77-.51-8.94 29.66s1.29.39 1.43.43c3.51-5.07 9.63-7.93 16.71-6.75-8.26 26.28-45.43 18.09-38.78-4.23 4.74-9.21 13.73-3.3 9.4 6.34 20.86-7.31 8.55-37.32-9.29-19.42 5.9-12.09 9.25-21.57 1.84-33.25-9.61 6.18-12.06 17.35-10.22 32.23-11.77-26.93-32.31.81-15.61 14.84-3.04-19.98 21.62-6.78 4.94 9.32-15.91 11.26-35.47-1.68-36.04-21.55 9.19.81 16.2 6.27 17.15 13.08.16 0 1.69.06 1.69.06l1.14-33.91s-1.92-.09-2.08-.1c-1.43 6.87-8.89 12.69-18.33 12.86.65-10.45 6.64-18.6 14.4-19.94v-1.94h-39.14v1.94c7.76 1.34 13.75 9.49 14.4 19.94-9.44-.17-16.9-5.99-18.33-12.86-.16 0-2.08.1-2.08.1l1.14 33.91s1.53-.05 1.69-.06c.95-6.81 7.96-12.27 17.15-13.08-.55 19.86-20.14 32.82-36.04 21.55-16.68-16.11 7.98-29.3 4.94-9.32 16.71-14.07-3.87-41.74-15.61-14.84 1.84-14.89-.61-26.05-10.22-32.23-7.41 11.68-4.05 21.17 1.84 33.25-17.87-17.91-30.12 12.15-9.29 19.42-4.33-9.64 4.66-15.54 9.4-6.34 6.66 22.33-30.54 30.5-38.78 4.23 7.08-1.18 13.2 1.67 16.71 6.75.14-.04 1.43-.43 1.43-.43l-8.94-29.66s-1.63.46-1.77.51c.77 6.04-3.29 12.79-10.43 15.87-3.07-9.53-.88-17.65 5.86-22.55l-.47-1.74-26.7 8.55.39 1.38c7.3 1.08 11.99 3.86 26.42 53.52-1.18 2.39-5.41 10.91-6.51 13.14 2.06 1.31 10.24 6.52 12.45 7.92 1.25 4.55 2.57 9.4 3.94 14.53.05-.03.11-.05.16-.08-.06.18-.12.24-.16.08-35.94 16.8-27.79 28.21-55.44 24.93-2.48 5.72-4.79 11.39-10.42 15.27-1.04-8.77-4.95-15.57-10.1-21.76-2.55-2.98-6.05.31-9.86.62-7.5 16.35-12.68 1.58-25.9 10.13.52 7.62 1.68 15.2 5.86 22.24-9.83-.69-17.95-3.35-24.45-7.97-29.39 32.83-60.07 64.35-85.2 100.46-13.42 17.73-49.31 7.42-39.84-17.01 4.34-17.83 30.11-14.04 28.48 3.66 12.73-14.16 4.55-28.24-14.91-25.09 17.86-7.73 28.58 6.89 44.68-13.2-12.3.3-22.73-3.6-34.99-.77 15.52-9.3 36.83 4.5 50.08-21.15-11.54 1.23-21.98 6.07-33.93 7.84 71.7-68.36 2.71-71.73 11.48-101.28-5.6 4.76-8.83 9.52-6.24 15.9-16.06-6.71-39.87-4.73-46.37-24.25-1.57 27.79 10.64 25.8 31.62 31.52-9.68-1.16-19.24-1.23-28.31-4.58 1.87 12.46 11.32 15.11 22.44 13.91-10.89 6.04-8.41 21.55 2.66 26.88-7.07-40.21 53.13-26.42 25.64 10.5-12.76 19.02-31.23 33.17-46.74 49.78-2.93-5.06-5.98-10.13-12.76-9.41 11.82 13.65-1.52 28.48-4.65 42.56-4.57 17.4 10.8 32.21 27.27 34.24-6.56 7.78-7.09 14.7-2.03 21.06 4.96-25.56 42.02-19.79 45.52-47.44.63-3.26 2.19-5.8 5.82-7.29-16.7 18.89 23.46 58.86-14.27 63.53-5.38.15-6.72 5.82-3.73 9.85-15.59-.78-19.89 5.15-22.27 19.84l19.72-5.1c-6.79 17.79-22.19-1.04-19.66 30.61 6.3-3.02 12.22-6.21 17.98-9.79 5.57 17.76-28.25 10.08-2.86 38.42 1.62-5.29 8.4-16.13 11.85-18.54-3.14 8.92-2.39 19.24 7.62 23.25.47-2.38.88-4.48 1.3-6.59l.84-.02c1.44 5.89 1.64 14.14 7.36 17.54 1.89.75 2.91 1.8 3.54 3.78 1.04 3.29 4.1 4.17 7.07 4.56 3.74.77 4.68-3.47 7.43-5.18.79 4.68 6.31 5.43 9.02 9.41 2.08-23.06-28.5-14.69-21.49-29.93 2.71 9.29 11.39 7.26 17.45 11.06 2.35 3.86 8.08 7.06 11.01 1.69 2.85 2.14 5.43 4.07 7.94 5.96-5.97-27.39-20.17-10.45-29.11-24.83 6.23.28 12.88 9.52 19.6 3.2 3.62 3.73 6.41 8.09 9.14 12.49 1.1-8.75-2.17-15.44-9.06-20.3-7.77-4.76-18.33 3.69-24.97-5.81-9.08-11.21-8.82-26.95-4.1-39.92 4.34-9.98 16.42-13.71 22-23.16-1.55 8.34-.77 22.87 8.68 25.57-2.3-15.5 8.72-29.46 10.96-44.45 2.87-3.79 3.01-6.74.41-10.83-4.69-7.7-5.98-16.97-11.17-24.55-8.05-11.28-17.96-11.59-1.55-23.49-9.96 15.47-1.83 9.84 6.77 24.4 1.59-4.91 8.92-11.32-.24-11.29-14.47-7.1 18.83-25.56 26.35-26.03 7.42-.58 17.82.25 23.44-7.08-3.52-6.68-6.93-7.63-.94-14.57-4.05-2.36-7.61-5.18-8.31-10.49-3.85 1.34-7.25 2.52-11.25 3.91 3.64-4.12 14.35-12.44 15.51-3.22.25 5.18 5.39 6.11 9.39 7.4-2.92 4.24-7.77 8.52-3.35 13.48 3.09 3.24 5.01 9.37 9.77 10.16 1.29-4.81 2.52-9.43 3.79-14.17 10.53 11.05-10.57 17.2 18.35 27.12-1.05-5.97-1.99-11.74-1.22-17.91 13.94 11.65-6 18.96 26.12 22.77-3.58-4.25-4.4-8.94-5.72-13.7 5.36.88 9.69 6.01 13.15 9.85 3.31 5.03 5.74 7.78 13.3 2.87.34.88.42 2.09 1.06 2.58 3.39 2.58 2.03 5.71 1.96 9.15h.93c4.47-4.51 4.78-9.68 3.39-15.32-3.1-10.64-16.08-2.17-20.63-13.03 6.13 4.17 12.23 6.61 18.97 3.12 3.77 3.55 5.34 6.14 7.17 11.17 3.08-11.46-.46-23.15-12.56-19.71-3.76 1.34-5.31 1.03-9.09-2.25 5.62 1.95 9.33-.93 12.92-3.5.78 1 1.23 2.14 1.76 2.17 3.4.2 5.61 2.25 7.71 4.76 1.14-9.8-8.61-17.72-18.42-15.23-2.45 12.02-12.54 5.22-20.53 3.62-12.42-7.27-18.95-21.2-29.94-30.28 1.1-13.48-10.12-24.21-23.61-23.43 12.16-5.3 26.59 5.14 27.53 17.83.45 5.19 3.62 8.46 6.9 12.34 41.08-82.61 173.69-104.21 249.83-51.78 6.48 5.94 13.54 10.8 20.26 17.05 2.62-7.89 1.07-17.27 12.84-12.49l2.2-1.5c-2.4-6.67 2.58-14.21 9.58-14.7v5.2c-3.06.5-5.44 3.48-4.95 6.66 2.35-.5 4.48 2.59 3.21 4.62 2.2 1.25 5.3.73 7-1.05 1.96.1 3.91.29 5.86.48-2.68 6.37-11.98 8.54-17.2 3.87h-.02c1.01 1.4-3.5 15.44-3.69 17.11a4.42 4.42 0 0 1-4.48 3.3c.84 1.37 1.53 2.51 2.29 3.75 3.33-1.86 7.99-1.75 7.56-6.47.63-2.68-1.09-15.01 2.74-13.91 1.55 4.68-1.37 10.09 2.1 14.71 10.98-2.71 6.17-12.66 19.49-15.26 5.29-.47 16.44-3.04 19.3 2.24-11.64-3.12-26.68.08-29.23 13.37-12.11 2.86-22.28 11.5-35.17 11.49-10.24.56-13 12.86-13.43 21.29-1.7 9.67-2.23 19.71-6.54 28.69-2.12 3.43-.34 7.37.82 10.55 3.93 2.06 6.72 15.68 7.29 20.54-.03 8.87 15.2 11.84 21.39 17.37 1.73-11.12-19.35-7.96-16.39-23.5 3.74 10.29 11.92 12.41 20.89 17.47-2.81-10.41-3.65-27.72-18.17-25.55-5.61-7.79 2.59-8.23-.05-17.52 4.17 1.31 6.14 2.75 7.25 5.34-1.3-.42-2.43-.78-4.21-1.35.49 6.58 6.19 8.14 10.58 12.67-.74-10.79-1.7-17.6-11.73-22.85-5.69-5.21.87-17.19.49-24.39-.19-2.12 13.42-8.89 15.5-8.29 10.09 1.32 20.66-.3 30.42 2.25 9.73 3.07 1.38-18.07 17.11-6.95-11.39-3.35-4.46 9.08-12.69 9.71-5.75.06-10.63-.49-16.62-.69 20.67 46.02 66.54 32.53 79.15 73.59 10.55-9.31 3.37-9.16.42-18.91 23.83 15.9-22.18 34.3-4.9 62.13-1.09-3.12 9.72-16.17 10.95-18.82 1.97-2.92 5.32-3.11 7.48-.99l3.44-7.15c-6.41-3.51 5.19-18.56 6.04-22.84 1.2-2.58 3.93-3.79 6.08-2.72l3.2-8.93c-6.06-1.63-1.52-16.34-2-20.44-8.52-7.69-15.5-17.36-22.11-26.29l4.08-.69c-.46 2.01.27 4.21 1.97 5.38 2.93 1.16 14.13 11.97 17.65 9.4l1.76 4.78c-2.83.77-3.33 4.75-3.36 7.42 1.51 1.27 3.13 2.46 4.61 3.79.21-.96.05-5.33.92-5.98 1.33 1.75 3.75 1.76 5.22.36 1.38.72-.34 10.22-.18 11.42 1.65 1.78 3.21 3.64 4.69 5.57-.62-4.37 4.75-21.05-2.68-21.87ZM508.26 185.1c1.56-.17 2.84-.3 4.58-.49-3.01-2.19-.07-5.19 2.42-3.06 5.96 4.62-5.98 12.19-7.01 3.55Zm-238.82 43.48-12.57-8 6.63-13.38 18.12 6.46-12.17 14.93Zm41.04-10.37c-19.66 3.98-23.83-17.66-4.09-21.26 19.66-3.98 23.83 17.66 4.09 21.26m44.44-1.7-19.37-13.67 19.4-13.69 19.37 13.67zm61.7-6.01c-2.31 13.83-33.34 7.86-30.35-5.84 2.31-13.83 33.34-7.86 30.35 5.84m11.65 3.16 18.12-6.46 6.63 13.38-12.57 8-12.17-14.93Zm149.24-63.55c3.56 3.95 5.12 8.23 5.11 13.09-3.43-1.19-4.93-4.94-5.11-13.09m-16.31 25.63c-4.79 3.28-9.1 8.12-13.98 1.56-1.13.23-2.06.41-3.22.65 7.24-11.22 6.64-9.29 17.2-2.21m-40.03 40.69c3.19 1.13 6.22 2.82 9.46-.39-3.11-.01-4.05-2.19-4.95-4.26-1.51-10.59 15.77-6.85 22.2-6.1 16.21 9.86 43.78 3.58 34.2-19.87 7.5 4.63 4.92 17.48-.77 22.49-14.98 8.1-29.18 2.01-44.13 17.87-2.28-7.25-10.89-6.85-13.98 1.14-2.85.19-3.59.14-6.31.32-.5-4.21 2.91-7.24 4.28-11.2m56.52 69.43-2.05 2.58c-12.46-14.23-54.51-30.55-72.68-27.89l.34-3.24-.13.07 6.91-4.39-5.9-4.89c.06-.68-3.78-24.62-3.78-24.62l10.42-.31s-3.72 4.37-3.88 7.82c.59.41 1.09 1 1.44 1.73 2.09-.89 4.32-5.21 4.32-5.21l.99 14.14s-2.9-4.08-5-4.81c-.16.52-.39 1.01-.76 1.4 3.01 9.39 16.72 9.94 16.73 1.9-.47-4.18-5.08-3.49-4.83.92-7.51-5.97 2.64-15.48 6.82-5.9-.53-5.52-.07-8.64 4.22-11.36 2.83 3.57 2.43 6.94-.63 12.29 9.22-8.56 12.74 5.95 4.08 8.09 4.23-7.64-7.93-5.23-3.47 2.76 4.09 6.24 13.99 5.32 17.47-1.46-.25-.4-.43-.84-.52-1.3-3.45-.66-8.61 2.28-8.61 2.28l4.8-13.04s2 5.58 4.89 7.32c.52-.5 1.18-.83 1.9-1.01.55-3.43-2.91-8.82-2.91-8.82l16.01 6.18s-6.33 1.61-8.36 4.47c.4.6.64 1.29.67 2 3.33.67 8.73-2.06 8.73-2.06l-5.74 12.68s-1.66-5.57-4.64-7.39c-.39.27-.83.47-1.3.6-2.28 7.36 4.38 14.5 11.67 12.7 8.82-2.7 1.82-12.73-.57-4.32-4.77-7.38 8.07-15.5 8.69-3.16 1.56-5.94 3.65-8.65 8.24-9.36 1.19 4.83-.68 7.41-4.97 11.07 9.9-4.17 10.36 9.57.78 8.83 3.33-3.08.39-6.6-2.86-3.89-5.72 5.97 4.98 14.51 13.35 10.25-.02-.53.13-1.05.37-1.52-2.08-1.45-7.01-1.6-7.01-1.6l10.26-7.6s-1.22 4.6-.24 7.01c.75-.12 1.53-.03 2.25.25 2.2-2.22 2.33-8.18 2.33-8.18l7.65 9.54s-19.22 8.85-22.61 11.42l-5.34-.53 2.64 7.52-.17.03Zm41.34 39.05c-2.41-.22-4.42 1.9-3.61 4.49-.24-.03-.47-.1-.69-.25l-11.25-7.68c-.73-.5-.95-1.52-.56-2.33 2.12-.08 4.41-1.18 4.12-3.74.87 1.1 12.97 7.55 11.98 9.5Z",
    className: "crest_svg__cls-1"
  })), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M478.88 279.77c.92.89 1.73 1.75 2.49 2.63 1.18.35 3.2 1.03 3.62-.7l2.88-11.17c-1.34 1.22-3.5 1.33-4.58-.29-.86-1.02-1.07-2.49-.32-3.58-1.36-.28-3.64 12.39-4.1 13.11ZM314.08 586.77c-31.78-12.59-54.9 18.21-28.94 23.41-28.48 1.24-22.98-38.84-34.74-36.46 10.31 11.1 10.3 31.78 19.79 37.5 19.14 8.13 39.04 9.46 59.54 8.51-10.32-9.16-12.84-20.71-15.65-32.96M411.17 609.75c25.9-5.14 2.95-35.99-28.94-23.4-2.82 12.25-5.33 23.79-15.65 32.96 20.5.95 40.4-.38 59.54-8.51 9.49-5.72 9.49-26.41 19.79-37.5-11.75-2.38-6.26 37.7-34.74 36.46ZM620.39 350.8l-.82 10.32c-.05.63.19 1.19.56 1.58 1.45-1.23 3.72-.71 4.77.75 1.66-.47 1.11-5.62 1.45-6.84a76 76 0 0 0-5.96-5.8ZM617.66 383.38c-1.44.28-3.12-.5-3.73-1.88-1.95-.81-7.03 13.62-7.91 14.53 2.55-1.57 5.78 1.04 4.92 3.99.25-.19.49-.43.64-.75.17-1.47 8.18-14.71 6.08-15.88Z",
    className: "crest_svg__cls-1"
  })), _path3 || (_path3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M702.47 338.19c-6.66 2.02-9.4 7.56-11.89 13.84-16.72-26.08-48.5-44.07-53.34-75.97 3.74-25.5 37.54-19.67 30.68 6.91 17.53-9.43 9.05-26.96-7.45-30.06 17.94 1.43 27.75 16.6 40.02-8.61-10.61 3.85-26.78 1.12-32.35.29 22.34-3.03 34.49-2.82 33.81-30.56-7.61 16.62-28.68 16.93-43.99 22.31.98-7.37-1.32-11.89-7.26-14.29 6.07 40.54-70.8 27.33 13.67 114.8-10.36-5.7-22.41-3.79-32.45-10.15 7.82 21.06 21.02 17.43 38.3 24.76-18.54-.1-24.3 17.99-10.57 26.67-3.58-13.97 15.61-23.59 25.21-12.67 21.93 28.17-18.2 67.29-53.8-3.3.25 3.9-2.47 7.4-6.26 6.22l-4.01 11.17c8.15 3.02-4.36 18.76-5.22 23.29-1.42 3.02-4.58 3.93-6.96 2.28l-3.93 8.18c4.94 4.52-8.32 17.35-9.82 21.33-1.54 2.29-4.29 3.08-6.24 1.85l-1.42 2.96c.29.39.5.61.54.59 9 10.65 13.12 18.86 10.7 30.17 7.3-6.26 10.56-23.62 4.72-33.08 6.61 6.9 16.2 11.83 19.98 20.63 3.8 16.01.88 31.89-9.99 44.53-4.61 4.64-3.38 7.08-3.97 12.76-3.07 9.02-13.87 9.77-17.94 17.42-2.86 6.7-7.58 12.18-9.63 19.21 12.25-1.92 10.15-19.02 21.75-22.49-4.71 7.17-9.26 13.69-12.48 22.01 9.68-2.52 27.96-5.13 24.9-18.8-2.3-6.31 3.82-10.45 3.51-16.47 7.67-2.75 5.89-5.85 9.56-11.83 1.7 3.62 1.78 6.67 1.57 10.61l-2.22-4.6c-5.42 7.37-.89 14.52-1.65 22.41 26.73-23.95-8.78-23.77 18.97-76.85 6.38-10.57-18.15-9.38-19.98-33.26-1.72-10.33 7.35-18.78 9.28-28.64 10.69 19.01 48.02 18.37 42.92 42.65 7.51-5.67 7.19-16.06 4.23-23.84 38.52-13.86 8.12-49.3 20.52-74.41Z",
    className: "crest_svg__cls-1"
  })), _path4 || (_path4 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M600.18 416.25c-1.06-.34-2.02-1.06-2.35-2.18-.9-.86-2.22-1.28-3.11.05-.35 1.58-10.92 13.52-8.21 15.04.44 0 .89.08 1.3.29.86.36 1.61.97 1.92 1.88.62.09 1.31-.22 1.74-.86.3-.91 9.79-13.36 8.71-14.22M582.26 431.92l.48.81.16-.34-.65-.47ZM203.91 455.89c-10.35 12.74-28.31 4.96-39.59-2.86-9.19-6.78 10.66-17.32 4.28-39.9 8.84 14.25-7.22 26.57 17.58 34.55-7.17-10.66-6.2-24.41-8.9-36.62-.32-2.1-1.35-4.2.34-6.31.84-2.92 1.04-6.88-2.94-7.31-27.71-15.9-22.12-8.18-49.1-11.88-6.6 11.7 7.45 22.12 5.23 33.56-1.98 5.61 6.51 5.37 6.42 10.83 1.89 8.51.96 20.46-8.76 23.74-4.83 2.92-.96 9.09 3.26 10.53-8.59 15.49-2.01 17.96 11.13 25.72.08-5.97.18-11.19 2.66-16.27 18.12 12.03-8.88 14.05 27.05 28.62-3.64-6.02-3.55-12.56-4.09-18.57 3.39.8 6.7 1.58 10.08 2.37 3.89 16.62 12.89 18.08 28.75 16.61-5.67-5.64-7.28-12.98-11.4-18.83 4.77 1.62 9.52-1.66 13.62 2.03 3.86.7 8.14 1.45 11.87-.24-5.82-9.9-11.54-19.64-17.48-29.75ZM578.3 382.1c-12.42 8.76-18.33-5.37-45.18 11.16-4.92.79-6.03 2.87-5.14 7.66-5.48 11.83-5.63 26.2-14.98 36.2 20.13-5.69 15.67-13.31 20.57-28.61-1 20.76.08 20.49 7.6 34.69-15.53 10.91-40.88 1.76-49.39 22.94 2.36 2.71 5.41-.05 8.56.7-2.03 2.45-2.84 5.33-6.08 7.46.7-2.04 1.14-3.32 1.57-4.58-5.81-1.95-10.59 11.34-14.92 15.63 41.45-8.34-5.02-20.51 76.7-30.03 14.44-6.8-13.66-17.45 14.7-35.4 2.52-9.8 4.05-19.91 9.37-28.76 1.27-2.91-.73-7-3.4-9.04ZM190.59 175.42c-6.4 1.66-17.65 6.96-17.65 6.96-5.5-2.1-3.14.62-2.35 3.28-17.62 3.23-34.89 7.86-48.87 19.54-2.51 1.83-3.65.72-4.48-2.83-1.67-2.56-2.44 1.85-2.67 2.95 0 0-10.58 2.58-15.19 6.51 3.26 5.37 7.85 13.84 15.17 11.02.18-2.76.35-5.4.55-8.33-3.11-.54-5.99-1.04-9.2-1.6 3.77-2.83 8.32-3.53 12.01-2.1-3.17 13.39 2.5 22.81 16.81 23.55 4.37-6.52 8.29-7.5 12.55-2.91-18.9-1.95-4.87 18.01 4.78 11.26 2.57-3.7 10.72-6.96 8.36-12.19-14.99-10.96-13.95 5.21-16.74-21.84-.62-.05-1.32-.11-1.91-.16-1.4 5.14-6.45 9.11-10.58 4.26-1.43-1.62-2.69-3.12-5.03-3.53 10.26-8.19 22.46 3.63 21.72-15.63 11.43 14.33 12.44-1.59 23.75-1.82-.53 11.35-2.86 10.49-12.64 9.83 3.18 2.44 15.39 14.6 8.27 15.75-2.97-7.61-7.95-15.01-16.39-16.53-6.81 6.81-3.48 14.42-2.41 22.27 6.05-2.06 11.22-5.97 17.62-5.48 2.13 6.26-7.91 9.72-2.22 15.93 9.75 1.58 20.34 1.64 17.24-12.16-3.17-1.9-6.33-3.19-9.62.3.17-5.36 5.42-6.29 9.5-5.27 9.01-9.59 6-22.26-3.67-29.96 2.56-3.76 5.25-6.36 9.9-7.28-1.57 3.24-4.86 4.43-5.6 7.39l6.14 7.54c5.19-2.29 6.53-10.42 2.85-18.72",
    className: "crest_svg__cls-1"
  })), _path5 || (_path5 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M187.2 216.57c.06-.28.13-.57.19-.85 8.48-.39 16.9-.38 24.84 4.8-2.09-6.5-7.36-16.1-15.05-15.28 2.76-5.77 2.72-9.59-.06-13.06-1.31 4.03-3.86 6.54-8.03 6.69.9 7.26-1.5 13.29-5.45 18.64 1.62 7.96-.64 14.61-5.87 20.87 7.84 14 21.1 24.63 26.96 39.78 13.08-24.43-.89-32.64-18.88-46.02 11.54 4.14 23.19 8.1 29.6 19.08 1.37-20.95-7.92-31.42-28.26-34.65ZM150.1 248.36c-5.31-3.04-11.29-3.8-14.88-8.25-.99-2.09-2.79-2.87-4.7-3.28-6.2-1.35-11.93-3.4-15.04-8.56-4.53 1.42-7.28 1.25-11.44-.49-.37 5.13 4.01 10.3 9.77 8.33-4.62 6.74-2.05 12.77-.36 19.71 3.3-6.93 8.35-11.1 14.01-14.62-4.33 7.39-12.04 14.82-8.54 24.07 2.41 5.85 6.01 12.65 11.97 15.09-3.08-11.55 4.73-21.6 8.35-32.04.07 24.06-13.61 37.11 19.39 45.95-8.79-14.16-2.97-31.36-8.53-45.9ZM247.47 501.2c-39.82-37.06-54.66-85.23-51.17-138.73-.96-.48-2.17-1.08-4.14-2.07-6.67 56.73 15.22 113.97 59.29 150.57 4.47-4.15-1.6-6.57-3.98-9.77M607 202.67c-3.78 7.3 7.15 10.32 7.28 17.23-2.89-2.29-5.35-4.25-8.11-6.44-3.47 13.52 12.49 17.85 17.4 28.49 6.42-19.7 2.94-31.66-16.58-39.28ZM175.73 238.23c-2.12.43-4.1-2.55-6.62-.18 2.36 6.56 11.08 19.68.36 22.75-10.55.64-9.01-12.62-12.1-20.03-1.91 2.16-3.51 3.97-5.22 5.9 2.18 7.36 4.36 14.75 6.68 22.6 1.76-1.26 3.23-2.31 4.8-3.43 7.36 5.2 14.1 1.62 16.53-6.5 2.18.55 4.18 1.49 5.74-.09-3.45-7.13-6.77-14-10.16-21.01ZM600.74 160.83c1.25-5.69-.29-11.05-3.82-13.17.06 4.99-2.02 8.63-6.57 10.51-2.24 9.89 8.06 9.39 14.62 11.48-.06.3-.11.59-.17.89l-10.09-.55c3.7 11.94 17.56 6.17 26.29 11.6-5.02-9.56-8.62-18.92-20.26-20.76M605.57 225.88c-3.89 7.51 1.53 14.69 3.45 21.8-.26.11-.53.21-.79.32l-6.26-9.62-.82.15c-2.39 10.54 4.94 19.78 9.52 28.77 7.95-14.16 7.64-30.23-5.09-41.43ZM599.03 178.92c4.54 10.84 11.83 8.24 16.57 15.32-3.99-1.31-7.46-2.45-10.92-3.58-.23 11.52 14.28 12.75 22.31 17.17-1.29-18.67-10.35-25.74-27.97-28.91ZM543.4 145.7c3.26 5.89 7.4 11.71 13.81 13.68 4.96 0 12.1 3.17 16.19.31.1-15.74-19.09-13.65-29.99-13.99ZM502.64 383.69c-4.1-.32-7.95-.63-12.41-.98.17 2.2.3 3.85.44 5.61 2.48.62 4.6 1.14 6.86 1.71.69 12.96-6.46 13.19-16.11 7.76-2.87 16.45 23.61 14.79 21.23-14.08ZM500.5 354.54c-4.35-1.3-8.63-2.9-12.51-5.53 2.81-3.48 5.43-6.72 8.14-10.08-.79-2.29-1.61-4.66-2.66-7.71-14.62 17.9-14.74 20.5 7.54 28.2-.21-2.03-.35-3.35-.51-4.88M423.49 251.09c-2.42 7.25-8.81 10.78-12.44 16.9 5.86-.41 9.24-2.3 12.6-6.87.6 1.73 1.14 3.31 1.69 4.9 2.44-.19 4.6-.36 6.73-.53 2.34-8.74-2.62-9.7-8.59-14.39ZM466.17 281.29c-2.72 1.61-8.47.92-7.93 5.25-.04 6.3-.01 12.59-.01 18.89.26.07.51.15.77.22 2.11-5.75 13.09-19.91 7.17-24.36M549.38 132.94c.18 10.68 11.26 10.7 19.07 11.64.23-.32.46-.64.68-.96-6.19-8.82-8.84-10.63-19.76-10.68ZM540.56 118.13c-.43 7.53 5.89 11.89 16.38 11.33-2.73-7.62-8.14-11.75-16.38-11.33M491.92 195.77c2.43 11.91 16.61 3.24 24.08.8-8.55-3.98-15.5 1.09-24.08-.8M532.26 106.09c2.2 7.6 5.18 9.22 13 8.11-2.49-6.24-6.52-8.75-13-8.11M525.47 95.53c2.63 6.41 6.45 8.8 10.99 6.63-3.03-6.48-4.6-7.31-10.99-6.63M502.79 313.78c-1.03-1.1-3.22-1.1-4.89-1.6-.17.22-.34.44-.51.67 2.03 3.48 4.06 6.95 6.02 10.31 7.87 0 1.19-6.56-.62-9.37ZM484.11 311.53c-3.45 3.4-11.57 4.48-9.37 10.4 4.01-2.31 8.17-4.1 11.77-6.99-.85-1.21-1.47-2.09-2.4-3.42ZM518 83.74c.56 4.55 5.34 8.54 8.94 7.92 1.13-4.12-4.75-9.59-8.94-7.92M436.97 320.15v.05s.01-.02.01-.03-.01-.01-.01-.02M129.27 158.77c-2.18 2.04 1.08 5.39 3.22 3.28 2.17-2.02-1.11-5.35-3.22-3.28M132.14 164.78c-2.18 2.04 1.08 5.39 3.22 3.28 2.17-2.02-1.11-5.35-3.22-3.28",
    className: "crest_svg__cls-1"
  })), _path6 || (_path6 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "m130.93 149.98-5.84-6.95c.13-.21.22-.44.3-.68l5.59.59-2.71-6.81-4.03 3.3c-.21-.12-.43-.22-.66-.29l-.47-6.58-6.67 2.65 4.18 5.1c-.11.21-.21.42-.27.65v.02l-5.2.37 2.71 6.81 3.66-4.26c.22.12.44.23.68.29 0 .04.53 9.06.53 9.1.93 7.97 13.07 3.07 8.22-3.31ZM105.55 171.39c-3.32-.08-3.41 5.18-.07 5.17 3.37.09 3.43-5.17.07-5.17M105 178.13c-3.32-.08-3.41 5.18-.07 5.17 3.37.09 3.43-5.17.07-5.17M115.78 155.08c-3.32-.08-3.41 5.18-.07 5.17 3.37.09 3.43-5.17.07-5.17M107.69 165.25c-3.32-.08-3.41 5.18-.07 5.17 3.37.09 3.43-5.17.07-5.17M168.87 163.24l-5.66.21c1.49 2.32 2.04 3.46 2.13 5.3-1.14-.47-2.49-1.64-3.99-3.64l.78 8.95c1.06-1.59 1.93-2.69 3.2-3.23-.02 8.49-6.8 11.69-9.26 5.67-.44-2.63 1.79-4.25 4.07-1.89.42-5.41-3.91-5.32-5.8-3.02 2.24-5.19 1.36-8.66-3.23-11.46-2.91 4.86-1.7 8.05 1.96 11.76-3.56-1.82-6.76 1.19-3.59 5.16.68-3.43 3.69-2.64 4.36.1.55 7.55-12.69 9.67-14.14 1.65 1.21-.76 4.05-.49 7.18 1.53l-2.63-8.77c-1.28 3.15-3.09 4.37-5.27 5.32-.18-2.58 1.7-7.68 1.7-7.68-2.61 1.04-7.96 3.17-10.58 4.21 0 0 4.87 2.41 6.51 4.41-2.23.81-4.39 1.17-7.48-.24l4.11 8.19c.89-3.62 2.76-5.77 4.16-6.05 4.46 6.84-6.63 14.37-11.41 8.52-1.4-2.45.25-5.09 3.1-3.06-.42-5.07-4.83-5.05-6.16-1.28.11-5.21-1.2-8.35-6.66-9.89-1.42 5.19.32 8.32 5.52 10.55-2.96-.38-6.16 2.53-2.14 6.18.04-3.28 2.78-3.63 4.26-1.42 2.36 6.06-4.77 8.4-10.62 2.24 1.3-.48 2.69-.28 4.55.14l-5.58-7.04c.29 2.49.1 4.26-.4 5.39-1.2-1.4-1.58-2.6-2.09-5.31l-4.25 3.74c4.06 2.54 8.61 6.57 14.21 14.54 7.41-7.28 37.26-19.76 48.79-19.41-1.41-9.64-.87-15.69.34-20.33ZM300.97 391.91c-13 3.84-24.96-15.16-36.45-4.76-4.58 4.05-1.6 13.04 4.61 13.34 5.5.15 7.07-7.41 2.17-9.77 10.7-3.62 5.56 13.58 1.68 17.98-12.28-6.35-14.31 13.45-2.16 8.25.54 3.54.7 7.03-.15 10.43-13.27-2.86-9.74 16.18.21 8.52 2.87 2.72 4.19 6.96 4.52 11.01-13.3 1.9-2.67 18.97 3.5 7.54 4 2.32 8.45 4.89 12.53 7.21-9.98 12.13 7.91 17.37 6.94 5.53 6.69 2.86 32.99 10.96 22.45-4.77-34.51 1.14-52.09-35.08-33.01-62.75 11.61 5.3 52.39-14.54 49 5.65 2.14 2.25 2.75 2.46 7.59 2.42 11.8-27.11-28.83-19.01-43.42-15.84Z",
    className: "crest_svg__cls-1"
  })), _path7 || (_path7 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M340.64 420.02c-1.14.13-8.96 66.56-13.04 62.66.82-4.38 10.37-62.65 10.37-62.65s-2.84-.4-4.23-.6c-.24 1.35-.54 3.08-.54 3.08l-15.85-20.81-2.09.99 16.97 22.32-1.09 3.95c-1.56-1.01-17.93-23.74-19.57-25.86l-3.34-.25 22.07 28.78-1.17 3.86-24.73-32.52-3.17-.04 26.78 35.3-1.41 5.09-29.41-39.99-3.89.11 32.53 42.94-1.19 3.97-35.91-46.91-.61 3.6s33.42 43.95 35.48 46.83c-1.72 5.41-.4 5.88 1.95 10.35 1.29 5-2.17 12.8-8.1 10.97-.55-.21-1.13-.37-1.86-.6-.93 2.5-2.35 7.06-.14 8.63l11.18 4.78 14.36-10.66 3.88-57.62-4.23.32Z",
    className: "crest_svg__cls-1"
  })), _path8 || (_path8 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M286.45 411.31s-.66 2.15-.95 3.1c2.56 3.35 32.93 43.64 32.93 43.64l2.39-1.17zM285.09 420.55s-.49 3.8 1.28 6.12c7.93 10.06 15.73 20.32 23.46 30.49 1.15.14 3.3.6 3.3.6l-28.03-37.21ZM346.28 409.74c-3.8-.31-7.84-1.06-11.55-1.42-7.23 6.29.9 9.89 6.3 9.4 4.63 1.23 10.81-4.91 5.25-7.98M345.12 572.3c-1.13 5.14 6.97 6.8 7.95 1.62 1.13-5.14-6.97-6.8-7.95-1.62M342.54 539.4c-1.4 6.37 8.64 8.42 9.85 2.01 1.4-6.37-8.64-8.42-9.85-2.01M308.25 522.39c-1.4 6.37 8.64 8.42 9.85 2.01 1.4-6.37-8.64-8.42-9.85-2.01M366.38 588.97c-2.68-1.67-6.2-3.33-9.5-3.33-1.77 0-3.47.48-4.95 1.69 10.48 4.14 6.73 19.95-3.45 20.01-10.18-.06-13.94-15.87-3.45-20.01-1.47-1.21-3.18-1.69-4.95-1.69-3.3 0-6.82 1.66-9.5 3.33-3.02-3.96-5.98-7.82-11.7-8.4 3.13 29.01 16.37 43.51 29.6 43.51s26.47-14.5 29.6-43.51c-5.72.58-8.68 4.44-11.7 8.4m-17.9 31.24c-9.77 0-20.73-10.39-24.81-33.38 1.25 1.14 2.44 2.65 3.84 4.49l2.13 2.8 2.99-1.86c1.28-.8 2.53-1.44 3.69-1.9-1.31 2.66-1.75 5.8-1.14 9.07 1.29 6.9 6.76 11.75 13.33 11.78 6.53-.04 11.99-4.88 13.29-11.78.61-3.27.17-6.41-1.14-9.07 1.16.46 2.4 1.1 3.69 1.9l2.99 1.86 2.13-2.8c1.4-1.83 2.59-3.34 3.84-4.49-4.08 23-15.05 33.38-24.81 33.38ZM270.21 489.44c-1.82-1.1-4.1-.82-5.32.75-4.38 5.02 10.73 12.03 12.8 14.82 1.87 1.44 4.45 1.23 5.76-.47 4.37-5.26-11-12.15-13.24-15.1",
    className: "crest_svg__cls-1"
  })), _path9 || (_path9 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M279.53 491.76c7.76 4.2 14.49 15.29 2.42 18.52-4.54.93-9.2-3.96-12.54-6.38.12 6.56 5.49 11.87 12.08 11.87 16.98.08 14.77-26.86-1.96-24Z",
    className: "crest_svg__cls-1"
  })), _path0 || (_path0 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M294.74 476.8c-6.58-2.21-27.34 2.49-34.3 2.8-4.72.6-8.12 4.83-7.7 9.57 1.05 5.06.9 27.01 4.61 31.05 3.73 7.11 25.57 26.41 31.51 17.29-10.67-5.4-28.73-18.71-21.8-35.61-15.67-9.62-1.82-24.98 10.39-11.93 13.01-8.05 27.46-2.29 40.28 6.61 4.61-9.96-17.76-16.83-22.99-19.79ZM382.54 78.06c-.82 2.24-1.57 4.65-2.25 7.2 29.57 7.43 54.51 27.56 69.49 54.69l9.66 3.09c-15.27-32.16-43.23-56.31-76.89-64.98ZM327.35 78.06c-33.66 8.67-61.62 32.81-76.89 64.98l9.66-3.09c14.98-27.14 39.92-47.26 69.49-54.69-.68-2.55-1.43-4.96-2.25-7.2ZM427.67 80.35c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M403.27 66.46c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M390.04 61.66c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M415.85 72.72c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M438.59 89.21c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M466.18 139.83c-.1 6.9 10.74 6.9 10.64 0 .1-6.9-10.74-6.9-10.64 0M459.75 127.33c-.1 6.9 10.74 6.9 10.64 0 .1-6.9-10.74-6.9-10.64 0M448.51 99.18c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M452.06 115.48c-.1 6.9 10.74 6.9 10.64 0 .1-6.9-10.74-6.9-10.64 0M282.21 80.35c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M271.3 89.21c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M238.38 134.51c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M294.04 72.72c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M252.51 110.16c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M244.81 122.01c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M319.84 61.66c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M261.37 99.18c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M306.62 66.46c-6.9-.1-6.9 10.74 0 10.64 6.9.1 6.9-10.74 0-10.64M373.85 68.85c-8.46 18.53-9.75 44.03-9.75 57.66h7.09c.01-22.45 3.25-41.87 9.11-54.72 1.97-4.14-4.58-7.18-6.45-2.95ZM336.03 68.85c-1.87-4.22-8.42-1.2-6.45 2.95 5.87 12.84 9.1 32.27 9.11 54.72h7.09c0-13.63-1.29-39.13-9.75-57.67M354.94 114.9c-7.48-.11-7.48 11.64 0 11.53 7.48.11 7.48-11.64 0-11.53M354.94 100.46c-7.48-.11-7.48 11.64 0 11.53 7.48.11 7.48-11.64 0-11.53M354.94 86.01c-7.48-.11-7.48 11.64 0 11.53 7.48.11 7.48-11.64 0-11.53M350.87 83.45c2.44-1.29 5.72-1.29 8.16 0 8.26-12.73-16.42-12.72-8.16 0",
    className: "crest_svg__cls-1"
  })), _path1 || (_path1 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M350.36 71.32c2.67-1.65 6.49-1.65 9.17 0 6.42-11.95-15.59-11.94-9.17 0",
    className: "crest_svg__cls-1"
  })), _path10 || (_path10 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M372.38 32.38h1.88V6.24h-1.88c-.89 4.79-6.58 8.65-13.95 9.59.94-7.37 4.8-13.07 9.59-13.95V0h-26.14v1.88c4.79.89 8.65 6.58 9.59 13.95-7.37-.94-13.07-4.8-13.95-9.59h-1.88v26.14h1.88c.89-4.79 6.58-8.65 13.95-9.59-.94 7.37-4.8 13.07-9.59 13.95v1.88h9.35c-.44.33-.83.72-1.17 1.16-16.68 3.72-18.39 29.16-2.45 35.15-6.22-6.01-1.44-17.56 7.34-17.26 8.78-.3 13.56 11.25 7.34 17.26 15.94-5.99 14.22-31.43-2.45-35.15a6.4 6.4 0 0 0-1.17-1.15h9.35v-1.88c-4.79-.89-8.65-6.58-9.59-13.95 7.37.94 13.07 4.8 13.96 9.59ZM580.59 428.91c.15 1.2.69 2.29 1.64 2.98l.03.02c-.6-1.02-1.17-2.04-1.67-3.01ZM231.1 406.8c-1.49-.31-19.78 3.05-19.78 3.05s17.38-20.27 16.94-22.68l-29.61 3.33.63 5.1 17.41-2.42s-14.47 16.33-15.16 16.64l1.65 6.38 29.34-3.64-1.42-5.78ZM255.58 462.22c-1.91 3.14-6.15 6.22-9.44 8.51l-7.6-10.51c3.21-2.41 7.45-5.47 11.03-6.3l-4.95-6.85c-5.26 6.47-16.1 14.31-23.88 17.28l4.95 6.85c1.9-3.13 6.1-6.18 9.38-8.47l7.6 10.51c-3.2 2.4-7.41 5.43-10.98 6.26l4.95 6.85c5.26-6.47 16.1-14.31 23.88-17.28l-4.95-6.85ZM199.06 370.82l-.41 6.27c8.38-1.57 21.89-1.57 30.25.07l.41-6.27c-8.38 1.57-21.89 1.57-30.25-.07M435.54 486.36c-8.5-2.41 2.24-11.05 7.87-9.15l.14-.12-4.26-5.04c-6.38 2.78-16.54 11.36-11.13 18.63 3.75 4.79 11.32-.32 16.27-.26 8.21 1.48-.62 10.03-5.7 9.54l-.08.11 3.22 3.81c17.95-7.85 13.94-25.7-6.32-17.53ZM468.19 416.15l-4.83 16.42 4.86 4.13.09-.05c-.37-3.79.14-8.03 1.53-12.74l8.84 2.57c-.88 2.57-2.44 8.42-3.65 9.96l4.42.66 2.82-9.57 8.47 2.46c-1.01 3.17-2.41 5.65-4.2 7.45l4.52 4.15 5.09-17.3c-2.57.18-25.88-6.6-27.95-8.13ZM459.03 443.83l-2.53 4.81c.86 1.12 15.87 9.97 15.87 9.97s-24.72 3.24-25.88 5.15l22.99 15.77 2.68-3.87-13.8-8.96s20.25-2.32 20.92-2.11l2.75-5.36-22.99-15.4ZM416.82 487.29l-15.19 8.78.68 6.23.11.02q3.6-4.5 10.14-8.28l4.73 7.72c-2.47 1.29-7.75 4.53-9.74 4.84l2.81 3.4 8.85-5.12 4.53 7.39c-2.99 1.64-5.78 2.53-8.38 2.66l.41 6.02 16-9.25c-2.04-1.57-14.5-21.93-14.95-24.42ZM237.3 318.75c-4.77-3.77-10.93 2.97-15.75 4.07-8.33.49-1.75-9.89 3.3-10.61l.05-.13-4.02-2.94c-7.54 3.83-13.26 20.16-1.08 20.51 2.58.13 9.19-4.45 11.35-4.95 5.73-1.07 3.91 6.61.48 8.43 1.7-.07 3.47-.31 5.11.13 3.18-4.48 5.22-10.99.58-14.51ZM243.21 289.53v-5.59c-20.92-1.25-20.6 31.94 0 31.24v-5.2c-13.35-.87-16.14-23.94 0-20.45M292.32 254.7l-7.25-5.52-22.27 13.32 2.55 8.55.13.04c1.8-3.54 4.51-6.39 7.49-8.05.67 1.23 1.89 3.43 3.4 6.1.05-.03 9.16 0 9.21 0-3.48-5.51-6.28-10.04-6.28-10.04 3.19-1.87 10-4.6 13.03-4.4ZM341.39 265.27c-2.21-.66-5.15-2.39-8.81-5.18 11.22-15.4-12-31.23-23.71-17.27-11.12 11.7 3.84 29.93 17.7 22.15 4.77 2.55 10.43 4.02 14.86.44l-.05-.13Zm-16.98-4.45c-9.93 4.09-19.43-13.3-8.4-17.52 9.88-4.07 19.54 13.17 8.4 17.52M373 235.6h-9.9c2.11 4.22 1.32 13.22 1.46 18.1.07 3.49-3.24 5.8-6.57 5.74-8.46 1.04-5.59-19.38-4-23.83h-9.9c2.04 4.12 1.37 12.54 1.47 17.32-.79 11.71 10.75 14.75 19.32 8.66 0 1.32-.09 2.27-.28 2.85h8.39c-2.32-7.68-2.32-21.15 0-28.83ZM387.99 239.38c.08 7.63-4 19.52-6.58 26.79q2.95.39 6.09.99c1.75-7.1 4.24-19.19 8.18-25.2l-7.69-2.57ZM449.97 366.26c.04-1.61-1.77-2.81-3.32-2.28v.35c-2.75 12.41-1.56-36.32-1.7-38.15l2.6 1.07v-6.16l-2.62 1.07v-39.05c.38-1.96 3.43-.29 1.75.98v.36c3.6 1.14 4.65-4.61.8-4.67l2.4-4.16-.57-.55s-4.3 2.36-4.34 2.33c-.06-3.57-6.1-2.7-4.96.77h.37c1.28-1.55 3.15 1.22 1.06 1.63h-36.02l1.12-2.43H400l1.12 2.43h-35.99c-2.17-.31-.34-3.22.99-1.64h.36c1.18-3.46-4.9-4.34-4.94-.77-.04.04-4.31-2.34-4.35-2.33l-.58.55 2.4 4.16c-3.85.06-2.79 5.82.81 4.67v-.36c2.72-12.4 1.56 36.29 1.7 38.04l-2.54-1.04v6.16l2.55-1.04c-.19.9 1.06 50.45-1.71 38.13v-.35c-3.6-1.13-4.66 4.62-.8 4.67l-2.41 4.16.58.55s4.3-2.37 4.35-2.33c.04 3.58 6.13 2.69 4.94-.76h-.36c-.56.84-2.05.4-2.02-.61 0-.52.43-.95.97-1.03h36.07l-1.14 2.46h6.54l-1.12-2.46h35.98c.54.07.97.5.97 1.03.03 1.01-1.46 1.45-2.01.61h-.38c-1.14 3.47 4.92 4.33 4.97.76.04-.04 4.29 2.34 4.32 2.33l.59-.55-2.4-4.16c1.39-.01 2.51-1.07 2.51-2.39m-7.53.02h-78.36v-42.31h.01-.01v-41.76h78.36z",
    className: "crest_svg__cls-1"
  })), _path11 || (_path11 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M367.2 358.64v4.63h72.14v-78.05H367.2zm32.43 2.31h-.04zm7.22 0h.04zm-37.2-33.25v-.02.2c0 .22.01.56 0 .58.13-1.47 2.49-.4 1.31.61l.37.35c2.38.28 2.73-3.29.31-3.42v-.08l2.87-1.25v-.86l-2.87-1.27v-.09c2.42-.15 2.07-3.7-.31-3.43l-.37.37c1.18 1-1.18 2.07-1.31.6 0 .1-.02.81.02.88h-.03v-31.02h2.46v-2.32h26.72c1.49.25.23 2.29-.72 1.22l-.38.36c-.29 2.33 3.69 2.5 3.66.15l1.41 2.84h.92l1.37-2.84c-.02 2.34 3.95 2.18 3.67-.16l-.39-.36c-.94 1.07-2.21-.96-.72-1.22h26.77v2.32h2.46c-.28-.54.97 38.07-1.29 29.53l-.39-.37c-2.36-.28-2.71 3.3-.3 3.43v.09l-2.88 1.26v.86l2.88 1.25v.08c-2.4.13-2.06 3.7.3 3.42l.39-.35c2.2-8.55 1.08 28.69 1.27 29.58h.02s-.01.02-.02 0h-2.45v2.31h-26.72c-1.53-.21-.32-2.32.69-1.24l.38-.36c.29-2.28-3.57-2.53-3.66-.25h-.06l-1.36-2.76h-.91l-1.34 2.76h-.06c-.09-2.27-3.9-2.04-3.65.25l.38.36c1.01-1.09 2.22 1.03.68 1.24h-26.69v-2.31h-2.46v-30.94Zm67.23-6.85v.02z",
    className: "crest_svg__cls-1"
  })), _path12 || (_path12 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M369.75 328.45s-.03.03 0 .06zM119.47 160.21c-6.25 4.54-9.91 12.09-10.19 20.43l1.74-1.44c.68-7.2 4.07-13.62 9.57-17.57-.37-.51-.75-.99-1.12-1.43ZM120.87 157.7c-.79-.81-2.08.39-1.28 1.17 2.43 2.44 4.77 6.57 6.6 11.63l1.67-.55c-1.11-3.07-3.49-8.73-7-12.25ZM111.17 159.65c-3.32-.08-3.41 5.18-.07 5.17 3.37.09 3.43-5.17.07-5.17M156.53 150.13c-2.36 2.4 1.44 6.04 3.74 3.57 2.34-2.38-1.47-5.99-3.74-3.57M161.72 154.46c-2.36 2.4 1.44 6.04 3.74 3.57 2.34-2.38-1.47-5.99-3.74-3.57M137.72 146.01c-2.36 2.4 1.44 6.04 3.74 3.57 2.34-2.38-1.47-5.99-3.74-3.57M150.65 147.36c-2.36 2.4 1.44 6.04 3.74 3.57 2.34-2.38-1.47-5.99-3.74-3.57M138.8 152.23c.05.57.13 1.17.23 1.8 6.67-1.16 13.63.91 19.24 5.47l2.24-.23c-6.15-5.64-14.1-8.31-21.72-7.04ZM137.33 151.38c0-1.12-1.76-1.03-1.73.09.06 4.97 2.43 10.62 3.84 13.57l1.57-.8c-2.33-4.85-3.64-9.42-3.68-12.86M144.22 145.92c-2.36 2.4 1.44 6.04 3.74 3.57 2.34-2.38-1.47-5.99-3.74-3.57M439.24 427.37c-3.68-3.55-9.8 3.21-13.52-.53 7.48-.14 24.85-8.36 12.23-15.17-7.06-1.19-14.09 2.26-20.89 3.85-27.35 10.87-11.32-2.42-28.3-.97 5.73 14.5 20.2 7.01 31.05 3.63.33 1.59-1.67 1.97-1.41 3.57 3.65-.76 7.14-1.48 10.57-2.19 1.49-7.11 14.48-7.19 8.53-.06-14.97 6.53-32.64 5.32-48.31 9.77-10.48 27.44-28.69 8.77-28.52 16.63-4.1.39-4.04 4.32.17 3.99.09 7.99 20.28-1.27 24.03-3.72.9-1.93 1.73-3.7 2.58-5.52 6.14 2.99 10.46-5.84 15.78-7.41 5.3-1.06 12.21-6.24 16.73-1.45 5.03 5.56 12.55-2.92 16.99 2.69-1.68 4.33.53 2.42 1.27 5.14-.07 2.43 3.99 2.4 4.05-.05-.02-1.07.11-1.74 1.16-2.17 2.25-3.41-2.53-7.19-4.2-10.03Z",
    className: "crest_svg__cls-1"
  })), _path13 || (_path13 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M444.89 398.41c-1.95-1.83-9.65 1.92-9.87-1.89 5.73 1.29 16.75-6.18 9.18-11.02-12.81-2.99-26.88 3.19-39.87 4.66-5.11 1.14-2.55-7.19-13.84-4.95 7.27 15.17 22.95 4.43 35.12 4.3.08 1.37-2.31 1.29-1.73 2.98 3.54-1.1 9.56.79 11.59-2.74 1.1-4.31 10.18-3.29 7.51 1.69-6.8 4.35-16.95 2.36-24.94 3.25-9.79.82-20.47 1.05-29.62 4.47-1.81 5.68-4.33 11.52-10.87 12.88-4.58-4.45-11.23.8-16.14-3.7-1.61.33-1.91 1.28-2.55 2.5-2.41.91-3.23 2.29-.75 3.91 1.22.4.76 1.85 1.33 2.58 6.45.44 12.89-1.28 19.39-2.08 4.86 0 4.68-4.28 8.24-4.87 8.59.45 13.93-7.14 22.02-8.36 6.48-1.83 15.22-4.23 20.95.32 1.39 1.54 3.39 1.84 5.46 1.45 2.74-.48 6-1.07 7.44 2.11-.47.49-.92.96-1.56 1.62.28.59.6 1.28.93 1.98 1.35-.09 1.54.99 2.07 1.87.73 1.2 2.43 1.22 2.71-.01.34-1.52 1.91-.76 2.39-2.08.26-3.96-.61-8.88-4.57-10.86ZM430.2 454.63c-12.81-1.65-10.87 7.17-17.17 5.09 1.14-1.4 4.27-2.19 3.25-4.3-9.38 4.1-19.25 7.03-28.6 11.25-4.75 5.04-3.19 15.12-13.93 16.04-.39 5.24-7.73 8.78-12.27 6.43-1.83 1.71-1.04 2.16-.76 3.74-1.54 1.4-3.67 4.63-.32 4.6 1.05-.22 1.86-1.78 2.95-1.28-.08.68-.15 1.35-.24 2.12.88-.01 2.07.29 2.38-.1 1.47-1.85 3.59-.33 5.24-1.78 5.51-3.7 13.38-7.1 12.95-14.81 9.73-4.28 15.37-20.02 28.06-14.47 6.26 3.38 7.97-6.77 13.59-6.99 1.6 3.71 2.35 3.41 4.37 2.18 3.53 2.7 2.92-1.57 4.31-3.56.17-1.94-1.81-4.21-3.81-4.17Z",
    className: "crest_svg__cls-1"
  })), _path14 || (_path14 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M388.5 388.16c-.98-2.35-4.65-.6-5.59-3.34-2.33-3.19-5.41-.59-7.3 1.55-1.42.17-2.82-.54-4.14.12-1.35 2.47 2.39 3.96.82 6.49-2.04 5.81.06 13.54 5.46 16.76 6.19-2.77 10.16-10.87 7.99-17.65 1.47-1.24 3.3-1.86 2.75-3.94ZM381.5 456.98c-1.77-3.8-5.59-4.18-8.23-.98-.93 1.16-2.32.74-3.53.87-2.57 1.2-1.15 4.02 1.11 4.65-1.23 4.36-1.87 8.72-.15 12.99 6.02 14.41 15.08-3.92 12.82-11.73 4.16-3.43 3-5.45-2.02-5.79ZM387.24 421.01c-1.17-.68-2.64-.71-3.94-.61-2.14-5.61-6.01-3.48-9.14-.14-4.66-1.85-3.96 2.34-1.5 4.62-2.33 5.7-.72 14.16 5.34 16.6 6.39-2.66 8.15-10.42 7.77-16.68 2-.31 3.6-2.55 1.47-3.79M433.1 439.88c-11.46-3.84-29.48 21.08-37.09 13.74-1.86-4.01-7.54-3.57-11.12-2.48 4.3 3.1 6.65 9.92 13.18 7.69 7.37-1.43 13.16-7.38 19.53-10.12.17 2.14-2.01 3.06-2.9 5.1 4.37-1.38 8.3-2.6 11.52-5.39-.55-12.06 16.7-3.61.15 3.81 2.94.07 5 1.39 6.97-1.03 3.8-3.39 4-8.3-.24-11.33ZM407.07 467.79c-3.36.85-6.73 1.13-8.81 4.57.84 1.13 1.64 2.2 2.5 3.37-1.6 4.17-5.75 3.46-9.62 3.64.36 1.31.55 2.03.8 2.91-1.65.87-2.28 2.33-1.94 4.39.43.15.95.32 1.47.5 1.09-1.34 3.03-2.71 3.49-.19 7.04-2.29 13.34-6.59 16.69-13.16-2-1.54-3.71-3.37-4.57-6.03Z",
    className: "crest_svg__cls-1"
  })), _path15 || (_path15 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M415.14 431.66c-3.34 1.08-7.14 1-9.14 4 1.2 1.28 2.25 2.39 3.41 3.63-2.25 1.25-4.86 3.36-7.3 1.34-1-.91-3.79-.49-3.11 1.27.1.26-.06.62-.09.94-.43.05-.77.1-1.11.13-1.49 0-1.82 1.92-.79 2.8 1.01 1.12 2-.1 3.15.23.04.63.07 1.17.1 1.67 6.14.36 15.45-5.12 18.72-10.08-1.31-2.03-2.54-3.94-3.82-5.93ZM364.11 467.24c2.04-2.84 1.12-6.5-2.67-4.17-.96-1.92-2.38-2.28-4.13-1.8-.5 1.23-.77 2.41.56 3.36.08.06-.02.37-.04.56l-1.23.41c-.94 2.44 1.47 3.86 2.35 5.77 2.64 4.21 6.57 14.34 12.69 9.04-2.28-4.45-5.86-8.51-7.53-13.17M366.34 390.88c.56-1.15.37-2.5-.8-3.43q-2.07.55-3.63-.44c-2.67-1.33-3.05 1.62-2.81 3.51l-1.74.8c1.85 5.28 7.38 18.52 14.28 15.84-.33-6.15-7.45-10.1-5.29-16.28ZM365.72 427.21c.29-1.26-.18-2.51-1.24-3.63-2.27.68-7.03-4.48-5.29 1.65-1.41.49-2.25 1.48-1.28 2.82 2.61 3.99 3.33 10.33 7.78 12.64 2.03 0 5.16 1.85 6.35-.56-1.3-4.75-7.17-7.5-6.33-12.91ZM336.34 291.05c-2.3 1.08-5.33 2.15-7.12-.59 3.96-1.61 8.86-1.21 11.56-4.93 2.02-2.45 1.84-7.37-2.01-8.68-9.98-2.77-20.55 2.29-30.65 3.16-18.95 5.13-5.43-4.06-20.46-3.99 5.38 15.4 21.54 5.5 32.76 4.38-.8 1.81-2.65 2.5-3.39 4.12 3.96-.76 9.19.73 12.14-2.34 1.53-4.24 11.57-4.72 9.2 1.02-9.46 9.24-39.11.58-52.3 6.52-1.97 6.02-5.47 10.02-11.23 11.66-4.72-2.91-6.85.41-11.56-.89-1.31-1.45-2.64-3.07-4.69-1.48 0 .61.02 1.33.03 2.17-2.23-.64-4.74 2.45-2.35 3.85.98.06 1.96-1.07 2.97-.06l-.28 1.59c6.24 2.71 13.11-.36 19.3-2.03 2.45-.76 3.86-3.23 6.56-3.18 6.4.46 10.05-4.91 15.55-6.45 6.8-1.29 13.69-2.37 20.63-2.24 7.97 10.87 9.41 1.64 16.55 5.33-.21 1.05-.41 2.09-.62 3.21.72.25 1.3.45 1.86.64-.7 2.7 3.31 4.28 3.86.85.07-.4-.11-.94.47-1.01 4.25-2.32-2.28-13.55-6.78-10.61Z",
    className: "crest_svg__cls-1"
  })), _path16 || (_path16 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M286.42 280.7c-.23-.85-.42-1.54-.63-2.33-1.41-.06-2.69-.11-3.91-.16-2.82-3.62-4.51-3.7-7.87-.44q-2.29-.86-3.83 1.16c.56 1.17 1.3 2.04 2.5 2.62-3.49 6.41-2.48 12.18 1.69 17.56 7.78.28 10.94-10.34 9.68-16.77.81-.56 1.57-1.09 2.37-1.64M320.73 295.83c-.91-3.52-7.41-.64-10.1-.51-.35 1.79 1.29 2.57 1.59 3.96-2.08 1.35-4.34 1.43-6.55 1.72-1.17-1.17-1.64-3.27-3.68-2.66-1.16.28-.51 1.5-1.37 1.99q-2.26-.19-2.6 2.09l2.1 1.25c-1.7 8.04 20.22-.32 23.46-2.71-1.06-1.8-2.43-3.04-2.84-5.13ZM266.5 288.24c-2.49-2.56-3.3-6.09-.76-8.83-1.27-1.21-2.96-.22-4.2-1.93-1.59-1.82-2.54.28-2.92 2.2-4.47.65-1.89 2.1-.89 4.49 1.48 4.12 6.76 13.99 11.92 12.14-.24-2.81-.93-6.1-3.16-8.06ZM335.81 326.29c-2.32 1.09-5.37 2.17-7.18-.6 3.99-1.63 8.93-1.22 11.65-4.97 2.03-2.47 1.85-7.43-2.03-8.75-10.07-2.79-20.72 2.3-30.9 3.19-19.1 5.18-5.47-4.09-20.62-4.02 5.42 15.52 21.72 5.55 33.03 4.41-.81 1.82-2.67 2.52-3.42 4.16 4-.77 9.27.74 12.24-2.36 1.55-4.27 11.66-4.76 9.27 1.03-9.54 9.32-39.43.58-52.72 6.57-1.99 6.07-5.51 10.1-11.33 11.75-4.03-2.49-6.2-.47-9.65-.6.14 1.13.48 2.22.76 3.33.29 1.13.41 2.28.49 3.44 4.01-.44 8.07-1.98 11.86-3.01 2.47-.76 3.89-3.26 6.61-3.21 6.46.47 10.14-4.95 15.68-6.51 6.85-1.3 13.8-2.39 20.8-2.26 8.03 10.96 9.48 1.65 16.69 5.37-.21 1.06-.41 2.1-.63 3.24.72.25 1.31.45 1.88.64-.71 2.73 3.34 4.31 3.89.85.07-.41-.11-.95.48-1.02 4.29-2.33-2.29-13.66-6.84-10.7Z",
    className: "crest_svg__cls-1"
  })), _path17 || (_path17 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M285.49 315.85c-.23-.85-.42-1.55-.63-2.35-1.42-.06-2.71-.11-3.94-.16-2.84-3.65-4.55-3.73-7.93-.44q-2.31-.87-3.86 1.17c.57 1.18 1.31 2.06 2.52 2.64-3.52 6.47-2.5 12.28 1.7 17.7 7.84.28 11.03-10.42 9.76-16.9.82-.57 1.58-1.1 2.39-1.66ZM320.07 331.11c-.91-3.55-7.47-.64-10.18-.52-.35 1.81 1.3 2.59 1.6 3.99-2.1 1.36-4.37 1.44-6.61 1.74-1.18-1.18-1.65-3.3-3.71-2.68-1.17.28-.52 1.51-1.38 2q-2.27-.19-2.62 2.11c.69.41 1.42.85 2.11 1.26-1.71 8.1 20.38-.32 23.66-2.73-1.07-1.81-2.45-3.06-2.87-5.17M265.4 323.46c-2.51-2.58-3.32-6.14-.77-8.9-1.28-1.22-2.98-.23-4.23-1.95-1.6-1.83-2.56.28-2.94 2.22-4.51.65-1.91 2.12-.9 4.52 1.5 4.15 6.81 14.1 12.02 12.24-.24-2.84-.94-6.15-3.18-8.13M336.59 359.32c-2.32 1.09-5.36 2.17-7.17-.6 3.98-1.62 8.92-1.22 11.64-4.96 2.03-2.47 1.85-7.42-2.03-8.74-10.05-2.79-20.69 2.3-30.86 3.18-19.08 5.17-5.46-4.09-20.6-4.01 5.42 15.5 21.69 5.54 32.99 4.4-.81 1.82-2.66 2.52-3.42 4.15 3.99-.77 9.26.74 12.23-2.35 1.54-4.26 11.64-4.75 9.26 1.03-9.53 9.3-39.38.58-52.65 6.56-1.98 6.06-5.5 10.09-11.31 11.74-4.75-2.93-6.9.41-11.64-.9-.46-.51-.93-1.04-1.42-1.45a.9.9 0 0 1-.35-.26c-.18-.12-.36-.21-.55-.29.02.07.05.14.05.22.08 2.78-.59 5.49-1.67 8.03 6.18 2.44 12.94-.54 19.04-2.19 2.47-.76 3.89-3.25 6.6-3.2 6.45.47 10.12-4.94 15.65-6.5 6.84-1.3 13.78-2.38 20.77-2.26 8.02 10.95 9.47 1.65 16.67 5.36-.21 1.06-.41 2.1-.63 3.23.72.25 1.31.45 1.88.64-.71 2.72 3.34 4.31 3.88.85.07-.41-.11-.95.48-1.02 4.28-2.33-2.29-13.64-6.83-10.68Z",
    className: "crest_svg__cls-1"
  })), _path18 || (_path18 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M286.33 348.89c-.23-.85-.42-1.55-.63-2.35-1.42-.06-2.71-.11-3.94-.16-2.84-3.64-4.54-3.72-7.92-.44q-2.3-.87-3.86 1.17c.57 1.18 1.31 2.05 2.52 2.63-3.52 6.46-2.5 12.27 1.7 17.68 7.83.28 11.02-10.41 9.74-16.88.82-.56 1.58-1.09 2.39-1.66ZM320.87 364.12c-.91-3.54-7.46-.64-10.17-.52-.35 1.8 1.3 2.58 1.6 3.99-2.1 1.36-4.36 1.43-6.6 1.73-1.18-1.18-1.65-3.29-3.7-2.68-1.16.28-.51 1.51-1.38 2q-2.27-.19-2.62 2.11c.69.41 1.42.85 2.11 1.26-1.71 8.09 20.36-.32 23.62-2.73-1.07-1.81-2.45-3.06-2.86-5.16M266.27 356.48c-.47-.49-.88-1.01-1.23-1.55-.14 1.45.62 3.13.36 4.56-.2 1.11-.52 2.78-.84 3.86 1.81 1.76 2.89 1.97 4.88 1.25-.24-2.83-.94-6.14-3.18-8.12ZM395.83 308.57c-3.77-3.28-6.05-6.51-6.13-9.52-.16-.98 2.15-2.29 1.97-3.22-.09-3.43-2.93.42-4.05-.14-.61-.99-2.74-3.8-4.05-2.43-.81.39.2 2.41-.45 2.89-.3.39-.48.46-1.38.44-3.04-.05-3.44 1.84-.96 2.99 1.72 1.08 3.01 6.12 4.04 6.83 1.96 2.58 6.05 9.46 10.06 8.04v-.11c1.19-.48 2.33-3.94 2.4-4.43-.03-.14-.71-.76-1.46-1.35Z",
    className: "crest_svg__cls-1"
  })), _path19 || (_path19 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M416.33 297.29c-.63-1.22-2.15-.3-4.22-.97-1.53-.71-5.58-1.96-7.22-1.05-1.17 1.41-8.03 1.56-6.79 3.6.27.76.76 2.49.76 2.49l3.13.37.05 2.27-2.99.65c-1.86 2.73 4.46 2.94 6.1.82 1.12-1.32 2.89-1.52 2.82-.06-.85 1.81-3.88 2.72-5.64 3.59-2.64.44-3.34 5.63-5.37 7.35-5.75 1.06-7.82.93-13.5-3.7-2.08-2.39-3.73-.59-2.16 1.29-1.02.34-6.3-2.64-3.91 2.44l.39.47c-2.6 3.75 1.27 2.48 3.45 3.64 4.63 1.85 9.72 3.25 15.7 2.24 1.01-1 4.05-3.96 4.39-4.61.3-.67.41-.71 2.55-.89 5.88-.84 8.85-3.24 10.52-9.55.81-1.89-.23-6-1.44-6.89-.46-.33-.67-.94-.38-1.15 1.09-.16 3.38-1.05 3.77-2.33Z",
    className: "crest_svg__cls-1"
  })), _path20 || (_path20 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M431.03 299.33c-8.49.58-16.85 6.28-12.65 15.81 2.58 5.39 2.02 4.97-3.04 3.96l2.44 5.05s5.24 2.34 5.95 3.04c2.94 2.15 2.45 8.11-.2 7.44-4.35-1.78-6.95-7.92-9.96-11.73-.8-.62-2.88-6.83-4.25-5.26-17.95 4.01 3.25 8.62-.01 15.28-.63.95-2.63 5.6-1.81 6.3 1.51 1.85 4.89 3.2 6.67 5.55 2.92 2.85.29 6.15-3.32 3.49-2.05-1.55-4.5.68-2.4 2.75.14.4-1.25.98-1.5 1.15-2.14 2.93 1.4 2.78 3.27 1.31 1.04-.5 0 2.58 1.74 2.07 3.27-.72 8.35-2.38 9.25-7.5 2.03-4.7-2.68-3.94-3.84-8.04-1.18-1.68-1.26-7.88 1.29-5.6 2.36 2.98 5.56 4.7 8.47 2.04 2.69-2.53.24-8.68-1.14-11.4-2.6-5.41-5.59-10.62-5.38-17.09 3.64-4.31 7.86 3.38 10.43-8.62Z",
    className: "crest_svg__cls-1"
  })), _path21 || (_path21 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M401.69 329.28c-4.49-.22-7.92-.59-6.67 4.75.25 1.28.73 5.17 1.49 6.07.32.51.27 1.04-.13 1.39-1.81 1.02-8.67-1.77-7.85-4.11 0-1.94-1.94-2.39-2.52-1.01-.31.61-.79.59-1.48-.17-1.27-1.82-3.03.64-2.31 2 .28.54-.06 1.14-.71 1.24-1.89.77-1.78 3.35.84 3.45 5.72 2.65 10.71 5.38 17.36 4.45l-.11.03c7.26-.58 3.51-1.94 3.2-6.99-1.24-5.43 8.03-8.99-1.11-11.11ZM423.65 401.16c-3.46.26-6.8-.23-9.79 1.41-.3 1.58.79 2.42 1.57 3.78-2.46 1.04-4.62 1.57-6.92.53-.47-.43-1.66.06-1.8.35.05 2.47-2.56 1.74-3.34 3.43.51 1.02 1.24 1.83 2.35 1.73 1.39-.13 1.28 1.59 2.54 1.68 5.98-2.72 13.08-2.06 18.16-6.73-1.9-1.62-2.36-3.84-2.77-6.17Z",
    className: "crest_svg__cls-1"
  })), _path22 || (_path22 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M504.18 339.65c-2.36-5.05-7.81-33.33-15.74-27.19 36.12 67.44 12.03 156.12-50.66 198.83-18.39 11.1-41.21 29.54-62.97 17.25 14.05-54.71 81.35-31.61 95.98-135.92-1.8-.88-2.48-1.44-4.13-1.73-2.1 14.58-5.77 28.59-11.22 42.04 5.84-15.53 2.13-64.13 3.22-66.8-.6-.8-1.24-1.1-3.23-3.56.36 5.87-.03 8 .03 15.77H353.33V271.81h100.24v60.1c-.05.33.39 3.18.6 4.23 1.43-2.19 1.55-2.11 2.51-2.83V268.7H246.44l-.19 54.45h3.11v-51.34h100.86v106.53h-97.28c-.29.29.06-1.67-.26-1.39-.02-.29-.67 1.68-.66 1.39h-2.72c-.05-4.97.06-8.02.06-8.17l-3.1-.12c-2.26 8 4.4 74.84 15.37 86.57-21.95-21.28-28.86-59.07-24.76-87.53 0 0-2.05-1.58-4.29-3.63-6.9 40.09 8.27 79.64 36.36 108.33 2.46 2.62 5.14-.2 8.13-.95-.61-.65-1.92-1.66-2.84-2.93 1.11 1.15 2.09 2.16 2.84 2.93l-1.56-4.31c-22.06-16.86-25.69-65.02-26.16-87.08h100.88s-.07 133.58-.14 133.88c-21.46-1.05-35.97-24.33-56.67-24.6 29.75 17.64 84.17 60.15 118.54 41.53.27.33.21.26.48.59-3.61 4.53-16.34 13.08-22.03 10.9-9.36-5.64-23.79 4.63-17.16 15.08.85 1.22 1.37 2.32.38 3.93-37.17-3.5-70.59-25.7-101.91-44.72-.31.33-.25.27-.55.6 12 16.21 54.89 36.36 54.89 36.36l-.03 24.1s2.75 1.83 4.55 3.03v-26.07c11.25 3.86 34.05 11.01 34.05 11.01l.07 16.28 4.34-2.77-.23-12.19 6.09-1.68a8 8 0 0 0 5.82-8.66c-1.8-.9-3.07-2.76-2.51-5.3.9-4.75 6.63-4.85 8.98-2 4.66 2.07 9.23-3.52 13.81-4.85 6.47-3.92 14.45-7.38 17.44-14.84.57-1.84 1.58-2.98 3.14-3.89 13.05-7.42 25.7-15.6 36.35-26.29 45.52-38.49 61.41-104.62 46.25-161.23m-150.83 41.8h102.11c8.35 78.04-37.4 104.16-102.11 131.37zm1.84 139.42c7.23-6.43 12.23-8.67 21.53-10.88-2.57 5.77-5.02 11.27-7.61 17.09-4.66-2.08-9.24-4.12-13.93-6.2ZM258.57 528.31c-57.8.09-115.41 24.77-173.23 24.77-6.94 0-13.87-.35-20.81-1.15 17.91 14.15 16.66 42.52 42.71 42.52 1.13 0 2.31-.05 3.54-.16 35.41-3.78 70.63-13.76 105.47-19.3 6-.9 34.85-7.97 51.74-7.97 6.09 0 10.62.92 11.97 3.37 1.83 3.33-9.65 13.01-9.73 13.38-.02.11.03.16.16.16 1.11 0 7.48-3.68 12.23-6.81 18.86-13.55-20.65-48.81-24.05-48.81m-121.72 47.96c-3.15 7.47-12.56 9.18-19.89 10.48.35-2.32-4.13-23.94-5.51-25.91 12.72-5.45 30.9-.18 25.4 15.43m7.51 4.73c.38-7.49-2.17-19.46-5.56-26.15l7.38-1.37c-.38 7.5 2.18 19.42 5.57 26.12l-7.39 1.41Zm28.59-5.51-15.3 2.99c.15-3.93-4.78-24.17-6.06-26.11l16.37-3.12-1.61 5.15c-2.21-.62-4.8-.64-7.75-.05l1.77 7.7 8.82-1.95 1.42 3.75c-1.75-.29-7.07 1.04-9.5 1.46l1.85 8.05c4.34-.96 7.93-2.4 10.77-4.34l.08.05-.87 6.42Zm15.26-3.2c-11.03.25-13.65-15.74-15.35-24l5.06-.98c2.55 6.77 2.27 23.31 13.63 21.22 6.88-1.82 2.06-17.73.55-23.89l4.74-1.03c2.01 10.45 7.42 29.75-8.63 28.67Zm43.71-8.19-15.01 2.86c.29-2.29-5.17-24-6.46-25.92l16.18-3.05-1.09 6.23c-2.22-.6-4.8-.59-7.75.02l1.84 7.69 8.81-2.03 1.46 3.73c-1.76-.27-7.06 1.1-9.48 1.55l1.92 8.03c4.34-1 7.91-2.48 10.73-4.44l.08.05zm16.07-25.43 4.34 21.98-5.05.91-4.46-21.87c-3.11.56-4.86.56-9.07 2.4l-.15-4.92 21.82-2.82 1.51 4.16c-2-.73-8.95.16-8.95.16Z",
    className: "crest_svg__cls-1"
  })), _path23 || (_path23 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M127.32 563.77c-2.35-1.43-5.24-1.87-8.65-1.33.73 5.18 2.61 14.76 4.11 19.78 9.62-1.37 12.51-13.39 4.54-18.45M608.04 552.97c-7.24 0-14.12-.11-17.48-.4-38.12-3.71-75.84-14.6-113.87-20.64-10.97-1.73-19.94-3.35-27.72-3.35-16.15 0-27.13 7.01-40.13 34.71-5.54 10.54 13.02 20.59 17.11 21.02-15.25-13.02-9.94-16.88 2.1-16.88 16.63 0 46.11 7.37 51.88 8.09 34.84 5.54 70.06 15.52 105.47 19.3 1.24.11 2.43.17 3.56.17 26.04 0 24.8-28.4 42.69-42.52-3.18.29-13.73.5-23.61.5M464.68 537.7c-.87.8-3.96 22.42-3.75 24.53l-5.82-1.14c1.04-1.88 2.42-16.95 2.42-16.95l-9.98 15.52-5.87-17.49s-2.38 12.56-2.47 16.6l-5.71-.78c1.83-2.96 5.42-25.2 5.42-25.2l5.91 1.11c.16 1.18 4.63 16.28 4.63 16.28s7.86-13.19 8.32-13.86l6.95 1.3-.02.09Zm21.38 19.12c-5.24 17.75-25.7 8.05-19.61-7.77 5.18-17.2 25.67-8.11 19.61 7.77m20.17 15.54c-1.79-.38-11.46-20.08-11.46-20.08s-2.36 15.3-2.96 16.37l-4.39-.63 5.01-24.02 4.87.64c.04.63 7.7 16.86 7.7 16.86s2.56-13.15 2.8-14.33l3.72 1.05-5.29 24.13Zm22.79 2.1c-3.46 1.2-8.38-.15-11.97-.86l4.83-24.73c16.05-1.06 22.7 19.72 7.15 25.58Zm28.47-11.4c-.71 2.8-2.78 4.73-6.19 5.79 1.49 4.88 2.36 6.48 4.87 11.78l-.03.12-3.89-.6c-.81-.47-5.69-7.31-7.15-11.03-.85 3.06-1.72 6.95-1.37 9.71l-6.6-1.02c1.22-1.9 6.38-22.14 6.18-24.26 5.72.73 15.98 1.75 14.17 9.52Zm12.69 19.59c-14.7 2.76-14.68-22.07-2.88-25.54 14.76-3.09 14.83 22.14 2.88 25.54m15.32-14.52c-.57 4.4-2.62 13.34-1.82 17.51l-5.75-.83c2.53-6.48 4.26-17.43 3.86-24.37l5.75.83c-.94 1.93-1.62 4.22-2.03 6.86Zm13.59-1.07s-3.37 19.04-3.16 20.65l-5.72-1.03c-.09.13 3.52-16.69 4.4-20.34-2.02-.43-4.41-.22-6.66.64l-.04-.07 2.29-4.79 15.53 2.79 1.08 5.28c-1.3-1.27-5.51-2.72-7.72-3.14Z",
    className: "crest_svg__cls-1"
  })), _path24 || (_path24 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M478.65 543.31c-9.04-2.49-12.54 16.22-4.94 19.38 9.24 2.46 12.57-16.13 4.94-19.38M526.41 552.71c-1.23 4.82-3.12 13.91-3.75 18.84 11.35 2.4 14.87-16.59 3.75-18.84M548.18 557.04l-2.64 9.58c7.39 1.36 10.57-8.37 2.64-9.58M570.86 560.41c-8.67-2.14-11.49 15.93-4.27 18.81 8.86 2.1 11.53-15.85 4.27-18.81M238.15 429.7c-.97-2.44-2.53-4.4-4.68-5.9s-4.63-2.34-7.44-2.55c-2.81-.2-5.6.3-8.37 1.52-4.15 1.68-7.04 4.38-8.68 8.11s-1.65 7.39-.05 11q1.41 3.54 4.71 5.73c2.2 1.46 4.69 2.29 7.46 2.5 2.78.21 5.45-.26 8.03-1.39 2.5-1.01 4.63-2.51 6.41-4.52 1.77-2.01 2.93-4.31 3.45-6.91.53-2.6.25-5.13-.85-7.59Zm-5.1 8.65c-1.66 2.75-4.08 4.77-7.25 6.06-2.76 1.21-5.36 1.47-7.78.78-2.42-.7-4.04-2.06-4.84-4.1-1.11-2.43-.85-5.07.76-7.91 1.61-2.85 3.98-4.89 7.11-6.14 2.69-1.13 5.26-1.39 7.72-.77q3.69.93 5.07 4.2c1.14 2.51.88 5.14-.79 7.89ZM584.15 446.05l2.99-6.6c-1.56-2.26-2.87-4.46-4.42-6.72l-5.03 10.43c-2.76-.96-5.84.3-7.06 3.01l-7.27 16.21c-1.22 2.71-.11 5.86 2.44 7.27l-5.05 11.26h-.14a5.7 5.7 0 0 0-5.69 5.69v17.77c0 2.78 2 5.09 4.64 5.58v2.52c-6.8 1.61-11.88 7.71-11.88 14.99 0 8.5 6.92 15.42 15.42 15.42s15.42-6.92 15.42-15.42c0-7.28-5.08-13.38-11.88-14.99v-2.42h.09a5.7 5.7 0 0 0 5.69-5.69v-17.77c0-2.56-1.71-4.7-4.03-5.41l3.88-8.64c.6.21 1.23.35 1.86.35.68 0 1.37-.13 2.03-.38 1.42-.54 2.55-1.6 3.17-2.98l7.27-16.21c.62-1.38.66-2.93.12-4.35-.48-1.27-1.39-2.28-2.56-2.93Zm-11.37 81.41c0 5.33-4.34 9.67-9.67 9.67s-9.67-4.34-9.67-9.67c0-4.08 2.55-7.58 6.13-8.99v2.83c0 1.73 1.41 3.14 3.14 3.14h.79c1.73 0 3.14-1.41 3.14-3.14v-2.83c3.59 1.42 6.13 4.91 6.13 8.99Zm-4.67-23.1c0 .75-.63 1.38-1.38 1.38h-.09v-1.31c0-1.73-1.41-3.14-3.14-3.14h-.79c-1.73 0-3.14 1.41-3.14 3.14v.79c-.2-.24-.33-.53-.33-.86v-17.77c0-.75.63-1.38 1.38-1.38h.34c.27.29.61.53.99.71l.72.33c1.38.62 2.98.15 3.84-1.03h.22c.75 0 1.38.63 1.38 1.38v17.77Zm14.55-52.8-7.27 16.21c-.15.33-.42.59-.77.72-.22.08-.45.09-.68.06.24-1.38-.46-2.82-1.8-3.42l-.72-.33c-1.34-.6-2.87-.17-3.74.93-.45-.39-.64-1.04-.38-1.6l7.27-16.21c.15-.33.42-.59.77-.72.16-.06.33-.09.5-.09.19 0 .38.04.56.12l.22.1c.24.88.84 1.65 1.73 2.05l.72.33c.89.4 1.87.33 2.68-.07l.22.1c.33.15.59.42.72.77s.12.72-.03 1.05",
    className: "crest_svg__cls-1"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGNsYXNzPSJyb3lhbC1jcmVzdCIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgNzAyLjQ3IDYyNC4wOCI+CiAgICA8Zz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjI4LjM2LDM0MC4zMWwtMS42Ny0uMi00LjQ0LTEyLjA1YzIuMDgtMi42NywzLjItNi45NS0uMDgtOS4xMS00LjM0LTEuNzEtMTYuNTYtMTUuNjktMjAuMTgtNi42NC0xLjU2LjU2LTExLjI0LDEuMTEtMTEuOTksMi45MS00LjY1LTcuMzUtOC41OC0xNS4xNy0xMS40Ny0yMy44NSwxLjg4LTEwLjA5LDI4LjU4LTIyLjY2LDI4LjU4LTIyLjY2LDAsMC03LjU4LTEwLjktMTAuNjEtMTcuMDQtMS4zNCwzLTIuNTcsMS43Mi01LjUsMy4wNSwxNC44My0yNi4zNSwxNy45OC02MS4wMS0xLjY0LTg1LjktMi4wMS00LjMyLTEuMDktMTAuMDItMy4wNi0xNC4yNS0zLjQtNC40OS01Ljc1LTEzLjMzLTExLjc3LTE0LjI3LS4wMyw3LjgyLS44MywxNS40OCwyLjk1LDIyLjc0LDQuMDMsNS4wNS01LjQ5LDkuMzMtOC40NSw1LjM0LDUuNjgtLjY1LDYuNjQtMS43OSw0LjY4LTUtMjQuNS01LjQ5LTM4LjE5LDExLjcyLTYxLjU2LDE0LjQyLTIuMDYtLjAyLTMuOS43MS01LjA1LDIuNTktMTQuMzksMTkuNCwxNy45MSw2LjE2LDIwLjczLDE5LjAyLTUuNCw0LjQ1LTYuMTQsMS41Mi0xMS4yLjIzLTcuMjguMjgtMTQuMzMsMi41NS01LjI1LDguNy01LjU0LDguNy01LjI3LDExLjc3LTE2LjU0LDEyLjUxLDQuODksNi45LDMuODQsMTYuODgsNS4xMSwyNC43LTguMDMsMS41MS0xMy40OSw1LjM4LTEzLjY1LDEzLjk2LTMuNjIuODEtNy41MS0xLjA4LTEwLjA4LDIuODItNS4wNi00LjE5LTEwLjg2LTQuOTUtMTYuOTItNS4wNS0yLjkyLTIuMTktMTAuMDktNy4zNC0xNy43OS0xMS4zLDEuNTItNS42OSwyLjk3LTExLjAzLDQuMzQtMTYuMDIsMi4yNS0xLjQzLDEwLjM1LTYuNTgsMTIuNDUtNy45Mi0xLjA4LTIuMTgtNS4zNS0xMC44LTYuNTEtMTMuMTQsMTQuNDMtNDkuNjYsMTkuMTItNTIuNDQsMjYuNDItNTMuNTJsLjM5LTEuMzgtMjYuNy04LjU1LS40NywxLjc0YzYuNzQsNC45LDguOTMsMTMuMDIsNS44NiwyMi41NS03LjEzLTMuMDgtMTEuMi05Ljg0LTEwLjQzLTE1Ljg3LS4xNC0uMDQtMS43Ny0uNTEtMS43Ny0uNTFsLTguOTQsMjkuNjZzMS4yOS4zOSwxLjQzLjQzYzMuNTEtNS4wNyw5LjYzLTcuOTMsMTYuNzEtNi43NS04LjI2LDI2LjI4LTQ1LjQzLDE4LjA5LTM4Ljc4LTQuMjMsNC43NC05LjIxLDEzLjczLTMuMyw5LjQsNi4zNCwyMC44Ni03LjMxLDguNTUtMzcuMzItOS4yOS0xOS40Miw1LjktMTIuMDksOS4yNS0yMS41NywxLjg0LTMzLjI1LTkuNjEsNi4xOC0xMi4wNiwxNy4zNS0xMC4yMiwzMi4yMy0xMS43Ny0yNi45My0zMi4zMS44MS0xNS42MSwxNC44NC0zLjA0LTE5Ljk4LDIxLjYyLTYuNzgsNC45NCw5LjMyLTE1LjkxLDExLjI2LTM1LjQ3LTEuNjgtMzYuMDQtMjEuNTUsOS4xOS44MSwxNi4yLDYuMjcsMTcuMTUsMTMuMDguMTYsMCwxLjY5LjA2LDEuNjkuMDZsMS4xNC0zMy45MXMtMS45Mi0uMDktMi4wOC0uMWMtMS40Myw2Ljg3LTguODksMTIuNjktMTguMzMsMTIuODYuNjUtMTAuNDUsNi42NC0xOC42LDE0LjQtMTkuOTR2LTEuOTRoLTM5LjE0djEuOTRjNy43NiwxLjM0LDEzLjc1LDkuNDksMTQuNCwxOS45NC05LjQ0LS4xNy0xNi45LTUuOTktMTguMzMtMTIuODYtLjE2LDAtMi4wOC4xLTIuMDguMWwxLjE0LDMzLjkxczEuNTMtLjA1LDEuNjktLjA2Yy45NS02LjgxLDcuOTYtMTIuMjcsMTcuMTUtMTMuMDgtLjU1LDE5Ljg2LTIwLjE0LDMyLjgyLTM2LjA0LDIxLjU1LTE2LjY4LTE2LjExLDcuOTgtMjkuMyw0Ljk0LTkuMzIsMTYuNzEtMTQuMDctMy44Ny00MS43NC0xNS42MS0xNC44NCwxLjg0LTE0Ljg5LS42MS0yNi4wNS0xMC4yMi0zMi4yMy03LjQxLDExLjY4LTQuMDUsMjEuMTcsMS44NCwzMy4yNS0xNy44Ny0xNy45MS0zMC4xMiwxMi4xNS05LjI5LDE5LjQyLTQuMzMtOS42NCw0LjY2LTE1LjU0LDkuNC02LjM0LDYuNjYsMjIuMzMtMzAuNTQsMzAuNS0zOC43OCw0LjIzLDcuMDgtMS4xOCwxMy4yLDEuNjcsMTYuNzEsNi43NS4xNC0uMDQsMS40My0uNDMsMS40My0uNDNsLTguOTQtMjkuNjZzLTEuNjMuNDYtMS43Ny41MWMuNzcsNi4wNC0zLjI5LDEyLjc5LTEwLjQzLDE1Ljg3LTMuMDctOS41My0uODgtMTcuNjUsNS44Ni0yMi41NWwtLjQ3LTEuNzQtMjYuNyw4LjU1LjM5LDEuMzhjNy4zLDEuMDgsMTEuOTksMy44NiwyNi40Miw1My41Mi0xLjE4LDIuMzktNS40MSwxMC45MS02LjUxLDEzLjE0LDIuMDYsMS4zMSwxMC4yNCw2LjUyLDEyLjQ1LDcuOTIsMS4yNSw0LjU1LDIuNTcsOS40LDMuOTQsMTQuNTMuMDUtLjAzLjExLS4wNS4xNi0uMDgtLjA2LjE4LS4xMi4yNC0uMTYuMDgtMzUuOTQsMTYuOC0yNy43OSwyOC4yMS01NS40NCwyNC45My0yLjQ4LDUuNzItNC43OSwxMS4zOS0xMC40MiwxNS4yNy0xLjA0LTguNzctNC45NS0xNS41Ny0xMC4xLTIxLjc2LTIuNTUtMi45OC02LjA1LjMxLTkuODYuNjItNy41LDE2LjM1LTEyLjY4LDEuNTgtMjUuOSwxMC4xMy41Miw3LjYyLDEuNjgsMTUuMiw1Ljg2LDIyLjI0LTkuODMtLjY5LTE3Ljk1LTMuMzUtMjQuNDUtNy45Ny0yOS4zOSwzMi44My02MC4wNyw2NC4zNS04NS4yLDEwMC40Ni0xMy40MiwxNy43My00OS4zMSw3LjQyLTM5Ljg0LTE3LjAxLDQuMzQtMTcuODMsMzAuMTEtMTQuMDQsMjguNDgsMy42NiwxMi43My0xNC4xNiw0LjU1LTI4LjI0LTE0LjkxLTI1LjA5LDE3Ljg2LTcuNzMsMjguNTgsNi44OSw0NC42OC0xMy4yLTEyLjMuMy0yMi43My0zLjYtMzQuOTktLjc3LDE1LjUyLTkuMywzNi44Myw0LjUsNTAuMDgtMjEuMTUtMTEuNTQsMS4yMy0yMS45OCw2LjA3LTMzLjkzLDcuODQsNzEuNy02OC4zNiwyLjcxLTcxLjczLDExLjQ4LTEwMS4yOC01LjYsNC43Ni04LjgzLDkuNTItNi4yNCwxNS45LTE2LjA2LTYuNzEtMzkuODctNC43My00Ni4zNy0yNC4yNS0xLjU3LDI3Ljc5LDEwLjY0LDI1LjgsMzEuNjIsMzEuNTItOS42OC0xLjE2LTE5LjI0LTEuMjMtMjguMzEtNC41OCwxLjg3LDEyLjQ2LDExLjMyLDE1LjExLDIyLjQ0LDEzLjkxLTEwLjg5LDYuMDQtOC40MSwyMS41NSwyLjY2LDI2Ljg4LTcuMDctNDAuMjEsNTMuMTMtMjYuNDIsMjUuNjQsMTAuNS0xMi43NiwxOS4wMi0zMS4yMywzMy4xNy00Ni43NCw0OS43OC0yLjkzLTUuMDYtNS45OC0xMC4xMy0xMi43Ni05LjQxLDExLjgyLDEzLjY1LTEuNTIsMjguNDgtNC42NSw0Mi41Ni00LjU3LDE3LjQsMTAuOCwzMi4yMSwyNy4yNywzNC4yNC02LjU2LDcuNzgtNy4wOSwxNC43LTIuMDMsMjEuMDYsNC45Ni0yNS41Niw0Mi4wMi0xOS43OSw0NS41Mi00Ny40NC42My0zLjI2LDIuMTktNS44LDUuODItNy4yOS0xNi43LDE4Ljg5LDIzLjQ2LDU4Ljg2LTE0LjI3LDYzLjUzLTUuMzguMTUtNi43Miw1LjgyLTMuNzMsOS44NS0xNS41OS0uNzgtMTkuODksNS4xNS0yMi4yNywxOS44NCw2Ljg4LTEuNzgsMTMuMjYtMy40MywxOS43Mi01LjEtNi43OSwxNy43OS0yMi4xOS0xLjA0LTE5LjY2LDMwLjYxLDYuMy0zLjAyLDEyLjIyLTYuMjEsMTcuOTgtOS43OSw1LjU3LDE3Ljc2LTI4LjI1LDEwLjA4LTIuODYsMzguNDIsMS42Mi01LjI5LDguNC0xNi4xMywxMS44NS0xOC41NC0zLjE0LDguOTItMi4zOSwxOS4yNCw3LjYyLDIzLjI1LjQ3LTIuMzguODgtNC40OCwxLjMtNi41OS40Ni0uMDEuMzgtLjAxLjg0LS4wMiwxLjQ0LDUuODksMS42NCwxNC4xNCw3LjM2LDE3LjU0LDEuODkuNzUsMi45MSwxLjgsMy41NCwzLjc4LDEuMDQsMy4yOSw0LjEsNC4xNyw3LjA3LDQuNTYsMy43NC43Nyw0LjY4LTMuNDcsNy40My01LjE4Ljc5LDQuNjgsNi4zMSw1LjQzLDkuMDIsOS40MSwyLjA4LTIzLjA2LTI4LjUtMTQuNjktMjEuNDktMjkuOTMsMi43MSw5LjI5LDExLjM5LDcuMjYsMTcuNDUsMTEuMDYsMi4zNSwzLjg2LDguMDgsNy4wNiwxMS4wMSwxLjY5LDIuODUsMi4xNCw1LjQzLDQuMDcsNy45NCw1Ljk2LTUuOTctMjcuMzktMjAuMTctMTAuNDUtMjkuMTEtMjQuODMsNi4yMy4yOCwxMi44OCw5LjUyLDE5LjYsMy4yLDMuNjIsMy43Myw2LjQxLDguMDksOS4xNCwxMi40OSwxLjEtOC43NS0yLjE3LTE1LjQ0LTkuMDYtMjAuMy03Ljc3LTQuNzYtMTguMzMsMy42OS0yNC45Ny01LjgxLTkuMDgtMTEuMjEtOC44Mi0yNi45NS00LjEtMzkuOTIsNC4zNC05Ljk4LDE2LjQyLTEzLjcxLDIyLTIzLjE2LTEuNTUsOC4zNC0uNzcsMjIuODcsOC42OCwyNS41Ny0yLjMtMTUuNSw4LjcyLTI5LjQ2LDEwLjk2LTQ0LjQ1LDIuODctMy43OSwzLjAxLTYuNzQuNDEtMTAuODMtNC42OS03LjctNS45OC0xNi45Ny0xMS4xNy0yNC41NS04LjA1LTExLjI4LTE3Ljk2LTExLjU5LTEuNTUtMjMuNDktOS45NiwxNS40Ny0xLjgzLDkuODQsNi43NywyNC40LDEuNTktNC45MSw4LjkyLTExLjMyLS4yNC0xMS4yOS0xNC40Ny03LjEsMTguODMtMjUuNTYsMjYuMzUtMjYuMDMsNy40Mi0uNTgsMTcuODIuMjUsMjMuNDQtNy4wOC0zLjUyLTYuNjgtNi45My03LjYzLS45NC0xNC41Ny00LjA1LTIuMzYtNy42MS01LjE4LTguMzEtMTAuNDktMy44NSwxLjM0LTcuMjUsMi41Mi0xMS4yNSwzLjkxLDMuNjQtNC4xMiwxNC4zNS0xMi40NCwxNS41MS0zLjIyLjI1LDUuMTgsNS4zOSw2LjExLDkuMzksNy40LTIuOTIsNC4yNC03Ljc3LDguNTItMy4zNSwxMy40OCwzLjA5LDMuMjQsNS4wMSw5LjM3LDkuNzcsMTAuMTYsMS4yOS00LjgxLDIuNTItOS40MywzLjc5LTE0LjE3LDEwLjUzLDExLjA1LTEwLjU3LDE3LjIsMTguMzUsMjcuMTItMS4wNS01Ljk3LTEuOTktMTEuNzQtMS4yMi0xNy45MSwxMy45NCwxMS42NS02LDE4Ljk2LDI2LjEyLDIyLjc3LTMuNTgtNC4yNS00LjQtOC45NC01LjcyLTEzLjcsNS4zNi44OCw5LjY5LDYuMDEsMTMuMTUsOS44NSwzLjMxLDUuMDMsNS43NCw3Ljc4LDEzLjMsMi44Ny4zNC44OC40MiwyLjA5LDEuMDYsMi41OCwzLjM5LDIuNTgsMi4wMyw1LjcxLDEuOTYsOS4xNWguOTNjNC40Ny00LjUxLDQuNzgtOS42OCwzLjM5LTE1LjMyLTMuMS0xMC42NC0xNi4wOC0yLjE3LTIwLjYzLTEzLjAzLDYuMTMsNC4xNywxMi4yMyw2LjYxLDE4Ljk3LDMuMTIsMy43NywzLjU1LDUuMzQsNi4xNCw3LjE3LDExLjE3LDMuMDgtMTEuNDYtLjQ2LTIzLjE1LTEyLjU2LTE5LjcxLTMuNzYsMS4zNC01LjMxLDEuMDMtOS4wOS0yLjI1LDUuNjIsMS45NSw5LjMzLS45MywxMi45Mi0zLjUuNzgsMSwxLjIzLDIuMTQsMS43NiwyLjE3LDMuNC4yLDUuNjEsMi4yNSw3LjcxLDQuNzYsMS4xNC05LjgtOC42MS0xNy43Mi0xOC40Mi0xNS4yMy0yLjQ1LDEyLjAyLTEyLjU0LDUuMjItMjAuNTMsMy42Mi0xMi40Mi03LjI3LTE4Ljk1LTIxLjItMjkuOTQtMzAuMjgsMS4xLTEzLjQ4LTEwLjEyLTI0LjIxLTIzLjYxLTIzLjQzLDEyLjE2LTUuMywyNi41OSw1LjE0LDI3LjUzLDE3LjgzLjQ1LDUuMTksMy42Miw4LjQ2LDYuOSwxMi4zNCw0MS4wOC04Mi42MSwxNzMuNjktMTA0LjIxLDI0OS44My01MS43OGgwYzYuNDgsNS45NCwxMy41NCwxMC44LDIwLjI2LDE3LjA1LDIuNjItNy44OSwxLjA3LTE3LjI3LDEyLjg0LTEyLjQ5bDIuMi0xLjVjLTIuNC02LjY3LDIuNTgtMTQuMjEsOS41OC0xNC43djUuMmMtMy4wNi41LTUuNDQsMy40OC00Ljk1LDYuNjYsMi4zNS0uNSw0LjQ4LDIuNTksMy4yMSw0LjYyLDIuMiwxLjI1LDUuMy43Myw3LTEuMDUsMS45Ni4xLDMuOTEuMjksNS44Ni40OC0yLjY4LDYuMzctMTEuOTgsOC41NC0xNy4yLDMuODdoLS4wMmMxLjAxLDEuNC0zLjUsMTUuNDQtMy42OSwxNy4xMS0uNTMsMi4wNS0yLjQ0LDMuNC00LjQ4LDMuMy44NCwxLjM3LDEuNTMsMi41MSwyLjI5LDMuNzUsMy4zMy0xLjg2LDcuOTktMS43NSw3LjU2LTYuNDcuNjMtMi42OC0xLjA5LTE1LjAxLDIuNzQtMTMuOTEsMS41NSw0LjY4LTEuMzcsMTAuMDksMi4xLDE0LjcxLDEwLjk4LTIuNzEsNi4xNy0xMi42NiwxOS40OS0xNS4yNiw1LjI5LS40NywxNi40NC0zLjA0LDE5LjMsMi4yNC0xMS42NC0zLjEyLTI2LjY4LjA4LTI5LjIzLDEzLjM3LTEyLjExLDIuODYtMjIuMjgsMTEuNS0zNS4xNywxMS40OS0xMC4yNC41Ni0xMywxMi44Ni0xMy40MywyMS4yOS0xLjcsOS42Ny0yLjIzLDE5LjcxLTYuNTQsMjguNjktMi4xMiwzLjQzLS4zNCw3LjM3LjgyLDEwLjU1LDMuOTMsMi4wNiw2LjcyLDE1LjY4LDcuMjksMjAuNTQtLjAzLDguODcsMTUuMiwxMS44NCwyMS4zOSwxNy4zNywxLjczLTExLjEyLTE5LjM1LTcuOTYtMTYuMzktMjMuNSwzLjc0LDEwLjI5LDExLjkyLDEyLjQxLDIwLjg5LDE3LjQ3LTIuODEtMTAuNDEtMy42NS0yNy43Mi0xOC4xNy0yNS41NS01LjYxLTcuNzksMi41OS04LjIzLS4wNS0xNy41Miw0LjE3LDEuMzEsNi4xNCwyLjc1LDcuMjUsNS4zNC0xLjMtLjQyLTIuNDMtLjc4LTQuMjEtMS4zNS40OSw2LjU4LDYuMTksOC4xNCwxMC41OCwxMi42Ny0uNzQtMTAuNzktMS43LTE3LjYtMTEuNzMtMjIuODUtNS42OS01LjIxLjg3LTE3LjE5LjQ5LTI0LjM5LS4xOS0yLjEyLDEzLjQyLTguODksMTUuNS04LjI5LDEwLjA5LDEuMzIsMjAuNjYtLjMsMzAuNDIsMi4yNSw5LjczLDMuMDcsMS4zOC0xOC4wNywxNy4xMS02Ljk1LTExLjM5LTMuMzUtNC40Niw5LjA4LTEyLjY5LDkuNzEtNS43NS4wNi0xMC42My0uNDktMTYuNjItLjY5LDIwLjY3LDQ2LjAyLDY2LjU0LDMyLjUzLDc5LjE1LDczLjU5LDEwLjU1LTkuMzEsMy4zNy05LjE2LjQyLTE4LjkxLDIzLjgzLDE1LjktMjIuMTgsMzQuMy00LjksNjIuMTMtMS4wOS0zLjEyLDkuNzItMTYuMTcsMTAuOTUtMTguODIsMS45Ny0yLjkyLDUuMzItMy4xMSw3LjQ4LS45OWwzLjQ0LTcuMTVjLTYuNDEtMy41MSw1LjE5LTE4LjU2LDYuMDQtMjIuODQsMS4yLTIuNTgsMy45My0zLjc5LDYuMDgtMi43MmwzLjItOC45M2MtNi4wNi0xLjYzLTEuNTItMTYuMzQtMi0yMC40NC04LjUyLTcuNjktMTUuNS0xNy4zNi0yMi4xMS0yNi4yOWw0LjA4LS42OWMtLjQ2LDIuMDEuMjcsNC4yMSwxLjk3LDUuMzgsMi45MywxLjE2LDE0LjEzLDExLjk3LDE3LjY1LDkuNGwxLjc2LDQuNzhjLTIuODMuNzctMy4zMyw0Ljc1LTMuMzYsNy40MiwxLjUxLDEuMjcsMy4xMywyLjQ2LDQuNjEsMy43OS4yMS0uOTYuMDUtNS4zMy45Mi01Ljk4LDEuMzMsMS43NSwzLjc1LDEuNzYsNS4yMi4zNiwxLjM4LjcyLS4zNCwxMC4yMi0uMTgsMTEuNDIsMS42NSwxLjc4LDMuMjEsMy42NCw0LjY5LDUuNTctLjYyLTQuMzcsNC43NS0yMS4wNS0yLjY4LTIxLjg3Wk01MDguMjYsMTg1LjFjMS41Ni0uMTcsMi44NC0uMyw0LjU4LS40OS0zLjAxLTIuMTktLjA3LTUuMTksMi40Mi0zLjA2LDUuOTYsNC42Mi01Ljk4LDEyLjE5LTcuMDEsMy41NVpNMjY5LjQ0LDIyOC41OGwtMTIuNTctOCw2LjYzLTEzLjM4LDE4LjEyLDYuNDYtMTIuMTcsMTQuOTNaTTMxMC40OCwyMTguMjFjLTE5LjY2LDMuOTgtMjMuODMtMTcuNjYtNC4wOS0yMS4yNiwxOS42Ni0zLjk4LDIzLjgzLDE3LjY2LDQuMDksMjEuMjZaTTM1NC45MiwyMTYuNTFsLTE5LjM3LTEzLjY3LDE5LjQtMTMuNjksMTkuMzcsMTMuNjctMTkuNCwxMy42OVpNNDE2LjYyLDIxMC41Yy0yLjMxLDEzLjgzLTMzLjM0LDcuODYtMzAuMzUtNS44NCwyLjMxLTEzLjgzLDMzLjM0LTcuODYsMzAuMzUsNS44NFpNNDI4LjI3LDIxMy42NmwxOC4xMi02LjQ2LDYuNjMsMTMuMzgtMTIuNTcsOC0xMi4xNy0xNC45M1pNNTc3LjUxLDE1MC4xMWMzLjU2LDMuOTUsNS4xMiw4LjIzLDUuMTEsMTMuMDktMy40My0xLjE5LTQuOTMtNC45NC01LjExLTEzLjA5Wk01NjEuMiwxNzUuNzRjLTQuNzksMy4yOC05LjEsOC4xMi0xMy45OCwxLjU2LTEuMTMuMjMtMi4wNi40MS0zLjIyLjY1LDcuMjQtMTEuMjIsNi42NC05LjI5LDE3LjItMi4yMVpNNTIxLjE3LDIxNi40M2MzLjE5LDEuMTMsNi4yMiwyLjgyLDkuNDYtLjM5LTMuMTEtLjAxLTQuMDUtMi4xOS00Ljk1LTQuMjYtMS41MS0xMC41OSwxNS43Ny02Ljg1LDIyLjItNi4xLDE2LjIxLDkuODYsNDMuNzgsMy41OCwzNC4yLTE5Ljg3LDcuNSw0LjYzLDQuOTIsMTcuNDgtLjc3LDIyLjQ5LTE0Ljk4LDguMS0yOS4xOCwyLjAxLTQ0LjEzLDE3Ljg3LTIuMjgtNy4yNS0xMC44OS02Ljg1LTEzLjk4LDEuMTQtMi44NS4xOS0zLjU5LjE0LTYuMzEuMzItLjUtNC4yMSwyLjkxLTcuMjQsNC4yOC0xMS4yWk01NzcuNjksMjg1Ljg2Yy0uNjYuODMtMi4wNSwyLjU4LTIuMDUsMi41OC0xMi40Ni0xNC4yMy01NC41MS0zMC41NS03Mi42OC0yNy44OSwwLDAsLjIyLTIuMS4zNC0zLjI0bC0uMTMuMDcsNi45MS00LjM5LTUuOS00Ljg5Yy4wNi0uNjgtMy43OC0yNC42Mi0zLjc4LTI0LjYybDEwLjQyLS4zMXMtMy43Miw0LjM3LTMuODgsNy44MmMuNTkuNDEsMS4wOSwxLDEuNDQsMS43MywyLjA5LS44OSw0LjMyLTUuMjEsNC4zMi01LjIxbC45OSwxNC4xNHMtMi45LTQuMDgtNS00LjgxYy0uMTYuNTItLjM5LDEuMDEtLjc2LDEuNCwzLjAxLDkuMzksMTYuNzIsOS45NCwxNi43MywxLjktLjQ3LTQuMTgtNS4wOC0zLjQ5LTQuODMuOTItNy41MS01Ljk3LDIuNjQtMTUuNDgsNi44Mi01LjktLjUzLTUuNTItLjA3LTguNjQsNC4yMi0xMS4zNiwyLjgzLDMuNTcsMi40Myw2Ljk0LS42MywxMi4yOSw5LjIyLTguNTYsMTIuNzQsNS45NSw0LjA4LDguMDksNC4yMy03LjY0LTcuOTMtNS4yMy0zLjQ3LDIuNzYsNC4wOSw2LjI0LDEzLjk5LDUuMzIsMTcuNDctMS40Ni0uMjUtLjQtLjQzLS44NC0uNTItMS4zLTMuNDUtLjY2LTguNjEsMi4yOC04LjYxLDIuMjhsNC44LTEzLjA0czIsNS41OCw0Ljg5LDcuMzJjLjUyLS41LDEuMTgtLjgzLDEuOS0xLjAxLjU1LTMuNDMtMi45MS04LjgyLTIuOTEtOC44MmwxNi4wMSw2LjE4cy02LjMzLDEuNjEtOC4zNiw0LjQ3Yy40LjYuNjQsMS4yOS42NywyLDMuMzMuNjcsOC43My0yLjA2LDguNzMtMi4wNmwtNS43NCwxMi42OHMtMS42Ni01LjU3LTQuNjQtNy4zOWMtLjM5LjI3LS44My40Ny0xLjMuNi0yLjI4LDcuMzYsNC4zOCwxNC41LDExLjY3LDEyLjcsOC44Mi0yLjcsMS44Mi0xMi43My0uNTctNC4zMi00Ljc3LTcuMzgsOC4wNy0xNS41LDguNjktMy4xNiwxLjU2LTUuOTQsMy42NS04LjY1LDguMjQtOS4zNiwxLjE5LDQuODMtLjY4LDcuNDEtNC45NywxMS4wNyw5LjktNC4xNywxMC4zNiw5LjU3Ljc4LDguODMsMy4zMy0zLjA4LjM5LTYuNi0yLjg2LTMuODktNS43Miw1Ljk3LDQuOTgsMTQuNTEsMTMuMzUsMTAuMjUtLjAyLS41My4xMy0xLjA1LjM3LTEuNTItMi4wOC0xLjQ1LTcuMDEtMS42LTcuMDEtMS42bDEwLjI2LTcuNnMtMS4yMiw0LjYtLjI0LDcuMDFjLjc1LS4xMiwxLjUzLS4wMywyLjI1LjI1LDIuMi0yLjIyLDIuMzMtOC4xOCwyLjMzLTguMThsNy42NSw5LjU0cy0xOS4yMiw4Ljg1LTIyLjYxLDExLjQybC01LjM0LS41MywyLjY0LDcuNTItLjE3LjAzWk02MTkuMDMsMzI0LjkxYy0yLjQxLS4yMi00LjQyLDEuOS0zLjYxLDQuNDktLjI0LS4wMy0uNDctLjEtLjY5LS4yNWwtMTEuMjUtNy42OGMtLjczLS41LS45NS0xLjUyLS41Ni0yLjMzLDIuMTItLjA4LDQuNDEtMS4xOCw0LjEyLTMuNzQuODcsMS4xLDEyLjk3LDcuNTUsMTEuOTgsOS41WiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NzguODgsMjc5Ljc3Yy45Mi44OSwxLjczLDEuNzUsMi40OSwyLjYzLDEuMTguMzUsMy4yLDEuMDMsMy42Mi0uNywwLDAsMi44OC0xMS4xNywyLjg4LTExLjE3LTEuMzQsMS4yMi0zLjUsMS4zMy00LjU4LS4yOS0uODYtMS4wMi0xLjA3LTIuNDktLjMyLTMuNTgtMS4zNi0uMjgtMy42NCwxMi4zOS00LjEsMTMuMTFaIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMxNC4wOCw1ODYuNzdjLTMxLjc4LTEyLjU5LTU0LjksMTguMjEtMjguOTQsMjMuNDEtMjguNDgsMS4yNC0yMi45OC0zOC44NC0zNC43NC0zNi40NiwxMC4zMSwxMS4xLDEwLjMsMzEuNzgsMTkuNzksMzcuNSwxOS4xNCw4LjEzLDM5LjA0LDkuNDYsNTkuNTQsOC41MS0xMC4zMi05LjE2LTEyLjg0LTIwLjcxLTE1LjY1LTMyLjk2WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQxMS4xNyw2MDkuNzVjMjUuOS01LjE0LDIuOTUtMzUuOTktMjguOTQtMjMuNC0yLjgyLDEyLjI1LTUuMzMsMjMuNzktMTUuNjUsMzIuOTYsMjAuNS45NSw0MC40LS4zOCw1OS41NC04LjUxLDkuNDktNS43Miw5LjQ5LTI2LjQxLDE5Ljc5LTM3LjUtMTEuNzUtMi4zOC02LjI2LDM3LjctMzQuNzQsMzYuNDZaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjIwLjM5LDM1MC44bC0uODIsMTAuMzJjLS4wNS42My4xOSwxLjE5LjU2LDEuNTgsMS40NS0xLjIzLDMuNzItLjcxLDQuNzcuNzUsMS42Ni0uNDcsMS4xMS01LjYyLDEuNDUtNi44NC0xLjg4LTIuMDQtMy44Ny0zLjk4LTUuOTYtNS44WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYxNy42NiwzODMuMzhjLTEuNDQuMjgtMy4xMi0uNS0zLjczLTEuODgtMS45NS0uODEtNy4wMywxMy42Mi03LjkxLDE0LjUzLDIuNTUtMS41Nyw1Ljc4LDEuMDQsNC45MiwzLjk5LjI1LS4xOS40OS0uNDMuNjQtLjc1LjE3LTEuNDcsOC4xOC0xNC43MSw2LjA4LTE1Ljg4WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTcwMi40NywzMzguMTljLTYuNjYsMi4wMi05LjQsNy41Ni0xMS44OSwxMy44NC0xNi43Mi0yNi4wOC00OC41LTQ0LjA3LTUzLjM0LTc1Ljk3LDMuNzQtMjUuNSwzNy41NC0xOS42NywzMC42OCw2LjkxLDE3LjUzLTkuNDMsOS4wNS0yNi45Ni03LjQ1LTMwLjA2LDE3Ljk0LDEuNDMsMjcuNzUsMTYuNiw0MC4wMi04LjYxLTEwLjYxLDMuODUtMjYuNzgsMS4xMi0zMi4zNS4yOSwyMi4zNC0zLjAzLDM0LjQ5LTIuODIsMzMuODEtMzAuNTYtNy42MSwxNi42Mi0yOC42OCwxNi45My00My45OSwyMi4zMS45OC03LjM3LTEuMzItMTEuODktNy4yNi0xNC4yOSw2LjA3LDQwLjU0LTcwLjgsMjcuMzMsMTMuNjcsMTE0LjgtMTAuMzYtNS43LTIyLjQxLTMuNzktMzIuNDUtMTAuMTUsNy44MiwyMS4wNiwyMS4wMiwxNy40MywzOC4zLDI0Ljc2LTE4LjU0LS4xLTI0LjMsMTcuOTktMTAuNTcsMjYuNjctMy41OC0xMy45NywxNS42MS0yMy41OSwyNS4yMS0xMi42NywyMS45MywyOC4xNy0xOC4yLDY3LjI5LTUzLjgtMy4zLjI1LDMuOS0yLjQ3LDcuNC02LjI2LDYuMjJsLTQuMDEsMTEuMTdjOC4xNSwzLjAyLTQuMzYsMTguNzYtNS4yMiwyMy4yOS0xLjQyLDMuMDItNC41OCwzLjkzLTYuOTYsMi4yOGwtMy45Myw4LjE4YzQuOTQsNC41Mi04LjMyLDE3LjM1LTkuODIsMjEuMzMtMS41NCwyLjI5LTQuMjksMy4wOC02LjI0LDEuODVsLTEuNDIsMi45NmMuMjkuMzkuNS42MS41NC41OSw5LDEwLjY1LDEzLjEyLDE4Ljg2LDEwLjcsMzAuMTcsNy4zLTYuMjYsMTAuNTYtMjMuNjIsNC43Mi0zMy4wOCw2LjYxLDYuOSwxNi4yLDExLjgzLDE5Ljk4LDIwLjYzLDMuOCwxNi4wMS44OCwzMS44OS05Ljk5LDQ0LjUzLTQuNjEsNC42NC0zLjM4LDcuMDgtMy45NywxMi43Ni0zLjA3LDkuMDItMTMuODcsOS43Ny0xNy45NCwxNy40Mi0yLjg2LDYuNy03LjU4LDEyLjE4LTkuNjMsMTkuMjEsMTIuMjUtMS45MiwxMC4xNS0xOS4wMiwyMS43NS0yMi40OS00LjcxLDcuMTctOS4yNiwxMy42OS0xMi40OCwyMi4wMSw5LjY4LTIuNTIsMjcuOTYtNS4xMywyNC45LTE4LjgtMi4zLTYuMzEsMy44Mi0xMC40NSwzLjUxLTE2LjQ3LDcuNjctMi43NSw1Ljg5LTUuODUsOS41Ni0xMS44MywxLjcsMy42MiwxLjc4LDYuNjcsMS41NywxMC42MS0uOTUtMS45Ny0xLjU0LTMuMTktMi4yMi00LjYtNS40Miw3LjM3LS44OSwxNC41Mi0xLjY1LDIyLjQxLDI2LjczLTIzLjk1LTguNzgtMjMuNzcsMTguOTctNzYuODUsNi4zOC0xMC41Ny0xOC4xNS05LjM4LTE5Ljk4LTMzLjI2LTEuNzItMTAuMzMsNy4zNS0xOC43OCw5LjI4LTI4LjY0LDEwLjY5LDE5LjAxLDQ4LjAyLDE4LjM3LDQyLjkyLDQyLjY1LDcuNTEtNS42Nyw3LjE5LTE2LjA2LDQuMjMtMjMuODQsMzguNTItMTMuODYsOC4xMi00OS4zLDIwLjUyLTc0LjQxWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYwMC4xOCw0MTYuMjVjLTEuMDYtLjM0LTIuMDItMS4wNi0yLjM1LTIuMTgtLjktLjg2LTIuMjItMS4yOC0zLjExLjA1LS4zNSwxLjU4LTEwLjkyLDEzLjUyLTguMjEsMTUuMDQuNDQsMCwuODkuMDgsMS4zLjI5Ljg2LjM2LDEuNjEuOTcsMS45MiwxLjg4LjYyLjA5LDEuMzEtLjIyLDEuNzQtLjg2LjMtLjkxLDkuNzktMTMuMzYsOC43MS0xNC4yMloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01ODIuMjYsNDMxLjkyYy4xNi4yNy4zMi41NC40OC44MWwuMTYtLjM0LS42NS0uNDdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAzLjkxLDQ1NS44OWMtMTAuMzUsMTIuNzQtMjguMzEsNC45Ni0zOS41OS0yLjg2LTkuMTktNi43OCwxMC42Ni0xNy4zMiw0LjI4LTM5LjksOC44NCwxNC4yNS03LjIyLDI2LjU3LDE3LjU4LDM0LjU1LTcuMTctMTAuNjYtNi4yLTI0LjQxLTguOS0zNi42Mi0uMzItMi4xLTEuMzUtNC4yLjM0LTYuMzEuODQtMi45MiwxLjA0LTYuODgtMi45NC03LjMxLTI3LjcxLTE1LjktMjIuMTItOC4xOC00OS4xLTExLjg4LTYuNiwxMS43LDcuNDUsMjIuMTIsNS4yMywzMy41Ni0xLjk4LDUuNjEsNi41MSw1LjM3LDYuNDIsMTAuODMsMS44OSw4LjUxLjk2LDIwLjQ2LTguNzYsMjMuNzQtNC44MywyLjkyLS45Niw5LjA5LDMuMjYsMTAuNTMtOC41OSwxNS40OS0yLjAxLDE3Ljk2LDExLjEzLDI1LjcyLjA4LTUuOTcuMTgtMTEuMTksMi42Ni0xNi4yNywxOC4xMiwxMi4wMy04Ljg4LDE0LjA1LDI3LjA1LDI4LjYyLTMuNjQtNi4wMi0zLjU1LTEyLjU2LTQuMDktMTguNTcsMy4zOS44LDYuNywxLjU4LDEwLjA4LDIuMzcsMy44OSwxNi42MiwxMi44OSwxOC4wOCwyOC43NSwxNi42MS01LjY3LTUuNjQtNy4yOC0xMi45OC0xMS40LTE4LjgzLDQuNzcsMS42Miw5LjUyLTEuNjYsMTMuNjIsMi4wMywzLjg2LjcsOC4xNCwxLjQ1LDExLjg3LS4yNC01LjgyLTkuOS0xMS41NC0xOS42NC0xNy40OC0yOS43NVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01NzguMywzODIuMWMtMTIuNDIsOC43Ni0xOC4zMy01LjM3LTQ1LjE4LDExLjE2LTQuOTIuNzktNi4wMywyLjg3LTUuMTQsNy42Ni01LjQ4LDExLjgzLTUuNjMsMjYuMi0xNC45OCwzNi4yLDIwLjEzLTUuNjksMTUuNjctMTMuMzEsMjAuNTctMjguNjEtMSwyMC43Ni4wOCwyMC40OSw3LjYsMzQuNjktMTUuNTMsMTAuOTEtNDAuODgsMS43Ni00OS4zOSwyMi45NCwyLjM2LDIuNzEsNS40MS0uMDUsOC41Ni43LTIuMDMsMi40NS0yLjg0LDUuMzMtNi4wOCw3LjQ2LjctMi4wNCwxLjE0LTMuMzIsMS41Ny00LjU4LTUuODEtMS45NS0xMC41OSwxMS4zNC0xNC45MiwxNS42Myw0MS40NS04LjM0LTUuMDItMjAuNTEsNzYuNy0zMC4wMywxNC40NC02LjgtMTMuNjYtMTcuNDUsMTQuNy0zNS40LDIuNTItOS44LDQuMDUtMTkuOTEsOS4zNy0yOC43NiwxLjI3LTIuOTEtLjczLTctMy40LTkuMDRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTkwLjU5LDE3NS40MmMtNi40LDEuNjYtMTcuNjUsNi45Ni0xNy42NSw2Ljk2LTUuNS0yLjEtMy4xNC42Mi0yLjM1LDMuMjgtMTcuNjIsMy4yMy0zNC44OSw3Ljg2LTQ4Ljg3LDE5LjU0LTIuNTEsMS44My0zLjY1LjcyLTQuNDgtMi44My0xLjY3LTIuNTYtMi40NCwxLjg1LTIuNjcsMi45NSwwLDAtMTAuNTgsMi41OC0xNS4xOSw2LjUxLDMuMjYsNS4zNyw3Ljg1LDEzLjg0LDE1LjE3LDExLjAyLjE4LTIuNzYuMzUtNS40LjU1LTguMzMtMy4xMS0uNTQtNS45OS0xLjA0LTkuMi0xLjYsMy43Ny0yLjgzLDguMzItMy41MywxMi4wMS0yLjEtMy4xNywxMy4zOSwyLjUsMjIuODEsMTYuODEsMjMuNTUsNC4zNy02LjUyLDguMjktNy41LDEyLjU1LTIuOTEtMTguOS0xLjk1LTQuODcsMTguMDEsNC43OCwxMS4yNiwyLjU3LTMuNywxMC43Mi02Ljk2LDguMzYtMTIuMTktMTQuOTktMTAuOTYtMTMuOTUsNS4yMS0xNi43NC0yMS44NC0uNjItLjA1LTEuMzItLjExLTEuOTEtLjE2LTEuNCw1LjE0LTYuNDUsOS4xMS0xMC41OCw0LjI2LTEuNDMtMS42Mi0yLjY5LTMuMTItNS4wMy0zLjUzLDEwLjI2LTguMTksMjIuNDYsMy42MywyMS43Mi0xNS42MywxMS40MywxNC4zMywxMi40NC0xLjU5LDIzLjc1LTEuODItLjUzLDExLjM1LTIuODYsMTAuNDktMTIuNjQsOS44MywzLjE4LDIuNDQsMTUuMzksMTQuNiw4LjI3LDE1Ljc1LTIuOTctNy42MS03Ljk1LTE1LjAxLTE2LjM5LTE2LjUzLTYuODEsNi44MS0zLjQ4LDE0LjQyLTIuNDEsMjIuMjcsNi4wNS0yLjA2LDExLjIyLTUuOTcsMTcuNjItNS40OCwyLjEzLDYuMjYtNy45MSw5LjcyLTIuMjIsMTUuOTMsOS43NSwxLjU4LDIwLjM0LDEuNjQsMTcuMjQtMTIuMTYtMy4xNy0xLjktNi4zMy0zLjE5LTkuNjIuMy4xNy01LjM2LDUuNDItNi4yOSw5LjUtNS4yNyw5LjAxLTkuNTksNi0yMi4yNi0zLjY3LTI5Ljk2LDIuNTYtMy43Niw1LjI1LTYuMzYsOS45LTcuMjgtMS41NywzLjI0LTQuODYsNC40My01LjYsNy4zOSwyLjE1LDIuNjQsNC4xNiw1LjExLDYuMTQsNy41NCw1LjE5LTIuMjksNi41My0xMC40MiwyLjg1LTE4LjcyWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE4Ny4yLDIxNi41N2MuMDYtLjI4LjEzLS41Ny4xOS0uODUsOC40OC0uMzksMTYuOS0uMzgsMjQuODQsNC44LTIuMDktNi41LTcuMzYtMTYuMS0xNS4wNS0xNS4yOCwyLjc2LTUuNzcsMi43Mi05LjU5LS4wNi0xMy4wNi0xLjMxLDQuMDMtMy44Niw2LjU0LTguMDMsNi42OS45LDcuMjYtMS41LDEzLjI5LTUuNDUsMTguNjQsMS42Miw3Ljk2LS42NCwxNC42MS01Ljg3LDIwLjg3LDcuODQsMTQsMjEuMSwyNC42MywyNi45NiwzOS43OCwxMy4wOC0yNC40My0uODktMzIuNjQtMTguODgtNDYuMDIsMTEuNTQsNC4xNCwyMy4xOSw4LjEsMjkuNiwxOS4wOCwxLjM3LTIwLjk1LTcuOTItMzEuNDItMjguMjYtMzQuNjVaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTUwLjEsMjQ4LjM2Yy01LjMxLTMuMDQtMTEuMjktMy44LTE0Ljg4LTguMjUtLjk5LTIuMDktMi43OS0yLjg3LTQuNy0zLjI4LTYuMi0xLjM1LTExLjkzLTMuNC0xNS4wNC04LjU2LTQuNTMsMS40Mi03LjI4LDEuMjUtMTEuNDQtLjQ5LS4zNyw1LjEzLDQuMDEsMTAuMyw5Ljc3LDguMzMtNC42Miw2Ljc0LTIuMDUsMTIuNzctLjM2LDE5LjcxLDMuMy02LjkzLDguMzUtMTEuMSwxNC4wMS0xNC42Mi00LjMzLDcuMzktMTIuMDQsMTQuODItOC41NCwyNC4wNywyLjQxLDUuODUsNi4wMSwxMi42NSwxMS45NywxNS4wOS0zLjA4LTExLjU1LDQuNzMtMjEuNiw4LjM1LTMyLjA0LjA3LDI0LjA2LTEzLjYxLDM3LjExLDE5LjM5LDQ1Ljk1LTguNzktMTQuMTYtMi45Ny0zMS4zNi04LjUzLTQ1LjlaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjQ3LjQ3LDUwMS4yYy0zOS44Mi0zNy4wNi01NC42Ni04NS4yMy01MS4xNy0xMzguNzMtLjk2LS40OC0yLjE3LTEuMDgtNC4xNC0yLjA3LTYuNjcsNTYuNzMsMTUuMjIsMTEzLjk3LDU5LjI5LDE1MC41Nyw0LjQ3LTQuMTUtMS42LTYuNTctMy45OC05Ljc3WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYwNywyMDIuNjdjLTMuNzgsNy4zLDcuMTUsMTAuMzIsNy4yOCwxNy4yMy0yLjg5LTIuMjktNS4zNS00LjI1LTguMTEtNi40NC0zLjQ3LDEzLjUyLDEyLjQ5LDE3Ljg1LDE3LjQsMjguNDksNi40Mi0xOS43LDIuOTQtMzEuNjYtMTYuNTgtMzkuMjhaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTc1LjczLDIzOC4yM2MtMi4xMi40My00LjEtMi41NS02LjYyLS4xOCwyLjM2LDYuNTYsMTEuMDgsMTkuNjguMzYsMjIuNzUtMTAuNTUuNjQtOS4wMS0xMi42Mi0xMi4xLTIwLjAzLTEuOTEsMi4xNi0zLjUxLDMuOTctNS4yMiw1LjksMi4xOCw3LjM2LDQuMzYsMTQuNzUsNi42OCwyMi42LDEuNzYtMS4yNiwzLjIzLTIuMzEsNC44LTMuNDMsNy4zNiw1LjIsMTQuMSwxLjYyLDE2LjUzLTYuNSwyLjE4LjU1LDQuMTgsMS40OSw1Ljc0LS4wOS0zLjQ1LTcuMTMtNi43Ny0xNC0xMC4xNi0yMS4wMVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02MDAuNzQsMTYwLjgzYzEuMjUtNS42OS0uMjktMTEuMDUtMy44Mi0xMy4xNy4wNiw0Ljk5LTIuMDIsOC42My02LjU3LDEwLjUxLTIuMjQsOS44OSw4LjA2LDkuMzksMTQuNjIsMTEuNDgtLjA2LjMtLjExLjU5LS4xNy44OS0zLjMxLS4xOC02LjYyLS4zNi0xMC4wOS0uNTUsMy43LDExLjk0LDE3LjU2LDYuMTcsMjYuMjksMTEuNi01LjAyLTkuNTYtOC42Mi0xOC45Mi0yMC4yNi0yMC43NloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02MDUuNTcsMjI1Ljg4Yy0zLjg5LDcuNTEsMS41MywxNC42OSwzLjQ1LDIxLjgtLjI2LjExLS41My4yMS0uNzkuMzItMi4wOS0zLjIxLTQuMTctNi40MS02LjI2LTkuNjItLjI3LjA1LS41NS4xLS44Mi4xNS0yLjM5LDEwLjU0LDQuOTQsMTkuNzgsOS41MiwyOC43Nyw3Ljk1LTE0LjE2LDcuNjQtMzAuMjMtNS4wOS00MS40M1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01OTkuMDMsMTc4LjkyYzQuNTQsMTAuODQsMTEuODMsOC4yNCwxNi41NywxNS4zMi0zLjk5LTEuMzEtNy40Ni0yLjQ1LTEwLjkyLTMuNTgtLjIzLDExLjUyLDE0LjI4LDEyLjc1LDIyLjMxLDE3LjE3LTEuMjktMTguNjctMTAuMzUtMjUuNzQtMjcuOTctMjguOTFaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTQzLjQsMTQ1LjdjMy4yNiw1Ljg5LDcuNCwxMS43MSwxMy44MSwxMy42OCw0Ljk2LDAsMTIuMSwzLjE3LDE2LjE5LjMxLjEtMTUuNzQtMTkuMDktMTMuNjUtMjkuOTktMTMuOTlaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTAyLjY0LDM4My42OWMtNC4xLS4zMi03Ljk1LS42My0xMi40MS0uOTguMTcsMi4yLjMsMy44NS40NCw1LjYxLDIuNDguNjIsNC42LDEuMTQsNi44NiwxLjcxLjY5LDEyLjk2LTYuNDYsMTMuMTktMTYuMTEsNy43Ni0yLjg3LDE2LjQ1LDIzLjYxLDE0Ljc5LDIxLjIzLTE0LjA4WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUwMC41LDM1NC41NGMtNC4zNS0xLjMtOC42My0yLjktMTIuNTEtNS41MywyLjgxLTMuNDgsNS40My02LjcyLDguMTQtMTAuMDgtLjc5LTIuMjktMS42MS00LjY2LTIuNjYtNy43MS0xNC42MiwxNy45LTE0Ljc0LDIwLjUsNy41NCwyOC4yLS4yMS0yLjAzLS4zNS0zLjM1LS41MS00Ljg4WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQyMy40OSwyNTEuMDljLTIuNDIsNy4yNS04LjgxLDEwLjc4LTEyLjQ0LDE2LjksNS44Ni0uNDEsOS4yNC0yLjMsMTIuNi02Ljg3LjYsMS43MywxLjE0LDMuMzEsMS42OSw0LjksMi40NC0uMTksNC42LS4zNiw2LjczLS41MywyLjM0LTguNzQtMi42Mi05LjctOC41OS0xNC4zOVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NjYuMTcsMjgxLjI5Yy0yLjcyLDEuNjEtOC40Ny45Mi03LjkzLDUuMjUtLjA0LDYuMy0uMDEsMTIuNTktLjAxLDE4Ljg5LjI2LjA3LjUxLjE1Ljc3LjIyLDIuMTEtNS43NSwxMy4wOS0xOS45MSw3LjE3LTI0LjM2WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU0OS4zOCwxMzIuOTRjLjE4LDEwLjY4LDExLjI2LDEwLjcsMTkuMDcsMTEuNjQuMjMtLjMyLjQ2LS42NC42OC0uOTYtNi4xOS04LjgyLTguODQtMTAuNjMtMTkuNzYtMTAuNjhaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTQwLjU2LDExOC4xM2MtLjQzLDcuNTMsNS44OSwxMS44OSwxNi4zOCwxMS4zMy0yLjczLTcuNjItOC4xNC0xMS43NS0xNi4zOC0xMS4zM1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00OTEuOTIsMTk1Ljc3YzIuNDMsMTEuOTEsMTYuNjEsMy4yNCwyNC4wOC44LTguNTUtMy45OC0xNS41LDEuMDktMjQuMDgtLjhaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTMyLjI2LDEwNi4wOWMyLjIsNy42LDUuMTgsOS4yMiwxMyw4LjExLTIuNDktNi4yNC02LjUyLTguNzUtMTMtOC4xMVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01MjUuNDcsOTUuNTNjMi42Myw2LjQxLDYuNDUsOC44LDEwLjk5LDYuNjMtMy4wMy02LjQ4LTQuNi03LjMxLTEwLjk5LTYuNjNaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTAyLjc5LDMxMy43OGMtMS4wMy0xLjEtMy4yMi0xLjEtNC44OS0xLjYtLjE3LjIyLS4zNC40NC0uNTEuNjcsMi4wMywzLjQ4LDQuMDYsNi45NSw2LjAyLDEwLjMxLDcuODcsMCwxLjE5LTYuNTYtLjYyLTkuMzdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDg0LjExLDMxMS41M2MtMy40NSwzLjQtMTEuNTcsNC40OC05LjM3LDEwLjQsNC4wMS0yLjMxLDguMTctNC4xLDExLjc3LTYuOTktLjg1LTEuMjEtMS40Ny0yLjA5LTIuNC0zLjQyWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUxOCw4My43NGMuNTYsNC41NSw1LjM0LDguNTQsOC45NCw3LjkyLDEuMTMtNC4xMi00Ljc1LTkuNTktOC45NC03LjkyWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQzNi45NywzMjAuMTV2LjA1cy4wMS0uMDIuMDEtLjAzYzAtLjAxLS4wMS0uMDEtLjAxLS4wMloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjkuMjcsMTU4Ljc3Yy0yLjE4LDIuMDQsMS4wOCw1LjM5LDMuMjIsMy4yOCwyLjE3LTIuMDItMS4xMS01LjM1LTMuMjItMy4yOFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzIuMTQsMTY0Ljc4Yy0yLjE4LDIuMDQsMS4wOCw1LjM5LDMuMjIsMy4yOCwyLjE3LTIuMDItMS4xMS01LjM1LTMuMjItMy4yOFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzAuOTMsMTQ5Ljk4cy01Ljg0LTYuOTUtNS44NC02Ljk1Yy4xMy0uMjEuMjItLjQ0LjMtLjY4bDUuNTkuNTktMi43MS02LjgxLTQuMDMsMy4zYy0uMjEtLjEyLS40My0uMjItLjY2LS4yOWwtLjQ3LTYuNThjLTEuNjYuNjYtNS4wMSwxLjk5LTYuNjcsMi42NWw0LjE4LDUuMWMtLjExLjIxLS4yMS40Mi0uMjcuNjV2LjAycy01LjIuMzctNS4yLjM3bDIuNzEsNi44MSwzLjY2LTQuMjZjLjIyLjEyLjQ0LjIzLjY4LjI5LDAsLjA0LjUzLDkuMDYuNTMsOS4xaDBjLjkzLDcuOTcsMTMuMDcsMy4wNyw4LjIyLTMuMzFaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTA1LjU1LDE3MS4zOWMtMy4zMi0uMDgtMy40MSw1LjE4LS4wNyw1LjE3LDMuMzcuMDksMy40My01LjE3LjA3LTUuMTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTA1LDE3OC4xM2MtMy4zMi0uMDgtMy40MSw1LjE4LS4wNyw1LjE3LDMuMzcuMDksMy40My01LjE3LjA3LTUuMTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTE1Ljc4LDE1NS4wOGMtMy4zMi0uMDgtMy40MSw1LjE4LS4wNyw1LjE3LDMuMzcuMDksMy40My01LjE3LjA3LTUuMTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTA3LjY5LDE2NS4yNWMtMy4zMi0uMDgtMy40MSw1LjE4LS4wNyw1LjE3LDMuMzcuMDksMy40My01LjE3LjA3LTUuMTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTY4Ljg3LDE2My4yNGwtNS42Ni4yMWMxLjQ5LDIuMzIsMi4wNCwzLjQ2LDIuMTMsNS4zLTEuMTQtLjQ3LTIuNDktMS42NC0zLjk5LTMuNjRsLjc4LDguOTVjMS4wNi0xLjU5LDEuOTMtMi42OSwzLjItMy4yMy0uMDIsOC40OS02LjgsMTEuNjktOS4yNiw1LjY3LS40NC0yLjYzLDEuNzktNC4yNSw0LjA3LTEuODkuNDItNS40MS0zLjkxLTUuMzItNS44LTMuMDIsMi4yNC01LjE5LDEuMzYtOC42Ni0zLjIzLTExLjQ2LTIuOTEsNC44Ni0xLjcsOC4wNSwxLjk2LDExLjc2LTMuNTYtMS44Mi02Ljc2LDEuMTktMy41OSw1LjE2LjY4LTMuNDMsMy42OS0yLjY0LDQuMzYuMS41NSw3LjU1LTEyLjY5LDkuNjctMTQuMTQsMS42NSwxLjIxLS43Niw0LjA1LS40OSw3LjE4LDEuNTNsLTIuNjMtOC43N2MtMS4yOCwzLjE1LTMuMDksNC4zNy01LjI3LDUuMzItLjE4LTIuNTgsMS43LTcuNjgsMS43LTcuNjgtMi42MSwxLjA0LTcuOTYsMy4xNy0xMC41OCw0LjIxLDAsMCw0Ljg3LDIuNDEsNi41MSw0LjQxLTIuMjMuODEtNC4zOSwxLjE3LTcuNDgtLjI0bDQuMTEsOC4xOWMuODktMy42MiwyLjc2LTUuNzcsNC4xNi02LjA1LDQuNDYsNi44NC02LjYzLDE0LjM3LTExLjQxLDguNTItMS40LTIuNDUuMjUtNS4wOSwzLjEtMy4wNi0uNDItNS4wNy00LjgzLTUuMDUtNi4xNi0xLjI4LjExLTUuMjEtMS4yLTguMzUtNi42Ni05Ljg5LTEuNDIsNS4xOS4zMiw4LjMyLDUuNTIsMTAuNTUtMi45Ni0uMzgtNi4xNiwyLjUzLTIuMTQsNi4xOC4wNC0zLjI4LDIuNzgtMy42Myw0LjI2LTEuNDIsMi4zNiw2LjA2LTQuNzcsOC40LTEwLjYyLDIuMjQsMS4zLS40OCwyLjY5LS4yOCw0LjU1LjE0bC01LjU4LTcuMDRjLjI5LDIuNDkuMSw0LjI2LS40LDUuMzktMS4yLTEuNC0xLjU4LTIuNi0yLjA5LTUuMzFsLTQuMjUsMy43NGM0LjA2LDIuNTQsOC42MSw2LjU3LDE0LjIxLDE0LjU0LDcuNDEtNy4yOCwzNy4yNi0xOS43Niw0OC43OS0xOS40MS0xLjQxLTkuNjQtLjg3LTE1LjY5LjM0LTIwLjMzWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMwMC45NywzOTEuOTFjLTEzLDMuODQtMjQuOTYtMTUuMTYtMzYuNDUtNC43Ni00LjU4LDQuMDUtMS42LDEzLjA0LDQuNjEsMTMuMzQsNS41LjE1LDcuMDctNy40MSwyLjE3LTkuNzcsMTAuNy0zLjYyLDUuNTYsMTMuNTgsMS42OCwxNy45OC0xMi4yOC02LjM1LTE0LjMxLDEzLjQ1LTIuMTYsOC4yNS41NCwzLjU0LjcsNy4wMy0uMTUsMTAuNDMtMTMuMjctMi44Ni05Ljc0LDE2LjE4LjIxLDguNTIsMi44NywyLjcyLDQuMTksNi45Niw0LjUyLDExLjAxLTEzLjMsMS45LTIuNjcsMTguOTcsMy41LDcuNTQsNCwyLjMyLDguNDUsNC44OSwxMi41Myw3LjIxLTkuOTgsMTIuMTMsNy45MSwxNy4zNyw2Ljk0LDUuNTMsNi42OSwyLjg2LDMyLjk5LDEwLjk2LDIyLjQ1LTQuNzctMzQuNTEsMS4xNC01Mi4wOS0zNS4wOC0zMy4wMS02Mi43NSwxMS42MSw1LjMsNTIuMzktMTQuNTQsNDksNS42NSwyLjE0LDIuMjUsMi43NSwyLjQ2LDcuNTksMi40MiwxMS44LTI3LjExLTI4LjgzLTE5LjAxLTQzLjQyLTE1Ljg0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM0MC42NCw0MjAuMDJjLTEuMTQuMTMtOC45Niw2Ni41Ni0xMy4wNCw2Mi42Ni44Mi00LjM4LDEwLjM3LTYyLjY1LDEwLjM3LTYyLjY1LDAsMC0yLjg0LS40LTQuMjMtLjYtLjI0LDEuMzUtLjU0LDMuMDgtLjU0LDMuMDhsLTE1Ljg1LTIwLjgxLTIuMDkuOTksMTYuOTcsMjIuMzItMS4wOSwzLjk1Yy0xLjU2LTEuMDEtMTcuOTMtMjMuNzQtMTkuNTctMjUuODZsLTMuMzQtLjI1LDIyLjA3LDI4Ljc4LTEuMTcsMy44Ni0yNC43My0zMi41Mi0zLjE3LS4wNCwyNi43OCwzNS4zLTEuNDEsNS4wOS0yOS40MS0zOS45OS0zLjg5LjExLDMyLjUzLDQyLjk0LTEuMTksMy45Ny0zNS45MS00Ni45MS0uNjEsMy42czMzLjQyLDQzLjk1LDM1LjQ4LDQ2LjgzYy0xLjcyLDUuNDEtLjQsNS44OCwxLjk1LDEwLjM1LDEuMjksNS0yLjE3LDEyLjgtOC4xLDEwLjk3LS41NS0uMjEtMS4xMy0uMzctMS44Ni0uNi0uOTMsMi41LTIuMzUsNy4wNi0uMTQsOC42MywwLDAsMTEuMTgsNC43OCwxMS4xOCw0Ljc4bDE0LjM2LTEwLjY2LDMuODgtNTcuNjItNC4yMy4zMloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yODYuNDUsNDExLjMxcy0uNjYsMi4xNS0uOTUsMy4xYzIuNTYsMy4zNSwzMi45Myw0My42NCwzMi45Myw0My42NGwyLjM5LTEuMTctMzQuMzctNDUuNTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjg1LjA5LDQyMC41NXMtLjQ5LDMuOCwxLjI4LDYuMTJjNy45MywxMC4wNiwxNS43MywyMC4zMiwyMy40NiwzMC40OSwxLjE1LjE0LDMuMy42LDMuMy42bC0yOC4wMy0zNy4yMVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zNDYuMjgsNDA5Ljc0Yy0zLjgtLjMxLTcuODQtMS4wNi0xMS41NS0xLjQyLTcuMjMsNi4yOS45LDkuODksNi4zLDkuNCw0LjYzLDEuMjMsMTAuODEtNC45MSw1LjI1LTcuOThaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzQ1LjEyLDU3Mi4zYy0xLjEzLDUuMTQsNi45Nyw2LjgsNy45NSwxLjYyLDEuMTMtNS4xNC02Ljk3LTYuOC03Ljk1LTEuNjJaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzQyLjU0LDUzOS40Yy0xLjQsNi4zNyw4LjY0LDguNDIsOS44NSwyLjAxLDEuNC02LjM3LTguNjQtOC40Mi05Ljg1LTIuMDFaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzA4LjI1LDUyMi4zOWMtMS40LDYuMzcsOC42NCw4LjQyLDkuODUsMi4wMSwxLjQtNi4zNy04LjY0LTguNDItOS44NS0yLjAxWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM2Ni4zOCw1ODguOTdjLTIuNjgtMS42Ny02LjItMy4zMy05LjUtMy4zMy0xLjc3LDAtMy40Ny40OC00Ljk1LDEuNjksMTAuNDgsNC4xNCw2LjczLDE5Ljk1LTMuNDUsMjAuMDEtMTAuMTgtLjA2LTEzLjk0LTE1Ljg3LTMuNDUtMjAuMDEtMS40Ny0xLjIxLTMuMTgtMS42OS00Ljk1LTEuNjktMy4zLDAtNi44MiwxLjY2LTkuNSwzLjMzLTMuMDItMy45Ni01Ljk4LTcuODItMTEuNy04LjQsMy4xMywyOS4wMSwxNi4zNyw0My41MSwyOS42LDQzLjUxczI2LjQ3LTE0LjUsMjkuNi00My41MWMtNS43Mi41OC04LjY4LDQuNDQtMTEuNyw4LjRaTTM0OC40OCw2MjAuMjFjLTkuNzcsMC0yMC43My0xMC4zOS0yNC44MS0zMy4zOCwxLjI1LDEuMTQsMi40NCwyLjY1LDMuODQsNC40OWwyLjEzLDIuOCwyLjk5LTEuODZjMS4yOC0uOCwyLjUzLTEuNDQsMy42OS0xLjktMS4zMSwyLjY2LTEuNzUsNS44LTEuMTQsOS4wNywxLjI5LDYuOSw2Ljc2LDExLjc1LDEzLjMzLDExLjc4LDYuNTMtLjA0LDExLjk5LTQuODgsMTMuMjktMTEuNzguNjEtMy4yNy4xNy02LjQxLTEuMTQtOS4wNywxLjE2LjQ2LDIuNCwxLjEsMy42OSwxLjlsMi45OSwxLjg2LDIuMTMtMi44YzEuNC0xLjgzLDIuNTktMy4zNCwzLjg0LTQuNDktNC4wOCwyMy0xNS4wNSwzMy4zOC0yNC44MSwzMy4zOFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNzAuMjEsNDg5LjQ0Yy0xLjgyLTEuMS00LjEtLjgyLTUuMzIuNzUtNC4zOCw1LjAyLDEwLjczLDEyLjAzLDEyLjgsMTQuODIsMS44NywxLjQ0LDQuNDUsMS4yMyw1Ljc2LS40Nyw0LjM3LTUuMjYtMTEtMTIuMTUtMTMuMjQtMTUuMVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNzkuNTMsNDkxLjc2YzcuNzYsNC4yLDE0LjQ5LDE1LjI5LDIuNDIsMTguNTItNC41NC45My05LjItMy45Ni0xMi41NC02LjM4LjEyLDYuNTYsNS40OSwxMS44NywxMi4wOCwxMS44NywxNi45OC4wOCwxNC43Ny0yNi44Ni0xLjk2LTI0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI5NC43NCw0NzYuOGMtNi41OC0yLjIxLTI3LjM0LDIuNDktMzQuMywyLjgtNC43Mi42LTguMTIsNC44My03LjcsOS41NywxLjA1LDUuMDYuOSwyNy4wMSw0LjYxLDMxLjA1LDMuNzMsNy4xMSwyNS41NywyNi40MSwzMS41MSwxNy4yOS0xMC42Ny01LjQtMjguNzMtMTguNzEtMjEuOC0zNS42MS0xNS42Ny05LjYyLTEuODItMjQuOTgsMTAuMzktMTEuOTMsMTMuMDEtOC4wNSwyNy40Ni0yLjI5LDQwLjI4LDYuNjEsNC42MS05Ljk2LTE3Ljc2LTE2LjgzLTIyLjk5LTE5Ljc5WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM4Mi41NCw3OC4wNmMtLjgyLDIuMjQtMS41Nyw0LjY1LTIuMjUsNy4yLDI5LjU3LDcuNDMsNTQuNTEsMjcuNTYsNjkuNDksNTQuNjlsOS42NiwzLjA5Yy0xNS4yNy0zMi4xNi00My4yMy01Ni4zMS03Ni44OS02NC45OFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zMjcuMzUsNzguMDZjLTMzLjY2LDguNjctNjEuNjIsMzIuODEtNzYuODksNjQuOThsOS42Ni0zLjA5YzE0Ljk4LTI3LjE0LDM5LjkyLTQ3LjI2LDY5LjQ5LTU0LjY5LS42OC0yLjU1LTEuNDMtNC45Ni0yLjI1LTcuMloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MjcuNjcsODAuMzVjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MDMuMjcsNjYuNDZjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zOTAuMDQsNjEuNjZjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MTUuODUsNzIuNzJjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzguNTksODkuMjFjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NjYuMTgsMTM5LjgzYy0uMSw2LjksMTAuNzQsNi45LDEwLjY0LDAsLjEtNi45LTEwLjc0LTYuOS0xMC42NCwwWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ1OS43NSwxMjcuMzNjLS4xLDYuOSwxMC43NCw2LjksMTAuNjQsMCwuMS02LjktMTAuNzQtNi45LTEwLjY0LDBaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDQ4LjUxLDk5LjE4Yy02LjktLjEtNi45LDEwLjc0LDAsMTAuNjQsNi45LjEsNi45LTEwLjc0LDAtMTAuNjRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDUyLjA2LDExNS40OGMtLjEsNi45LDEwLjc0LDYuOSwxMC42NCwwLC4xLTYuOS0xMC43NC02LjktMTAuNjQsMFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yODIuMjEsODAuMzVjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNzEuMyw4OS4yMWMtNi45LS4xLTYuOSwxMC43NCwwLDEwLjY0LDYuOS4xLDYuOS0xMC43NCwwLTEwLjY0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIzOC4zOCwxMzQuNTFjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yOTQuMDQsNzIuNzJjLTYuOS0uMS02LjksMTAuNzQsMCwxMC42NCw2LjkuMSw2LjktMTAuNzQsMC0xMC42NFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNTIuNTEsMTEwLjE2Yy02LjktLjEtNi45LDEwLjc0LDAsMTAuNjQsNi45LjEsNi45LTEwLjc0LDAtMTAuNjRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjQ0LjgxLDEyMi4wMWMtNi45LS4xLTYuOSwxMC43NCwwLDEwLjY0LDYuOS4xLDYuOS0xMC43NCwwLTEwLjY0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMxOS44NCw2MS42NmMtNi45LS4xLTYuOSwxMC43NCwwLDEwLjY0LDYuOS4xLDYuOS0xMC43NCwwLTEwLjY0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI2MS4zNyw5OS4xOGMtNi45LS4xLTYuOSwxMC43NCwwLDEwLjY0LDYuOS4xLDYuOS0xMC43NCwwLTEwLjY0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMwNi42Miw2Ni40NmMtNi45LS4xLTYuOSwxMC43NCwwLDEwLjY0LDYuOS4xLDYuOS0xMC43NCwwLTEwLjY0WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM3My44NSw2OC44NWMtOC40NiwxOC41My05Ljc1LDQ0LjAzLTkuNzUsNTcuNjZoNy4wOWMuMDEtMjIuNDUsMy4yNS00MS44Nyw5LjExLTU0LjcyLDEuOTctNC4xNC00LjU4LTcuMTgtNi40NS0yLjk1WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMzNi4wMyw2OC44NWMtMS44Ny00LjIyLTguNDItMS4yLTYuNDUsMi45NSw1Ljg3LDEyLjg0LDkuMSwzMi4yNyw5LjExLDU0LjcyaDcuMDljMC0xMy42My0xLjI5LTM5LjEzLTkuNzUtNTcuNjdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzU0Ljk0LDExNC45Yy03LjQ4LS4xMS03LjQ4LDExLjY0LDAsMTEuNTMsNy40OC4xMSw3LjQ4LTExLjY0LDAtMTEuNTNaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzU0Ljk0LDEwMC40NmMtNy40OC0uMTEtNy40OCwxMS42NCwwLDExLjUzLDcuNDguMTEsNy40OC0xMS42NCwwLTExLjUzWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM1NC45NCw4Ni4wMWMtNy40OC0uMTEtNy40OCwxMS42NCwwLDExLjUzLDcuNDguMTEsNy40OC0xMS42NCwwLTExLjUzWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM1MC44Nyw4My40NWMyLjQ0LTEuMjksNS43Mi0xLjI5LDguMTYsMCw4LjI2LTEyLjczLTE2LjQyLTEyLjcyLTguMTYsMFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zNTAuMzYsNzEuMzJjMi42Ny0xLjY1LDYuNDktMS42NSw5LjE3LDAsNi40Mi0xMS45NS0xNS41OS0xMS45NC05LjE3LDBaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzcyLjM4LDMyLjM4aDEuODhWNi4yNGgtMS44OGMtLjg5LDQuNzktNi41OCw4LjY1LTEzLjk1LDkuNTkuOTQtNy4zNyw0LjgtMTMuMDcsOS41OS0xMy45NVYwaC0yNi4xNHYxLjg4YzQuNzkuODksOC42NSw2LjU4LDkuNTksMTMuOTUtNy4zNy0uOTQtMTMuMDctNC44LTEzLjk1LTkuNTloLTEuODh2MjYuMTRoMS44OGMuODktNC43OSw2LjU4LTguNjUsMTMuOTUtOS41OS0uOTQsNy4zNy00LjgsMTMuMDctOS41OSwxMy45NXYxLjg4aDkuMzVjLS40NC4zMy0uODMuNzItMS4xNywxLjE2LTE2LjY4LDMuNzItMTguMzksMjkuMTYtMi40NSwzNS4xNS02LjIyLTYuMDEtMS40NC0xNy41Niw3LjM0LTE3LjI2LDguNzgtLjMsMTMuNTYsMTEuMjUsNy4zNCwxNy4yNiwxNS45NC01Ljk5LDE0LjIyLTMxLjQzLTIuNDUtMzUuMTUtLjM0LS40My0uNzMtLjgyLTEuMTctMS4xNWg5LjM1di0xLjg4Yy00Ljc5LS44OS04LjY1LTYuNTgtOS41OS0xMy45NSw3LjM3Ljk0LDEzLjA3LDQuOCwxMy45Niw5LjU5WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU4MC41OSw0MjguOTFjLjE1LDEuMi42OSwyLjI5LDEuNjQsMi45OGwuMDMuMDJjLS42LTEuMDItMS4xNy0yLjA0LTEuNjctMy4wMVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMzEuMSw0MDYuOGMtMS40OS0uMzEtMTkuNzgsMy4wNS0xOS43OCwzLjA1LDAsMCwxNy4zOC0yMC4yNywxNi45NC0yMi42OGwtMjkuNjEsMy4zMy42Myw1LjFjMS40NC0uMiwxNy40MS0yLjQyLDE3LjQxLTIuNDIsMCwwLTE0LjQ3LDE2LjMzLTE1LjE2LDE2LjY0bDEuNjUsNi4zOCwyOS4zNC0zLjY0LTEuNDItNS43OFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNTUuNTgsNDYyLjIyYy0xLjkxLDMuMTQtNi4xNSw2LjIyLTkuNDQsOC41MWwtNy42LTEwLjUxYzMuMjEtMi40MSw3LjQ1LTUuNDcsMTEuMDMtNi4zbC00Ljk1LTYuODVjLTUuMjYsNi40Ny0xNi4xLDE0LjMxLTIzLjg4LDE3LjI4bDQuOTUsNi44NWMxLjktMy4xMyw2LjEtNi4xOCw5LjM4LTguNDdsNy42LDEwLjUxYy0zLjIsMi40LTcuNDEsNS40My0xMC45OCw2LjI2bDQuOTUsNi44NWM1LjI2LTYuNDcsMTYuMS0xNC4zMSwyMy44OC0xNy4yOGwtNC45NS02Ljg1WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5OS4wNiwzNzAuODJsLS40MSw2LjI3YzguMzgtMS41NywyMS44OS0xLjU3LDMwLjI1LjA3bC40MS02LjI3Yy04LjM4LDEuNTctMjEuODksMS41Ny0zMC4yNS0uMDdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDM1LjU0LDQ4Ni4zNmMtOC41LTIuNDEsMi4yNC0xMS4wNSw3Ljg3LTkuMTVsLjE0LS4xMi00LjI2LTUuMDRjLTYuMzgsMi43OC0xNi41NCwxMS4zNi0xMS4xMywxOC42MywzLjc1LDQuNzksMTEuMzItLjMyLDE2LjI3LS4yNiw4LjIxLDEuNDgtLjYyLDEwLjAzLTUuNyw5LjU0bC0uMDguMTEsMy4yMiwzLjgxYzE3Ljk1LTcuODUsMTMuOTQtMjUuNy02LjMyLTE3LjUzWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ2OC4xOSw0MTYuMTVsLTQuODMsMTYuNDIsNC44Niw0LjEzLjA5LS4wNWMtLjM3LTMuNzkuMTQtOC4wMywxLjUzLTEyLjc0bDguODQsMi41N2MtLjg4LDIuNTctMi40NCw4LjQyLTMuNjUsOS45Nmw0LjQyLjY2LDIuODItOS41Nyw4LjQ3LDIuNDZjLTEuMDEsMy4xNy0yLjQxLDUuNjUtNC4yLDcuNDVsNC41Miw0LjE1LDUuMDktMTcuM2MtMi41Ny4xOC0yNS44OC02LjYtMjcuOTUtOC4xM1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NTkuMDMsNDQzLjgzbC0yLjUzLDQuODFjLjg2LDEuMTIsMTUuODcsOS45NywxNS44Nyw5Ljk3LDAsMC0yNC43MiwzLjI0LTI1Ljg4LDUuMTVsMjIuOTksMTUuNzcsMi42OC0zLjg3Yy0xLjE0LS43NC0xMy44LTguOTYtMTMuOC04Ljk2LDAsMCwyMC4yNS0yLjMyLDIwLjkyLTIuMTFsMi43NS01LjM2LTIyLjk5LTE1LjRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDE2LjgyLDQ4Ny4yOWwtMTUuMTksOC43OC42OCw2LjIzLjExLjAyYzIuNC0zLDUuNzgtNS43NiwxMC4xNC04LjI4bDQuNzMsNy43MmMtMi40NywxLjI5LTcuNzUsNC41My05Ljc0LDQuODRsMi44MSwzLjQsOC44NS01LjEyLDQuNTMsNy4zOWMtMi45OSwxLjY0LTUuNzgsMi41My04LjM4LDIuNjZsLjQxLDYuMDIsMTYtOS4yNWMtMi4wNC0xLjU3LTE0LjUtMjEuOTMtMTQuOTUtMjQuNDJaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjM3LjMsMzE4Ljc1Yy00Ljc3LTMuNzctMTAuOTMsMi45Ny0xNS43NSw0LjA3LTguMzMuNDktMS43NS05Ljg5LDMuMy0xMC42MWwuMDUtLjEzLTQuMDItMi45NGMtNy41NCwzLjgzLTEzLjI2LDIwLjE2LTEuMDgsMjAuNTEsMi41OC4xMyw5LjE5LTQuNDUsMTEuMzUtNC45NSw1LjczLTEuMDcsMy45MSw2LjYxLjQ4LDguNDMsMS43LS4wNywzLjQ3LS4zMSw1LjExLjEzLDMuMTgtNC40OCw1LjIyLTEwLjk5LjU4LTE0LjUxWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0My4yMSwyODkuNTN2LTUuNTljLTIwLjkyLTEuMjUtMjAuNiwzMS45NCwwLDMxLjI0di01LjJjLTEzLjM1LS44Ny0xNi4xNC0yMy45NCwwLTIwLjQ1WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI5Mi4zMiwyNTQuN2wtNy4yNS01LjUyLTIyLjI3LDEzLjMyLDIuNTUsOC41NS4xMy4wNGMxLjgtMy41NCw0LjUxLTYuMzksNy40OS04LjA1LjY3LDEuMjMsMS44OSwzLjQzLDMuNCw2LjEuMDUtLjAzLDkuMTYsMCw5LjIxLDAtMy40OC01LjUxLTYuMjgtMTAuMDQtNi4yOC0xMC4wNCwzLjE5LTEuODcsMTAtNC42LDEzLjAzLTQuNFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zNDEuMzksMjY1LjI3Yy0yLjIxLS42Ni01LjE1LTIuMzktOC44MS01LjE4LDExLjIyLTE1LjQtMTItMzEuMjMtMjMuNzEtMTcuMjctMTEuMTIsMTEuNywzLjg0LDI5LjkzLDE3LjcsMjIuMTUsNC43NywyLjU1LDEwLjQzLDQuMDIsMTQuODYuNDRsLS4wNS0uMTNaTTMyNC40MSwyNjAuODJjLTkuOTMsNC4wOS0xOS40My0xMy4zLTguNC0xNy41Miw5Ljg4LTQuMDcsMTkuNTQsMTMuMTcsOC40LDE3LjUyWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM3MywyMzUuNmgtOS45YzIuMTEsNC4yMiwxLjMyLDEzLjIyLDEuNDYsMTguMS4wNywzLjQ5LTMuMjQsNS44LTYuNTcsNS43NC04LjQ2LDEuMDQtNS41OS0xOS4zOC00LTIzLjgzaC05LjljMi4wNCw0LjEyLDEuMzcsMTIuNTQsMS40NywxNy4zMi0uNzksMTEuNzEsMTAuNzUsMTQuNzUsMTkuMzIsOC42NiwwLDEuMzItLjA5LDIuMjctLjI4LDIuODVoOC4zOWMtMi4zMi03LjY4LTIuMzItMjEuMTUsMC0yOC44M1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zODcuOTksMjM5LjM4Yy4wOCw3LjYzLTQsMTkuNTItNi41OCwyNi43OXEyLjk1LjM5LDYuMDkuOTljMS43NS03LjEsNC4yNC0xOS4xOSw4LjE4LTI1LjJsLTcuNjktMi41N1oiPjwvcGF0aD4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDQ5Ljk3LDM2Ni4yNmMuMDQtMS42MS0xLjc3LTIuODEtMy4zMi0yLjI4di4zNWMtMi43NSwxMi40MS0xLjU2LTM2LjMyLTEuNy0zOC4xNWwyLjYsMS4wN3YtNi4xNmwtMi42MiwxLjA3di0zOS4wNWMuMzgtMS45NiwzLjQzLS4yOSwxLjc1Ljk4di4zNmMzLjYsMS4xNCw0LjY1LTQuNjEuOC00LjY3bDIuNC00LjE2LS41Ny0uNTVzLTQuMywyLjM2LTQuMzQsMi4zM2MtLjA2LTMuNTctNi4xLTIuNy00Ljk2Ljc3aC4zN2MxLjI4LTEuNTUsMy4xNSwxLjIyLDEuMDYsMS42MywwLDAtMzYuMDIsMC0zNi4wMiwwbDEuMTItMi40M2gtNi41NGwxLjEyLDIuNDNoLTM1Ljk5Yy0yLjE3LS4zMS0uMzQtMy4yMi45OS0xLjY0aC4zNmMxLjE4LTMuNDYtNC45LTQuMzQtNC45NC0uNzctLjA0LjA0LTQuMzEtMi4zNC00LjM1LTIuMzNsLS41OC41NSwyLjQsNC4xNmMtMy44NS4wNi0yLjc5LDUuODIuODEsNC42N3YtLjM2YzIuNzItMTIuNCwxLjU2LDM2LjI5LDEuNywzOC4wNGwtMi41NC0xLjA0djYuMTZsMi41NS0xLjA0Yy0uMTkuOSwxLjA2LDUwLjQ1LTEuNzEsMzguMTN2LS4zNWMtMy42LTEuMTMtNC42Niw0LjYyLS44LDQuNjdsLTIuNDEsNC4xNi41OC41NXM0LjMtMi4zNyw0LjM1LTIuMzNjLjA0LDMuNTgsNi4xMywyLjY5LDQuOTQtLjc2aC0uMzZjLS41Ni44NC0yLjA1LjQtMi4wMi0uNjEsMC0uNTIuNDMtLjk1Ljk3LTEuMDNoMzYuMDdsLTEuMTQsMi40Nmg2LjU0bC0xLjEyLTIuNDZoMzUuOThjLjU0LjA3Ljk3LjUuOTcsMS4wMy4wMywxLjAxLTEuNDYsMS40NS0yLjAxLjYxaC0uMzhjLTEuMTQsMy40Nyw0LjkyLDQuMzMsNC45Ny43Ni4wNC0uMDQsNC4yOSwyLjM0LDQuMzIsMi4zM2wuNTktLjU1LTIuNC00LjE2YzEuMzktLjAxLDIuNTEtMS4wNywyLjUxLTIuMzlaTTQ0Mi40NCwzNjYuMjhoLTc4LjM2di00Mi4zMWguMDFzLS4wMSwwLS4wMSwwdi00MS43Nmg3OC4zNnY4NC4wN1oiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzY3LjIsMzU4LjY0djQuNjNoNzIuMTR2LTc4LjA1aC03Mi4xNHY3My40MlpNMzk5LjYzLDM2MC45NWgtLjA0cy4wMiwwLC4wNCwwaDBaTTQwNi44NSwzNjAuOTVoMHMuMDMsMCwuMDQsMGgtLjA0Wk00MDYuNzcsMjg3LjU0aDBzMCwwLDAsMGgwWk0zNjkuNjUsMzI3Ljd2LS4wMmgwczAsLjA1LDAsLjF2LjFjMCwuMjIuMDEuNTYsMCwuNTguMTMtMS40NywyLjQ5LS40LDEuMzEuNjFsLjM3LjM1YzIuMzguMjgsMi43My0zLjI5LjMxLTMuNDJ2LS4wOGwyLjg3LTEuMjV2LS44NmwtMi44Ny0xLjI3di0uMDljMi40Mi0uMTUsMi4wNy0zLjctLjMxLTMuNDNsLS4zNy4zN2MxLjE4LDEtMS4xOCwyLjA3LTEuMzEuNiwwLC4xLS4wMi44MS4wMi44OGgtLjAzdi0zMS4wMmgyLjQ2di0yLjMyaDI2LjcyYzEuNDkuMjUuMjMsMi4yOS0uNzIsMS4yMmwtLjM4LjM2Yy0uMjksMi4zMywzLjY5LDIuNSwzLjY2LjE1aDBsMS40MSwyLjg0aC45MmwxLjM3LTIuODRjLS4wMiwyLjM0LDMuOTUsMi4xOCwzLjY3LS4xNmwtLjM5LS4zNmMtLjk0LDEuMDctMi4yMS0uOTYtLjcyLTEuMjIsMCwwLDI2Ljc3LDAsMjYuNzcsMHYyLjMyaDIuNDZjLS4yOC0uNTQuOTcsMzguMDctMS4yOSwyOS41M2wtLjM5LS4zN2MtMi4zNi0uMjgtMi43MSwzLjMtLjMsMy40M3YuMDlsLTIuODgsMS4yNnYuODZsMi44OCwxLjI1di4wOGMtMi40LjEzLTIuMDYsMy43LjMsMy40MmwuMzktLjM1YzIuMi04LjU1LDEuMDgsMjguNjksMS4yNywyOS41OGguMDJzLS4wMS4wMi0uMDIsMGgtMi40NXYyLjMxaC0yNi43MmMtMS41My0uMjEtLjMyLTIuMzIuNjktMS4yNGwuMzgtLjM2Yy4yOS0yLjI4LTMuNTctMi41My0zLjY2LS4yNWgtLjA2bC0xLjM2LTIuNzZoLS45MWwtMS4zNCwyLjc2aC0uMDZjLS4wOS0yLjI3LTMuOS0yLjA0LTMuNjUuMjVsLjM4LjM2YzEuMDEtMS4wOSwyLjIyLDEuMDMuNjgsMS4yNCwwLDAtMjYuNjksMC0yNi42OSwwdi0yLjMxaC0yLjQ2di0zMC43N3MwLS4wNywwLS4xdi0uMDdaTTQzNi44OCwzMjAuODV2LjAyaDBzMC0uMDEsMC0uMDJaIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM2OS43NSwzMjguNDVzLS4wMy4wMywwLC4wNnYtLjA2WiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMTkuNDcsMTYwLjIxYy02LjI1LDQuNTQtOS45MSwxMi4wOS0xMC4xOSwyMC40M2wxLjc0LTEuNDRjLjY4LTcuMiw0LjA3LTEzLjYyLDkuNTctMTcuNTctLjM3LS41MS0uNzUtLjk5LTEuMTItMS40M1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjAuODcsMTU3LjdjLS43OS0uODEtMi4wOC4zOS0xLjI4LDEuMTcsMi40MywyLjQ0LDQuNzcsNi41Nyw2LjYsMTEuNjNsMS42Ny0uNTVjLTEuMTEtMy4wNy0zLjQ5LTguNzMtNy0xMi4yNVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMTEuMTcsMTU5LjY1Yy0zLjMyLS4wOC0zLjQxLDUuMTgtLjA3LDUuMTcsMy4zNy4wOSwzLjQzLTUuMTcuMDctNS4xN1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTYuNTMsMTUwLjEzYy0yLjM2LDIuNCwxLjQ0LDYuMDQsMy43NCwzLjU3LDIuMzQtMi4zOC0xLjQ3LTUuOTktMy43NC0zLjU3WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE2MS43MiwxNTQuNDZjLTIuMzYsMi40LDEuNDQsNi4wNCwzLjc0LDMuNTcsMi4zNC0yLjM4LTEuNDctNS45OS0zLjc0LTMuNTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTM3LjcyLDE0Ni4wMWMtMi4zNiwyLjQsMS40NCw2LjA0LDMuNzQsMy41NywyLjM0LTIuMzgtMS40Ny01Ljk5LTMuNzQtMy41N1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTAuNjUsMTQ3LjM2Yy0yLjM2LDIuNCwxLjQ0LDYuMDQsMy43NCwzLjU3LDIuMzQtMi4zOC0xLjQ3LTUuOTktMy43NC0zLjU3WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzOC44LDE1Mi4yM2MuMDUuNTcuMTMsMS4xNy4yMywxLjgsNi42Ny0xLjE2LDEzLjYzLjkxLDE5LjI0LDUuNDdsMi4yNC0uMjNjLTYuMTUtNS42NC0xNC4xLTguMzEtMjEuNzItNy4wNFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzcuMzMsMTUxLjM4YzAtMS4xMi0xLjc2LTEuMDMtMS43My4wOS4wNiw0Ljk3LDIuNDMsMTAuNjIsMy44NCwxMy41N2wxLjU3LS44Yy0yLjMzLTQuODUtMy42NC05LjQyLTMuNjgtMTIuODZaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTQ0LjIyLDE0NS45MmMtMi4zNiwyLjQsMS40NCw2LjA0LDMuNzQsMy41NywyLjM0LTIuMzgtMS40Ny01Ljk5LTMuNzQtMy41N1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzkuMjQsNDI3LjM3Yy0zLjY4LTMuNTUtOS44LDMuMjEtMTMuNTItLjUzLDcuNDgtLjE0LDI0Ljg1LTguMzYsMTIuMjMtMTUuMTctNy4wNi0xLjE5LTE0LjA5LDIuMjYtMjAuODksMy44NS0yNy4zNSwxMC44Ny0xMS4zMi0yLjQyLTI4LjMtLjk3LDUuNzMsMTQuNSwyMC4yLDcuMDEsMzEuMDUsMy42My4zMywxLjU5LTEuNjcsMS45Ny0xLjQxLDMuNTcsMy42NS0uNzYsNy4xNC0xLjQ4LDEwLjU3LTIuMTksMS40OS03LjExLDE0LjQ4LTcuMTksOC41My0uMDYtMTQuOTcsNi41My0zMi42NCw1LjMyLTQ4LjMxLDkuNzctMTAuNDgsMjcuNDQtMjguNjksOC43Ny0yOC41MiwxNi42My00LjEuMzktNC4wNCw0LjMyLjE3LDMuOTkuMDksNy45OSwyMC4yOC0xLjI3LDI0LjAzLTMuNzIuOS0xLjkzLDEuNzMtMy43LDIuNTgtNS41Miw2LjE0LDIuOTksMTAuNDYtNS44NCwxNS43OC03LjQxLDUuMy0xLjA2LDEyLjIxLTYuMjQsMTYuNzMtMS40NSw1LjAzLDUuNTYsMTIuNTUtMi45MiwxNi45OSwyLjY5LTEuNjgsNC4zMy41MywyLjQyLDEuMjcsNS4xNC0uMDcsMi40MywzLjk5LDIuNCw0LjA1LS4wNS0uMDItMS4wNy4xMS0xLjc0LDEuMTYtMi4xNywyLjI1LTMuNDEtMi41My03LjE5LTQuMi0xMC4wM1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NDQuODksMzk4LjQxYy0xLjk1LTEuODMtOS42NSwxLjkyLTkuODctMS44OSw1LjczLDEuMjksMTYuNzUtNi4xOCw5LjE4LTExLjAyLTEyLjgxLTIuOTktMjYuODgsMy4xOS0zOS44Nyw0LjY2LTUuMTEsMS4xNC0yLjU1LTcuMTktMTMuODQtNC45NSw3LjI3LDE1LjE3LDIyLjk1LDQuNDMsMzUuMTIsNC4zLjA4LDEuMzctMi4zMSwxLjI5LTEuNzMsMi45OCwzLjU0LTEuMSw5LjU2Ljc5LDExLjU5LTIuNzQsMS4xLTQuMzEsMTAuMTgtMy4yOSw3LjUxLDEuNjktNi44LDQuMzUtMTYuOTUsMi4zNi0yNC45NCwzLjI1LTkuNzkuODItMjAuNDcsMS4wNS0yOS42Miw0LjQ3LTEuODEsNS42OC00LjMzLDExLjUyLTEwLjg3LDEyLjg4LTQuNTgtNC40NS0xMS4yMy44LTE2LjE0LTMuNy0xLjYxLjMzLTEuOTEsMS4yOC0yLjU1LDIuNS0yLjQxLjkxLTMuMjMsMi4yOS0uNzUsMy45MSwxLjIyLjQuNzYsMS44NSwxLjMzLDIuNTgsNi40NS40NCwxMi44OS0xLjI4LDE5LjM5LTIuMDgsNC44NiwwLDQuNjgtNC4yOCw4LjI0LTQuODcsOC41OS40NSwxMy45My03LjE0LDIyLjAyLTguMzYsNi40OC0xLjgzLDE1LjIyLTQuMjMsMjAuOTUuMzIsMS4zOSwxLjU0LDMuMzksMS44NCw1LjQ2LDEuNDUsMi43NC0uNDgsNi0xLjA3LDcuNDQsMi4xMS0uNDcuNDktLjkyLjk2LTEuNTYsMS42Mi4yOC41OS42LDEuMjguOTMsMS45OCwxLjM1LS4wOSwxLjU0Ljk5LDIuMDcsMS44Ny43MywxLjIsMi40MywxLjIyLDIuNzEtLjAxLjM0LTEuNTIsMS45MS0uNzYsMi4zOS0yLjA4LjI2LTMuOTYtLjYxLTguODgtNC41Ny0xMC44NloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzAuMiw0NTQuNjNjLTEyLjgxLTEuNjUtMTAuODcsNy4xNy0xNy4xNyw1LjA5LDEuMTQtMS40LDQuMjctMi4xOSwzLjI1LTQuMy05LjM4LDQuMS0xOS4yNSw3LjAzLTI4LjYsMTEuMjUtNC43NSw1LjA0LTMuMTksMTUuMTItMTMuOTMsMTYuMDQtLjM5LDUuMjQtNy43Myw4Ljc4LTEyLjI3LDYuNDMtMS44MywxLjcxLTEuMDQsMi4xNi0uNzYsMy43NC0xLjU0LDEuNC0zLjY3LDQuNjMtLjMyLDQuNiwxLjA1LS4yMiwxLjg2LTEuNzgsMi45NS0xLjI4LS4wOC42OC0uMTUsMS4zNS0uMjQsMi4xMi44OC0uMDEsMi4wNy4yOSwyLjM4LS4xLDEuNDctMS44NSwzLjU5LS4zMyw1LjI0LTEuNzgsNS41MS0zLjcsMTMuMzgtNy4xLDEyLjk1LTE0LjgxLDkuNzMtNC4yOCwxNS4zNy0yMC4wMiwyOC4wNi0xNC40Nyw2LjI2LDMuMzgsNy45Ny02Ljc3LDEzLjU5LTYuOTksMS42LDMuNzEsMi4zNSwzLjQxLDQuMzcsMi4xOCwzLjUzLDIuNywyLjkyLTEuNTcsNC4zMS0zLjU2LjE3LTEuOTQtMS44MS00LjIxLTMuODEtNC4xN1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zODguNSwzODguMTZjLS45OC0yLjM1LTQuNjUtLjYtNS41OS0zLjM0LTIuMzMtMy4xOS01LjQxLS41OS03LjMsMS41NS0xLjQyLjE3LTIuODItLjU0LTQuMTQuMTItMS4zNSwyLjQ3LDIuMzksMy45Ni44Miw2LjQ5LTIuMDQsNS44MS4wNiwxMy41NCw1LjQ2LDE2Ljc2LDYuMTktMi43NywxMC4xNi0xMC44Nyw3Ljk5LTE3LjY1LDEuNDctMS4yNCwzLjMtMS44NiwyLjc1LTMuOTRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzgxLjUsNDU2Ljk4Yy0xLjc3LTMuOC01LjU5LTQuMTgtOC4yMy0uOTgtLjkzLDEuMTYtMi4zMi43NC0zLjUzLjg3LTIuNTcsMS4yLTEuMTUsNC4wMiwxLjExLDQuNjUtMS4yMyw0LjM2LTEuODcsOC43Mi0uMTUsMTIuOTksNi4wMiwxNC40MSwxNS4wOC0zLjkyLDEyLjgyLTExLjczLDQuMTYtMy40MywzLTUuNDUtMi4wMi01Ljc5WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM4Ny4yNCw0MjEuMDFjLTEuMTctLjY4LTIuNjQtLjcxLTMuOTQtLjYxLTIuMTQtNS42MS02LjAxLTMuNDgtOS4xNC0uMTQtNC42Ni0xLjg1LTMuOTYsMi4zNC0xLjUsNC42Mi0yLjMzLDUuNy0uNzIsMTQuMTYsNS4zNCwxNi42LDYuMzktMi42Niw4LjE1LTEwLjQyLDcuNzctMTYuNjgsMi0uMzEsMy42LTIuNTUsMS40Ny0zLjc5WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQzMy4xLDQzOS44OGMtMTEuNDYtMy44NC0yOS40OCwyMS4wOC0zNy4wOSwxMy43NC0xLjg2LTQuMDEtNy41NC0zLjU3LTExLjEyLTIuNDgsNC4zLDMuMSw2LjY1LDkuOTIsMTMuMTgsNy42OSw3LjM3LTEuNDMsMTMuMTYtNy4zOCwxOS41My0xMC4xMi4xNywyLjE0LTIuMDEsMy4wNi0yLjksNS4xLDQuMzctMS4zOCw4LjMtMi42LDExLjUyLTUuMzktLjU1LTEyLjA2LDE2LjctMy42MS4xNSwzLjgxLDIuOTQuMDcsNSwxLjM5LDYuOTctMS4wMywzLjgtMy4zOSw0LTguMy0uMjQtMTEuMzNaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDA3LjA3LDQ2Ny43OWMtMy4zNi44NS02LjczLDEuMTMtOC44MSw0LjU3Ljg0LDEuMTMsMS42NCwyLjIsMi41LDMuMzctMS42LDQuMTctNS43NSwzLjQ2LTkuNjIsMy42NC4zNiwxLjMxLjU1LDIuMDMuOCwyLjkxLTEuNjUuODctMi4yOCwyLjMzLTEuOTQsNC4zOS40My4xNS45NS4zMiwxLjQ3LjUsMS4wOS0xLjM0LDMuMDMtMi43MSwzLjQ5LS4xOSw3LjA0LTIuMjksMTMuMzQtNi41OSwxNi42OS0xMy4xNi0yLTEuNTQtMy43MS0zLjM3LTQuNTctNi4wM1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MTUuMTQsNDMxLjY2Yy0zLjM0LDEuMDgtNy4xNCwxLTkuMTQsNCwxLjIsMS4yOCwyLjI1LDIuMzksMy40MSwzLjYzLTIuMjUsMS4yNS00Ljg2LDMuMzYtNy4zLDEuMzQtMS0uOTEtMy43OS0uNDktMy4xMSwxLjI3LjEuMjYtLjA2LjYyLS4wOS45NC0uNDMuMDUtLjc3LjEtMS4xMS4xMy0xLjQ5LDAtMS44MiwxLjkyLS43OSwyLjgsMS4wMSwxLjEyLDItLjEsMy4xNS4yMy4wNC42My4wNywxLjE3LjEsMS42Nyw2LjE0LjM2LDE1LjQ1LTUuMTIsMTguNzItMTAuMDgtMS4zMS0yLjAzLTIuNTQtMy45NC0zLjgyLTUuOTNaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzY0LjExLDQ2Ny4yNGMyLjA0LTIuODQsMS4xMi02LjUtMi42Ny00LjE3LS45Ni0xLjkyLTIuMzgtMi4yOC00LjEzLTEuOC0uNSwxLjIzLS43NywyLjQxLjU2LDMuMzYuMDguMDYtLjAyLjM3LS4wNC41Ni0uNDIuMTQtLjg0LjI4LTEuMjMuNDEtLjk0LDIuNDQsMS40NywzLjg2LDIuMzUsNS43NywyLjY0LDQuMjEsNi41NywxNC4zNCwxMi42OSw5LjA0LTIuMjgtNC40NS01Ljg2LTguNTEtNy41My0xMy4xN1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zNjYuMzQsMzkwLjg4Yy41Ni0xLjE1LjM3LTIuNS0uOC0zLjQzcS0yLjA3LjU1LTMuNjMtLjQ0Yy0yLjY3LTEuMzMtMy4wNSwxLjYyLTIuODEsMy41MS0uNTIuMjQtMS4wMi40Ny0xLjc0LjgsMS44NSw1LjI4LDcuMzgsMTguNTIsMTQuMjgsMTUuODQtLjMzLTYuMTUtNy40NS0xMC4xLTUuMjktMTYuMjhaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzY1LjcyLDQyNy4yMWMuMjktMS4yNi0uMTgtMi41MS0xLjI0LTMuNjMtMi4yNy42OC03LjAzLTQuNDgtNS4yOSwxLjY1LTEuNDEuNDktMi4yNSwxLjQ4LTEuMjgsMi44MiwyLjYxLDMuOTksMy4zMywxMC4zMyw3Ljc4LDEyLjY0LDIuMDMsMCw1LjE2LDEuODUsNi4zNS0uNTYtMS4zLTQuNzUtNy4xNy03LjUtNi4zMy0xMi45MVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zMzYuMzQsMjkxLjA1Yy0yLjMsMS4wOC01LjMzLDIuMTUtNy4xMi0uNTksMy45Ni0xLjYxLDguODYtMS4yMSwxMS41Ni00LjkzLDIuMDItMi40NSwxLjg0LTcuMzctMi4wMS04LjY4LTkuOTgtMi43Ny0yMC41NSwyLjI5LTMwLjY1LDMuMTYtMTguOTUsNS4xMy01LjQzLTQuMDYtMjAuNDYtMy45OSw1LjM4LDE1LjQsMjEuNTQsNS41LDMyLjc2LDQuMzgtLjgsMS44MS0yLjY1LDIuNS0zLjM5LDQuMTIsMy45Ni0uNzYsOS4xOS43MywxMi4xNC0yLjM0LDEuNTMtNC4yNCwxMS41Ny00LjcyLDkuMiwxLjAyLTkuNDYsOS4yNC0zOS4xMS41OC01Mi4zLDYuNTItMS45Nyw2LjAyLTUuNDcsMTAuMDItMTEuMjMsMTEuNjYtNC43Mi0yLjkxLTYuODUuNDEtMTEuNTYtLjg5LTEuMzEtMS40NS0yLjY0LTMuMDctNC42OS0xLjQ4LDAsLjYxLjAyLDEuMzMuMDMsMi4xNy0yLjIzLS42NC00Ljc0LDIuNDUtMi4zNSwzLjg1Ljk4LjA2LDEuOTYtMS4wNywyLjk3LS4wNi0uMDkuNTEtLjE4LDEuMDItLjI4LDEuNTksNi4yNCwyLjcxLDEzLjExLS4zNiwxOS4zLTIuMDMsMi40NS0uNzYsMy44Ni0zLjIzLDYuNTYtMy4xOCw2LjQuNDYsMTAuMDUtNC45MSwxNS41NS02LjQ1LDYuOC0xLjI5LDEzLjY5LTIuMzcsMjAuNjMtMi4yNCw3Ljk3LDEwLjg3LDkuNDEsMS42NCwxNi41NSw1LjMzLS4yMSwxLjA1LS40MSwyLjA5LS42MiwzLjIxLjcyLjI1LDEuMy40NSwxLjg2LjY0LS43LDIuNywzLjMxLDQuMjgsMy44Ni44NS4wNy0uNC0uMTEtLjk0LjQ3LTEuMDEsNC4yNS0yLjMyLTIuMjgtMTMuNTUtNi43OC0xMC42MVoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yODYuNDIsMjgwLjdjLS4yMy0uODUtLjQyLTEuNTQtLjYzLTIuMzMtMS40MS0uMDYtMi42OS0uMTEtMy45MS0uMTYtMi44Mi0zLjYyLTQuNTEtMy43LTcuODctLjQ0cS0yLjI5LS44Ni0zLjgzLDEuMTZjLjU2LDEuMTcsMS4zLDIuMDQsMi41LDIuNjItMy40OSw2LjQxLTIuNDgsMTIuMTgsMS42OSwxNy41Niw3Ljc4LjI4LDEwLjk0LTEwLjM0LDkuNjgtMTYuNzcuODEtLjU2LDEuNTctMS4wOSwyLjM3LTEuNjRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzIwLjczLDI5NS44M2MtLjkxLTMuNTItNy40MS0uNjQtMTAuMS0uNTEtLjM1LDEuNzksMS4yOSwyLjU3LDEuNTksMy45Ni0yLjA4LDEuMzUtNC4zNCwxLjQzLTYuNTUsMS43Mi0xLjE3LTEuMTctMS42NC0zLjI3LTMuNjgtMi42Ni0xLjE2LjI4LS41MSwxLjUtMS4zNywxLjk5cS0yLjI2LS4xOS0yLjYsMi4wOWMuNjkuNDEsMS40MS44NCwyLjEsMS4yNS0xLjcsOC4wNCwyMC4yMi0uMzIsMjMuNDYtMi43MS0xLjA2LTEuOC0yLjQzLTMuMDQtMi44NC01LjEzWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI2Ni41LDI4OC4yNGMtMi40OS0yLjU2LTMuMy02LjA5LS43Ni04LjgzLTEuMjctMS4yMS0yLjk2LS4yMi00LjItMS45My0xLjU5LTEuODItMi41NC4yOC0yLjkyLDIuMi00LjQ3LjY1LTEuODksMi4xLS44OSw0LjQ5LDEuNDgsNC4xMiw2Ljc2LDEzLjk5LDExLjkyLDEyLjE0LS4yNC0yLjgxLS45My02LjEtMy4xNi04LjA2WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMzNS44MSwzMjYuMjljLTIuMzIsMS4wOS01LjM3LDIuMTctNy4xOC0uNiwzLjk5LTEuNjMsOC45My0xLjIyLDExLjY1LTQuOTcsMi4wMy0yLjQ3LDEuODUtNy40My0yLjAzLTguNzUtMTAuMDctMi43OS0yMC43MiwyLjMtMzAuOSwzLjE5LTE5LjEsNS4xOC01LjQ3LTQuMDktMjAuNjItNC4wMiw1LjQyLDE1LjUyLDIxLjcyLDUuNTUsMzMuMDMsNC40MS0uODEsMS44Mi0yLjY3LDIuNTItMy40Miw0LjE2LDQtLjc3LDkuMjcuNzQsMTIuMjQtMi4zNiwxLjU1LTQuMjcsMTEuNjYtNC43Niw5LjI3LDEuMDMtOS41NCw5LjMyLTM5LjQzLjU4LTUyLjcyLDYuNTctMS45OSw2LjA3LTUuNTEsMTAuMS0xMS4zMywxMS43NS00LjAzLTIuNDktNi4yLS40Ny05LjY1LS42LjE0LDEuMTMuNDgsMi4yMi43NiwzLjMzLjI5LDEuMTMuNDEsMi4yOC40OSwzLjQ0LDQuMDEtLjQ0LDguMDctMS45OCwxMS44Ni0zLjAxLDIuNDctLjc2LDMuODktMy4yNiw2LjYxLTMuMjEsNi40Ni40NywxMC4xNC00Ljk1LDE1LjY4LTYuNTEsNi44NS0xLjMsMTMuOC0yLjM5LDIwLjgtMi4yNiw4LjAzLDEwLjk2LDkuNDgsMS42NSwxNi42OSw1LjM3LS4yMSwxLjA2LS40MSwyLjEtLjYzLDMuMjQuNzIuMjUsMS4zMS40NSwxLjg4LjY0LS43MSwyLjczLDMuMzQsNC4zMSwzLjg5Ljg1LjA3LS40MS0uMTEtLjk1LjQ4LTEuMDIsNC4yOS0yLjMzLTIuMjktMTMuNjYtNi44NC0xMC43WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI4NS40OSwzMTUuODVjLS4yMy0uODUtLjQyLTEuNTUtLjYzLTIuMzUtMS40Mi0uMDYtMi43MS0uMTEtMy45NC0uMTYtMi44NC0zLjY1LTQuNTUtMy43My03LjkzLS40NHEtMi4zMS0uODctMy44NiwxLjE3Yy41NywxLjE4LDEuMzEsMi4wNiwyLjUyLDIuNjQtMy41Miw2LjQ3LTIuNSwxMi4yOCwxLjcsMTcuNyw3Ljg0LjI4LDExLjAzLTEwLjQyLDkuNzYtMTYuOS44Mi0uNTcsMS41OC0xLjEsMi4zOS0xLjY2WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMyMC4wNywzMzEuMTFjLS45MS0zLjU1LTcuNDctLjY0LTEwLjE4LS41Mi0uMzUsMS44MSwxLjMsMi41OSwxLjYsMy45OS0yLjEsMS4zNi00LjM3LDEuNDQtNi42MSwxLjc0LTEuMTgtMS4xOC0xLjY1LTMuMy0zLjcxLTIuNjgtMS4xNy4yOC0uNTIsMS41MS0xLjM4LDJxLTIuMjctLjE5LTIuNjIsMi4xMWMuNjkuNDEsMS40Mi44NSwyLjExLDEuMjYtMS43MSw4LjEsMjAuMzgtLjMyLDIzLjY2LTIuNzMtMS4wNy0xLjgxLTIuNDUtMy4wNi0yLjg3LTUuMTdaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjY1LjQsMzIzLjQ2Yy0yLjUxLTIuNTgtMy4zMi02LjE0LS43Ny04LjktMS4yOC0xLjIyLTIuOTgtLjIzLTQuMjMtMS45NS0xLjYtMS44My0yLjU2LjI4LTIuOTQsMi4yMi00LjUxLjY1LTEuOTEsMi4xMi0uOSw0LjUyLDEuNSw0LjE1LDYuODEsMTQuMSwxMi4wMiwxMi4yNC0uMjQtMi44NC0uOTQtNi4xNS0zLjE4LTguMTNaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzM2LjU5LDM1OS4zMmMtMi4zMiwxLjA5LTUuMzYsMi4xNy03LjE3LS42LDMuOTgtMS42Miw4LjkyLTEuMjIsMTEuNjQtNC45NiwyLjAzLTIuNDcsMS44NS03LjQyLTIuMDMtOC43NC0xMC4wNS0yLjc5LTIwLjY5LDIuMy0zMC44NiwzLjE4LTE5LjA4LDUuMTctNS40Ni00LjA5LTIwLjYtNC4wMSw1LjQyLDE1LjUsMjEuNjksNS41NCwzMi45OSw0LjQtLjgxLDEuODItMi42NiwyLjUyLTMuNDIsNC4xNSwzLjk5LS43Nyw5LjI2Ljc0LDEyLjIzLTIuMzUsMS41NC00LjI2LDExLjY0LTQuNzUsOS4yNiwxLjAzLTkuNTMsOS4zLTM5LjM4LjU4LTUyLjY1LDYuNTYtMS45OCw2LjA2LTUuNSwxMC4wOS0xMS4zMSwxMS43NC00Ljc1LTIuOTMtNi45LjQxLTExLjY0LS45LS40Ni0uNTEtLjkzLTEuMDQtMS40Mi0xLjQ1LS4xMy0uMDYtLjI2LS4xNC0uMzUtLjI2LS4xOC0uMTItLjM2LS4yMS0uNTUtLjI5LjAyLjA3LjA1LjE0LjA1LjIyLjA4LDIuNzgtLjU5LDUuNDktMS42Nyw4LjAzLDYuMTgsMi40NCwxMi45NC0uNTQsMTkuMDQtMi4xOSwyLjQ3LS43NiwzLjg5LTMuMjUsNi42LTMuMiw2LjQ1LjQ3LDEwLjEyLTQuOTQsMTUuNjUtNi41LDYuODQtMS4zLDEzLjc4LTIuMzgsMjAuNzctMi4yNiw4LjAyLDEwLjk1LDkuNDcsMS42NSwxNi42Nyw1LjM2LS4yMSwxLjA2LS40MSwyLjEtLjYzLDMuMjMuNzIuMjUsMS4zMS40NSwxLjg4LjY0LS43MSwyLjcyLDMuMzQsNC4zMSwzLjg4Ljg1LjA3LS40MS0uMTEtLjk1LjQ4LTEuMDIsNC4yOC0yLjMzLTIuMjktMTMuNjQtNi44My0xMC42OFoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yODYuMzMsMzQ4Ljg5Yy0uMjMtLjg1LS40Mi0xLjU1LS42My0yLjM1LTEuNDItLjA2LTIuNzEtLjExLTMuOTQtLjE2LTIuODQtMy42NC00LjU0LTMuNzItNy45Mi0uNDRxLTIuMy0uODctMy44NiwxLjE3Yy41NywxLjE4LDEuMzEsMi4wNSwyLjUyLDIuNjMtMy41Miw2LjQ2LTIuNSwxMi4yNywxLjcsMTcuNjgsNy44My4yOCwxMS4wMi0xMC40MSw5Ljc0LTE2Ljg4LjgyLS41NiwxLjU4LTEuMDksMi4zOS0xLjY2WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMyMC44NywzNjQuMTJjLS45MS0zLjU0LTcuNDYtLjY0LTEwLjE3LS41Mi0uMzUsMS44LDEuMywyLjU4LDEuNiwzLjk5LTIuMSwxLjM2LTQuMzYsMS40My02LjYsMS43My0xLjE4LTEuMTgtMS42NS0zLjI5LTMuNy0yLjY4LTEuMTYuMjgtLjUxLDEuNTEtMS4zOCwycS0yLjI3LS4xOS0yLjYyLDIuMTFjLjY5LjQxLDEuNDIuODUsMi4xMSwxLjI2LTEuNzEsOC4wOSwyMC4zNi0uMzIsMjMuNjItMi43My0xLjA3LTEuODEtMi40NS0zLjA2LTIuODYtNS4xNloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNjYuMjcsMzU2LjQ4Yy0uNDctLjQ5LS44OC0xLjAxLTEuMjMtMS41NS0uMTQsMS40NS42MiwzLjEzLjM2LDQuNTYtLjIsMS4xMS0uNTIsMi43OC0uODQsMy44NiwxLjgxLDEuNzYsMi44OSwxLjk3LDQuODgsMS4yNS0uMjQtMi44My0uOTQtNi4xNC0zLjE4LTguMTJaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzk1LjgzLDMwOC41N2MtMy43Ny0zLjI4LTYuMDUtNi41MS02LjEzLTkuNTItLjE2LS45OCwyLjE1LTIuMjksMS45Ny0zLjIyLS4wOS0zLjQzLTIuOTMuNDItNC4wNS0uMTQtLjYxLS45OS0yLjc0LTMuOC00LjA1LTIuNDMtLjgxLjM5LjIsMi40MS0uNDUsMi44OS0uMy4zOS0uNDguNDYtMS4zOC40NC0zLjA0LS4wNS0zLjQ0LDEuODQtLjk2LDIuOTksMS43MiwxLjA4LDMuMDEsNi4xMiw0LjA0LDYuODMsMS45NiwyLjU4LDYuMDUsOS40NiwxMC4wNiw4LjA0di0uMTFjMS4xOS0uNDgsMi4zMy0zLjk0LDIuNC00LjQzLS4wMy0uMTQtLjcxLS43Ni0xLjQ2LTEuMzVaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDE2LjMzLDI5Ny4yOWMtLjYzLTEuMjItMi4xNS0uMy00LjIyLS45Ny0xLjUzLS43MS01LjU4LTEuOTYtNy4yMi0xLjA1LTEuMTcsMS40MS04LjAzLDEuNTYtNi43OSwzLjYuMjcuNzYuNzYsMi40OS43NiwyLjQ5bDMuMTMuMzcuMDUsMi4yN3MtMi4yNS40OS0yLjk5LjY1Yy0xLjg2LDIuNzMsNC40NiwyLjk0LDYuMS44MiwxLjEyLTEuMzIsMi44OS0xLjUyLDIuODItLjA2LS44NSwxLjgxLTMuODgsMi43Mi01LjY0LDMuNTktMi42NC40NC0zLjM0LDUuNjMtNS4zNyw3LjM1LTUuNzUsMS4wNi03LjgyLjkzLTEzLjUtMy43LTIuMDgtMi4zOS0zLjczLS41OS0yLjE2LDEuMjktMS4wMi4zNC02LjMtMi42NC0zLjkxLDIuNDRsLjM5LjQ3Yy0yLjYsMy43NSwxLjI3LDIuNDgsMy40NSwzLjY0LDQuNjMsMS44NSw5LjcyLDMuMjUsMTUuNywyLjI0LDEuMDEtMSw0LjA1LTMuOTYsNC4zOS00LjYxLjMtLjY3LjQxLS43MSwyLjU1LS44OSw1Ljg4LS44NCw4Ljg1LTMuMjQsMTAuNTItOS41NS44MS0xLjg5LS4yMy02LTEuNDQtNi44OS0uNDYtLjMzLS42Ny0uOTQtLjM4LTEuMTUsMS4wOS0uMTYsMy4zOC0xLjA1LDMuNzctMi4zM1oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzEuMDMsMjk5LjMzYy04LjQ5LjU4LTE2Ljg1LDYuMjgtMTIuNjUsMTUuODEsMi41OCw1LjM5LDIuMDIsNC45Ny0zLjA0LDMuOTZsMi40NCw1LjA1czUuMjQsMi4zNCw1Ljk1LDMuMDRjMi45NCwyLjE1LDIuNDUsOC4xMS0uMiw3LjQ0LTQuMzUtMS43OC02Ljk1LTcuOTItOS45Ni0xMS43My0uOC0uNjItMi44OC02LjgzLTQuMjUtNS4yNi0xNy45NSw0LjAxLDMuMjUsOC42Mi0uMDEsMTUuMjgtLjYzLjk1LTIuNjMsNS42LTEuODEsNi4zLDEuNTEsMS44NSw0Ljg5LDMuMiw2LjY3LDUuNTUsMi45MiwyLjg1LjI5LDYuMTUtMy4zMiwzLjQ5LTIuMDUtMS41NS00LjUuNjgtMi40LDIuNzUuMTQuNC0xLjI1Ljk4LTEuNSwxLjE1LTIuMTQsMi45MywxLjQsMi43OCwzLjI3LDEuMzEsMS4wNC0uNSwwLDIuNTgsMS43NCwyLjA3LDMuMjctLjcyLDguMzUtMi4zOCw5LjI1LTcuNSwyLjAzLTQuNy0yLjY4LTMuOTQtMy44NC04LjA0LTEuMTgtMS42OC0xLjI2LTcuODgsMS4yOS01LjYsMi4zNiwyLjk4LDUuNTYsNC43LDguNDcsMi4wNCwyLjY5LTIuNTMuMjQtOC42OC0xLjE0LTExLjQtMi42LTUuNDEtNS41OS0xMC42Mi01LjM4LTE3LjA5LDMuNjQtNC4zMSw3Ljg2LDMuMzgsMTAuNDMtOC42MloiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MDEuNjksMzI5LjI4Yy00LjQ5LS4yMi03LjkyLS41OS02LjY3LDQuNzUuMjUsMS4yOC43Myw1LjE3LDEuNDksNi4wNy4zMi41MS4yNywxLjA0LS4xMywxLjM5LTEuODEsMS4wMi04LjY3LTEuNzctNy44NS00LjExLDAtMS45NC0xLjk0LTIuMzktMi41Mi0xLjAxLS4zMS42MS0uNzkuNTktMS40OC0uMTctMS4yNy0xLjgyLTMuMDMuNjQtMi4zMSwyLC4yOC41NC0uMDYsMS4xNC0uNzEsMS4yNC0xLjg5Ljc3LTEuNzgsMy4zNS44NCwzLjQ1LDUuNzIsMi42NSwxMC43MSw1LjM4LDE3LjM2LDQuNDVsLS4xMS4wM2M3LjI2LS41OCwzLjUxLTEuOTQsMy4yLTYuOTktMS4yNC01LjQzLDguMDMtOC45OS0xLjExLTExLjExWiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQyMy42NSw0MDEuMTZjLTMuNDYuMjYtNi44LS4yMy05Ljc5LDEuNDEtLjMsMS41OC43OSwyLjQyLDEuNTcsMy43OC0yLjQ2LDEuMDQtNC42MiwxLjU3LTYuOTIuNTMtLjQ3LS40My0xLjY2LjA2LTEuOC4zNS4wNSwyLjQ3LTIuNTYsMS43NC0zLjM0LDMuNDMuNTEsMS4wMiwxLjI0LDEuODMsMi4zNSwxLjczLDEuMzktLjEzLDEuMjgsMS41OSwyLjU0LDEuNjgsNS45OC0yLjcyLDEzLjA4LTIuMDYsMTguMTYtNi43My0xLjktMS42Mi0yLjM2LTMuODQtMi43Ny02LjE3WiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUwNC4xOCwzMzkuNjVjLTIuMzYtNS4wNS03LjgxLTMzLjMzLTE1Ljc0LTI3LjE5LDM2LjEyLDY3LjQ0LDEyLjAzLDE1Ni4xMi01MC42NiwxOTguODMtMTguMzksMTEuMS00MS4yMSwyOS41NC02Mi45NywxNy4yNSwxNC4wNS01NC43MSw4MS4zNS0zMS42MSw5NS45OC0xMzUuOTItMS44LS44OC0yLjQ4LTEuNDQtNC4xMy0xLjczLTIuMSwxNC41OC01Ljc3LDI4LjU5LTExLjIyLDQyLjA0LDUuODQtMTUuNTMsMi4xMy02NC4xMywzLjIyLTY2LjgtLjYtLjgtMS4yNC0xLjEtMy4yMy0zLjU2LjM2LDUuODctLjAzLDgsLjAzLDE1Ljc3aC0xMDIuMTN2LTEwNi41M2gxMDAuMjR2NjAuMWMtLjA1LjMzLjM5LDMuMTguNiw0LjIzLDEuNDMtMi4xOSwxLjU1LTIuMTEsMi41MS0yLjgzdi02NC42MWgtMjEwLjI0bC0uMTksNTQuNDVoMy4xMXYtNTEuMzRoMTAwLjg2djEwNi41M2gtOTcuMjhjLS4yOS4yOS4wNi0xLjY3LS4yNi0xLjM5LS4wMi0uMjktLjY3LDEuNjgtLjY2LDEuMzloLTIuNzJjLS4wNS00Ljk3LjA2LTguMDIuMDYtOC4xN2wtMy4xLS4xMmMtMi4yNiw4LDQuNCw3NC44NCwxNS4zNyw4Ni41Ny0yMS45NS0yMS4yOC0yOC44Ni01OS4wNy0yNC43Ni04Ny41MywwLDAtMi4wNS0xLjU4LTQuMjktMy42My02LjksNDAuMDksOC4yNyw3OS42NCwzNi4zNiwxMDguMzMsMi40NiwyLjYyLDUuMTQtLjIsOC4xMy0uOTUtLjYxLS42NS0xLjkyLTEuNjYtMi44NC0yLjkzLDEuMTEsMS4xNSwyLjA5LDIuMTYsMi44NCwyLjkzbC0xLjU2LTQuMzFjLTIyLjA2LTE2Ljg2LTI1LjY5LTY1LjAyLTI2LjE2LTg3LjA4aDEwMC44OHMtLjA3LDEzMy41OC0uMTQsMTMzLjg4Yy0yMS40Ni0xLjA1LTM1Ljk3LTI0LjMzLTU2LjY3LTI0LjYsMjkuNzUsMTcuNjQsODQuMTcsNjAuMTUsMTE4LjU0LDQxLjUzLjI3LjMzLjIxLjI2LjQ4LjU5LTMuNjEsNC41My0xNi4zNCwxMy4wOC0yMi4wMywxMC45LTkuMzYtNS42NC0yMy43OSw0LjYzLTE3LjE2LDE1LjA4Ljg1LDEuMjIsMS4zNywyLjMyLjM4LDMuOTMtMzcuMTctMy41LTcwLjU5LTI1LjctMTAxLjkxLTQ0LjcyLS4zMS4zMy0uMjUuMjctLjU1LjYsMTIsMTYuMjEsNTQuODksMzYuMzYsNTQuODksMzYuMzZsLS4wMywyNC4xczIuNzUsMS44Myw0LjU1LDMuMDN2LTI2LjA3YzExLjI1LDMuODYsMzQuMDUsMTEuMDEsMzQuMDUsMTEuMDFsLjA3LDE2LjI4LDQuMzQtMi43Ny0uMjMtMTIuMTksNi4wOS0xLjY4YzMuODMtMS4wNiw2LjI5LTQuNzUsNS44Mi04LjY2LTEuOC0uOS0zLjA3LTIuNzYtMi41MS01LjMuOS00Ljc1LDYuNjMtNC44NSw4Ljk4LTIsNC42NiwyLjA3LDkuMjMtMy41MiwxMy44MS00Ljg1LDYuNDctMy45MiwxNC40NS03LjM4LDE3LjQ0LTE0Ljg0LjU3LTEuODQsMS41OC0yLjk4LDMuMTQtMy44OSwxMy4wNS03LjQyLDI1LjctMTUuNiwzNi4zNS0yNi4yOSw0NS41Mi0zOC40OSw2MS40MS0xMDQuNjIsNDYuMjUtMTYxLjIzWk0zNTMuMzUsMzgxLjQ1aDEwMi4xMWM4LjM1LDc4LjA0LTM3LjQsMTA0LjE2LTEwMi4xMSwxMzEuMzd2LTEzMS4zN1pNMzU1LjE5LDUyMC44N2M3LjIzLTYuNDMsMTIuMjMtOC42NywyMS41My0xMC44OC0yLjU3LDUuNzctNS4wMiwxMS4yNy03LjYxLDE3LjA5LTQuNjYtMi4wOC05LjI0LTQuMTItMTMuOTMtNi4yWiI+PC9wYXRoPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNTguNTcsNTI4LjMxaDBjLTU3LjguMDktMTE1LjQxLDI0Ljc3LTE3My4yMywyNC43Ny02Ljk0LDAtMTMuODctLjM1LTIwLjgxLTEuMTUsMTcuOTEsMTQuMTUsMTYuNjYsNDIuNTIsNDIuNzEsNDIuNTIsMS4xMywwLDIuMzEtLjA1LDMuNTQtLjE2LDM1LjQxLTMuNzgsNzAuNjMtMTMuNzYsMTA1LjQ3LTE5LjMsNi0uOSwzNC44NS03Ljk3LDUxLjc0LTcuOTcsNi4wOSwwLDEwLjYyLjkyLDExLjk3LDMuMzcsMS44MywzLjMzLTkuNjUsMTMuMDEtOS43MywxMy4zOC0uMDIuMTEuMDMuMTYuMTYuMTYsMS4xMSwwLDcuNDgtMy42OCwxMi4yMy02LjgxLDE4Ljg2LTEzLjU1LTIwLjY1LTQ4LjgxLTI0LjA1LTQ4LjgxWk0xMzYuODUsNTc2LjI3Yy0zLjE1LDcuNDctMTIuNTYsOS4xOC0xOS44OSwxMC40OC4zNS0yLjMyLTQuMTMtMjMuOTQtNS41MS0yNS45MSwxMi43Mi01LjQ1LDMwLjktLjE4LDI1LjQsMTUuNDNaTTE0NC4zNiw1ODFjLjM4LTcuNDktMi4xNy0xOS40Ni01LjU2LTI2LjE1bDcuMzgtMS4zN2MtLjM4LDcuNSwyLjE4LDE5LjQyLDUuNTcsMjYuMTJsLTcuMzksMS40MVpNMTcyLjk1LDU3NS40OWwtMTUuMywyLjk5Yy4xNS0zLjkzLTQuNzgtMjQuMTctNi4wNi0yNi4xMWwxNi4zNy0zLjEyLTEuNjEsNS4xNWMtMi4yMS0uNjItNC44LS42NC03Ljc1LS4wNWwxLjc3LDcuNyw4LjgyLTEuOTUsMS40MiwzLjc1Yy0xLjc1LS4yOS03LjA3LDEuMDQtOS41LDEuNDZsMS44NSw4LjA1YzQuMzQtLjk2LDcuOTMtMi40LDEwLjc3LTQuMzRsLjA4LjA1LS44Nyw2LjQyWk0xODguMjEsNTcyLjI5Yy0xMS4wMy4yNS0xMy42NS0xNS43NC0xNS4zNS0yNGw1LjA2LS45OGMyLjU1LDYuNzcsMi4yNywyMy4zMSwxMy42MywyMS4yMiw2Ljg4LTEuODIsMi4wNi0xNy43My41NS0yMy44OWw0Ljc0LTEuMDNjMi4wMSwxMC40NSw3LjQyLDI5Ljc1LTguNjMsMjguNjdaTTIzMS45Miw1NjQuMWwtMTUuMDEsMi44NmMuMjktMi4yOS01LjE3LTI0LTYuNDYtMjUuOTJsMTYuMTgtMy4wNS0xLjA5LDYuMjNjLTIuMjItLjYtNC44LS41OS03Ljc1LjAybDEuODQsNy42OSw4LjgxLTIuMDMsMS40NiwzLjczYy0xLjc2LS4yNy03LjA2LDEuMS05LjQ4LDEuNTVsMS45Miw4LjAzYzQuMzQtMSw3LjkxLTIuNDgsMTAuNzMtNC40NGwuMDguMDUtMS4yMyw1LjI4Wk0yNDcuOTksNTM4LjY3bDQuMzQsMjEuOTgtNS4wNS45MS00LjQ2LTIxLjg3Yy0zLjExLjU2LTQuODYuNTYtOS4wNywyLjRsLS4xNS00LjkyLDIxLjgyLTIuODIsMS41MSw0LjE2Yy0yLS43My04Ljk1LjE2LTguOTUuMTZaIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyNy4zMiw1NjMuNzdjLTIuMzUtMS40My01LjI0LTEuODctOC42NS0xLjMzLjczLDUuMTgsMi42MSwxNC43Niw0LjExLDE5Ljc4LDkuNjItMS4zNywxMi41MS0xMy4zOSw0LjU0LTE4LjQ1WiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjA4LjA0LDU1Mi45N2MtNy4yNCwwLTE0LjEyLS4xMS0xNy40OC0uNC0zOC4xMi0zLjcxLTc1Ljg0LTE0LjYtMTEzLjg3LTIwLjY0LTEwLjk3LTEuNzMtMTkuOTQtMy4zNS0yNy43Mi0zLjM1LTE2LjE1LDAtMjcuMTMsNy4wMS00MC4xMywzNC43MS01LjU0LDEwLjU0LDEzLjAyLDIwLjU5LDE3LjExLDIxLjAyLTE1LjI1LTEzLjAyLTkuOTQtMTYuODgsMi4xLTE2Ljg4LDE2LjYzLDAsNDYuMTEsNy4zNyw1MS44OCw4LjA5LDM0Ljg0LDUuNTQsNzAuMDYsMTUuNTIsMTA1LjQ3LDE5LjMsMS4yNC4xMSwyLjQzLjE3LDMuNTYuMTcsMjYuMDQsMCwyNC44LTI4LjQsNDIuNjktNDIuNTItMy4xOC4yOS0xMy43My41LTIzLjYxLjVaTTQ2NC42OCw1MzcuN2MtLjg3LjgtMy45NiwyMi40Mi0zLjc1LDI0LjUzbC01LjgyLTEuMTRjMS4wNC0xLjg4LDIuNDItMTYuOTUsMi40Mi0xNi45NWwtOS45OCwxNS41Mi01Ljg3LTE3LjQ5cy0yLjM4LDEyLjU2LTIuNDcsMTYuNmwtNS43MS0uNzhjMS44My0yLjk2LDUuNDItMjUuMiw1LjQyLTI1LjJsNS45MSwxLjExYy4xNiwxLjE4LDQuNjMsMTYuMjgsNC42MywxNi4yOCwwLDAsNy44Ni0xMy4xOSw4LjMyLTEzLjg2bDYuOTUsMS4zLS4wMi4wOVpNNDg2LjA2LDU1Ni44MmMtNS4yNCwxNy43NS0yNS43LDguMDUtMTkuNjEtNy43Nyw1LjE4LTE3LjIsMjUuNjctOC4xMSwxOS42MSw3Ljc3Wk01MDYuMjMsNTcyLjM2Yy0xLjc5LS4zOC0xMS40Ni0yMC4wOC0xMS40Ni0yMC4wOCwwLDAtMi4zNiwxNS4zLTIuOTYsMTYuMzdsLTQuMzktLjYzLDUuMDEtMjQuMDIsNC44Ny42NGMuMDQuNjMsNy43LDE2Ljg2LDcuNywxNi44NiwwLDAsMi41Ni0xMy4xNSwyLjgtMTQuMzNsMy43MiwxLjA1LTUuMjksMjQuMTNaTTUyOS4wMiw1NzQuNDZjLTMuNDYsMS4yLTguMzgtLjE1LTExLjk3LS44Nmw0LjgzLTI0LjczYzE2LjA1LTEuMDYsMjIuNywxOS43Miw3LjE1LDI1LjU4Wk01NTcuNDksNTYzLjA2Yy0uNzEsMi44LTIuNzgsNC43My02LjE5LDUuNzksMS40OSw0Ljg4LDIuMzYsNi40OCw0Ljg3LDExLjc4bC0uMDMuMTItMy44OS0uNmMtLjgxLS40Ny01LjY5LTcuMzEtNy4xNS0xMS4wMy0uODUsMy4wNi0xLjcyLDYuOTUtMS4zNyw5LjcxbC02LjYtMS4wMmMxLjIyLTEuOSw2LjM4LTIyLjE0LDYuMTgtMjQuMjYsNS43Mi43MywxNS45OCwxLjc1LDE0LjE3LDkuNTJaTTU3MC4xOCw1ODIuNjVjLTE0LjcsMi43Ni0xNC42OC0yMi4wNy0yLjg4LTI1LjU0LDE0Ljc2LTMuMDksMTQuODMsMjIuMTQsMi44OCwyNS41NFpNNTg1LjUsNTY4LjEzYy0uNTcsNC40LTIuNjIsMTMuMzQtMS44MiwxNy41MWwtNS43NS0uODNjMi41My02LjQ4LDQuMjYtMTcuNDMsMy44Ni0yNC4zN2w1Ljc1LjgzYy0uOTQsMS45My0xLjYyLDQuMjItMi4wMyw2Ljg2Wk01OTkuMDksNTY3LjA2cy0zLjM3LDE5LjA0LTMuMTYsMjAuNjVsLTUuNzItMS4wM2MtLjA5LjEzLDMuNTItMTYuNjksNC40LTIwLjM0LTIuMDItLjQzLTQuNDEtLjIyLTYuNjYuNjRsLS4wNC0uMDcsMi4yOS00Ljc5LDE1LjUzLDIuNzksMS4wOCw1LjI4Yy0xLjMtMS4yNy01LjUxLTIuNzItNy43Mi0zLjE0WiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NzguNjUsNTQzLjMxYy05LjA0LTIuNDktMTIuNTQsMTYuMjItNC45NCwxOS4zOCw5LjI0LDIuNDYsMTIuNTctMTYuMTMsNC45NC0xOS4zOFoiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTI2LjQxLDU1Mi43MWMtMS4yMyw0LjgyLTMuMTIsMTMuOTEtMy43NSwxOC44NCwxMS4zNSwyLjQsMTQuODctMTYuNTksMy43NS0xOC44NFoiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTQ4LjE4LDU1Ny4wNGwtMi42NCw5LjU4YzcuMzksMS4zNiwxMC41Ny04LjM3LDIuNjQtOS41OFoiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTcwLjg2LDU2MC40MWMtOC42Ny0yLjE0LTExLjQ5LDE1LjkzLTQuMjcsMTguODEsOC44NiwyLjEsMTEuNTMtMTUuODUsNC4yNy0xOC44MVoiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMzguMTUsNDI5LjdjLS45Ny0yLjQ0LTIuNTMtNC40LTQuNjgtNS45LTIuMTUtMS41LTQuNjMtMi4zNC03LjQ0LTIuNTUtMi44MS0uMi01LjYuMy04LjM3LDEuNTItNC4xNSwxLjY4LTcuMDQsNC4zOC04LjY4LDguMTEtMS42NCwzLjczLTEuNjUsNy4zOS0uMDUsMTEsLjk0LDIuMzYsMi41MSw0LjI3LDQuNzEsNS43MywyLjIsMS40Niw0LjY5LDIuMjksNy40NiwyLjUsMi43OC4yMSw1LjQ1LS4yNiw4LjAzLTEuMzksMi41LTEuMDEsNC42My0yLjUxLDYuNDEtNC41MiwxLjc3LTIuMDEsMi45My00LjMxLDMuNDUtNi45MS41My0yLjYuMjUtNS4xMy0uODUtNy41OVpNMjMzLjA1LDQzOC4zNWMtMS42NiwyLjc1LTQuMDgsNC43Ny03LjI1LDYuMDYtMi43NiwxLjIxLTUuMzYsMS40Ny03Ljc4Ljc4LTIuNDItLjctNC4wNC0yLjA2LTQuODQtNC4xLTEuMTEtMi40My0uODUtNS4wNy43Ni03LjkxLDEuNjEtMi44NSwzLjk4LTQuODksNy4xMS02LjE0LDIuNjktMS4xMyw1LjI2LTEuMzksNy43Mi0uNzcsMi40Ni42Miw0LjE1LDIuMDIsNS4wNyw0LjIsMS4xNCwyLjUxLjg4LDUuMTQtLjc5LDcuODlaIj48L3BhdGg+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01ODQuMTUsNDQ2LjA1bDIuOTktNi42Yy0xLjU2LTIuMjYtMi44Ny00LjQ2LTQuNDItNi43MmwtNS4wMywxMC40M2MtMi43Ni0uOTYtNS44NC4zLTcuMDYsMy4wMWwtNy4yNywxNi4yMWMtMS4yMiwyLjcxLS4xMSw1Ljg2LDIuNDQsNy4yN2wtNS4wNSwxMS4yNmgtLjE0Yy0zLjEzLDAtNS42OSwyLjU1LTUuNjksNS42OXYxNy43N2MwLDIuNzgsMiw1LjA5LDQuNjQsNS41OHYyLjUyYy02LjgsMS42MS0xMS44OCw3LjcxLTExLjg4LDE0Ljk5LDAsOC41LDYuOTIsMTUuNDIsMTUuNDIsMTUuNDJzMTUuNDItNi45MiwxNS40Mi0xNS40MmMwLTcuMjgtNS4wOC0xMy4zOC0xMS44OC0xNC45OXYtMi40MmguMDljMy4xMywwLDUuNjktMi41NSw1LjY5LTUuNjl2LTE3Ljc3YzAtMi41Ni0xLjcxLTQuNy00LjAzLTUuNDFsMy44OC04LjY0Yy42LjIxLDEuMjMuMzUsMS44Ni4zNS42OCwwLDEuMzctLjEzLDIuMDMtLjM4LDEuNDItLjU0LDIuNTUtMS42LDMuMTctMi45OGw3LjI3LTE2LjIxYy42Mi0xLjM4LjY2LTIuOTMuMTItNC4zNS0uNDgtMS4yNy0xLjM5LTIuMjgtMi41Ni0yLjkzWk01NzIuNzgsNTI3LjQ2YzAsNS4zMy00LjM0LDkuNjctOS42Nyw5LjY3cy05LjY3LTQuMzQtOS42Ny05LjY3YzAtNC4wOCwyLjU1LTcuNTgsNi4xMy04Ljk5djIuODNjMCwxLjczLDEuNDEsMy4xNCwzLjE0LDMuMTRoLjc5YzEuNzMsMCwzLjE0LTEuNDEsMy4xNC0zLjE0di0yLjgzYzMuNTksMS40Miw2LjEzLDQuOTEsNi4xMyw4Ljk5Wk01NjguMTEsNTA0LjM2YzAsLjc1LS42MywxLjM4LTEuMzgsMS4zOGgtLjA5di0xLjMxYzAtMS43My0xLjQxLTMuMTQtMy4xNC0zLjE0aC0uNzljLTEuNzMsMC0zLjE0LDEuNDEtMy4xNCwzLjE0di43OWMtLjItLjI0LS4zMy0uNTMtLjMzLS44NnYtMTcuNzdjMC0uNzUuNjMtMS4zOCwxLjM4LTEuMzhoLjM0Yy4yNy4yOS42MS41My45OS43MWwuNzIuMzNjMS4zOC42MiwyLjk4LjE1LDMuODQtMS4wM2guMjJjLjc1LDAsMS4zOC42MywxLjM4LDEuMzh2MTcuNzdaTTU4Mi42Niw0NTEuNTZsLTcuMjcsMTYuMjFjLS4xNS4zMy0uNDIuNTktLjc3LjcyLS4yMi4wOC0uNDUuMDktLjY4LjA2LjI0LTEuMzgtLjQ2LTIuODItMS44LTMuNDJsLS43Mi0uMzNjLTEuMzQtLjYtMi44Ny0uMTctMy43NC45My0uNDUtLjM5LS42NC0xLjA0LS4zOC0xLjZsNy4yNy0xNi4yMWMuMTUtLjMzLjQyLS41OS43Ny0uNzIuMTYtLjA2LjMzLS4wOS41LS4wOS4xOSwwLC4zOC4wNC41Ni4xMmwuMjIuMWMuMjQuODguODQsMS42NSwxLjczLDIuMDVsLjcyLjMzYy44OS40LDEuODcuMzMsMi42OC0uMDdsLjIyLjFjLjMzLjE1LjU5LjQyLjcyLjc3LjEzLjM1LjEyLjcyLS4wMywxLjA1WiI+PC9wYXRoPgo8L3N2Zz4=");

/***/ },

/***/ "./src/custom-blocks/hmg-svg/svg/crown.svg"
/*!*************************************************!*\
  !*** ./src/custom-blocks/hmg-svg/svg/crown.svg ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgCrown),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _circle2, _circle3, _circle4, _circle5, _circle6, _circle7, _circle8, _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgCrown = function SvgCrown(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 32,
    height: 30,
    fill: "currentColor",
    viewBox: "0 0 64 60"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 20,
    cy: 17.6,
    r: 3.7
  })), _circle2 || (_circle2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 10.2,
    cy: 23.5,
    r: 3.7
  })), _circle3 || (_circle3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 3.7,
    cy: 33.2,
    r: 3.7
  })), _circle4 || (_circle4 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 31.7,
    cy: 30.6,
    r: 3.7
  })), _circle5 || (_circle5 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 43.3,
    cy: 17.6,
    r: 3.7
  })), _circle6 || (_circle6 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 53.2,
    cy: 23.5,
    r: 3.7
  })), _circle7 || (_circle7 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 59.7,
    cy: 33.2,
    r: 3.7
  })), _circle8 || (_circle8 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 31.7,
    cy: 30.6,
    r: 3.7
  })), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M33.1 9.8c.2-.1.3-.3.5-.5l4.6 2.4V4.9l-4.6 1.5c-.1-.2-.3-.3-.5-.5L35 0h-6.7l1.9 5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6 8c-.9 2.8 1.2 5.7 4.1 5.7 3 0 5.1-2.9 4.1-5.7l-2.6-8ZM37 37.9s-3.4 3.8-4.1 6.1c2.2 0 4.2-.5 6.4-2.8l-.7 8.5c-2-2.8-4.4-4.1-5.7-3.8.1 3.1.5 6.7 5.8 7.2 3.7.3 6.7-1.5 7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5 2.4-6.1 4.9-3.2-1.9-4.5-1.8-7.7 2.4-10.9 3 4 2.6 7.3-1.2 11.1 2.4-1.3 6.2 0 4 4.6-1.2-2.8-3.7-2.2-4.2.2-.3 1.7.7 3.7 3 4.2 1.9.3 4.7-.9 7-5.9-1.3 0-2.4.7-3.9 1.7l2.4-8c.6 2.3 1.4 3.7 2.2 4.5.6-1.6.5-2.8 0-5.3l5 1.8c-2.6 3.6-5.2 8.7-7.3 17.5-7.4-1.1-15.7-1.7-24.5-1.7s-17.1.6-24.5 1.7C5.2 51.1 2.6 46.1 0 42.5l5-1.8c-.5 2.5-.6 3.7 0 5.3.8-.8 1.6-2.3 2.2-4.5l2.4 8c-1.5-1-2.6-1.7-3.9-1.7 2.3 5 5.2 6.2 7 5.9 2.3-.4 3.3-2.4 3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6 1.6-6 4-4.6-3.7-3.7-4.2-7.1-1.2-11.1 4.2 3.2 4.3 6.4 2.4 10.9 2.5-2.8 6.3-1.3 4.9 3.2-1.8-2.7-4.1-1-3.7 1.6.3 2.3 3.3 4.1 7 3.8 5.4-.5 5.7-4.2 5.8-7.2-1.3-.2-3.7 1-5.7 3.8l-.7-8.5c2.2 2.3 4.2 2.7 6.4 2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6Z"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9ImN1cnJlbnRDb2xvciIgdmlld0JveD0iMCAwIDY0IDYwIiBoZWlnaHQ9IjMwIiB3aWR0aD0iMzIiPgoJPGc+CgkJPGNpcmNsZSBjeD0iMjAiIGN5PSIxNy42IiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjEwLjIiIGN5PSIyMy41IiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjMuNyIgY3k9IjMzLjIiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPGNpcmNsZSBjeD0iMzEuNyIgY3k9IjMwLjYiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPGNpcmNsZSBjeD0iNDMuMyIgY3k9IjE3LjYiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPGNpcmNsZSBjeD0iNTMuMiIgY3k9IjIzLjUiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPGNpcmNsZSBjeD0iNTkuNyIgY3k9IjMzLjIiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPGNpcmNsZSBjeD0iMzEuNyIgY3k9IjMwLjYiIHI9IjMuNyI+PC9jaXJjbGU+CgkJPHBhdGggZD0iTTMzLjEsOS44Yy4yLS4xLjMtLjMuNS0uNWw0LjYsMi40di02LjhsLTQuNiwxLjVjLS4xLS4yLS4zLS4zLS41LS41bDEuOS01LjloLTYuN2wxLjksNS45Yy0uMi4xLS4zLjMtLjUuNWwtNC42LTEuNXY2LjhsNC42LTIuNGMuMS4yLjMuMy41LjVsLTIuNiw4Yy0uOSwyLjgsMS4yLDUuNyw0LjEsNS43aDBjMywwLDUuMS0yLjksNC4xLTUuN2wtMi42LThaTTM3LDM3LjlzLTMuNCwzLjgtNC4xLDYuMWMyLjIsMCw0LjItLjUsNi40LTIuOGwtLjcsOC41Yy0yLTIuOC00LjQtNC4xLTUuNy0zLjguMSwzLjEuNSw2LjcsNS44LDcuMiwzLjcuMyw2LjctMS41LDctMy44LjQtMi42LTItNC4zLTMuNy0xLjYtMS40LTQuNSwyLjQtNi4xLDQuOS0zLjItMS45LTQuNS0xLjgtNy43LDIuNC0xMC45LDMsNCwyLjYsNy4zLTEuMiwxMS4xLDIuNC0xLjMsNi4yLDAsNCw0LjYtMS4yLTIuOC0zLjctMi4yLTQuMi4yLS4zLDEuNy43LDMuNywzLDQuMiwxLjkuMyw0LjctLjksNy01LjktMS4zLDAtMi40LjctMy45LDEuN2wyLjQtOGMuNiwyLjMsMS40LDMuNywyLjIsNC41LjYtMS42LjUtMi44LDAtNS4zbDUsMS44Yy0yLjYsMy42LTUuMiw4LjctNy4zLDE3LjUtNy40LTEuMS0xNS43LTEuNy0yNC41LTEuN2gwYy04LjgsMC0xNy4xLjYtMjQuNSwxLjctMi4xLTguOS00LjctMTMuOS03LjMtMTcuNWw1LTEuOGMtLjUsMi41LS42LDMuNywwLDUuMy44LS44LDEuNi0yLjMsMi4yLTQuNWwyLjQsOGMtMS41LTEtMi42LTEuNy0zLjktMS43LDIuMyw1LDUuMiw2LjIsNyw1LjksMi4zLS40LDMuMy0yLjQsMy00LjItLjUtMi40LTMtMy4xLTQuMi0uMi0yLjItNC42LDEuNi02LDQtNC42LTMuNy0zLjctNC4yLTcuMS0xLjItMTEuMSw0LjIsMy4yLDQuMyw2LjQsMi40LDEwLjksMi41LTIuOCw2LjMtMS4zLDQuOSwzLjItMS44LTIuNy00LjEtMS0zLjcsMS42LjMsMi4zLDMuMyw0LjEsNywzLjgsNS40LS41LDUuNy00LjIsNS44LTcuMi0xLjMtLjItMy43LDEtNS43LDMuOGwtLjctOC41YzIuMiwyLjMsNC4yLDIuNyw2LjQsMi44LS43LTIuMy00LjEtNi4xLTQuMS02LjFoMTAuNiwwWiI+PC9wYXRoPgoJPC9nPgo8L3N2Zz4=");

/***/ },

/***/ "./src/custom-blocks/hmg-svg/svg/govuk.svg"
/*!*************************************************!*\
  !*** ./src/custom-blocks/hmg-svg/svg/govuk.svg ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgGovuk),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _circle2, _circle3, _circle4, _circle5, _circle6, _circle7, _circle8, _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgGovuk = function SvgGovuk(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 148,
    height: 30,
    fill: "currentcolor",
    "aria-label": "GOV.UK",
    className: "govuk_svg__govuk-header__logotype",
    viewBox: "0 0 296 60"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 20,
    cy: 17.6,
    r: 3.7
  })), _circle2 || (_circle2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 10.2,
    cy: 23.5,
    r: 3.7
  })), _circle3 || (_circle3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 3.7,
    cy: 33.2,
    r: 3.7
  })), _circle4 || (_circle4 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 31.7,
    cy: 30.6,
    r: 3.7
  })), _circle5 || (_circle5 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 43.3,
    cy: 17.6,
    r: 3.7
  })), _circle6 || (_circle6 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 53.2,
    cy: 23.5,
    r: 3.7
  })), _circle7 || (_circle7 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 59.7,
    cy: 33.2,
    r: 3.7
  })), _circle8 || (_circle8 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 31.7,
    cy: 30.6,
    r: 3.7
  })), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M33.1 9.8c.2-.1.3-.3.5-.5l4.6 2.4V4.9l-4.6 1.5c-.1-.2-.3-.3-.5-.5L35 0h-6.7l1.9 5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6 8c-.9 2.8 1.2 5.7 4.1 5.7 3 0 5.1-2.9 4.1-5.7l-2.6-8ZM37 37.9s-3.4 3.8-4.1 6.1c2.2 0 4.2-.5 6.4-2.8l-.7 8.5c-2-2.8-4.4-4.1-5.7-3.8.1 3.1.5 6.7 5.8 7.2 3.7.3 6.7-1.5 7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5 2.4-6.1 4.9-3.2-1.9-4.5-1.8-7.7 2.4-10.9 3 4 2.6 7.3-1.2 11.1 2.4-1.3 6.2 0 4 4.6-1.2-2.8-3.7-2.2-4.2.2-.3 1.7.7 3.7 3 4.2 1.9.3 4.7-.9 7-5.9-1.3 0-2.4.7-3.9 1.7l2.4-8c.6 2.3 1.4 3.7 2.2 4.5.6-1.6.5-2.8 0-5.3l5 1.8c-2.6 3.6-5.2 8.7-7.3 17.5-7.4-1.1-15.7-1.7-24.5-1.7s-17.1.6-24.5 1.7C5.2 51.1 2.6 46.1 0 42.5l5-1.8c-.5 2.5-.6 3.7 0 5.3.8-.8 1.6-2.3 2.2-4.5l2.4 8c-1.5-1-2.6-1.7-3.9-1.7 2.3 5 5.2 6.2 7 5.9 2.3-.4 3.3-2.4 3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6 1.6-6 4-4.6-3.7-3.7-4.2-7.1-1.2-11.1 4.2 3.2 4.3 6.4 2.4 10.9 2.5-2.8 6.3-1.3 4.9 3.2-1.8-2.7-4.1-1-3.7 1.6.3 2.3 3.3 4.1 7 3.8 5.4-.5 5.7-4.2 5.8-7.2-1.3-.2-3.7 1-5.7 3.8l-.7-8.5c2.2 2.3 4.2 2.7 6.4 2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6ZM88.6 33.2c0 1.8.2 3.4.6 5s1.2 3 2 4.4c1 1.2 2 2.2 3.4 3s3 1.2 5 1.2 3.4-.2 4.6-.8 2.2-1.4 3-2.2 1.2-1.8 1.6-3c.2-1 .4-2 .4-3v-.4H98.6V31h18.8v23H110v-5c-.6.8-1.2 1.6-2 2.2s-1.6 1.2-2.6 1.8c-1 .4-2 .8-3.2 1.2s-2.4.4-3.6.4c-3 0-5.8-.6-8-1.6-2.4-1.2-4.4-2.6-6-4.6s-2.8-4.2-3.6-6.8c-.6-2.8-1-5.6-1-8.6s.4-5.8 1.4-8.4 2.2-4.8 4-6.8 3.8-3.4 6.2-4.6 5.2-1.6 8.2-1.6 3.8.2 5.6.6 3.4 1.2 4.8 2 2.8 1.8 3.8 3c1.2 1.2 2 2.6 2.8 4l-7.4 4.2c-.4-.8-1-1.8-1.6-2.4-.6-.8-1.2-1.4-2-2s-1.6-1-2.6-1.4-2.2-.4-3.4-.4c-2 0-3.6.4-5 1.2s-2.6 1.8-3.4 3c-1 1.2-1.6 2.8-2 4.4-.6 1.6-.8 3.8-.8 5.4m72.8-8.6c-.8-2.6-2.2-4.8-4-6.8s-3.8-3.4-6.2-4.6-5.2-1.6-8.4-1.6-5.8.6-8.4 1.6c-2.2 1.2-4.4 2.8-6 4.6-1.8 2-3 4.2-4 6.8-.8 2.6-1.4 5.4-1.4 8.4s.4 5.8 1.4 8.4c.8 2.6 2.2 4.8 4 6.8s3.8 3.4 6.2 4.6 5.2 1.6 8.4 1.6 5.8-.6 8.4-1.6c2.4-1.2 4.6-2.6 6.2-4.6 1.8-2 3-4.2 4-6.8.8-2.6 1.4-5.4 1.4-8.4-.2-3-.6-5.8-1.6-8.4m-7.4 8.6c0 2-.2 3.8-.8 5.4-.4 1.6-1.2 3.2-2.2 4.4s-2.2 2.2-3.4 2.8c-1.4.6-3 1-4.8 1s-3.4-.4-4.8-1-2.6-1.6-3.4-2.8c-1-1.2-1.6-2.6-2.2-4.4-.4-1.6-.8-3.4-.8-5.4V33c0-2 .2-3.8.8-5.4.4-1.6 1.2-3.2 2.2-4.4s2.2-2.2 3.4-2.8c1.4-.6 3-1 4.8-1s3.4.4 4.8 1 2.6 1.6 3.4 2.8c1 1.2 1.6 2.6 2.2 4.4.4 1.6.8 3.4.8 5.4zM177.8 54 166 12h9.4l8 31.4h.2l8-31.4h9.4l-11.8 42zm57.6-7.3c1.2 0 2.4-.2 3.4-.6s2-.8 2.8-1.6 1.4-1.6 1.8-2.8.6-2.4.6-4V11.8h8.2V39c0 2.4-.4 4.4-1.2 6.2s-2 3.4-3.6 4.8q-2.1 2.1-5.4 3c-2 .8-4.4 1-6.8 1s-4.8-.4-6.8-1q-3-1.2-5.4-3c-1.6-1.4-2.6-3-3.6-4.8-.8-1.8-1.2-4-1.2-6.2V11.7h8.4v26c0 1.6.2 2.8.6 4s1 2 1.8 2.8 1.6 1.2 2.8 1.6 2.2.6 3.6.6m26-34.8h8.4v18.2l14.8-18.2H295l-14.4 16.8L296 53.9h-9.8l-11-18.8-5.4 6v12.8h-8.4zm-55.2 32.3c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4-2.4-5.4-5.4-5.4"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI5NiA2MCIgaGVpZ2h0PSIzMCIgd2lkdGg9IjE0OCIgZmlsbD0iY3VycmVudGNvbG9yIiBjbGFzcz0iZ292dWstaGVhZGVyX19sb2dvdHlwZSIgYXJpYS1sYWJlbD0iR09WLlVLIj48dGl0bGU+R09WLlVLPC90aXRsZT4KCTxnPgoJCTxjaXJjbGUgY3g9IjIwIiBjeT0iMTcuNiIgcj0iMy43Ij48L2NpcmNsZT4KCQk8Y2lyY2xlIGN4PSIxMC4yIiBjeT0iMjMuNSIgcj0iMy43Ij48L2NpcmNsZT4KCQk8Y2lyY2xlIGN4PSIzLjciIGN5PSIzMy4yIiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjMxLjciIGN5PSIzMC42IiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjQzLjMiIGN5PSIxNy42IiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjUzLjIiIGN5PSIyMy41IiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjU5LjciIGN5PSIzMy4yIiByPSIzLjciPjwvY2lyY2xlPgoJCTxjaXJjbGUgY3g9IjMxLjciIGN5PSIzMC42IiByPSIzLjciPjwvY2lyY2xlPgoJCTxwYXRoIGQ9Ik0zMy4xLDkuOGMuMi0uMS4zLS4zLjUtLjVsNC42LDIuNHYtNi44bC00LjYsMS41Yy0uMS0uMi0uMy0uMy0uNS0uNWwxLjktNS45aC02LjdsMS45LDUuOWMtLjIuMS0uMy4zLS41LjVsLTQuNi0xLjV2Ni44bDQuNi0yLjRjLjEuMi4zLjMuNS41bC0yLjYsOGMtLjksMi44LDEuMiw1LjcsNC4xLDUuN2gwYzMsMCw1LjEtMi45LDQuMS01LjdsLTIuNi04Wk0zNywzNy45cy0zLjQsMy44LTQuMSw2LjFjMi4yLDAsNC4yLS41LDYuNC0yLjhsLS43LDguNWMtMi0yLjgtNC40LTQuMS01LjctMy44LjEsMy4xLjUsNi43LDUuOCw3LjIsMy43LjMsNi43LTEuNSw3LTMuOC40LTIuNi0yLTQuMy0zLjctMS42LTEuNC00LjUsMi40LTYuMSw0LjktMy4yLTEuOS00LjUtMS44LTcuNywyLjQtMTAuOSwzLDQsMi42LDcuMy0xLjIsMTEuMSwyLjQtMS4zLDYuMiwwLDQsNC42LTEuMi0yLjgtMy43LTIuMi00LjIuMi0uMywxLjcuNywzLjcsMyw0LjIsMS45LjMsNC43LS45LDctNS45LTEuMywwLTIuNC43LTMuOSwxLjdsMi40LThjLjYsMi4zLDEuNCwzLjcsMi4yLDQuNS42LTEuNi41LTIuOCwwLTUuM2w1LDEuOGMtMi42LDMuNi01LjIsOC43LTcuMywxNy41LTcuNC0xLjEtMTUuNy0xLjctMjQuNS0xLjdoMGMtOC44LDAtMTcuMS42LTI0LjUsMS43LTIuMS04LjktNC43LTEzLjktNy4zLTE3LjVsNS0xLjhjLS41LDIuNS0uNiwzLjcsMCw1LjMuOC0uOCwxLjYtMi4zLDIuMi00LjVsMi40LDhjLTEuNS0xLTIuNi0xLjctMy45LTEuNywyLjMsNSw1LjIsNi4yLDcsNS45LDIuMy0uNCwzLjMtMi40LDMtNC4yLS41LTIuNC0zLTMuMS00LjItLjItMi4yLTQuNiwxLjYtNiw0LTQuNi0zLjctMy43LTQuMi03LjEtMS4yLTExLjEsNC4yLDMuMiw0LjMsNi40LDIuNCwxMC45LDIuNS0yLjgsNi4zLTEuMyw0LjksMy4yLTEuOC0yLjctNC4xLTEtMy43LDEuNi4zLDIuMywzLjMsNC4xLDcsMy44LDUuNC0uNSw1LjctNC4yLDUuOC03LjItMS4zLS4yLTMuNywxLTUuNywzLjhsLS43LTguNWMyLjIsMi4zLDQuMiwyLjcsNi40LDIuOC0uNy0yLjMtNC4xLTYuMS00LjEtNi4xaDEwLjYsMFoiPjwvcGF0aD4KCTwvZz4KCTxwYXRoIGQ9Ik04OC42LDMzLjJjMCwxLjguMiwzLjQuNiw1czEuMiwzLDIsNC40YzEsMS4yLDIsMi4yLDMuNCwzczMsMS4yLDUsMS4yLDMuNC0uMiw0LjYtLjgsMi4yLTEuNCwzLTIuMiwxLjItMS44LDEuNi0zYy4yLTEsLjQtMiwuNC0zdi0uNGgtMTAuNnYtNi40aDE4Ljh2MjNoLTcuNHYtNWMtLjYuOC0xLjIsMS42LTIsMi4yLS44LjYtMS42LDEuMi0yLjYsMS44LTEsLjQtMiwuOC0zLjIsMS4ycy0yLjQuNC0zLjYuNGMtMywwLTUuOC0uNi04LTEuNi0yLjQtMS4yLTQuNC0yLjYtNi00LjZzLTIuOC00LjItMy42LTYuOGMtLjYtMi44LTEtNS42LTEtOC42cy40LTUuOCwxLjQtOC40LDIuMi00LjgsNC02LjgsMy44LTMuNCw2LjItNC42YzIuNC0xLjIsNS4yLTEuNiw4LjItMS42czMuOC4yLDUuNi42YzEuOC40LDMuNCwxLjIsNC44LDJzMi44LDEuOCwzLjgsM2MxLjIsMS4yLDIsMi42LDIuOCw0bC03LjQsNC4yYy0uNC0uOC0xLTEuOC0xLjYtMi40LS42LS44LTEuMi0xLjQtMi0ycy0xLjYtMS0yLjYtMS40LTIuMi0uNC0zLjQtLjRjLTIsMC0zLjYuNC01LDEuMi0xLjQuOC0yLjYsMS44LTMuNCwzLTEsMS4yLTEuNiwyLjgtMiw0LjQtLjYsMS42LS44LDMuOC0uOCw1LjRaTTE2MS40LDI0LjZjLS44LTIuNi0yLjItNC44LTQtNi44cy0zLjgtMy40LTYuMi00LjZjLTIuNC0xLjItNS4yLTEuNi04LjQtMS42cy01LjguNi04LjQsMS42Yy0yLjIsMS4yLTQuNCwyLjgtNiw0LjYtMS44LDItMyw0LjItNCw2LjgtLjgsMi42LTEuNCw1LjQtMS40LDguNHMuNCw1LjgsMS40LDguNGMuOCwyLjYsMi4yLDQuOCw0LDYuOHMzLjgsMy40LDYuMiw0LjZjMi40LDEuMiw1LjIsMS42LDguNCwxLjZzNS44LS42LDguNC0xLjZjMi40LTEuMiw0LjYtMi42LDYuMi00LjYsMS44LTIsMy00LjIsNC02LjguOC0yLjYsMS40LTUuNCwxLjQtOC40LS4yLTMtLjYtNS44LTEuNi04LjRoMFpNMTU0LDMzLjJjMCwyLS4yLDMuOC0uOCw1LjQtLjQsMS42LTEuMiwzLjItMi4yLDQuNHMtMi4yLDIuMi0zLjQsMi44Yy0xLjQuNi0zLDEtNC44LDFzLTMuNC0uNC00LjgtMS0yLjYtMS42LTMuNC0yLjhjLTEtMS4yLTEuNi0yLjYtMi4yLTQuNC0uNC0xLjYtLjgtMy40LS44LTUuNHYtLjJjMC0yLC4yLTMuOC44LTUuNC40LTEuNiwxLjItMy4yLDIuMi00LjQsMS0xLjIsMi4yLTIuMiwzLjQtMi44LDEuNC0uNiwzLTEsNC44LTFzMy40LjQsNC44LDEsMi42LDEuNiwzLjQsMi44YzEsMS4yLDEuNiwyLjYsMi4yLDQuNC40LDEuNi44LDMuNC44LDUuNHYuMlpNMTc3LjgsNTRsLTExLjgtNDJoOS40bDgsMzEuNGguMmw4LTMxLjRoOS40bC0xMS44LDQyaC0xMS40LDBaTTIzNS40LDQ2LjdjMS4yLDAsMi40LS4yLDMuNC0uNiwxLS40LDItLjgsMi44LTEuNnMxLjQtMS42LDEuOC0yLjhjLjQtMS4yLjYtMi40LjYtNFYxMS44aDguMnYyNy4yYzAsMi40LS40LDQuNC0xLjIsNi4ycy0yLDMuNC0zLjYsNC44Yy0xLjQsMS40LTMuMiwyLjQtNS40LDMtMiwuOC00LjQsMS02LjgsMXMtNC44LS40LTYuOC0xYy0yLS44LTMuOC0xLjgtNS40LTMtMS42LTEuNC0yLjYtMy0zLjYtNC44LS44LTEuOC0xLjItNC0xLjItNi4yVjExLjdoOC40djI2YzAsMS42LjIsMi44LjYsNCwuNCwxLjIsMSwyLDEuOCwyLjhzMS42LDEuMiwyLjgsMS42YzEuMi40LDIuMi42LDMuNi42aDBaTTI2MS40LDExLjloOC40djE4LjJsMTQuOC0xOC4yaDEwLjRsLTE0LjQsMTYuOCwxNS40LDI1LjJoLTkuOGwtMTEtMTguOC01LjQsNnYxMi44aC04LjRWMTEuOWgwWk0yMDYuMiw0NC4yYy0zLDAtNS40LDIuNC01LjQsNS40czIuNCw1LjQsNS40LDUuNCw1LjQtMi40LDUuNC01LjQtMi40LTUuNC01LjQtNS40WiI+PC9wYXRoPgo8L3N2Zz4=");

/***/ },

/***/ "./src/custom-blocks/hmg-svg/svg/ogl.svg"
/*!***********************************************!*\
  !*** ./src/custom-blocks/hmg-svg/svg/ogl.svg ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgOgl),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgOgl = function SvgOgl(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 41,
    height: 17,
    "aria-hidden": "true",
    className: "ogl_svg__govuk-footer__licence-logo",
    viewBox: "0 0 483.2 195.7"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fill: "currentColor",
    d: "M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgY2xhc3M9ImdvdnVrLWZvb3Rlcl9fbGljZW5jZS1sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODMuMiAxOTUuNyIgaGVpZ2h0PSIxNyIgd2lkdGg9IjQxIj4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTQyMS41IDE0Mi44Vi4xbC01MC43IDMyLjN2MTYxLjFoMTEyLjR2LTUwLjd6bS0xMjIuMy05LjZBNDcuMTIgNDcuMTIgMCAwIDEgMjIxIDk3LjhjMC0yNiAyMS4xLTQ3LjEgNDcuMS00Ny4xIDE2LjcgMCAzMS40IDguNyAzOS43IDIxLjhsNDIuNy0yNy4yQTk3LjYzIDk3LjYzIDAgMCAwIDI2OC4xIDBjLTM2LjUgMC02OC4zIDIwLjEtODUuMSA0OS43QTk4IDk4IDAgMCAwIDk3LjggMEM0My45IDAgMCA0My45IDAgOTcuOHM0My45IDk3LjggOTcuOCA5Ny44YzM2LjUgMCA2OC4zLTIwLjEgODUuMS00OS43YTk3Ljc2IDk3Ljc2IDAgMCAwIDE0OS42IDI1LjRsMTkuNCAyMi4yaDN2LTg3LjhoLTgwbDI0LjMgMjcuNXpNOTcuOCAxNDVjLTI2IDAtNDcuMS0yMS4xLTQ3LjEtNDcuMXMyMS4xLTQ3LjEgNDcuMS00Ny4xIDQ3LjIgMjEgNDcuMiA0N1MxMjMuOCAxNDUgOTcuOCAxNDUiPjwvcGF0aD4KPC9zdmc+");

/***/ },

/***/ "./src/custom-blocks/accordion/index.js"
/*!**********************************************!*\
  !*** ./src/custom-blocks/accordion/index.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const {
  __
} = wp.i18n;
const {
  registerBlockType
} = wp.blocks;
const {
  RichText,
  InnerBlocks,
  InspectorControls,
  useSettings
} = wp.blockEditor;
const {
  PanelBody,
  PanelRow,
  TextControl,
  SelectControl,
  RadioControl
} = wp.components;
const tailwind_open_all_basic = "cursor-pointer inline-flex items-center mb-2 !font-bold";
const tailwind_open_all_chevron = "pr-1 after:content-[''] after:inline-block after:w-1.5 after:h-1.5 after:ml-2 after:border-r-2 after:border-b-2 after:border-current after:rotate-[45deg] after:transition-transform after:duration-200 data-[state=open]:after:rotate-[-135deg]";
const tailwind_borders = "first-of-type:border-t border-b";

/**
 * Block: Accordion
 *
 * Display content in accordion layout.
 */
registerBlockType('wb-blocks/accordion', {
  title: 'Accordion',
  description: __('Display content in an accordion component.'),
  icon: "list-view",
  category: 'wb-blocks',
  keywords: [__('accordion'), __('sections'), __('lists')],
  attributes: {
    openAll: {
      type: "text",
      default: "Expand all sections"
    },
    closeAll: {
      type: "text",
      default: "Collapse all sections"
    },
    headingLevel: {
      type: 'number',
      default: 3
    },
    headingFontSize: {
      type: 'string',
      default: 'base'
    },
    accordionClassName: {
      type: 'string'
    }
  },
  // Provide context for child blocks
  providesContext: {
    'wb-blocks/accordionHeadingLevel': 'headingLevel',
    'wb-blocks/accordionHeadingFontSize': 'headingFontSize'
  },
  edit: props => {
    const {
      setAttributes,
      attributes: {
        openAll,
        closeAll,
        headingLevel,
        headingFontSize
      },
      className
    } = props;
    const [fontSizes] = useSettings('typography.fontSizes');
    const options = [...fontSizes.map(size => ({
      label: size.name,
      value: size.slug
    }))];

    // Set className attribute for PHP frontend to use
    setAttributes({
      accordionClassName: className
    });

    // Load allowed blocks on repeater
    const allowedBlocks = ['wb-blocks/accordion-section'];

    // Load template/block when block is selected
    const templates = [['wb-blocks/accordion-section', {}, [['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }], ['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }]]], ['wb-blocks/accordion-section', {}, [['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }], ['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }]]]];
    return [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(PanelBody, {
        title: "Heading level & size",
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectControl, {
            label: "Heading level",
            value: headingLevel,
            options: [{
              label: 'H2',
              value: 2
            }, {
              label: 'H3',
              value: 3
            }, {
              label: 'H4',
              value: 4
            }, {
              label: 'H5',
              value: 5
            }, {
              label: 'H6',
              value: 6
            }],
            onChange: newValue => setAttributes({
              headingLevel: parseInt(newValue, 10)
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectControl, {
            label: "Font size",
            value: headingFontSize,
            options: options,
            onChange: newValue => setAttributes({
              headingFontSize: newValue
            })
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(PanelBody, {
        title: "Open and close text",
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TextControl, {
            label: "Open all text",
            value: openAll,
            onChange: newValue => setAttributes({
              openAll: newValue
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TextControl, {
            label: "Close all text",
            value: closeAll,
            onChange: newValue => setAttributes({
              closeAll: newValue
            })
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
      className: tailwind_open_all_basic + " " + tailwind_open_all_chevron,
      children: [openAll, "/", closeAll]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: 'wb-accordion ' + className,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InnerBlocks, {
        template: templates,
        allowedBlocks: allowedBlocks
      })
    }, "accordion-block")];
  },
  // When using InnerBlocks with dynamic blocks, you need to return the content.
  save: () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InnerBlocks.Content, {});
  }
});

/**
 * Block: Accordion section
 *
 * Inner-block. Displayed only in the parent accordion block.
 */
registerBlockType("wb-blocks/accordion-section", {
  title: "Accordion Section",
  category: 'wb-blocks',
  parent: ['wb-blocks/accordion'],
  attributes: {
    sectionTitle: {
      type: "string"
    },
    accordionHeadingLevel: {
      type: "number"
    },
    accordionHeadingFontSize: {
      type: "string"
    },
    defaultOpen: {
      type: "boolean"
    },
    accordionSectionClassName: {
      type: "string"
    }
  },
  usesContext: ['wb-blocks/accordionHeadingLevel', 'wb-blocks/accordionHeadingFontSize'],
  edit: props => {
    const {
      attributes: {
        sectionTitle,
        defaultOpen,
        accordionHeadingLevel,
        accordionHeadingFontSize
      },
      className,
      setAttributes,
      context
    } = props;

    // Set className attribute for PHP frontend to use
    setAttributes({
      accordionSectionClassName: className
    });

    // Load allowed blocks to be added to accordion section body
    const allowedBlocks = ['core/heading', 'core/list', 'core/paragraph', 'core/file', 'core/image'];
    const templates = [['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }], ['core/paragraph', {
      placeholder: '[Accordion paragraph]'
    }]];
    const onChangeAccordionTitle = newValue => {
      setAttributes({
        sectionTitle: newValue
      });
    };

    // Set variables from parent
    const headingLevel = context['wb-blocks/accordionHeadingLevel'] || 3;
    const headingFontSize = context['wb-blocks/accordionHeadingFontSize'] || "base";
    setAttributes({
      accordionHeadingLevel: headingLevel
    });
    setAttributes({
      accordionHeadingFontSize: headingFontSize
    });
    return [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelBody, {
        title: "Options",
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(RadioControl, {
            label: "Open section by default",
            selected: defaultOpen ? 'yes' : 'no',
            options: [{
              label: 'Yes',
              value: 'yes'
            }, {
              label: 'No',
              value: 'no'
            }],
            onChange: value => setAttributes({
              defaultOpen: value === 'yes'
            })
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      className: `${className} accordion-section ` + tailwind_borders,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(RichText, {
        tagName: `h${accordionHeadingLevel}`,
        className: `wp-block-heading inline-block has-${accordionHeadingFontSize}-font-size !my-4`,
        value: sectionTitle,
        placeholder: "Add accordion section title\u2026",
        onChange: onChangeAccordionTitle,
        allowedFormats: [] // disable all format options
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "accordion-section__content",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InnerBlocks, {
          template: templates,
          allowedBlocks: allowedBlocks
        })
      })]
    }, "accordion-block-section")];
  },
  // When using InnerBlocks with dynamic blocks, you need to return the content.
  save: () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InnerBlocks.Content, {});
  }
});

/***/ },

/***/ "./src/custom-blocks/filterable-listing/edit.js"
/*!******************************************************!*\
  !*** ./src/custom-blocks/filterable-listing/edit.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ filterableListingEdit)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);








const {
  Fragment
} = wp.element;
const d = new Date();
const noItemSelectedText = "No item selected"; // Text in editor to shew that no item will be displayed

function filterableListingEdit({
  attributes,
  setAttributes
}) {
  const {
    listingPostType,
    listingSearchTextFilter,
    listingFilters,
    listingDisplayFields,
    listingDisplayTerms,
    listingItemsPerPage,
    listingSortOrder,
    listingRestrictTaxonomies,
    listingRestrictTerms,
    stylesResultsShadedBackground,
    className
  } = attributes;
  const {
    allPostTypes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getPostTypes
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    const allPostTypeList = getPostTypes({
      per_page: -1
    });
    return {
      allPostTypes: allPostTypeList
    };
  });

  // Sort Options used to sort the results
  let sortOptions = [{
    label: "Published Date (Newest to Oldest)",
    value: "published_date"
  }, {
    label: "Title (Alphabetical)",
    value: "title"
  }];
  const allTaxonomies = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).getTaxonomies());
  const termsByTaxonomy = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!allTaxonomies) return {};
    const map = {};
    allTaxonomies.forEach(tax => {
      map[tax.slug] = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).getEntityRecords('taxonomy', tax.slug, {
        per_page: -1
      });
    });
    return map;
  }, [allTaxonomies]);
  let itemTypes = [{
    label: "-",
    value: ""
  }];
  const displayFieldsList = [{
    label: "Published date",
    value: "published_date"
  }];
  const filterOptionList = [{
    label: "Published date",
    value: "published_date"
  }];
  const taxOptionList = [];
  const restrictTermOptionList = [];
  const selectedListingFilters = [];
  const selectedDisplayFields = [];
  const selectedDisplayTerms = [];
  const selectedRestrictTaxonomies = [];
  const selectedRestrictTerms = [];
  if (allPostTypes) {
    allPostTypes.forEach(thisPostType => {
      if (thisPostType.name != "Posts" && thisPostType.name != "Pages" && thisPostType.name != "Media" && thisPostType.viewable) {
        itemTypes.push({
          label: thisPostType.name,
          value: thisPostType.slug
        });
      }
      if (thisPostType.slug == listingPostType && thisPostType.taxonomies.length && allTaxonomies) {
        //console.log(thisPostType);
        thisPostType.taxonomies.forEach(postTypeTaxKey => {
          allTaxonomies.forEach(taxonomy => {
            if (taxonomy.slug == postTypeTaxKey) {
              taxOptionList.push({
                label: taxonomy.name,
                value: taxonomy.slug
              });
              filterOptionList.push({
                label: taxonomy.name,
                value: taxonomy.slug
              });
              displayFieldsList.push({
                label: taxonomy.name,
                value: taxonomy.slug
              });
              if (listingRestrictTaxonomies?.includes(taxonomy.slug) && termsByTaxonomy) {
                if (termsByTaxonomy[taxonomy.slug]) {
                  termsByTaxonomy[taxonomy.slug].forEach(term => {
                    restrictTermOptionList.push({
                      label: term.name,
                      value: term.id
                    });
                  });
                }
              }
            }
          });
        });
      }
      //Add ACF Meta Fields
      if (thisPostType.slug == listingPostType && thisPostType.acfFields.length) {
        thisPostType.acfFields.forEach(acfField => {
          filterOptionList.push({
            label: acfField.label,
            value: acfField.key
          });
          displayFieldsList.push({
            label: acfField.label,
            value: acfField.key
          });
        });
      }
    });

    //Seperate loops to keep the selection order

    if (listingFilters.length > 0) {
      listingFilters.forEach(field => {
        for (const opt of filterOptionList) {
          if (field == opt.value) {
            selectedListingFilters.push(opt);
            break;
          }
        }
      });
    }
    if (listingDisplayTerms.length > 0) {
      listingDisplayTerms.forEach(field => {
        for (const opt of taxOptionList) {
          if (field == opt.value) {
            selectedDisplayTerms.push(opt);
            break;
          }
        }
      });
    }
    if (listingRestrictTaxonomies.length > 0) {
      listingRestrictTaxonomies.forEach(field => {
        for (const opt of taxOptionList) {
          if (field == opt.value) {
            selectedRestrictTaxonomies.push(opt);
            break;
          }
        }
      });
    }
    if (listingDisplayFields.length > 0) {
      listingDisplayFields.forEach(field => {
        for (const opt of displayFieldsList) {
          if (field == opt.value) {
            selectedDisplayFields.push(opt);
            break;
          }
        }
      });
    }
    if (listingRestrictTerms.length > 0) {
      listingRestrictTerms.forEach(field => {
        for (const opt of restrictTermOptionList) {
          if (field == opt.value) {
            selectedRestrictTerms.push(opt);
            break;
          }
        }
      });
    }
  }
  const setListingPostType = newPostType => {
    setAttributes({
      listingPostType: newPostType
    });
    setAttributes({
      listingFilters: []
    });
    setAttributes({
      listingDisplayFields: []
    });
    setAttributes({
      listingRestrictTaxonomies: []
    });
    setAttributes({
      listingRestrictTerms: []
    });
  };
  const setListingSearchTextFilter = newSearchTextFilter => {
    setAttributes({
      listingSearchTextFilter: newSearchTextFilter
    });
  };
  const setListingFilters = selectedItems => {
    const values = selectedItems ? selectedItems.map(item => item.value) : [];
    setAttributes({
      listingFilters: values
    });
  };
  const setListingDisplayFields = selectedItems => {
    const values = selectedItems ? selectedItems.map(item => item.value) : [];
    setAttributes({
      listingDisplayFields: values
    });
  };
  const setListingDisplayTerms = selectedItems => {
    const values = selectedItems ? selectedItems.map(item => item.value) : [];
    setAttributes({
      listingDisplayTerms: values
    });
  };
  const setItemsPerPage = newItemsPerPage => {
    const parsedValue = parseInt(newItemsPerPage, 10);
    if (!isNaN(parsedValue)) {
      setAttributes({
        listingItemsPerPage: parsedValue
      });
    } else {
      // Fallback to a default (optional)
      setAttributes({
        listingItemsPerPage: 10
      });
    }
  };
  const setSortOrder = newSortOrder => {
    setAttributes({
      listingSortOrder: newSortOrder
    });
  };
  const setRestrictTaxonomies = selectedItems => {
    const values = selectedItems ? selectedItems.map(item => item.value) : [];
    setAttributes({
      listingRestrictTaxonomies: values
    });
    setAttributes({
      listingRestrictTerms: []
    });
  };
  const setRestrictTerms = selectedItems => {
    const values = selectedItems ? selectedItems.map(item => item.value) : [];
    setAttributes({
      listingRestrictTerms: values
    });
  };
  const inspectorControls = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filterable Listing settings'),
      initialOpen: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
        label: "Select item type",
        value: listingPostType,
        options: itemTypes,
        onChange: setListingPostType
      }), listingPostType.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
        label: "Search Text Filter",
        checked: listingSearchTextFilter,
        onChange: setListingSearchTextFilter
      }), filterOptionList.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
        label: "Listing Filters",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
          isMulti: true,
          label: "Filters",
          options: filterOptionList,
          value: selectedListingFilters,
          onChange: setListingFilters
        })
      })]
    }), listingPostType.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Results display settings'),
      initialOpen: true,
      children: [displayFieldsList.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
        label: "Display Fields",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
          isMulti: true,
          value: selectedDisplayFields,
          options: displayFieldsList,
          onChange: setListingDisplayFields
        })
      }), taxOptionList.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
        label: "Display Terms",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
          isMulti: true,
          value: selectedDisplayTerms,
          options: taxOptionList,
          onChange: setListingDisplayTerms
        })
      })]
    }), listingPostType.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Results settings'),
      initialOpen: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RangeControl, {
        label: "Items per page",
        min: 5,
        max: 50,
        value: listingItemsPerPage,
        onChange: setItemsPerPage
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
        label: "Sort by",
        options: sortOptions,
        value: listingSortOrder,
        onChange: setSortOrder
      })]
    }), listingPostType.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Restrict results settings'),
      initialOpen: true,
      children: [taxOptionList.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
        label: "Restrict by",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
          isMulti: true,
          options: taxOptionList,
          value: selectedRestrictTaxonomies,
          onChange: setRestrictTaxonomies
        })
      }), restrictTermOptionList.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
        label: "Restrict terms",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
          isMulti: true,
          options: restrictTermOptionList,
          value: selectedRestrictTerms,
          onChange: setRestrictTerms
        })
      })]
    })]
  });
  const setStylesResultsShadedBackground = newStylesResultsShadedBackground => {
    setAttributes({
      stylesResultsShadedBackground: newStylesResultsShadedBackground
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(Fragment, {
    children: [inspectorControls, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "styles",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Results styles'),
        initialOpen: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
          label: "Shaded background",
          help: "Item divider line will be hidden",
          checked: stylesResultsShadedBackground,
          onChange: setStylesResultsShadedBackground
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: `wb-blocks-filterable-listing ${className}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "",
        children: "Filterable Listing"
      })
    })]
  });
}

/***/ },

/***/ "./src/custom-blocks/filterable-listing/index.js"
/*!*******************************************************!*\
  !*** ./src/custom-blocks/filterable-listing/index.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/custom-blocks/filterable-listing/edit.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
const {
  registerBlockType,
  registerBlockStyle
} = wp.blocks;
const {
  __
} = wp.i18n;



registerBlockType("wb-blocks/filterable-listing", {
  title: __("Filterable Listing", "wb_block"),
  description: __('Listing block'),
  category: "wb-blocks",
  icon: "id-alt",
  keywords: [__('listing')],
  attributes: {
    listingPostType: {
      type: "string",
      default: ""
    },
    listingSearchTextFilter: {
      type: "boolean",
      default: true
    },
    listingFilters: {
      type: "array",
      default: ""
    },
    listingDisplayFields: {
      type: "array",
      default: ""
    },
    listingDisplayTerms: {
      type: "array",
      default: ""
    },
    listingItemsPerPage: {
      type: "number",
      default: 10
    },
    listingSortOrder: {
      type: "string",
      default: "published_date"
    },
    listingRestrictTaxonomies: {
      type: "array",
      default: ""
    },
    listingRestrictTerms: {
      type: "array",
      default: ""
    },
    stylesResultsShadedBackground: {
      type: "boolean",
      default: false
    },
    className: {
      type: "string"
    }
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {});
  }
});

/***/ },

/***/ "./src/custom-blocks/hmg-svg/index.js"
/*!********************************************!*\
  !*** ./src/custom-blocks/hmg-svg/index.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blockEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blockEditor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_blockEditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blockEditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _svg_crest_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./svg/crest.svg */ "./src/custom-blocks/hmg-svg/svg/crest.svg");
/* harmony import */ var _svg_govuk_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./svg/govuk.svg */ "./src/custom-blocks/hmg-svg/svg/govuk.svg");
/* harmony import */ var _svg_ogl_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./svg/ogl.svg */ "./src/custom-blocks/hmg-svg/svg/ogl.svg");
/* harmony import */ var _svg_crown_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./svg/crown.svg */ "./src/custom-blocks/hmg-svg/svg/crown.svg");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * HMG logo SVG
 */










(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('wb-blocks/hmg-svg', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('HM Government logo SVG', 'wb_block'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("The SVGs associated with government websites (for use in the footer)"),
  category: 'wb-blocks',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("svg", {
    focusable: "false",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 60",
    height: "30",
    width: "32",
    fill: "currentcolor",
    "aria-label": "GOV.UK",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("title", {
      children: "GOV.UK"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("g", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "20",
        cy: "17.6",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "10.2",
        cy: "23.5",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "3.7",
        cy: "33.2",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "31.7",
        cy: "30.6",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "43.3",
        cy: "17.6",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "53.2",
        cy: "23.5",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "59.7",
        cy: "33.2",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("circle", {
        cx: "31.7",
        cy: "30.6",
        r: "3.7"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        d: "M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"
      })]
    })]
  }),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('crown'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('copyright'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ogl'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('royal'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('crest'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('arms'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('coat-of-arms')],
  attributes: {
    logo: {
      type: 'string',
      default: 'crest'
    },
    className: {
      type: 'string'
    }
  },
  edit: props => {
    const {
      setAttributes,
      attributes: {
        logo
      },
      className
    } = props;

    // Grab newLogo, set the value of logo to newLogo.
    const onChangeLogo = newLogo => {
      setAttributes({
        logo: newLogo
      });
    };
    const logoOptions = [{
      label: "Government coat-of-arms",
      value: 'crest'
    }, {
      label: "Crown",
      value: 'crown'
    }, {
      label: "GOV.UK logo",
      value: 'govuk'
    }, {
      label: "Open Government Licence Logo",
      value: 'ogl'
    }];
    return [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_blockEditor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Government identity'),
        initialOpen: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Identity mark", "mojblocks"),
            help: "",
            value: logo,
            options: logoOptions,
            onChange: onChangeLogo
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: `wb-hmg-svg ${className || ''} ${logo}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.RawHTML, {
        children: logo == "crest" ? decodeBase64Svg(_svg_crest_svg__WEBPACK_IMPORTED_MODULE_5__["default"]) : logo == "crown" ? decodeBase64Svg(_svg_crown_svg__WEBPACK_IMPORTED_MODULE_8__["default"]) : logo == "govuk" ? decodeBase64Svg(_svg_govuk_svg__WEBPACK_IMPORTED_MODULE_6__["default"]) : logo == "ogl" ? decodeBase64Svg(_svg_ogl_svg__WEBPACK_IMPORTED_MODULE_7__["default"]) : ""
      })
    })];
  },
  // return null as frontend output is done via PHP
  save: () => null
});
function decodeBase64Svg(base64) {
  // Remove data URL prefix if present
  const clean = base64.replace(/^data:image\/svg\+xml;base64,/, '').replace(/\s/g, '');

  // Decode Base64 → UTF-8
  return decodeURIComponent(Array.from(atob(clean), c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
}

/***/ },

/***/ "./src/custom-blocks/icon/index.js"
/*!*****************************************!*\
  !*** ./src/custom-blocks/icon/index.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Icon
 */






const iconRootDirectory = IconData.rootDirectory;
const iconCategories = IconData.categories;
const iconOptions = IconData.options;
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('wb-blocks/icon', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon', 'wb_block'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Choose from a whole plethorah of icons"),
  category: 'wb-blocks',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 200 190",
    width: "200",
    height: "200",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("g", {
      transform: "translate(60,60)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("circle", {
        cx: "0",
        cy: "0",
        r: "50",
        stroke: "black",
        "stroke-width": "10",
        fill: "none"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
        d: "M -25 0 L -5 20 L 22 -20",
        stroke: "black",
        "stroke-width": "10",
        fill: "none"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("g", {
      transform: "translate(140,60)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("circle", {
        cx: "0",
        cy: "0",
        r: "50",
        stroke: "black",
        "stroke-width": "10",
        fill: "none"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("line", {
        x1: "-18",
        y1: "-18",
        x2: "18",
        y2: "18",
        stroke: "black",
        "stroke-width": "10"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("line", {
        x1: "-18",
        y1: "18",
        x2: "18",
        y2: "-18",
        stroke: "black",
        "stroke-width": "10"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("g", {
      transform: "translate(100,130)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("circle", {
        cx: "0",
        cy: "0",
        r: "50",
        stroke: "black",
        "stroke-width": "10",
        fill: "none"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("line", {
        x1: "0",
        y1: "-8",
        x2: "0",
        y2: "28",
        stroke: "black",
        "stroke-width": "10"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("circle", {
        cx: "0",
        cy: "-18",
        r: "6",
        fill: "black"
      })]
    })]
  }),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('icon')],
  attributes: {
    icon: {
      type: 'string',
      default: 'action/group_work/materialicons/24px.svg'
    },
    size: {
      type: 'number',
      default: 1
    },
    colour: {
      type: 'string'
    },
    className: {
      type: 'string'
    }
  },
  edit: props => {
    const {
      setAttributes,
      attributes: {
        colour,
        icon,
        size,
        category
      },
      className
    } = props;
    const [searchTerm, setSearchTerm] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
    // Filter icons based on search input
    const filteredIcons = Object.entries(iconOptions).filter(([index, data]) => data.value.toLowerCase().includes(searchTerm.toLowerCase().replaceAll(/\s+/g, "_")));
    const onChangeSize = value => {
      setAttributes({
        size: value
      });
    };
    const onChangeColour = value => {
      setAttributes({
        colour: value
      });
    };
    const [colorPalette] = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useSettings)('color.palette');
    const extraIconColours = [{
      name: 'Red',
      color: 'var(--colour-red)'
    }, {
      name: 'Green',
      color: 'var(--colour-green)'
    }, {
      name: 'Blue',
      color: 'var(--colour-blue)'
    }];
    const allColours = [...colorPalette, ...extraIconColours];
    const iconPathURL = `url('${iconRootDirectory}/${icon}')`;
    return [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "settings",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: "Icon picker (buttons)",
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: "Search icons",
          placeholder: "Type to filter",
          value: searchTerm,
          onChange: value => setSearchTerm(value),
          style: {
            marginBottom: '8px'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          },
          children: [filteredIcons.map(([index, data]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            onClick: () => setAttributes({
              icon: data.value
            }),
            style: {
              border: icon === data.value ? '8px solid #0ff' : '1px solid #ccc',
              filter: icon === data.value ? 'invert(1)' : 'none',
              padding: '10px',
              background: 'white',
              cursor: 'pointer'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
              src: iconRootDirectory + "/" + data.value,
              width: 24,
              height: 24,
              alt: data.name,
              loading: "lazy"
            })
          }, data.value)), filteredIcons.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            style: {
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: '#666'
            },
            children: "No icons found."
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "styles",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: "Size",
          value: size,
          onChange: onChangeSize,
          min: 1,
          max: 12,
          step: 0.5
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
          title: "Icon colour",
          colorSettings: [{
            value: colour,
            onChange: onChangeColour,
            label: 'Colour',
            colors: allColours
          }]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: `wb-icon ${className || ''}`,
      style: {
        backgroundColor: colour,
        '--icon-path': iconPathURL,
        '--icon-size': size
      }
    })];
  },
  // return null as frontend output is done via PHP
  save: () => null
});

/***/ },

/***/ "./src/custom-blocks/index.js"
/*!************************************!*\
  !*** ./src/custom-blocks/index.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordion */ "./src/custom-blocks/accordion/index.js");
/* harmony import */ var _filterable_listing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterable-listing */ "./src/custom-blocks/filterable-listing/index.js");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./icon */ "./src/custom-blocks/icon/index.js");
/* harmony import */ var _hmg_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hmg-svg */ "./src/custom-blocks/hmg-svg/index.js");
/* harmony import */ var _reveal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reveal */ "./src/custom-blocks/reveal/index.js");
/* harmony import */ var _table_of_contents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./table-of-contents */ "./src/custom-blocks/table-of-contents/index.js");
/**
 * Import blocks as components.
 */








/***/ },

/***/ "./src/custom-blocks/reveal/index.js"
/*!*******************************************!*\
  !*** ./src/custom-blocks/reveal/index.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Reveal
 */




const {
  InnerBlocks
} = wp.blockEditor;
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('wb-blocks/reveal', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reveal', 'wb_block'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Arrow toggle to reveal text"),
  category: 'wb-blocks',
  icon: 'controls-play',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('show'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('hide')],
  attributes: {
    revealTitle: {
      type: 'string'
    },
    revealClassName: {
      type: 'string'
    }
  },
  edit: props => {
    const {
      setAttributes,
      attributes: {
        revealTitle
      },
      className
    } = props;

    // Load allowed blocks to be added to content
    const allowedBlocks = ['core/heading', 'core/paragraph', 'core/list'];

    // Set className attribute for PHP frontend to use
    setAttributes({
      revealClassName: className
    });

    // Grab newRevealTitle, set the value of revealTitle to newRevealTitle.
    const onChangeRevealTitle = newRevealTitle => {
      setAttributes({
        revealTitle: newRevealTitle
      });
    };
    return [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: `revealClassName`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("details", {
        className: "wb-details",
        open: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("summary", {
          className: "wb-details__summary",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            className: "wb-details__summary-text",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
              value: revealTitle,
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add reveal title'),
              keepPlaceholderOnFocus: true,
              onChange: onChangeRevealTitle
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "wb-details__text",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(InnerBlocks, {
            allowedBlocks: allowedBlocks
          })
        })]
      })
    })];
  },
  save: () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(InnerBlocks.Content, {});
  }
});

/***/ },

/***/ "./src/custom-blocks/table-of-contents/edit.js"
/*!*****************************************************!*\
  !*** ./src/custom-blocks/table-of-contents/edit.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tocEdit)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const {
  Fragment
} = wp.element;
function tocEdit({
  attributes,
  setAttributes
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let contentArea = document.querySelector('.editor-visual-editor');
    if (!contentArea) {
      return;
    }
    let contentsList = document.getElementById("table-of-contents-contents-list");
    const mutationObserver = new MutationObserver(mutationList => {
      let headingItems = contentArea.querySelectorAll("h2:not(.wb-toc-ignore)");
      let contentItems = contentsList.querySelectorAll("li");
      if (headingItems.length != contentItems.length) {
        contentsList.innerHTML = "";
        for (let i = 0; i < headingItems.length; i++) {
          if (headingItems[i].innerHTML.includes(tocTitle)) continue;
          onClassChange(headingItems[i]); // Live updating of contents item if content is changed without re-writing the entire table of contents
          contentsList.innerHTML += createContentItem(headingItems[i]);
        }
      }
    });
    mutationObserver.observe(contentArea, {
      childList: true,
      subtree: true
    });
  }, []);
  const {
    tocTitle,
    backToTopText,
    sticky,
    scrollSpy,
    tocClassName,
    className
  } = attributes;

  // Set className attribute for PHP frontend to use
  setAttributes({
    tocClassName: className
  });
  const setTocTitle = newTocTitle => {
    setAttributes({
      tocTitle: newTocTitle
    });
  };
  const setBackToTopText = newBackToTopText => {
    setAttributes({
      backToTopText: newBackToTopText
    });
  };
  const setSticky = newSticky => {
    setAttributes({
      sticky: newSticky
    });
  };
  const setScrollSpy = newScrollSpy => {
    setAttributes({
      scrollSpy: newScrollSpy
    });
  };
  const inspectorControls = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Table of contents'),
      initialOpen: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
        label: "Contents tracks down the page",
        help: "Designed for the ToC to be in its own column",
        checked: sticky,
        onChange: setSticky
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
        label: "Highlight the current position",
        help: "Marks the current ToC item as you scroll down the page, designed to be used with the above where the ToC is always visible on Desktop displays.",
        checked: scrollSpy,
        onChange: setScrollSpy
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
        __nextHasNoMarginBottom: true,
        __next40pxDefaultSize: true,
        label: "Back to top link text",
        help: "What text should be used for the link to skip back to the table of contents",
        value: backToTopText,
        onChange: setBackToTopText
      })]
    })
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(Fragment, {
    children: [inspectorControls, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: `wb-blocks-toc ${tocClassName} ${sticky ? 'toc-sticky' : ''}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        id: "table-of-contents",
        class: "wb-table-of-contents toc-sticky toc-scrollspy",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
          class: "wb-table-of-contents__heading wb-toc-ignore",
          id: "table-of-contents-heading",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
            value: tocTitle,
            onChange: setTocTitle
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("ol", {
          id: "table-of-contents-contents-list",
          class: "wb-table-of-contents__list"
        })]
      })
    })]
  });
}
function createContentItem(heading) {
  // This function creates the entries for the table of contents.
  let additionalClass = "";
  let hintText = "";
  if (heading.innerText.trim() == "") {
    additionalClass = "empty";
    hintText = "Empty item";
  }
  return '<li id="toc-link-for_' + heading.id + '" class="wb-table-of-contents__item ' + additionalClass + '"><a href="#' + heading.id + '">' + heading.innerText + hintText + '</a></li>';
}
function onClassChange(node) {
  // Class change happens when any editing is done, so we look for a class change
  // If a class change is detected we run the alterHeading function

  let lastClassString = node.classList.toString();
  const mutationObserver = new MutationObserver(mutationList => {
    for (const item of mutationList) {
      if (item.attributeName === "class") {
        const classString = node.classList.toString();
        if (classString !== lastClassString) {
          alterHeading(node);
          lastClassString = classString;
          break;
        }
      }
    }
  });
  mutationObserver.observe(node, {
    attributes: true
  });
  return mutationObserver;
}
function alterHeading(heading) {
  if (!heading) return;
  let headingContentItem = document.getElementById("toc-link-for_" + heading.id);
  if (!headingContentItem) return; // The function will run before the contents list has been created so this is important

  // Check: has the text changed
  if (heading.innerText != headingContentItem.innerText) {
    headingContentItem.outerHTML = createContentItem(heading);
  }
}

/***/ },

/***/ "./src/custom-blocks/table-of-contents/index.js"
/*!******************************************************!*\
  !*** ./src/custom-blocks/table-of-contents/index.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./src/custom-blocks/table-of-contents/edit.js");
const {
  registerBlockType,
  registerBlockStyle
} = wp.blocks;
const {
  __
} = wp.i18n;

/**
 * Internal dependencies
 */

registerBlockType("wb-blocks/table-of-contents", {
  title: "Table of contents",
  description: 'Table of contents',
  category: "wb-blocks",
  icon: "id-alt",
  keywords: ['contents', 'toc', 'side navigation'],
  attributes: {
    tocTitle: {
      type: "string",
      default: "Table of contents"
    },
    backToTopText: {
      type: "string",
      default: "Back to top"
    },
    sticky: {
      type: "boolean",
      default: false
    },
    scrollSpy: {
      type: "boolean",
      default: false
    },
    tocClassName: {
      type: "string"
    }
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  // return null as frontend output is done via PHP
  save: () => null
});

/***/ },

/***/ "./src/extended-core-blocks/file/index.js"
/*!************************************************!*\
  !*** ./src/extended-core-blocks/file/index.js ***!
  \************************************************/
() {

/**
 *  Extend core WP file block
 *  https://wordpress.org/support/article/file-block/
 *
 * This makes use of WP Blocks extention filters
 * https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 *
 */

const {
  addFilter
} = wp.hooks;
const {
  createHigherOrderComponent
} = wp.compose;
const {
  Fragment,
  createElement
} = wp.element;
function getFileExtension(file = '') {
  return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
}
const addFileExtension = createHigherOrderComponent(BlockEdit => {
  return props => {
    if (props.name !== 'core/file') {
      return createElement(BlockEdit, props);
    }
    const extText = '(' + getFileExtension(props.attributes.href).toUpperCase() + ')';
    return createElement(Fragment, {}, createElement(BlockEdit, props), createElement('style', {}, `#block-${props.clientId}.wp-block-file .wp-block-file__content-wrapper::after { 
                    content: "${extText}";
                    color: #000;
                    margin-left: 4px;
                }`));
  };
}, 'addFileExtension');
addFilter('editor.BlockEdit', 'my-plugin/file-link-after-text', addFileExtension);
wp.hooks.addFilter('blocks.registerBlockType', 'custom/disable-file-block-settings', function (settings, name) {
  if (name === 'core/file') {
    // Ensure attributes exists
    settings.attributes = settings.attributes || {};

    // Disable preview by default
    settings.attributes.displayPreview = {
      type: 'boolean',
      default: false
    };

    // Disable download button by default
    settings.attributes.showDownloadButton = {
      type: 'boolean',
      default: false
    };
  }
  return settings;
});

/***/ },

/***/ "./src/extended-core-blocks/index.js"
/*!*******************************************!*\
  !*** ./src/extended-core-blocks/index.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./file */ "./src/extended-core-blocks/file/index.js");
/* harmony import */ var _file__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_file__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list */ "./src/extended-core-blocks/list/index.js");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation */ "./src/extended-core-blocks/navigation/index.js");
/* harmony import */ var _post_date__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./post-date */ "./src/extended-core-blocks/post-date/index.jsx");
/* harmony import */ var _query_pagination__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query-pagination */ "./src/extended-core-blocks/query-pagination/index.jsx");
/* harmony import */ var _query_pagination_numbers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./query-pagination-numbers */ "./src/extended-core-blocks/query-pagination-numbers/index.jsx");
/* harmony import */ var _query_total__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./query-total */ "./src/extended-core-blocks/query-total/index.jsx");
/**
 * Import blocks as components.
 */









/***/ },

/***/ "./src/extended-core-blocks/list/index.js"
/*!************************************************!*\
  !*** ./src/extended-core-blocks/list/index.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */







const iconRootDirectory = IconData.rootDirectory + "/";
const iconPathSuffix = "/materialicons/24px.svg";
const allowedIcons = ["content/remove", "navigation/check", "action/check_circle", "action/check_circle_outline", "action/info", "action/info_outline", "navigation/chevron_right", "av/play_arrow", "action/help", "action/help_outline", "alert/error", "alert/error_outline", "toggle/star", "action/label_important", "action/label_important_outline", "action/arrow_right_alt"];
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockStyle)('core/list', {
  name: 'horizontal',
  label: 'Horizontal'
});
wp.hooks.addFilter('blocks.registerBlockType', 'wb-blocks/list-custom-bullet-attribute', function (settings, name) {
  if (name !== 'core/list') return settings;
  settings.attributes = {
    ...settings.attributes,
    customBulletColour: {
      type: 'string'
    },
    customBulletStyle: {
      type: 'string'
    },
    customBulletIcon: {
      type: 'string'
    }
  };
  return settings;
});
const bulletColourPicker = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    if (props.name !== 'core/list') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
        ...props
      });
    }
    const {
      attributes,
      setAttributes
    } = props;
    const [colorPalette] = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useSettings)('color.palette');
    const extraBulletColours = [{
      name: 'Red',
      color: 'var(--colour-red)'
    }, {
      name: 'Green',
      color: 'var(--colour-green)'
    }, {
      name: 'Blue',
      color: 'var(--colour-blue)'
    }];
    const allColours = [...colorPalette, ...extraBulletColours];
    const chooseIcon = data => {
      setAttributes({
        customBulletIcon: attributes.customBulletIcon === data ? "" : data //toggle
      });
    };
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
        group: "styles",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: attributes.ordered ? `Marker colouring` : `Custom bullets`,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
            title: "Colour",
            colorSettings: [{
              value: props.attributes.customBulletColour,
              onChange: colour => props.setAttributes({
                customBulletColour: colour
              }),
              label: 'Bullet colour',
              colors: allColours
            }]
          }), !attributes.ordered && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
              onClick: () => chooseIcon(""),
              style: {
                outline: attributes.customBulletIcon === "" ? '8px solid #0ff' : '1px solid #ccc',
                filter: attributes.customBulletIcon === "" ? 'invert(1)' : 'none',
                padding: '10px',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: '700',
                gridColumn: 'span 4'
              },
              children: "Default (no special icon)"
            }), allowedIcons.map(data => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
              onClick: () => chooseIcon(data),
              style: {
                outline: attributes.customBulletIcon === data ? '8px solid #0ff' : '1px solid #ccc',
                filter: attributes.customBulletIcon === data ? 'invert(1)' : 'none',
                padding: '10px',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'center'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
                src: iconRootDirectory + data + iconPathSuffix,
                width: 24,
                height: 24,
                alt: data,
                loading: "lazy"
              })
            }, data))]
          })]
        })
      })]
    });
  };
}, 'bulletColourPicker');
wp.hooks.addFilter('editor.BlockEdit', 'wb-blocks/list-custom-bullet-control', bulletColourPicker);
const selectCustomBullet = wp.compose.createHigherOrderComponent(BlockEdit => props => {
  if (props.name !== 'core/list') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
      ...props
    });
  }
  const {
    customBulletColour,
    customBulletIcon
  } = props.attributes;
  const maskURL = "url('" + iconRootDirectory + customBulletIcon + iconPathSuffix + "')";
  const colour = customBulletColour ? customBulletColour : 'currentColor';
  let className = "edit-screen-container";
  if (customBulletIcon) {
    className += " is-style-icon-list";
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: className,
    style: {
      '--bullet-icon': maskURL,
      '--bullet-colour': colour
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
      ...props
    })
  });
}, 'selectCustomBullet');
wp.hooks.addFilter('editor.BlockEdit', 'wb-blocks/custom-bullet-colour', selectCustomBullet);

// Save our custom attribute

const saveCustomBullet = (props, blockType, attributes) => {
  // Do nothing if it's another block than our defined ones.
  if (blockType.name == "core/list") {
    const {
      customBulletColour,
      customBulletIcon
    } = attributes;
    const maskURL = "url('" + iconRootDirectory + customBulletIcon + iconPathSuffix + "')";
    if (customBulletColour) {
      props.style = {
        ...props.style,
        '--bullet-colour': customBulletColour
      };
    }
    if (customBulletIcon) {
      props = {
        ...props,
        className: classnames__WEBPACK_IMPORTED_MODULE_5___default()(props.className, "is-style-icon-list")
      };
      props.style = {
        ...props.style,
        '--bullet-icon': maskURL
      };
    }
  }
  return props;
};
wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'wb-blocks/save-custom-bullet-colour', saveCustomBullet);

/***/ },

/***/ "./src/extended-core-blocks/navigation/index.js"
/*!******************************************************!*\
  !*** ./src/extended-core-blocks/navigation/index.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */


const {
  createHigherOrderComponent
} = wp.compose;
const {
  useEffect
} = wp.element;
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/navigation', {
  // This is the out-of-the-box WordPress style, no special stuff
  name: 'original-navigation',
  title: 'WordPress navigation',
  description: 'Navigation used as default by WordPress',
  attributes: {
    className: 'is-style-wordpress'
  },
  scope: ['transform'],
  isActive: blockAttributes => !blockAttributes?.className?.includes('is-style-drawer') && !blockAttributes?.className?.includes('is-style-detached')
});
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/navigation', {
  name: 'drawer-navigation',
  title: 'Drawer navigation',
  description: 'Navigation where the submenu opens in a drawer',
  attributes: {
    openSubmenusOnClick: true,
    overlayMenu: 'never',
    className: 'is-style-drawer'
  },
  scope: ['transform'],
  isActive: blockAttributes => blockAttributes?.className?.includes('is-style-drawer')
});
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/navigation', {
  name: 'detached-navigation',
  title: 'Detached navigation',
  description: 'Navigation opened and closed by a button',
  attributes: {
    openSubmenusOnClick: true,
    overlayMenu: 'always',
    className: 'is-style-detached'
  },
  scope: ['transform'],
  isActive: blockAttributes => blockAttributes?.className?.includes('is-style-detached')
});

/**
 * The following functions deal with the navigation settings which are incompatible with the new styles
 * overlayMenu must be "never" for drawer, and "always" for detached
 * openSubmenusOnClick must be TRUE for both
 */
const syncOptionsWithClass = createHigherOrderComponent(BlockEdit => {
  return props => {
    if (props.name !== 'core/navigation') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(BlockEdit, {
        ...props
      });
    }
    const {
      attributes,
      setAttributes
    } = props;
    const {
      className,
      overlayMenu,
      openSubmenusOnClick
    } = attributes;
    const hasDrawerStyle = className?.includes('is-style-drawer');
    const hasDetachedStyle = className?.includes('is-style-detached');
    useEffect(() => {
      // Upon selecting either of these styles, the relevant options are selected
      if (hasDrawerStyle) {
        setAttributes({
          openSubmenusOnClick: true
        });
        setAttributes({
          overlayMenu: "never"
        });
      }
      if (hasDetachedStyle) {
        setAttributes({
          openSubmenusOnClick: true
        });
        setAttributes({
          overlayMenu: "always"
        });
      }
    }, [hasDrawerStyle, hasDetachedStyle]);
    useEffect(() => {
      //Upon changing the submenu behaviour once one of the styles has been selected
      if (!openSubmenusOnClick && (hasDrawerStyle || hasDetachedStyle)) {
        // Revert toggle
        setAttributes({
          openSubmenusOnClick: true
        });
      }

      //Upon changing the overlay
      if (hasDrawerStyle && overlayMenu != "never") {
        setAttributes({
          overlayMenu: "never"
        });
      }
      if (hasDetachedStyle && overlayMenu != "always") {
        setAttributes({
          overlayMenu: "always"
        });
      }
    }, [overlayMenu, openSubmenusOnClick]);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(BlockEdit, {
      ...props
    });
  };
}, 'syncOptionsWithClass');
wp.hooks.addFilter('editor.BlockEdit', 'website-builder-blocks/sync-toggle', syncOptionsWithClass);

/***/ },

/***/ "./src/extended-core-blocks/post-date/index.jsx"
/*!******************************************************!*\
  !*** ./src/extended-core-blocks/post-date/index.jsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






/**
 * Extend core/post-date with the attributes
 *
 * - hasPrefix: a marker to identify if block should have prefix input,
 *   and if the block should render with the prefix class.
 * - prefix: the text to prefix the date with.
 */

const addAttributes = (settings, name) => {
  if (name !== "core/post-date") {
    return settings;
  }
  settings.attributes = {
    ...settings.attributes,
    hasPrefix: {
      type: "boolean",
      default: false
    },
    prefix: {
      type: "string",
      default: ""
    }
  };
  return settings;
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)("blocks.registerBlockType", "wb_blocks/post-date-extend-attributes", addAttributes);

/**
 * Inject inline editable prefix via BlockEdit.
 * Uses useBlockProps to become the block wrapper, containing both prefix and date.
 */
const BlockWithPrefix = props => {
  const {
    attributes: {
      hasPrefix = false,
      prefix = ''
    },
    setAttributes,
    variationIsModified = false
  } = props;
  const wrapperRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);

  // Clean up the inner BlockEdit's wrapper element.
  // BlockEdit calls useBlockProps() internally, creating a nested block wrapper
  // with duplicate id, role, aria-label, data-block, and draggable attributes.
  // We strip these to produce valid HTML and prevent drag/selection conflicts.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)(() => {
    const inner = wrapperRef.current?.querySelector(":scope > [data-block]");
    if (inner) {
      // Remove the inner block attributes, they are now on the wrapper block.
      inner.removeAttribute("id");
      inner.removeAttribute("tabindex");
      inner.removeAttribute('role');
      inner.removeAttribute('aria-label');
      inner.setAttribute("draggable", "false");
    }
  }, []);

  // Keep track of initial value for variation.
  const prev = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(variationIsModified);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    // If the user changes the variation (e.g. from Post Date to Modified Date),
    // clear the prefix, otherwise we could end up with a misleading value.
    if (prev.current !== variationIsModified) {
      setAttributes({
        prefix: ''
      });
      prev.current = variationIsModified;
    }
  }, [variationIsModified, setAttributes]);

  // Get block props - this makes our div the block wrapper
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    ref: wrapperRef,
    className: hasPrefix ? "wp-block-post-date--has-prefix" : undefined
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...blockProps,
    children: [hasPrefix && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
      tagName: "span",
      className: "wp-block-post-date__prefix",
      value: prefix,
      onChange: value => setAttributes({
        prefix: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Prefix…", "wb_blocks"),
      allowedFormats: ["core/bold", "core/italic"],
      disableLineBreaks: true
    }), props.children]
  });
};

/**
 * Filter the Post Date block
 * - Call the custom component that wraps the original BlockEdit.
 * - Render a toggle in the block sidebar.
 */
const addPrefixControl = BlockEdit => props => {
  if (props.name !== "core/post-date") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockEdit, {
      ...props
    });
  }
  const {
    attributes: {
      hasPrefix = false
    },
    setAttributes
  } = props;
  const variationIsModified = props.attributes?.metadata?.bindings?.datetime?.args?.field === 'modified';
  const examplePrefix = variationIsModified ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Updated', 'wb_blocks') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Published', 'wb_blocks');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockWithPrefix, {
      attributes: props.attributes,
      setAttributes: props.setAttributes,
      variationIsModified: variationIsModified,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockEdit, {
        ...props
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Date prefix', 'wb_blocks'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Show prefix before date', 'wb_blocks'),
            checked: hasPrefix,
            onChange: () => setAttributes({
              hasPrefix: !hasPrefix
            }),
            help: hasPrefix ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Type the prefix inline before the date (e.g., %s).', 'wb_blocks'), examplePrefix) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Adds text (e.g. %s) before the post date.', 'wb_blocks'), examplePrefix)
          })
        })
      })
    })]
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)("editor.BlockEdit", "wb_blocks/post-date-prefix-controls", addPrefixControl);

/***/ },

/***/ "./src/extended-core-blocks/query-pagination-numbers/index.jsx"
/*!*********************************************************************!*\
  !*** ./src/extended-core-blocks/query-pagination-numbers/index.jsx ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WbPreviewWrapper: () => (/* binding */ WbPreviewWrapper)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Page %1$d of %2$d
 *   -> Page <b>%1$d</b> of <b>%2$d</b>
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockStyle)("core/query-pagination-numbers", {
  name: "bold-numbers",
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)("Bold numbers", "wb_blocks")
});

/**
 * Extend core/query-total with the attribute displayType
 *
 * displayType (string)
 * - 'page-links' is the default & original display type
 *   where there are numbers for each page, and they are links.
 * - 'current-of-total' is a custom display type
 *   where the phrase 'Page X of Y' is shown, without any links.
 */
const addAttributes = (settings, name) => {
  if (name !== "core/query-pagination-numbers") {
    return settings;
  }
  settings.attributes = {
    ...settings.attributes,
    displayType: {
      type: "string",
      default: "page-links"
    }
  };
  return settings;
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)("blocks.registerBlockType", "wb_blocks/query-pagination-numbers-extend-attributes", addAttributes);

/**
 * Register block variations
 *
 * Since we don't have any variations, create a default one too.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)("core/query-pagination-numbers", {
  name: "page-links-query-pagination-numbers",
  title: "WordPress page numbers",
  description: "Default WordPress page numbers",
  attributes: {
    displayType: "page-links"
  },
  scope: ["transform"],
  isDefault: true,
  isActive: blockAttributes => blockAttributes?.displayType !== "current-of-total"
});
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)("core/query-pagination-numbers", {
  name: "current-of-total-query-pagination-numbers",
  title: "Simple page numbers",
  description: "Page numbers in the format of: Page x of y",
  attributes: {
    displayType: "current-of-total"
  },
  scope: ["transform"],
  isActive: blockAttributes => blockAttributes?.displayType === "current-of-total"
});

/**
 * Handle the custom display type of current-of-total
 */
const handleDisplayTypes = BlockEdit => props => {
  if (props.name !== "core/query-pagination-numbers") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(BlockEdit, {
      ...props
    });
  }
  const attributes = props.attributes || {};

  // Check the display type
  if (attributes.displayType !== "current-of-total") {
    // Do nothing if it is set to anything other than current-of-total
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(BlockEdit, {
      ...props
    });
  }

  // Here, the displayType is set to current-of-total

  // Infer from the className, should the numbers be bold?
  const classArray = attributes?.className?.split(" ") ?? [];
  const isStyleBoldNumbers = classArray.includes("is-style-bold-numbers");

  // Start to build the string for the preview.
  let previewTranslation = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)("Page %1$d of %2$d");
  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$d)/g, "<b>$1</b>");
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(WbPreviewWrapper, {
    blockName: props.name,
    className: attributes?.className ?? '',
    label: "Block: Simple page numbers",
    previewHtml: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.sprintf)(previewTranslation, 1, 2),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(BlockEdit, {
      ...props,
      ariaHidden: true
    })
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)("editor.BlockEdit", "website-builder-blocks/query-pagination-numbers", handleDisplayTypes);

/**
 * The block that is rendered in the editor canvas.
 *
 * A wrap around the original block that lets us show our own preview html,
 * without losing the original block's toolbar controls.
 *
 * This element is styled in editor.scss
 *
 * NOTE: This function is very similar to CustomBlockWrapper in
 * src/extended-core-blocks/query-total/index.jsx
 * If another extended core block needs this functionality, then consider:
 * - moving WbPreviewWrapper into it's own file
 * - using it as an abstraction that's compatible with all blocks
 */
const WbPreviewWrapper = ({
  blockName,
  children,
  className,
  label,
  previewHtml
}) => {
  const variant = blockName.replace(/\//g, "-").replace(/^core-/, "");

  // Wrapper element, set initial opacity to 0, to avoid FOUC - the user seeing the original block.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: `wb-preview-wrap wb-preview-wrap--${variant}`,
    style: {
      opacity: 0
    },
    children: [children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.RawHTML, {
      className: `wb-preview-wrap__preview ${(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.getBlockDefaultClassName)(blockName)} ${className}`
      // Properties from the original block
      ,
      "aria-label": label,
      role: "document"
      // Set initial display to none, to avoid layout shift, when css loads.
      ,
      style: {
        display: "none"
      },
      children: previewHtml
    })]
  });
};

/***/ },

/***/ "./src/extended-core-blocks/query-pagination/index.jsx"
/*!*************************************************************!*\
  !*** ./src/extended-core-blocks/query-pagination/index.jsx ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








/**
 * Register our custom block style.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockStyle)("core/query-pagination", {
  name: "centred-on-mobile",
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Centred on mobile", "wb_blocks")
});

/**
 * Add gap control with spacing presets to query-pagination block
 */
const withQueryPaginationGapControl = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    if (props.name !== "core/query-pagination") {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
        ...props
      });
    }

    // Guard against missing component
    if (!_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.__experimentalSpacingSizesControl) {
      console.warn("SpacingSizesControl not available");
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
        ...props
      });
    }
    const currentGap = props.attributes.style?.spacing?.blockGap;
    const updateGap = newValues => {
      // SpacingSizesControl returns an object, extract the 'left' value as shorthand
      const newGap = newValues?.left || undefined;
      props.setAttributes({
        style: {
          ...props.attributes.style,
          spacing: {
            ...props.attributes.style?.spacing,
            blockGap: newGap
          }
        }
      });
    };
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
        group: "styles",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Dimensions"),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.__experimentalSpacingSizesControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Block spacing"),
            values: {
              left: currentGap,
              right: currentGap
            },
            onChange: updateGap,
            sides: ["horizontal"],
            showSideInLabel: false,
            allowReset: true
          })
        })
      })]
    });
  };
}, "withQueryPaginationGapControl");
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__.addFilter)("editor.BlockEdit", "wb_blocks/query-pagination-gap-control", withQueryPaginationGapControl);

/***/ },

/***/ "./src/extended-core-blocks/query-total/FormatPicker.jsx"
/*!***************************************************************!*\
  !*** ./src/extended-core-blocks/query-total/FormatPicker.jsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryRangeFormatPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * This component takes strong influence from WordPress's DateFormatPicker component.
 *
 * The `QueryRangeFormatPicker` component renders controls that let the user choose a
 * _phrase format_. That is, how they want their query range to be formatted.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/date-format-picker/index.js
 */

function QueryRangeFormatPicker({
  rangeFormatSingle,
  rangeFormatMulti,
  defaultFormatSingle,
  defaultFormatRange,
  onChange
}) {
  const checked = rangeFormatSingle === null && rangeFormatMulti === null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalVStack, {
    as: "fieldset",
    spacing: 4,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.VisuallyHidden, {
      as: "legend",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Query range format")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Default format"),
      help: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Example:")}  ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(defaultFormatRange, 1, 10, 12))}`,
      checked: checked,
      onChange: checked => onChange({
        rangeFormatSingle: checked ? null : defaultFormatSingle,
        rangeFormatMulti: checked ? null : defaultFormatRange
      }),
      __nextHasNoMarginBottom: true
    }), !checked && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(NonDefaultControls, {
      rangeFormatSingle: rangeFormatSingle,
      rangeFormatMulti: rangeFormatMulti,
      onChange: onChange
    })]
  });
}
function NonDefaultControls({
  rangeFormatSingle,
  rangeFormatMulti,
  onChange
}) {
  const defaultOptions = [{
    key: 1,
    formatSingle: "Displaying %1$s of %2$s",
    formatRange: "Displaying %1$s – %2$s of %3$s",
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Displaying %1$s – %2$s of %3$s", "wb_blocks"), "1", "10", "12")
  }, {
    key: 2,
    formatSingle: "Showing %1$s of %2$s results",
    formatRange: "Showing %1$s to %2$s of %3$s results",
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Showing %1$s to %2$s of %3$s results", "wb_blocks"), "1", "10", "12")
  }];

  // Filter out duplicates based on name
  const suggestedOptions = defaultOptions.filter((obj1, i, arr) => arr.findIndex(obj2 => obj2.name === obj1.name) === i);
  const customOption = {
    key: "custom",
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Custom"),
    style: {
      borderTop: "1px solid #ddd"
    },
    hint: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Enter your own phrase format", "wb_blocks")
  };
  const [isCustom, setIsCustom] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(() => !!rangeFormatSingle && !!rangeFormatMulti && !suggestedOptions.some(o => o.formatSingle === rangeFormatSingle && o.formatRange === rangeFormatMulti));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalVStack, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CustomSelectControl, {
      __next40pxDefaultSize: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Choose a format"),
      options: [...suggestedOptions, customOption],
      value: isCustom ? customOption : suggestedOptions.find(option => option.formatSingle === rangeFormatSingle && option.formatRange === rangeFormatMulti) ?? customOption,
      onChange: ({
        selectedItem
      }) => {
        if (selectedItem === customOption) {
          setIsCustom(true);
          // Reset the values to the first default option
          onChange({
            rangeFormatSingle: suggestedOptions[0].formatSingle,
            rangeFormatMulti: suggestedOptions[0].formatRange
          });
        } else {
          setIsCustom(false);
          onChange({
            rangeFormatSingle: selectedItem.formatSingle,
            rangeFormatMulti: selectedItem.formatRange
          });
        }
      }
    }), isCustom && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextareaControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Single item format", "wb_blocks"),
        help: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Use placeholders: %1$s (index), %2$s (total).", "wb_blocks")} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("For bold text use tags: <b> & </b>.", "wb_blocks")}`,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Displaying %1$s of %2$s", "wb_blocks"),
        value: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(rangeFormatSingle, "wb_blocks"),
        onChange: value => onChange({
          rangeFormatSingle: value,
          rangeFormatMulti
        }),
        rows: 2,
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextareaControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Range format", "wb_blocks"),
        help: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Use placeholders: %1$s (start), %2$s (end), %3$s (total).", "wb_blocks")} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("For bold text use tags: <b> & </b>.", "wb_blocks")}`,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Displaying %1$s – %2$s of %3$s", "wb_blocks"),
        value: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(rangeFormatMulti, "wb_blocks"),
        onChange: value => onChange({
          rangeFormatSingle,
          rangeFormatMulti: value
        }),
        rows: 2,
        __nextHasNoMarginBottom: true
      })]
    })]
  });
}

/***/ },

/***/ "./src/extended-core-blocks/query-total/index.jsx"
/*!********************************************************!*\
  !*** ./src/extended-core-blocks/query-total/index.jsx ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _FormatPicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FormatPicker */ "./src/extended-core-blocks/query-total/FormatPicker.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Displaying %1$s - %2$s of %3$s
 *   -> Displaying <b>%1$s</b> - <b>%2$s</b> of <b>%3$s</b>
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockStyle)("core/query-total", {
  name: "bold-numbers",
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Bold numbers", "wb_blocks")
});

/**
 * Extend core/query-total with the attribute
 *
 * - rangeFormatSingle (string): The format for the page range
 *   when there is a single entry e.g. "Displaying %1$s of %2$s"
 * - rangeFormatMulti  (string): The format for the page range
 *   when there are multiple results e.g. "Displaying %1$s – %2$s of %3$s"
 */
const addAttributes = (settings, name) => {
  if (name !== "core/query-total") {
    return settings;
  }
  settings.attributes = {
    ...settings.attributes,
    showWhenNoResults: {
      type: "boolean",
      default: false
    },
    rangeFormatSingle: {
      type: "string",
      default: null
    },
    rangeFormatMulti: {
      type: "string",
      default: null
    }
  };
  return settings;
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__.addFilter)("blocks.registerBlockType", "wb_blocks/query-total-extend-attributes", addAttributes);

/**
 * Custom TotalResults component for preview
 *
 * This is a minor change from the original block,
 * all we do here is wrap the number in b tags
 * if the bold-numbers style is active.
 */
const TotalResults = ({
  showWhenNoResults,
  isStyleBoldNumbers,
  setAttributes,
  children
}) => {
  // Translate the phrase with the number, that's what WP does.
  let previewHtml = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("12 results found");
  if (isStyleBoldNumbers) {
    // Lets add b tags round the number.
    previewHtml = previewHtml.replace("12", "<b>12</b>");
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CustomBlockWrapper, {
      previewHtml: previewHtml,
      children: children
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Settings"),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Show when no results", "wb_blocks"),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Display this block when a query returns no results", "wb_blocks"),
            checked: showWhenNoResults,
            onChange: showWhenNoResults => setAttributes({
              showWhenNoResults
            })
          })
        })
      })
    })]
  });
};

/**
 * Custom RangeDisplay component
 *
 * This component:
 * 1. Lets us preview the changes to custom format or style
 * 2. Adds controls to the right side bar for the user to select from
 *    preset formats or a custom format.
 */
const RangeDisplay = ({
  showWhenNoResults,
  rangeFormatSingle,
  rangeFormatMulti,
  isStyleBoldNumbers,
  setAttributes,
  children
}) => {
  // Generate the string for the editor canvas preview.
  // Fallback to core's default format strings if attribute from block is empty.
  const formatRange = rangeFormatMulti ? sanitizeHtml(rangeFormatMulti, ["b"]) : "Displaying %1$s – %2$s of %3$s";
  // Translate the phrase, before number substitution.
  let previewTranslation = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)(formatRange, "wb_blocks");
  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$s)/g, "<b>$1</b>");
  }

  // Substitute numbers into the string.
  const previewHtml = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.sprintf)(previewTranslation, 1, 10, 12);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CustomBlockWrapper, {
      previewHtml: previewHtml,
      children: children
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Settings"),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalVStack, {
            spacing: "10",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_FormatPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
              rangeFormatSingle: rangeFormatSingle,
              rangeFormatMulti: rangeFormatMulti,
              defaultFormatSingle: "Displaying %1$s of %2$s",
              defaultFormatRange: "Displaying %1$s \u2013 %2$s of %3$s",
              onChange: ({
                rangeFormatSingle,
                rangeFormatMulti
              }) => setAttributes({
                rangeFormatSingle,
                rangeFormatMulti
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Show when no results", "wb_blocks"),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Display this block when a query returns no results", "wb_blocks"),
              checked: showWhenNoResults,
              onChange: showWhenNoResults => setAttributes({
                showWhenNoResults
              })
            })]
          })
        })
      })
    })]
  });
};

/**
 * Filter the Query Total block
 * - Call the custom component that wraps the original BlockEdit.
 * - Render a toggle in the block sidebar.
 */
const addFormatControl = BlockEdit => props => {
  if (props.name !== "core/query-total") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
      ...props
    });
  }

  // Infer from the className, should the numbers be bold.
  const isStyleBoldNumbers = props.attributes?.className?.split(" ").includes("is-style-bold-numbers");
  const showWhenNoResults = !!props.attributes?.showWhenNoResults;
  if (props.attributes.displayType === "total-results") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TotalResults, {
      showWhenNoResults: showWhenNoResults,
      isStyleBoldNumbers: isStyleBoldNumbers,
      setAttributes: props.setAttributes,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
        ...props
      })
    });
  }

  // We only want to customize the range-display type.
  if (props.attributes.displayType === "range-display") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(RangeDisplay, {
      showWhenNoResults: showWhenNoResults,
      isStyleBoldNumbers: isStyleBoldNumbers,
      rangeFormatSingle: props.attributes.rangeFormatSingle ?? null,
      rangeFormatMulti: props.attributes.rangeFormatMulti ?? null,
      setAttributes: props.setAttributes,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
        ...props
      })
    });
  }

  // For some reason, the display type is not total-results or range-display, return BlockEdit, unmodified.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BlockEdit, {
    ...props
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__.addFilter)("editor.BlockEdit", "wb_blocks/query-total-format-controls", addFormatControl);

/**
 * The block that is rendered in the editor canvas.
 *
 * A wrap around the original block that lets us show our own preview html,
 * without losing the original block's toolbar controls.
 *
 * This element is styled in editor.scss
 *
 * NOTE: This function is very similar to WbPreviewWrapper in
 * src/extended-core-blocks/query-pagination-numbers/index.jsx
 * If another extended core block needs this functionality, then consider:
 * - moving WbPreviewWrapper into it's own file
 * - using it as an abstraction that's compatible with all blocks
 */
const CustomBlockWrapper = ({
  children,
  previewHtml
}) => {
  // Wrapper element, set initial opacity to 0, to avoid FOUC - the user seeing the original block.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "wb-query-total__editor-wrap",
    style: {
      opacity: 0
    },
    children: [children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.RawHTML, {
      className: "wb-query-total__preview"
      // Properties from the original block
      ,
      "aria-label": "Block: Query Total",
      role: "document",
      children: previewHtml
    })]
  });
};

/**
 * Sanitize user input - for the preview of custom format option
 *
 * @param {string} input Unsanitized input
 * @param {string[]} allowedTags An array of allowed tags
 * @returns {string|null} The sanitized value
 */
const sanitizeHtml = (input, allowedTags = []) => {
  if (typeof input !== "string" && !input instanceof String) {
    return null;
  }

  // Normalize allowed tags to lowercase for easy comparison
  const allowed = new Set(Array.isArray(allowedTags) ? allowedTags.map(t => t.toLowerCase()) : [allowedTags.toLowerCase()]);
  const doc = new DOMParser().parseFromString(input, "text/html");
  function clean(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (!allowed.has(tag)) {
          // Replace the disallowed element with its text content
          const text = document.createTextNode(child.textContent);
          child.replaceWith(text);
        } else {
          // Recurse into allowed elements to clean their children
          clean(child);
        }
      }
    });
  }
  clean(doc.body);
  return doc.body.innerHTML;
};

/***/ },

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var reactIs = __webpack_require__(/*! react-is */ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ },

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js"
/*!************************************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************************************************/
(__unused_webpack_module, exports) {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ },

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/index.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js");
}


/***/ },

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js"
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoizeOne)
/* harmony export */ });
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var cache = null;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
            return cache.lastResult;
        }
        var lastResult = resultFn.apply(this, newArgs);
        cache = {
            lastResult: lastResult,
            lastArgs: newArgs,
            lastThis: this,
        };
        return lastResult;
    }
    memoized.clear = function clear() {
        cache = null;
    };
    return memoized;
}




/***/ },

/***/ "./node_modules/react-select/dist/Select-ef7c0426.esm.js"
/*!***************************************************************!*\
  !*** ./node_modules/react-select/dist/Select-ef7c0426.esm.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ Select),
/* harmony export */   a: () => (/* binding */ defaultProps),
/* harmony export */   b: () => (/* binding */ getOptionLabel$1),
/* harmony export */   c: () => (/* binding */ createFilter),
/* harmony export */   d: () => (/* binding */ defaultTheme),
/* harmony export */   g: () => (/* binding */ getOptionValue$1),
/* harmony export */   m: () => (/* binding */ mergeStyles)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createSuper */ "./node_modules/@babel/runtime/helpers/esm/createSuper.js");
/* harmony import */ var _babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index-641ee5b8.esm.js */ "./node_modules/react-select/dist/index-641ee5b8.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js");
/* harmony import */ var memoize_one__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");














function _EMOTION_STRINGIFIED_CSS_ERROR__$2() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

// Assistive text to describe visual elements. Hidden for sighted users.
var _ref =  false ? 0 : {
  name: "1f43avz-a11yText-A11yText",
  styles: "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap;label:A11yText;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkExMXlUZXh0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPSSIsImZpbGUiOiJBMTF5VGV4dC50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCB7IEpTWCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGpzeCB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuLy8gQXNzaXN0aXZlIHRleHQgdG8gZGVzY3JpYmUgdmlzdWFsIGVsZW1lbnRzLiBIaWRkZW4gZm9yIHNpZ2h0ZWQgdXNlcnMuXG5jb25zdCBBMTF5VGV4dCA9IChwcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ10pID0+IChcbiAgPHNwYW5cbiAgICBjc3M9e3tcbiAgICAgIGxhYmVsOiAnYTExeVRleHQnLFxuICAgICAgekluZGV4OiA5OTk5LFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgY2xpcDogJ3JlY3QoMXB4LCAxcHgsIDFweCwgMXB4KScsXG4gICAgICBoZWlnaHQ6IDEsXG4gICAgICB3aWR0aDogMSxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcGFkZGluZzogMCxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgQTExeVRleHQ7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__$2
};
var A11yText = function A11yText(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _ref
  }, props));
};
var A11yText$1 = A11yText;

var defaultAriaLiveMessages = {
  guidance: function guidance(props) {
    var isSearchable = props.isSearchable,
      isMulti = props.isMulti,
      tabSelectsValue = props.tabSelectsValue,
      context = props.context,
      isInitialFocus = props.isInitialFocus;
    switch (context) {
      case 'menu':
        return "Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu".concat(tabSelectsValue ? ', press Tab to select the option and exit the menu' : '', ".");
      case 'input':
        return isInitialFocus ? "".concat(props['aria-label'] || 'Select', " is focused ").concat(isSearchable ? ',type to refine list' : '', ", press Down to open the menu, ").concat(isMulti ? ' press left to focus selected values' : '') : '';
      case 'value':
        return 'Use left and right to toggle between focused values, press Backspace to remove the currently focused value';
      default:
        return '';
    }
  },
  onChange: function onChange(props) {
    var action = props.action,
      _props$label = props.label,
      label = _props$label === void 0 ? '' : _props$label,
      labels = props.labels,
      isDisabled = props.isDisabled;
    switch (action) {
      case 'deselect-option':
      case 'pop-value':
      case 'remove-value':
        return "option ".concat(label, ", deselected.");
      case 'clear':
        return 'All selected options have been cleared.';
      case 'initial-input-focus':
        return "option".concat(labels.length > 1 ? 's' : '', " ").concat(labels.join(','), ", selected.");
      case 'select-option':
        return isDisabled ? "option ".concat(label, " is disabled. Select another option.") : "option ".concat(label, ", selected.");
      default:
        return '';
    }
  },
  onFocus: function onFocus(props) {
    var context = props.context,
      focused = props.focused,
      options = props.options,
      _props$label2 = props.label,
      label = _props$label2 === void 0 ? '' : _props$label2,
      selectValue = props.selectValue,
      isDisabled = props.isDisabled,
      isSelected = props.isSelected,
      isAppleDevice = props.isAppleDevice;
    var getArrayIndex = function getArrayIndex(arr, item) {
      return arr && arr.length ? "".concat(arr.indexOf(item) + 1, " of ").concat(arr.length) : '';
    };
    if (context === 'value' && selectValue) {
      return "value ".concat(label, " focused, ").concat(getArrayIndex(selectValue, focused), ".");
    }
    if (context === 'menu' && isAppleDevice) {
      var disabled = isDisabled ? ' disabled' : '';
      var status = "".concat(isSelected ? ' selected' : '').concat(disabled);
      return "".concat(label).concat(status, ", ").concat(getArrayIndex(options, focused), ".");
    }
    return '';
  },
  onFilter: function onFilter(props) {
    var inputValue = props.inputValue,
      resultsMessage = props.resultsMessage;
    return "".concat(resultsMessage).concat(inputValue ? ' for search term ' + inputValue : '', ".");
  }
};

var LiveRegion = function LiveRegion(props) {
  var ariaSelection = props.ariaSelection,
    focusedOption = props.focusedOption,
    focusedValue = props.focusedValue,
    focusableOptions = props.focusableOptions,
    isFocused = props.isFocused,
    selectValue = props.selectValue,
    selectProps = props.selectProps,
    id = props.id,
    isAppleDevice = props.isAppleDevice;
  var ariaLiveMessages = selectProps.ariaLiveMessages,
    getOptionLabel = selectProps.getOptionLabel,
    inputValue = selectProps.inputValue,
    isMulti = selectProps.isMulti,
    isOptionDisabled = selectProps.isOptionDisabled,
    isSearchable = selectProps.isSearchable,
    menuIsOpen = selectProps.menuIsOpen,
    options = selectProps.options,
    screenReaderStatus = selectProps.screenReaderStatus,
    tabSelectsValue = selectProps.tabSelectsValue,
    isLoading = selectProps.isLoading;
  var ariaLabel = selectProps['aria-label'];
  var ariaLive = selectProps['aria-live'];

  // Update aria live message configuration when prop changes
  var messages = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultAriaLiveMessages), ariaLiveMessages || {});
  }, [ariaLiveMessages]);

  // Update aria live selected option when prop changes
  var ariaSelected = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var message = '';
    if (ariaSelection && messages.onChange) {
      var option = ariaSelection.option,
        selectedOptions = ariaSelection.options,
        removedValue = ariaSelection.removedValue,
        removedValues = ariaSelection.removedValues,
        value = ariaSelection.value;
      // select-option when !isMulti does not return option so we assume selected option is value
      var asOption = function asOption(val) {
        return !Array.isArray(val) ? val : null;
      };

      // If there is just one item from the action then get its label
      var selected = removedValue || option || asOption(value);
      var label = selected ? getOptionLabel(selected) : '';

      // If there are multiple items from the action then return an array of labels
      var multiSelected = selectedOptions || removedValues || undefined;
      var labels = multiSelected ? multiSelected.map(getOptionLabel) : [];
      var onChangeProps = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        // multiSelected items are usually items that have already been selected
        // or set by the user as a default value so we assume they are not disabled
        isDisabled: selected && isOptionDisabled(selected, selectValue),
        label: label,
        labels: labels
      }, ariaSelection);
      message = messages.onChange(onChangeProps);
    }
    return message;
  }, [ariaSelection, messages, isOptionDisabled, selectValue, getOptionLabel]);
  var ariaFocused = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var focusMsg = '';
    var focused = focusedOption || focusedValue;
    var isSelected = !!(focusedOption && selectValue && selectValue.includes(focusedOption));
    if (focused && messages.onFocus) {
      var onFocusProps = {
        focused: focused,
        label: getOptionLabel(focused),
        isDisabled: isOptionDisabled(focused, selectValue),
        isSelected: isSelected,
        options: focusableOptions,
        context: focused === focusedOption ? 'menu' : 'value',
        selectValue: selectValue,
        isAppleDevice: isAppleDevice
      };
      focusMsg = messages.onFocus(onFocusProps);
    }
    return focusMsg;
  }, [focusedOption, focusedValue, getOptionLabel, isOptionDisabled, messages, focusableOptions, selectValue, isAppleDevice]);
  var ariaResults = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var resultsMsg = '';
    if (menuIsOpen && options.length && !isLoading && messages.onFilter) {
      var resultsMessage = screenReaderStatus({
        count: focusableOptions.length
      });
      resultsMsg = messages.onFilter({
        inputValue: inputValue,
        resultsMessage: resultsMessage
      });
    }
    return resultsMsg;
  }, [focusableOptions, inputValue, menuIsOpen, messages, options, screenReaderStatus, isLoading]);
  var isInitialFocus = (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus';
  var ariaGuidance = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var guidanceMsg = '';
    if (messages.guidance) {
      var context = focusedValue ? 'value' : menuIsOpen ? 'menu' : 'input';
      guidanceMsg = messages.guidance({
        'aria-label': ariaLabel,
        context: context,
        isDisabled: focusedOption && isOptionDisabled(focusedOption, selectValue),
        isMulti: isMulti,
        isSearchable: isSearchable,
        tabSelectsValue: tabSelectsValue,
        isInitialFocus: isInitialFocus
      });
    }
    return guidanceMsg;
  }, [ariaLabel, focusedOption, focusedValue, isMulti, isOptionDisabled, isSearchable, menuIsOpen, messages, selectValue, tabSelectsValue, isInitialFocus]);
  var ScreenReaderText = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-selection"
  }, ariaSelected), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-focused"
  }, ariaFocused), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-results"
  }, ariaResults), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-guidance"
  }, ariaGuidance));
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(A11yText$1, {
    id: id
  }, isInitialFocus && ScreenReaderText), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(A11yText$1, {
    "aria-live": ariaLive,
    "aria-atomic": "false",
    "aria-relevant": "additions text",
    role: "log"
  }, isFocused && !isInitialFocus && ScreenReaderText));
};
var LiveRegion$1 = LiveRegion;

var diacritics = [{
  base: 'A',
  letters: "A\u24B6\uFF21\xC0\xC1\xC2\u1EA6\u1EA4\u1EAA\u1EA8\xC3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\xC4\u01DE\u1EA2\xC5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F"
}, {
  base: 'AA',
  letters: "\uA732"
}, {
  base: 'AE',
  letters: "\xC6\u01FC\u01E2"
}, {
  base: 'AO',
  letters: "\uA734"
}, {
  base: 'AU',
  letters: "\uA736"
}, {
  base: 'AV',
  letters: "\uA738\uA73A"
}, {
  base: 'AY',
  letters: "\uA73C"
}, {
  base: 'B',
  letters: "B\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181"
}, {
  base: 'C',
  letters: "C\u24B8\uFF23\u0106\u0108\u010A\u010C\xC7\u1E08\u0187\u023B\uA73E"
}, {
  base: 'D',
  letters: "D\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779"
}, {
  base: 'DZ',
  letters: "\u01F1\u01C4"
}, {
  base: 'Dz',
  letters: "\u01F2\u01C5"
}, {
  base: 'E',
  letters: "E\u24BA\uFF25\xC8\xC9\xCA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\xCB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E"
}, {
  base: 'F',
  letters: "F\u24BB\uFF26\u1E1E\u0191\uA77B"
}, {
  base: 'G',
  letters: "G\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E"
}, {
  base: 'H',
  letters: "H\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D"
}, {
  base: 'I',
  letters: "I\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197"
}, {
  base: 'J',
  letters: "J\u24BF\uFF2A\u0134\u0248"
}, {
  base: 'K',
  letters: "K\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2"
}, {
  base: 'L',
  letters: "L\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780"
}, {
  base: 'LJ',
  letters: "\u01C7"
}, {
  base: 'Lj',
  letters: "\u01C8"
}, {
  base: 'M',
  letters: "M\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C"
}, {
  base: 'N',
  letters: "N\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4"
}, {
  base: 'NJ',
  letters: "\u01CA"
}, {
  base: 'Nj',
  letters: "\u01CB"
}, {
  base: 'O',
  letters: "O\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C"
}, {
  base: 'OI',
  letters: "\u01A2"
}, {
  base: 'OO',
  letters: "\uA74E"
}, {
  base: 'OU',
  letters: "\u0222"
}, {
  base: 'P',
  letters: "P\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754"
}, {
  base: 'Q',
  letters: "Q\u24C6\uFF31\uA756\uA758\u024A"
}, {
  base: 'R',
  letters: "R\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782"
}, {
  base: 'S',
  letters: "S\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784"
}, {
  base: 'T',
  letters: "T\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786"
}, {
  base: 'TZ',
  letters: "\uA728"
}, {
  base: 'U',
  letters: "U\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244"
}, {
  base: 'V',
  letters: "V\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245"
}, {
  base: 'VY',
  letters: "\uA760"
}, {
  base: 'W',
  letters: "W\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72"
}, {
  base: 'X',
  letters: "X\u24CD\uFF38\u1E8A\u1E8C"
}, {
  base: 'Y',
  letters: "Y\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE"
}, {
  base: 'Z',
  letters: "Z\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762"
}, {
  base: 'a',
  letters: "a\u24D0\uFF41\u1E9A\xE0\xE1\xE2\u1EA7\u1EA5\u1EAB\u1EA9\xE3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\xE4\u01DF\u1EA3\xE5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250"
}, {
  base: 'aa',
  letters: "\uA733"
}, {
  base: 'ae',
  letters: "\xE6\u01FD\u01E3"
}, {
  base: 'ao',
  letters: "\uA735"
}, {
  base: 'au',
  letters: "\uA737"
}, {
  base: 'av',
  letters: "\uA739\uA73B"
}, {
  base: 'ay',
  letters: "\uA73D"
}, {
  base: 'b',
  letters: "b\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253"
}, {
  base: 'c',
  letters: "c\u24D2\uFF43\u0107\u0109\u010B\u010D\xE7\u1E09\u0188\u023C\uA73F\u2184"
}, {
  base: 'd',
  letters: "d\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A"
}, {
  base: 'dz',
  letters: "\u01F3\u01C6"
}, {
  base: 'e',
  letters: "e\u24D4\uFF45\xE8\xE9\xEA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\xEB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD"
}, {
  base: 'f',
  letters: "f\u24D5\uFF46\u1E1F\u0192\uA77C"
}, {
  base: 'g',
  letters: "g\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F"
}, {
  base: 'h',
  letters: "h\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265"
}, {
  base: 'hv',
  letters: "\u0195"
}, {
  base: 'i',
  letters: "i\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131"
}, {
  base: 'j',
  letters: "j\u24D9\uFF4A\u0135\u01F0\u0249"
}, {
  base: 'k',
  letters: "k\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3"
}, {
  base: 'l',
  letters: "l\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747"
}, {
  base: 'lj',
  letters: "\u01C9"
}, {
  base: 'm',
  letters: "m\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F"
}, {
  base: 'n',
  letters: "n\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5"
}, {
  base: 'nj',
  letters: "\u01CC"
}, {
  base: 'o',
  letters: "o\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\u0254\uA74B\uA74D\u0275"
}, {
  base: 'oi',
  letters: "\u01A3"
}, {
  base: 'ou',
  letters: "\u0223"
}, {
  base: 'oo',
  letters: "\uA74F"
}, {
  base: 'p',
  letters: "p\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755"
}, {
  base: 'q',
  letters: "q\u24E0\uFF51\u024B\uA757\uA759"
}, {
  base: 'r',
  letters: "r\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783"
}, {
  base: 's',
  letters: "s\u24E2\uFF53\xDF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B"
}, {
  base: 't',
  letters: "t\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787"
}, {
  base: 'tz',
  letters: "\uA729"
}, {
  base: 'u',
  letters: "u\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289"
}, {
  base: 'v',
  letters: "v\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C"
}, {
  base: 'vy',
  letters: "\uA761"
}, {
  base: 'w',
  letters: "w\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73"
}, {
  base: 'x',
  letters: "x\u24E7\uFF58\u1E8B\u1E8D"
}, {
  base: 'y',
  letters: "y\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF"
}, {
  base: 'z',
  letters: "z\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763"
}];
var anyDiacritic = new RegExp('[' + diacritics.map(function (d) {
  return d.letters;
}).join('') + ']', 'g');
var diacriticToBase = {};
for (var i = 0; i < diacritics.length; i++) {
  var diacritic = diacritics[i];
  for (var j = 0; j < diacritic.letters.length; j++) {
    diacriticToBase[diacritic.letters[j]] = diacritic.base;
  }
}
var stripDiacritics = function stripDiacritics(str) {
  return str.replace(anyDiacritic, function (match) {
    return diacriticToBase[match];
  });
};

var memoizedStripDiacriticsForInput = (0,memoize_one__WEBPACK_IMPORTED_MODULE_10__["default"])(stripDiacritics);
var trimString = function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
};
var defaultStringify = function defaultStringify(option) {
  return "".concat(option.label, " ").concat(option.value);
};
var createFilter = function createFilter(config) {
  return function (option, rawInput) {
    // eslint-disable-next-line no-underscore-dangle
    if (option.data.__isNew__) return true;
    var _ignoreCase$ignoreAcc = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        ignoreCase: true,
        ignoreAccents: true,
        stringify: defaultStringify,
        trim: true,
        matchFrom: 'any'
      }, config),
      ignoreCase = _ignoreCase$ignoreAcc.ignoreCase,
      ignoreAccents = _ignoreCase$ignoreAcc.ignoreAccents,
      stringify = _ignoreCase$ignoreAcc.stringify,
      trim = _ignoreCase$ignoreAcc.trim,
      matchFrom = _ignoreCase$ignoreAcc.matchFrom;
    var input = trim ? trimString(rawInput) : rawInput;
    var candidate = trim ? trimString(stringify(option)) : stringify(option);
    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }
    if (ignoreAccents) {
      input = memoizedStripDiacriticsForInput(input);
      candidate = stripDiacritics(candidate);
    }
    return matchFrom === 'start' ? candidate.substr(0, input.length) === input : candidate.indexOf(input) > -1;
  };
};

var _excluded = ["innerRef"];
function DummyInput(_ref) {
  var innerRef = _ref.innerRef,
    props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_11__["default"])(_ref, _excluded);
  // Remove animation props not meant for HTML elements
  var filteredProps = (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.r)(props, 'onExited', 'in', 'enter', 'exit', 'appear');
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: innerRef
  }, filteredProps, {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.css)({
      label: 'dummyInput',
      // get rid of any default styles
      background: 0,
      border: 0,
      // important! this hides the flashing cursor
      caretColor: 'transparent',
      fontSize: 'inherit',
      gridArea: '1 / 1 / 2 / 3',
      outline: 0,
      padding: 0,
      // important! without `width` browsers won't allow focus
      width: 1,
      // remove cursor on desktop
      color: 'transparent',
      // remove cursor on mobile whilst maintaining "scroll into view" behaviour
      left: -100,
      opacity: 0,
      position: 'relative',
      transform: 'scale(.01)'
    },  false ? 0 : ";label:DummyInput;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkR1bW15SW5wdXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCTSIsImZpbGUiOiJEdW1teUlucHV0LnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgSlNYLCBSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyByZW1vdmVQcm9wcyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRHVtbXlJbnB1dCh7XG4gIGlubmVyUmVmLFxuICAuLi5wcm9wc1xufTogSlNYLkludHJpbnNpY0VsZW1lbnRzWydpbnB1dCddICYge1xuICByZWFkb25seSBpbm5lclJlZjogUmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xufSkge1xuICAvLyBSZW1vdmUgYW5pbWF0aW9uIHByb3BzIG5vdCBtZWFudCBmb3IgSFRNTCBlbGVtZW50c1xuICBjb25zdCBmaWx0ZXJlZFByb3BzID0gcmVtb3ZlUHJvcHMoXG4gICAgcHJvcHMsXG4gICAgJ29uRXhpdGVkJyxcbiAgICAnaW4nLFxuICAgICdlbnRlcicsXG4gICAgJ2V4aXQnLFxuICAgICdhcHBlYXInXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8aW5wdXRcbiAgICAgIHJlZj17aW5uZXJSZWZ9XG4gICAgICB7Li4uZmlsdGVyZWRQcm9wc31cbiAgICAgIGNzcz17e1xuICAgICAgICBsYWJlbDogJ2R1bW15SW5wdXQnLFxuICAgICAgICAvLyBnZXQgcmlkIG9mIGFueSBkZWZhdWx0IHN0eWxlc1xuICAgICAgICBiYWNrZ3JvdW5kOiAwLFxuICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgIC8vIGltcG9ydGFudCEgdGhpcyBoaWRlcyB0aGUgZmxhc2hpbmcgY3Vyc29yXG4gICAgICAgIGNhcmV0Q29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGZvbnRTaXplOiAnaW5oZXJpdCcsXG4gICAgICAgIGdyaWRBcmVhOiAnMSAvIDEgLyAyIC8gMycsXG4gICAgICAgIG91dGxpbmU6IDAsXG4gICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgIC8vIGltcG9ydGFudCEgd2l0aG91dCBgd2lkdGhgIGJyb3dzZXJzIHdvbid0IGFsbG93IGZvY3VzXG4gICAgICAgIHdpZHRoOiAxLFxuXG4gICAgICAgIC8vIHJlbW92ZSBjdXJzb3Igb24gZGVza3RvcFxuICAgICAgICBjb2xvcjogJ3RyYW5zcGFyZW50JyxcblxuICAgICAgICAvLyByZW1vdmUgY3Vyc29yIG9uIG1vYmlsZSB3aGlsc3QgbWFpbnRhaW5pbmcgXCJzY3JvbGwgaW50byB2aWV3XCIgYmVoYXZpb3VyXG4gICAgICAgIGxlZnQ6IC0xMDAsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSguMDEpJyxcbiAgICAgIH19XG4gICAgLz5cbiAgKTtcbn1cbiJdfQ== */")
  }));
}

var cancelScroll = function cancelScroll(event) {
  if (event.cancelable) event.preventDefault();
  event.stopPropagation();
};
function useScrollCapture(_ref) {
  var isEnabled = _ref.isEnabled,
    onBottomArrive = _ref.onBottomArrive,
    onBottomLeave = _ref.onBottomLeave,
    onTopArrive = _ref.onTopArrive,
    onTopLeave = _ref.onTopLeave;
  var isBottom = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(false);
  var isTop = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(false);
  var touchStart = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(0);
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var handleEventDelta = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event, delta) {
    if (scrollTarget.current === null) return;
    var _scrollTarget$current = scrollTarget.current,
      scrollTop = _scrollTarget$current.scrollTop,
      scrollHeight = _scrollTarget$current.scrollHeight,
      clientHeight = _scrollTarget$current.clientHeight;
    var target = scrollTarget.current;
    var isDeltaPositive = delta > 0;
    var availableScroll = scrollHeight - clientHeight - scrollTop;
    var shouldCancelScroll = false;

    // reset bottom/top flags
    if (availableScroll > delta && isBottom.current) {
      if (onBottomLeave) onBottomLeave(event);
      isBottom.current = false;
    }
    if (isDeltaPositive && isTop.current) {
      if (onTopLeave) onTopLeave(event);
      isTop.current = false;
    }

    // bottom limit
    if (isDeltaPositive && delta > availableScroll) {
      if (onBottomArrive && !isBottom.current) {
        onBottomArrive(event);
      }
      target.scrollTop = scrollHeight;
      shouldCancelScroll = true;
      isBottom.current = true;

      // top limit
    } else if (!isDeltaPositive && -delta > scrollTop) {
      if (onTopArrive && !isTop.current) {
        onTopArrive(event);
      }
      target.scrollTop = 0;
      shouldCancelScroll = true;
      isTop.current = true;
    }

    // cancel scroll
    if (shouldCancelScroll) {
      cancelScroll(event);
    }
  }, [onBottomArrive, onBottomLeave, onTopArrive, onTopLeave]);
  var onWheel = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    handleEventDelta(event, event.deltaY);
  }, [handleEventDelta]);
  var onTouchStart = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    // set touch start so we can calculate touchmove delta
    touchStart.current = event.changedTouches[0].clientY;
  }, []);
  var onTouchMove = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    var deltaY = touchStart.current - event.changedTouches[0].clientY;
    handleEventDelta(event, deltaY);
  }, [handleEventDelta]);
  var startListening = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (el) {
    // bail early if no element is available to attach to
    if (!el) return;
    var notPassive = _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.s ? {
      passive: false
    } : false;
    el.addEventListener('wheel', onWheel, notPassive);
    el.addEventListener('touchstart', onTouchStart, notPassive);
    el.addEventListener('touchmove', onTouchMove, notPassive);
  }, [onTouchMove, onTouchStart, onWheel]);
  var stopListening = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (el) {
    // bail early if no element is available to detach from
    if (!el) return;
    el.removeEventListener('wheel', onWheel, false);
    el.removeEventListener('touchstart', onTouchStart, false);
    el.removeEventListener('touchmove', onTouchMove, false);
  }, [onTouchMove, onTouchStart, onWheel]);
  (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    startListening(element);
    return function () {
      stopListening(element);
    };
  }, [isEnabled, startListening, stopListening]);
  return function (element) {
    scrollTarget.current = element;
  };
}

var STYLE_KEYS = ['boxSizing', 'height', 'overflow', 'paddingRight', 'position'];
var LOCK_STYLES = {
  boxSizing: 'border-box',
  // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%'
};
function preventTouchMove(e) {
  if (e.cancelable) e.preventDefault();
}
function allowTouchMove(e) {
  e.stopPropagation();
}
function preventInertiaScroll() {
  var top = this.scrollTop;
  var totalScroll = this.scrollHeight;
  var currentScroll = top + this.offsetHeight;
  if (top === 0) {
    this.scrollTop = 1;
  } else if (currentScroll === totalScroll) {
    this.scrollTop = top - 1;
  }
}

// `ontouchstart` check works on most browsers
// `maxTouchPoints` works on IE10/11 and Surface
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var activeScrollLocks = 0;
var listenerOptions = {
  capture: false,
  passive: false
};
function useScrollLock(_ref) {
  var isEnabled = _ref.isEnabled,
    _ref$accountForScroll = _ref.accountForScrollbars,
    accountForScrollbars = _ref$accountForScroll === void 0 ? true : _ref$accountForScroll;
  var originalStyles = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)({});
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var addScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style;
    if (accountForScrollbars) {
      // store any styles already applied to the body
      STYLE_KEYS.forEach(function (key) {
        var val = targetStyle && targetStyle[key];
        originalStyles.current[key] = val;
      });
    }

    // apply the lock styles and padding if this is the first scroll lock
    if (accountForScrollbars && activeScrollLocks < 1) {
      var currentPadding = parseInt(originalStyles.current.paddingRight, 10) || 0;
      var clientWidth = document.body ? document.body.clientWidth : 0;
      var adjustedPadding = window.innerWidth - clientWidth + currentPadding || 0;
      Object.keys(LOCK_STYLES).forEach(function (key) {
        var val = LOCK_STYLES[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
      if (targetStyle) {
        targetStyle.paddingRight = "".concat(adjustedPadding, "px");
      }
    }

    // account for touch devices
    if (target && isTouchDevice()) {
      // Mobile Safari ignores { overflow: hidden } declaration on the body.
      target.addEventListener('touchmove', preventTouchMove, listenerOptions);

      // Allow scroll on provided target
      if (touchScrollTarget) {
        touchScrollTarget.addEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.addEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    }

    // increment active scroll locks
    activeScrollLocks += 1;
  }, [accountForScrollbars]);
  var removeScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style;

    // safely decrement active scroll locks
    activeScrollLocks = Math.max(activeScrollLocks - 1, 0);

    // reapply original body styles, if any
    if (accountForScrollbars && activeScrollLocks < 1) {
      STYLE_KEYS.forEach(function (key) {
        var val = originalStyles.current[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
    }

    // remove touch listeners
    if (target && isTouchDevice()) {
      target.removeEventListener('touchmove', preventTouchMove, listenerOptions);
      if (touchScrollTarget) {
        touchScrollTarget.removeEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.removeEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    }
  }, [accountForScrollbars]);
  (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    addScrollLock(element);
    return function () {
      removeScrollLock(element);
    };
  }, [isEnabled, addScrollLock, removeScrollLock]);
  return function (element) {
    scrollTarget.current = element;
  };
}

function _EMOTION_STRINGIFIED_CSS_ERROR__$1() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
var blurSelectInput = function blurSelectInput(event) {
  var element = event.target;
  return element.ownerDocument.activeElement && element.ownerDocument.activeElement.blur();
};
var _ref2$1 =  false ? 0 : {
  name: "bp8cua-ScrollManager",
  styles: "position:fixed;left:0;bottom:0;right:0;top:0;label:ScrollManager;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcm9sbE1hbmFnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW9EVSIsImZpbGUiOiJTY3JvbGxNYW5hZ2VyLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsganN4IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCwgUmVmQ2FsbGJhY2ssIE1vdXNlRXZlbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdXNlU2Nyb2xsQ2FwdHVyZSBmcm9tICcuL3VzZVNjcm9sbENhcHR1cmUnO1xuaW1wb3J0IHVzZVNjcm9sbExvY2sgZnJvbSAnLi91c2VTY3JvbGxMb2NrJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgcmVhZG9ubHkgY2hpbGRyZW46IChyZWY6IFJlZkNhbGxiYWNrPEhUTUxFbGVtZW50PikgPT4gUmVhY3RFbGVtZW50O1xuICByZWFkb25seSBsb2NrRW5hYmxlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgY2FwdHVyZUVuYWJsZWQ6IGJvb2xlYW47XG4gIHJlYWRvbmx5IG9uQm90dG9tQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Cb3R0b21MZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIHJlYWRvbmx5IG9uVG9wQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Ub3BMZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG59XG5cbmNvbnN0IGJsdXJTZWxlY3RJbnB1dCA9IChldmVudDogTW91c2VFdmVudDxIVE1MRGl2RWxlbWVudD4pID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRGl2RWxlbWVudDtcbiAgcmV0dXJuIChcbiAgICBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJlxuICAgIChlbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuYmx1cigpXG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTY3JvbGxNYW5hZ2VyKHtcbiAgY2hpbGRyZW4sXG4gIGxvY2tFbmFibGVkLFxuICBjYXB0dXJlRW5hYmxlZCA9IHRydWUsXG4gIG9uQm90dG9tQXJyaXZlLFxuICBvbkJvdHRvbUxlYXZlLFxuICBvblRvcEFycml2ZSxcbiAgb25Ub3BMZWF2ZSxcbn06IFByb3BzKSB7XG4gIGNvbnN0IHNldFNjcm9sbENhcHR1cmVUYXJnZXQgPSB1c2VTY3JvbGxDYXB0dXJlKHtcbiAgICBpc0VuYWJsZWQ6IGNhcHR1cmVFbmFibGVkLFxuICAgIG9uQm90dG9tQXJyaXZlLFxuICAgIG9uQm90dG9tTGVhdmUsXG4gICAgb25Ub3BBcnJpdmUsXG4gICAgb25Ub3BMZWF2ZSxcbiAgfSk7XG4gIGNvbnN0IHNldFNjcm9sbExvY2tUYXJnZXQgPSB1c2VTY3JvbGxMb2NrKHsgaXNFbmFibGVkOiBsb2NrRW5hYmxlZCB9KTtcblxuICBjb25zdCB0YXJnZXRSZWY6IFJlZkNhbGxiYWNrPEhUTUxFbGVtZW50PiA9IChlbGVtZW50KSA9PiB7XG4gICAgc2V0U2Nyb2xsQ2FwdHVyZVRhcmdldChlbGVtZW50KTtcbiAgICBzZXRTY3JvbGxMb2NrVGFyZ2V0KGVsZW1lbnQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEZyYWdtZW50PlxuICAgICAge2xvY2tFbmFibGVkICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9e2JsdXJTZWxlY3RJbnB1dH1cbiAgICAgICAgICBjc3M9e3sgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDAsIHRvcDogMCB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtjaGlsZHJlbih0YXJnZXRSZWYpfVxuICAgIDwvRnJhZ21lbnQ+XG4gICk7XG59XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__$1
};
function ScrollManager(_ref) {
  var children = _ref.children,
    lockEnabled = _ref.lockEnabled,
    _ref$captureEnabled = _ref.captureEnabled,
    captureEnabled = _ref$captureEnabled === void 0 ? true : _ref$captureEnabled,
    onBottomArrive = _ref.onBottomArrive,
    onBottomLeave = _ref.onBottomLeave,
    onTopArrive = _ref.onTopArrive,
    onTopLeave = _ref.onTopLeave;
  var setScrollCaptureTarget = useScrollCapture({
    isEnabled: captureEnabled,
    onBottomArrive: onBottomArrive,
    onBottomLeave: onBottomLeave,
    onTopArrive: onTopArrive,
    onTopLeave: onTopLeave
  });
  var setScrollLockTarget = useScrollLock({
    isEnabled: lockEnabled
  });
  var targetRef = function targetRef(element) {
    setScrollCaptureTarget(element);
    setScrollLockTarget(element);
  };
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, lockEnabled && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    onClick: blurSelectInput,
    css: _ref2$1
  }), children(targetRef));
}

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
var _ref2 =  false ? 0 : {
  name: "5kkxb2-requiredInput-RequiredInput",
  styles: "label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%;label:RequiredInput;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVpcmVkSW5wdXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNJIiwiZmlsZSI6IlJlcXVpcmVkSW5wdXQudHN4Iiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBGb2N1c0V2ZW50SGFuZGxlciwgRnVuY3Rpb25Db21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmNvbnN0IFJlcXVpcmVkSW5wdXQ6IEZ1bmN0aW9uQ29tcG9uZW50PHtcbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgb25Gb2N1czogRm9jdXNFdmVudEhhbmRsZXI8SFRNTElucHV0RWxlbWVudD47XG59PiA9ICh7IG5hbWUsIG9uRm9jdXMgfSkgPT4gKFxuICA8aW5wdXRcbiAgICByZXF1aXJlZFxuICAgIG5hbWU9e25hbWV9XG4gICAgdGFiSW5kZXg9ey0xfVxuICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICBjc3M9e3tcbiAgICAgIGxhYmVsOiAncmVxdWlyZWRJbnB1dCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3R0b206IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgIH19XG4gICAgLy8gUHJldmVudCBgU3dpdGNoaW5nIGZyb20gdW5jb250cm9sbGVkIHRvIGNvbnRyb2xsZWRgIGVycm9yXG4gICAgdmFsdWU9XCJcIlxuICAgIG9uQ2hhbmdlPXsoKSA9PiB7fX1cbiAgLz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFJlcXVpcmVkSW5wdXQ7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};
var RequiredInput = function RequiredInput(_ref) {
  var name = _ref.name,
    onFocus = _ref.onFocus;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
    required: true,
    name: name,
    tabIndex: -1,
    "aria-hidden": "true",
    onFocus: onFocus,
    css: _ref2
    // Prevent `Switching from uncontrolled to controlled` error
    ,
    value: "",
    onChange: function onChange() {}
  });
};
var RequiredInput$1 = RequiredInput;

/// <reference types="user-agent-data-types" />

function testPlatform(re) {
  var _window$navigator$use;
  return typeof window !== 'undefined' && window.navigator != null ? re.test(((_window$navigator$use = window.navigator['userAgentData']) === null || _window$navigator$use === void 0 ? void 0 : _window$navigator$use.platform) || window.navigator.platform) : false;
}
function isIPhone() {
  return testPlatform(/^iPhone/i);
}
function isMac() {
  return testPlatform(/^Mac/i);
}
function isIPad() {
  return testPlatform(/^iPad/i) ||
  // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function isAppleDevice() {
  return isMac() || isIOS();
}

var formatGroupLabel = function formatGroupLabel(group) {
  return group.label;
};
var getOptionLabel$1 = function getOptionLabel(option) {
  return option.label;
};
var getOptionValue$1 = function getOptionValue(option) {
  return option.value;
};
var isOptionDisabled = function isOptionDisabled(option) {
  return !!option.isDisabled;
};

var defaultStyles = {
  clearIndicator: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.a,
  container: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.b,
  control: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.d,
  dropdownIndicator: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.e,
  group: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.g,
  groupHeading: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.f,
  indicatorsContainer: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.i,
  indicatorSeparator: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.h,
  input: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.j,
  loadingIndicator: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.l,
  loadingMessage: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.k,
  menu: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.m,
  menuList: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.n,
  menuPortal: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.o,
  multiValue: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.p,
  multiValueLabel: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.q,
  multiValueRemove: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.t,
  noOptionsMessage: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.u,
  option: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.v,
  placeholder: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.w,
  singleValue: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.x,
  valueContainer: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.y
};
// Merge Utility
// Allows consumers to extend a base Select with additional styles

function mergeStyles(source) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // initialize with source styles
  var styles = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, source);

  // massage in target styles
  Object.keys(target).forEach(function (keyAsString) {
    var key = keyAsString;
    if (source[key]) {
      styles[key] = function (rsCss, props) {
        return target[key](source[key](rsCss, props), props);
      };
    } else {
      styles[key] = target[key];
    }
  });
  return styles;
}

var colors = {
  primary: '#2684FF',
  primary75: '#4C9AFF',
  primary50: '#B2D4FF',
  primary25: '#DEEBFF',
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)'
};
var borderRadius = 4;
// Used to calculate consistent margin/padding on elements
var baseUnit = 4;
// The minimum height of the control
var controlHeight = 38;
// The amount of space between the control and menu */
var menuGutter = baseUnit * 2;
var spacing = {
  baseUnit: baseUnit,
  controlHeight: controlHeight,
  menuGutter: menuGutter
};
var defaultTheme = {
  borderRadius: borderRadius,
  colors: colors,
  spacing: spacing
};

var defaultProps = {
  'aria-live': 'polite',
  backspaceRemovesValue: true,
  blurInputOnSelect: (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.z)(),
  captureMenuScroll: !(0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.z)(),
  classNames: {},
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabel,
  getOptionLabel: getOptionLabel$1,
  getOptionValue: getOptionValue$1,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !(0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.A)(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return "".concat(count, " result").concat(count !== 1 ? 's' : '', " available");
  },
  styles: {},
  tabIndex: 0,
  tabSelectsValue: true,
  unstyled: false
};
function toCategorizedOption(props, option, selectValue, index) {
  var isDisabled = _isOptionDisabled(props, option, selectValue);
  var isSelected = _isOptionSelected(props, option, selectValue);
  var label = getOptionLabel(props, option);
  var value = getOptionValue(props, option);
  return {
    type: 'option',
    data: option,
    isDisabled: isDisabled,
    isSelected: isSelected,
    label: label,
    value: value,
    index: index
  };
}
function buildCategorizedOptions(props, selectValue) {
  return props.options.map(function (groupOrOption, groupOrOptionIndex) {
    if ('options' in groupOrOption) {
      var categorizedOptions = groupOrOption.options.map(function (option, optionIndex) {
        return toCategorizedOption(props, option, selectValue, optionIndex);
      }).filter(function (categorizedOption) {
        return isFocusable(props, categorizedOption);
      });
      return categorizedOptions.length > 0 ? {
        type: 'group',
        data: groupOrOption,
        options: categorizedOptions,
        index: groupOrOptionIndex
      } : undefined;
    }
    var categorizedOption = toCategorizedOption(props, groupOrOption, selectValue, groupOrOptionIndex);
    return isFocusable(props, categorizedOption) ? categorizedOption : undefined;
  }).filter(_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.K);
}
function buildFocusableOptionsFromCategorizedOptions(categorizedOptions) {
  return categorizedOptions.reduce(function (optionsAccumulator, categorizedOption) {
    if (categorizedOption.type === 'group') {
      optionsAccumulator.push.apply(optionsAccumulator, (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(categorizedOption.options.map(function (option) {
        return option.data;
      })));
    } else {
      optionsAccumulator.push(categorizedOption.data);
    }
    return optionsAccumulator;
  }, []);
}
function buildFocusableOptionsWithIds(categorizedOptions, optionId) {
  return categorizedOptions.reduce(function (optionsAccumulator, categorizedOption) {
    if (categorizedOption.type === 'group') {
      optionsAccumulator.push.apply(optionsAccumulator, (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(categorizedOption.options.map(function (option) {
        return {
          data: option.data,
          id: "".concat(optionId, "-").concat(categorizedOption.index, "-").concat(option.index)
        };
      })));
    } else {
      optionsAccumulator.push({
        data: categorizedOption.data,
        id: "".concat(optionId, "-").concat(categorizedOption.index)
      });
    }
    return optionsAccumulator;
  }, []);
}
function buildFocusableOptions(props, selectValue) {
  return buildFocusableOptionsFromCategorizedOptions(buildCategorizedOptions(props, selectValue));
}
function isFocusable(props, categorizedOption) {
  var _props$inputValue = props.inputValue,
    inputValue = _props$inputValue === void 0 ? '' : _props$inputValue;
  var data = categorizedOption.data,
    isSelected = categorizedOption.isSelected,
    label = categorizedOption.label,
    value = categorizedOption.value;
  return (!shouldHideSelectedOptions(props) || !isSelected) && _filterOption(props, {
    label: label,
    value: value,
    data: data
  }, inputValue);
}
function getNextFocusedValue(state, nextSelectValue) {
  var focusedValue = state.focusedValue,
    lastSelectValue = state.selectValue;
  var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);
  if (lastFocusedIndex > -1) {
    var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);
    if (nextFocusedIndex > -1) {
      // the focused value is still in the selectValue, return it
      return focusedValue;
    } else if (lastFocusedIndex < nextSelectValue.length) {
      // the focusedValue is not present in the next selectValue array by
      // reference, so return the new value at the same index
      return nextSelectValue[lastFocusedIndex];
    }
  }
  return null;
}
function getNextFocusedOption(state, options) {
  var lastFocusedOption = state.focusedOption;
  return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
}
var getFocusedOptionId = function getFocusedOptionId(focusableOptionsWithIds, focusedOption) {
  var _focusableOptionsWith;
  var focusedOptionId = (_focusableOptionsWith = focusableOptionsWithIds.find(function (option) {
    return option.data === focusedOption;
  })) === null || _focusableOptionsWith === void 0 ? void 0 : _focusableOptionsWith.id;
  return focusedOptionId || null;
};
var getOptionLabel = function getOptionLabel(props, data) {
  return props.getOptionLabel(data);
};
var getOptionValue = function getOptionValue(props, data) {
  return props.getOptionValue(data);
};
function _isOptionDisabled(props, option, selectValue) {
  return typeof props.isOptionDisabled === 'function' ? props.isOptionDisabled(option, selectValue) : false;
}
function _isOptionSelected(props, option, selectValue) {
  if (selectValue.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }
  var candidate = getOptionValue(props, option);
  return selectValue.some(function (i) {
    return getOptionValue(props, i) === candidate;
  });
}
function _filterOption(props, option, inputValue) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}
var shouldHideSelectedOptions = function shouldHideSelectedOptions(props) {
  var hideSelectedOptions = props.hideSelectedOptions,
    isMulti = props.isMulti;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};
var instanceId = 1;
var Select = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Select, _Component);
  var _super = (0,_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_5__["default"])(Select);
  // Misc. Instance Properties
  // ------------------------------

  // TODO

  // Refs
  // ------------------------------

  // Lifecycle
  // ------------------------------

  function Select(_props) {
    var _this;
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Select);
    _this = _super.call(this, _props);
    _this.state = {
      ariaSelection: null,
      focusedOption: null,
      focusedOptionId: null,
      focusableOptionsWithIds: [],
      focusedValue: null,
      inputIsHidden: false,
      isFocused: false,
      selectValue: [],
      clearFocusValueOnUpdate: false,
      prevWasFocused: false,
      inputIsHiddenAfterUpdate: undefined,
      prevProps: undefined,
      instancePrefix: '',
      isAppleDevice: false
    };
    _this.blockOptionHover = false;
    _this.isComposing = false;
    _this.commonProps = void 0;
    _this.initialTouchX = 0;
    _this.initialTouchY = 0;
    _this.openAfterFocus = false;
    _this.scrollToFocusedOptionOnUpdate = false;
    _this.userIsDragging = void 0;
    _this.controlRef = null;
    _this.getControlRef = function (ref) {
      _this.controlRef = ref;
    };
    _this.focusedOptionRef = null;
    _this.getFocusedOptionRef = function (ref) {
      _this.focusedOptionRef = ref;
    };
    _this.menuListRef = null;
    _this.getMenuListRef = function (ref) {
      _this.menuListRef = ref;
    };
    _this.inputRef = null;
    _this.getInputRef = function (ref) {
      _this.inputRef = ref;
    };
    _this.focus = _this.focusInput;
    _this.blur = _this.blurInput;
    _this.onChange = function (newValue, actionMeta) {
      var _this$props = _this.props,
        onChange = _this$props.onChange,
        name = _this$props.name;
      actionMeta.name = name;
      _this.ariaOnChange(newValue, actionMeta);
      onChange(newValue, actionMeta);
    };
    _this.setValue = function (newValue, action, option) {
      var _this$props2 = _this.props,
        closeMenuOnSelect = _this$props2.closeMenuOnSelect,
        isMulti = _this$props2.isMulti,
        inputValue = _this$props2.inputValue;
      _this.onInputChange('', {
        action: 'set-value',
        prevInputValue: inputValue
      });
      if (closeMenuOnSelect) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });
        _this.onMenuClose();
      }
      // when the select value should change, we should reset focusedValue
      _this.setState({
        clearFocusValueOnUpdate: true
      });
      _this.onChange(newValue, {
        action: action,
        option: option
      });
    };
    _this.selectOption = function (newValue) {
      var _this$props3 = _this.props,
        blurInputOnSelect = _this$props3.blurInputOnSelect,
        isMulti = _this$props3.isMulti,
        name = _this$props3.name;
      var selectValue = _this.state.selectValue;
      var deselected = isMulti && _this.isOptionSelected(newValue, selectValue);
      var isDisabled = _this.isOptionDisabled(newValue, selectValue);
      if (deselected) {
        var candidate = _this.getOptionValue(newValue);
        _this.setValue((0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.B)(selectValue.filter(function (i) {
          return _this.getOptionValue(i) !== candidate;
        })), 'deselect-option', newValue);
      } else if (!isDisabled) {
        // Select option if option is not disabled
        if (isMulti) {
          _this.setValue((0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.B)([].concat((0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(selectValue), [newValue])), 'select-option', newValue);
        } else {
          _this.setValue((0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.C)(newValue), 'select-option');
        }
      } else {
        _this.ariaOnChange((0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.C)(newValue), {
          action: 'select-option',
          option: newValue,
          name: name
        });
        return;
      }
      if (blurInputOnSelect) {
        _this.blurInput();
      }
    };
    _this.removeValue = function (removedValue) {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;
      var candidate = _this.getOptionValue(removedValue);
      var newValueArray = selectValue.filter(function (i) {
        return _this.getOptionValue(i) !== candidate;
      });
      var newValue = (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(isMulti, newValueArray, newValueArray[0] || null);
      _this.onChange(newValue, {
        action: 'remove-value',
        removedValue: removedValue
      });
      _this.focusInput();
    };
    _this.clearValue = function () {
      var selectValue = _this.state.selectValue;
      _this.onChange((0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(_this.props.isMulti, [], null), {
        action: 'clear',
        removedValues: selectValue
      });
    };
    _this.popValue = function () {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;
      var lastSelectedValue = selectValue[selectValue.length - 1];
      var newValueArray = selectValue.slice(0, selectValue.length - 1);
      var newValue = (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(isMulti, newValueArray, newValueArray[0] || null);
      if (lastSelectedValue) {
        _this.onChange(newValue, {
          action: 'pop-value',
          removedValue: lastSelectedValue
        });
      }
    };
    _this.getFocusedOptionId = function (focusedOption) {
      return getFocusedOptionId(_this.state.focusableOptionsWithIds, focusedOption);
    };
    _this.getFocusableOptionsWithIds = function () {
      return buildFocusableOptionsWithIds(buildCategorizedOptions(_this.props, _this.state.selectValue), _this.getElementId('option'));
    };
    _this.getValue = function () {
      return _this.state.selectValue;
    };
    _this.cx = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.E.apply(void 0, [_this.props.classNamePrefix].concat(args));
    };
    _this.getOptionLabel = function (data) {
      return getOptionLabel(_this.props, data);
    };
    _this.getOptionValue = function (data) {
      return getOptionValue(_this.props, data);
    };
    _this.getStyles = function (key, props) {
      var unstyled = _this.props.unstyled;
      var base = defaultStyles[key](props, unstyled);
      base.boxSizing = 'border-box';
      var custom = _this.props.styles[key];
      return custom ? custom(base, props) : base;
    };
    _this.getClassNames = function (key, props) {
      var _this$props$className, _this$props$className2;
      return (_this$props$className = (_this$props$className2 = _this.props.classNames)[key]) === null || _this$props$className === void 0 ? void 0 : _this$props$className.call(_this$props$className2, props);
    };
    _this.getElementId = function (element) {
      return "".concat(_this.state.instancePrefix, "-").concat(element);
    };
    _this.getComponents = function () {
      return (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.F)(_this.props);
    };
    _this.buildCategorizedOptions = function () {
      return buildCategorizedOptions(_this.props, _this.state.selectValue);
    };
    _this.getCategorizedOptions = function () {
      return _this.props.menuIsOpen ? _this.buildCategorizedOptions() : [];
    };
    _this.buildFocusableOptions = function () {
      return buildFocusableOptionsFromCategorizedOptions(_this.buildCategorizedOptions());
    };
    _this.getFocusableOptions = function () {
      return _this.props.menuIsOpen ? _this.buildFocusableOptions() : [];
    };
    _this.ariaOnChange = function (value, actionMeta) {
      _this.setState({
        ariaSelection: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
          value: value
        }, actionMeta)
      });
    };
    _this.onMenuMouseDown = function (event) {
      if (event.button !== 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      _this.focusInput();
    };
    _this.onMenuMouseMove = function (event) {
      _this.blockOptionHover = false;
    };
    _this.onControlMouseDown = function (event) {
      // Event captured by dropdown indicator
      if (event.defaultPrevented) {
        return;
      }
      var openMenuOnClick = _this.props.openMenuOnClick;
      if (!_this.state.isFocused) {
        if (openMenuOnClick) {
          _this.openAfterFocus = true;
        }
        _this.focusInput();
      } else if (!_this.props.menuIsOpen) {
        if (openMenuOnClick) {
          _this.openMenu('first');
        }
      } else {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          _this.onMenuClose();
        }
      }
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
    };
    _this.onDropdownIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }
      if (_this.props.isDisabled) return;
      var _this$props4 = _this.props,
        isMulti = _this$props4.isMulti,
        menuIsOpen = _this$props4.menuIsOpen;
      _this.focusInput();
      if (menuIsOpen) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });
        _this.onMenuClose();
      } else {
        _this.openMenu('first');
      }
      event.preventDefault();
    };
    _this.onClearIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }
      _this.clearValue();
      event.preventDefault();
      _this.openAfterFocus = false;
      if (event.type === 'touchend') {
        _this.focusInput();
      } else {
        setTimeout(function () {
          return _this.focusInput();
        });
      }
    };
    _this.onScroll = function (event) {
      if (typeof _this.props.closeMenuOnScroll === 'boolean') {
        if (event.target instanceof HTMLElement && (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.G)(event.target)) {
          _this.props.onMenuClose();
        }
      } else if (typeof _this.props.closeMenuOnScroll === 'function') {
        if (_this.props.closeMenuOnScroll(event)) {
          _this.props.onMenuClose();
        }
      }
    };
    _this.onCompositionStart = function () {
      _this.isComposing = true;
    };
    _this.onCompositionEnd = function () {
      _this.isComposing = false;
    };
    _this.onTouchStart = function (_ref2) {
      var touches = _ref2.touches;
      var touch = touches && touches.item(0);
      if (!touch) {
        return;
      }
      _this.initialTouchX = touch.clientX;
      _this.initialTouchY = touch.clientY;
      _this.userIsDragging = false;
    };
    _this.onTouchMove = function (_ref3) {
      var touches = _ref3.touches;
      var touch = touches && touches.item(0);
      if (!touch) {
        return;
      }
      var deltaX = Math.abs(touch.clientX - _this.initialTouchX);
      var deltaY = Math.abs(touch.clientY - _this.initialTouchY);
      var moveThreshold = 5;
      _this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
    };
    _this.onTouchEnd = function (event) {
      if (_this.userIsDragging) return;

      // close the menu if the user taps outside
      // we're checking on event.target here instead of event.currentTarget, because we want to assert information
      // on events on child elements, not the document (which we've attached this handler to).
      if (_this.controlRef && !_this.controlRef.contains(event.target) && _this.menuListRef && !_this.menuListRef.contains(event.target)) {
        _this.blurInput();
      }

      // reset move vars
      _this.initialTouchX = 0;
      _this.initialTouchY = 0;
    };
    _this.onControlTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onControlMouseDown(event);
    };
    _this.onClearIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onClearIndicatorMouseDown(event);
    };
    _this.onDropdownIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onDropdownIndicatorMouseDown(event);
    };
    _this.handleInputChange = function (event) {
      var prevInputValue = _this.props.inputValue;
      var inputValue = event.currentTarget.value;
      _this.setState({
        inputIsHiddenAfterUpdate: false
      });
      _this.onInputChange(inputValue, {
        action: 'input-change',
        prevInputValue: prevInputValue
      });
      if (!_this.props.menuIsOpen) {
        _this.onMenuOpen();
      }
    };
    _this.onInputFocus = function (event) {
      if (_this.props.onFocus) {
        _this.props.onFocus(event);
      }
      _this.setState({
        inputIsHiddenAfterUpdate: false,
        isFocused: true
      });
      if (_this.openAfterFocus || _this.props.openMenuOnFocus) {
        _this.openMenu('first');
      }
      _this.openAfterFocus = false;
    };
    _this.onInputBlur = function (event) {
      var prevInputValue = _this.props.inputValue;
      if (_this.menuListRef && _this.menuListRef.contains(document.activeElement)) {
        _this.inputRef.focus();
        return;
      }
      if (_this.props.onBlur) {
        _this.props.onBlur(event);
      }
      _this.onInputChange('', {
        action: 'input-blur',
        prevInputValue: prevInputValue
      });
      _this.onMenuClose();
      _this.setState({
        focusedValue: null,
        isFocused: false
      });
    };
    _this.onOptionHover = function (focusedOption) {
      if (_this.blockOptionHover || _this.state.focusedOption === focusedOption) {
        return;
      }
      var options = _this.getFocusableOptions();
      var focusedOptionIndex = options.indexOf(focusedOption);
      _this.setState({
        focusedOption: focusedOption,
        focusedOptionId: focusedOptionIndex > -1 ? _this.getFocusedOptionId(focusedOption) : null
      });
    };
    _this.shouldHideSelectedOptions = function () {
      return shouldHideSelectedOptions(_this.props);
    };
    _this.onValueInputFocus = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.focus();
    };
    _this.onKeyDown = function (event) {
      var _this$props5 = _this.props,
        isMulti = _this$props5.isMulti,
        backspaceRemovesValue = _this$props5.backspaceRemovesValue,
        escapeClearsValue = _this$props5.escapeClearsValue,
        inputValue = _this$props5.inputValue,
        isClearable = _this$props5.isClearable,
        isDisabled = _this$props5.isDisabled,
        menuIsOpen = _this$props5.menuIsOpen,
        onKeyDown = _this$props5.onKeyDown,
        tabSelectsValue = _this$props5.tabSelectsValue,
        openMenuOnFocus = _this$props5.openMenuOnFocus;
      var _this$state = _this.state,
        focusedOption = _this$state.focusedOption,
        focusedValue = _this$state.focusedValue,
        selectValue = _this$state.selectValue;
      if (isDisabled) return;
      if (typeof onKeyDown === 'function') {
        onKeyDown(event);
        if (event.defaultPrevented) {
          return;
        }
      }

      // Block option hover events when the user has just pressed a key
      _this.blockOptionHover = true;
      switch (event.key) {
        case 'ArrowLeft':
          if (!isMulti || inputValue) return;
          _this.focusValue('previous');
          break;
        case 'ArrowRight':
          if (!isMulti || inputValue) return;
          _this.focusValue('next');
          break;
        case 'Delete':
        case 'Backspace':
          if (inputValue) return;
          if (focusedValue) {
            _this.removeValue(focusedValue);
          } else {
            if (!backspaceRemovesValue) return;
            if (isMulti) {
              _this.popValue();
            } else if (isClearable) {
              _this.clearValue();
            }
          }
          break;
        case 'Tab':
          if (_this.isComposing) return;
          if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption ||
          // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          openMenuOnFocus && _this.isOptionSelected(focusedOption, selectValue)) {
            return;
          }
          _this.selectOption(focusedOption);
          break;
        case 'Enter':
          if (event.keyCode === 229) {
            // ignore the keydown event from an Input Method Editor(IME)
            // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
            break;
          }
          if (menuIsOpen) {
            if (!focusedOption) return;
            if (_this.isComposing) return;
            _this.selectOption(focusedOption);
            break;
          }
          return;
        case 'Escape':
          if (menuIsOpen) {
            _this.setState({
              inputIsHiddenAfterUpdate: false
            });
            _this.onInputChange('', {
              action: 'menu-close',
              prevInputValue: inputValue
            });
            _this.onMenuClose();
          } else if (isClearable && escapeClearsValue) {
            _this.clearValue();
          }
          break;
        case ' ':
          // space
          if (inputValue) {
            return;
          }
          if (!menuIsOpen) {
            _this.openMenu('first');
            break;
          }
          if (!focusedOption) return;
          _this.selectOption(focusedOption);
          break;
        case 'ArrowUp':
          if (menuIsOpen) {
            _this.focusOption('up');
          } else {
            _this.openMenu('last');
          }
          break;
        case 'ArrowDown':
          if (menuIsOpen) {
            _this.focusOption('down');
          } else {
            _this.openMenu('first');
          }
          break;
        case 'PageUp':
          if (!menuIsOpen) return;
          _this.focusOption('pageup');
          break;
        case 'PageDown':
          if (!menuIsOpen) return;
          _this.focusOption('pagedown');
          break;
        case 'Home':
          if (!menuIsOpen) return;
          _this.focusOption('first');
          break;
        case 'End':
          if (!menuIsOpen) return;
          _this.focusOption('last');
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    _this.state.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);
    _this.state.selectValue = (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.H)(_props.value);
    // Set focusedOption if menuIsOpen is set on init (e.g. defaultMenuIsOpen)
    if (_props.menuIsOpen && _this.state.selectValue.length) {
      var focusableOptionsWithIds = _this.getFocusableOptionsWithIds();
      var focusableOptions = _this.buildFocusableOptions();
      var optionIndex = focusableOptions.indexOf(_this.state.selectValue[0]);
      _this.state.focusableOptionsWithIds = focusableOptionsWithIds;
      _this.state.focusedOption = focusableOptions[optionIndex];
      _this.state.focusedOptionId = getFocusedOptionId(focusableOptionsWithIds, focusableOptions[optionIndex]);
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Select, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startListeningComposition();
      this.startListeningToTouch();
      if (this.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', this.onScroll, true);
      }
      if (this.props.autoFocus) {
        this.focusInput();
      }

      // Scroll focusedOption into view if menuIsOpen is set on mount (e.g. defaultMenuIsOpen)
      if (this.props.menuIsOpen && this.state.focusedOption && this.menuListRef && this.focusedOptionRef) {
        (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.I)(this.menuListRef, this.focusedOptionRef);
      }
      if (isAppleDevice()) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          isAppleDevice: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props6 = this.props,
        isDisabled = _this$props6.isDisabled,
        menuIsOpen = _this$props6.menuIsOpen;
      var isFocused = this.state.isFocused;
      if (
      // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled ||
      // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      }
      if (isFocused && isDisabled && !prevProps.isDisabled) {
        // ensure select state gets blurred in case Select is programmatically disabled while focused
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isFocused: false
        }, this.onMenuClose);
      } else if (!isFocused && !isDisabled && prevProps.isDisabled && this.inputRef === document.activeElement) {
        // ensure select state gets focused in case Select is programatically re-enabled while focused (Firefox)
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isFocused: true
        });
      }

      // scroll the focused option into view if necessary
      if (this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.I)(this.menuListRef, this.focusedOptionRef);
        this.scrollToFocusedOptionOnUpdate = false;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopListeningComposition();
      this.stopListeningToTouch();
      document.removeEventListener('scroll', this.onScroll, true);
    }

    // ==============================
    // Consumer Handlers
    // ==============================
  }, {
    key: "onMenuOpen",
    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: "onMenuClose",
    value: function onMenuClose() {
      this.onInputChange('', {
        action: 'menu-close',
        prevInputValue: this.props.inputValue
      });
      this.props.onMenuClose();
    }
  }, {
    key: "onInputChange",
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    }

    // ==============================
    // Methods
    // ==============================
  }, {
    key: "focusInput",
    value: function focusInput() {
      if (!this.inputRef) return;
      this.inputRef.focus();
    }
  }, {
    key: "blurInput",
    value: function blurInput() {
      if (!this.inputRef) return;
      this.inputRef.blur();
    }

    // aliased for consumers
  }, {
    key: "openMenu",
    value: function openMenu(focusOption) {
      var _this2 = this;
      var _this$state2 = this.state,
        selectValue = _this$state2.selectValue,
        isFocused = _this$state2.isFocused;
      var focusableOptions = this.buildFocusableOptions();
      var openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;
      if (!this.props.isMulti) {
        var selectedIndex = focusableOptions.indexOf(selectValue[0]);
        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      }

      // only scroll if the menu isn't already open
      this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);
      this.setState({
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex],
        focusedOptionId: this.getFocusedOptionId(focusableOptions[openAtIndex])
      }, function () {
        return _this2.onMenuOpen();
      });
    }
  }, {
    key: "focusValue",
    value: function focusValue(direction) {
      var _this$state3 = this.state,
        selectValue = _this$state3.selectValue,
        focusedValue = _this$state3.focusedValue;

      // Only multiselects support value focusing
      if (!this.props.isMulti) return;
      this.setState({
        focusedOption: null
      });
      var focusedIndex = selectValue.indexOf(focusedValue);
      if (!focusedValue) {
        focusedIndex = -1;
      }
      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;
      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }
          break;
        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }
          break;
      }
      this.setState({
        inputIsHidden: nextFocus !== -1,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: "focusOption",
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var focusedOption = this.state.focusedOption;
      var options = this.getFocusableOptions();
      if (!options.length) return;
      var nextFocus = 0; // handles 'first'
      var focusedIndex = options.indexOf(focusedOption);
      if (!focusedOption) {
        focusedIndex = -1;
      }
      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }
      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null,
        focusedOptionId: this.getFocusedOptionId(options[nextFocus])
      });
    }
  }, {
    key: "getTheme",
    value:
    // ==============================
    // Getters
    // ==============================

    function getTheme() {
      // Use the default theme if there are no customisations.
      if (!this.props.theme) {
        return defaultTheme;
      }
      // If the theme prop is a function, assume the function
      // knows how to merge the passed-in default theme with
      // its own modifications.
      if (typeof this.props.theme === 'function') {
        return this.props.theme(defaultTheme);
      }
      // Otherwise, if a plain theme object was passed in,
      // overlay it with the default theme.
      return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultTheme), this.props.theme);
    }
  }, {
    key: "getCommonProps",
    value: function getCommonProps() {
      var clearValue = this.clearValue,
        cx = this.cx,
        getStyles = this.getStyles,
        getClassNames = this.getClassNames,
        getValue = this.getValue,
        selectOption = this.selectOption,
        setValue = this.setValue,
        props = this.props;
      var isMulti = props.isMulti,
        isRtl = props.isRtl,
        options = props.options;
      var hasValue = this.hasValue();
      return {
        clearValue: clearValue,
        cx: cx,
        getStyles: getStyles,
        getClassNames: getClassNames,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        selectProps: props,
        setValue: setValue,
        theme: this.getTheme()
      };
    }
  }, {
    key: "hasValue",
    value: function hasValue() {
      var selectValue = this.state.selectValue;
      return selectValue.length > 0;
    }
  }, {
    key: "hasOptions",
    value: function hasOptions() {
      return !!this.getFocusableOptions().length;
    }
  }, {
    key: "isClearable",
    value: function isClearable() {
      var _this$props7 = this.props,
        isClearable = _this$props7.isClearable,
        isMulti = _this$props7.isMulti;

      // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable
      if (isClearable === undefined) return isMulti;
      return isClearable;
    }
  }, {
    key: "isOptionDisabled",
    value: function isOptionDisabled(option, selectValue) {
      return _isOptionDisabled(this.props, option, selectValue);
    }
  }, {
    key: "isOptionSelected",
    value: function isOptionSelected(option, selectValue) {
      return _isOptionSelected(this.props, option, selectValue);
    }
  }, {
    key: "filterOption",
    value: function filterOption(option, inputValue) {
      return _filterOption(this.props, option, inputValue);
    }
  }, {
    key: "formatOptionLabel",
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var _inputValue = this.props.inputValue;
        var _selectValue = this.state.selectValue;
        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: _inputValue,
          selectValue: _selectValue
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: "formatGroupLabel",
    value: function formatGroupLabel(data) {
      return this.props.formatGroupLabel(data);
    }

    // ==============================
    // Mouse Handlers
    // ==============================
  }, {
    key: "startListeningComposition",
    value:
    // ==============================
    // Composition Handlers
    // ==============================

    function startListeningComposition() {
      if (document && document.addEventListener) {
        document.addEventListener('compositionstart', this.onCompositionStart, false);
        document.addEventListener('compositionend', this.onCompositionEnd, false);
      }
    }
  }, {
    key: "stopListeningComposition",
    value: function stopListeningComposition() {
      if (document && document.removeEventListener) {
        document.removeEventListener('compositionstart', this.onCompositionStart);
        document.removeEventListener('compositionend', this.onCompositionEnd);
      }
    }
  }, {
    key: "startListeningToTouch",
    value:
    // ==============================
    // Touch Handlers
    // ==============================

    function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: "stopListeningToTouch",
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }
  }, {
    key: "renderInput",
    value:
    // ==============================
    // Renderers
    // ==============================
    function renderInput() {
      var _this$props8 = this.props,
        isDisabled = _this$props8.isDisabled,
        isSearchable = _this$props8.isSearchable,
        inputId = _this$props8.inputId,
        inputValue = _this$props8.inputValue,
        tabIndex = _this$props8.tabIndex,
        form = _this$props8.form,
        menuIsOpen = _this$props8.menuIsOpen,
        required = _this$props8.required;
      var _this$getComponents = this.getComponents(),
        Input = _this$getComponents.Input;
      var _this$state4 = this.state,
        inputIsHidden = _this$state4.inputIsHidden,
        ariaSelection = _this$state4.ariaSelection;
      var commonProps = this.commonProps;
      var id = inputId || this.getElementId('input');

      // aria attributes makes the JSX "noisy", separated for clarity
      var ariaAttributes = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        'aria-autocomplete': 'list',
        'aria-expanded': menuIsOpen,
        'aria-haspopup': true,
        'aria-errormessage': this.props['aria-errormessage'],
        'aria-invalid': this.props['aria-invalid'],
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby'],
        'aria-required': required,
        role: 'combobox',
        'aria-activedescendant': this.state.isAppleDevice ? undefined : this.state.focusedOptionId || ''
      }, menuIsOpen && {
        'aria-controls': this.getElementId('listbox')
      }), !isSearchable && {
        'aria-readonly': true
      }), this.hasValue() ? (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus' && {
        'aria-describedby': this.getElementId('live-region')
      } : {
        'aria-describedby': this.getElementId('placeholder')
      });
      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(DummyInput, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          id: id,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.J,
          onFocus: this.onInputFocus,
          disabled: isDisabled,
          tabIndex: tabIndex,
          inputMode: "none",
          form: form,
          value: ""
        }, ariaAttributes));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Input, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        autoCapitalize: "none",
        autoComplete: "off",
        autoCorrect: "off",
        id: id,
        innerRef: this.getInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        spellCheck: "false",
        tabIndex: tabIndex,
        form: form,
        type: "text",
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: "renderPlaceholderOrValue",
    value: function renderPlaceholderOrValue() {
      var _this3 = this;
      var _this$getComponents2 = this.getComponents(),
        MultiValue = _this$getComponents2.MultiValue,
        MultiValueContainer = _this$getComponents2.MultiValueContainer,
        MultiValueLabel = _this$getComponents2.MultiValueLabel,
        MultiValueRemove = _this$getComponents2.MultiValueRemove,
        SingleValue = _this$getComponents2.SingleValue,
        Placeholder = _this$getComponents2.Placeholder;
      var commonProps = this.commonProps;
      var _this$props9 = this.props,
        controlShouldRenderValue = _this$props9.controlShouldRenderValue,
        isDisabled = _this$props9.isDisabled,
        isMulti = _this$props9.isMulti,
        inputValue = _this$props9.inputValue,
        placeholder = _this$props9.placeholder;
      var _this$state5 = this.state,
        selectValue = _this$state5.selectValue,
        focusedValue = _this$state5.focusedValue,
        isFocused = _this$state5.isFocused;
      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Placeholder, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          key: "placeholder",
          isDisabled: isDisabled,
          isFocused: isFocused,
          innerProps: {
            id: this.getElementId('placeholder')
          }
        }), placeholder);
      }
      if (isMulti) {
        return selectValue.map(function (opt, index) {
          var isOptionFocused = opt === focusedValue;
          var key = "".concat(_this3.getOptionLabel(opt), "-").concat(_this3.getOptionValue(opt));
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MultiValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            components: {
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove
            },
            isFocused: isOptionFocused,
            isDisabled: isDisabled,
            key: key,
            index: index,
            removeProps: {
              onClick: function onClick() {
                return _this3.removeValue(opt);
              },
              onTouchEnd: function onTouchEnd() {
                return _this3.removeValue(opt);
              },
              onMouseDown: function onMouseDown(e) {
                e.preventDefault();
              }
            },
            data: opt
          }), _this3.formatOptionLabel(opt, 'value'));
        });
      }
      if (inputValue) {
        return null;
      }
      var singleValue = selectValue[0];
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(SingleValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        data: singleValue,
        isDisabled: isDisabled
      }), this.formatOptionLabel(singleValue, 'value'));
    }
  }, {
    key: "renderClearIndicator",
    value: function renderClearIndicator() {
      var _this$getComponents3 = this.getComponents(),
        ClearIndicator = _this$getComponents3.ClearIndicator;
      var commonProps = this.commonProps;
      var _this$props10 = this.props,
        isDisabled = _this$props10.isDisabled,
        isLoading = _this$props10.isLoading;
      var isFocused = this.state.isFocused;
      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }
      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ClearIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      var _this$getComponents4 = this.getComponents(),
        LoadingIndicator = _this$getComponents4.LoadingIndicator;
      var commonProps = this.commonProps;
      var _this$props11 = this.props,
        isDisabled = _this$props11.isDisabled,
        isLoading = _this$props11.isLoading;
      var isFocused = this.state.isFocused;
      if (!LoadingIndicator || !isLoading) return null;
      var innerProps = {
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LoadingIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderIndicatorSeparator",
    value: function renderIndicatorSeparator() {
      var _this$getComponents5 = this.getComponents(),
        DropdownIndicator = _this$getComponents5.DropdownIndicator,
        IndicatorSeparator = _this$getComponents5.IndicatorSeparator;

      // separator doesn't make sense without the dropdown indicator
      if (!DropdownIndicator || !IndicatorSeparator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(IndicatorSeparator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderDropdownIndicator",
    value: function renderDropdownIndicator() {
      var _this$getComponents6 = this.getComponents(),
        DropdownIndicator = _this$getComponents6.DropdownIndicator;
      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(DropdownIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this4 = this;
      var _this$getComponents7 = this.getComponents(),
        Group = _this$getComponents7.Group,
        GroupHeading = _this$getComponents7.GroupHeading,
        Menu = _this$getComponents7.Menu,
        MenuList = _this$getComponents7.MenuList,
        MenuPortal = _this$getComponents7.MenuPortal,
        LoadingMessage = _this$getComponents7.LoadingMessage,
        NoOptionsMessage = _this$getComponents7.NoOptionsMessage,
        Option = _this$getComponents7.Option;
      var commonProps = this.commonProps;
      var focusedOption = this.state.focusedOption;
      var _this$props12 = this.props,
        captureMenuScroll = _this$props12.captureMenuScroll,
        inputValue = _this$props12.inputValue,
        isLoading = _this$props12.isLoading,
        loadingMessage = _this$props12.loadingMessage,
        minMenuHeight = _this$props12.minMenuHeight,
        maxMenuHeight = _this$props12.maxMenuHeight,
        menuIsOpen = _this$props12.menuIsOpen,
        menuPlacement = _this$props12.menuPlacement,
        menuPosition = _this$props12.menuPosition,
        menuPortalTarget = _this$props12.menuPortalTarget,
        menuShouldBlockScroll = _this$props12.menuShouldBlockScroll,
        menuShouldScrollIntoView = _this$props12.menuShouldScrollIntoView,
        noOptionsMessage = _this$props12.noOptionsMessage,
        onMenuScrollToTop = _this$props12.onMenuScrollToTop,
        onMenuScrollToBottom = _this$props12.onMenuScrollToBottom;
      if (!menuIsOpen) return null;

      // TODO: Internal Option Type here
      var render = function render(props, id) {
        var type = props.type,
          data = props.data,
          isDisabled = props.isDisabled,
          isSelected = props.isSelected,
          label = props.label,
          value = props.value;
        var isFocused = focusedOption === data;
        var onHover = isDisabled ? undefined : function () {
          return _this4.onOptionHover(data);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this4.selectOption(data);
        };
        var optionId = "".concat(_this4.getElementId('option'), "-").concat(id);
        var innerProps = {
          id: optionId,
          onClick: onSelect,
          onMouseMove: onHover,
          onMouseOver: onHover,
          tabIndex: -1,
          role: 'option',
          'aria-selected': _this4.state.isAppleDevice ? undefined : isSelected // is not supported on Apple devices
        };

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Option, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          innerProps: innerProps,
          data: data,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: type,
          value: value,
          isFocused: isFocused,
          innerRef: isFocused ? _this4.getFocusedOptionRef : undefined
        }), _this4.formatOptionLabel(props.data, 'menu'));
      };
      var menuUI;
      if (this.hasOptions()) {
        menuUI = this.getCategorizedOptions().map(function (item) {
          if (item.type === 'group') {
            var _data = item.data,
              options = item.options,
              groupIndex = item.index;
            var groupId = "".concat(_this4.getElementId('group'), "-").concat(groupIndex);
            var headingId = "".concat(groupId, "-heading");
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Group, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
              key: groupId,
              data: _data,
              options: options,
              Heading: GroupHeading,
              headingProps: {
                id: headingId,
                data: item.data
              },
              label: _this4.formatGroupLabel(item.data)
            }), item.options.map(function (option) {
              return render(option, "".concat(groupIndex, "-").concat(option.index));
            }));
          } else if (item.type === 'option') {
            return render(item, "".concat(item.index));
          }
        });
      } else if (isLoading) {
        var message = loadingMessage({
          inputValue: inputValue
        });
        if (message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LoadingMessage, commonProps, message);
      } else {
        var _message = noOptionsMessage({
          inputValue: inputValue
        });
        if (_message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(NoOptionsMessage, commonProps, _message);
      }
      var menuPlacementProps = {
        minMenuHeight: minMenuHeight,
        maxMenuHeight: maxMenuHeight,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition,
        menuShouldScrollIntoView: menuShouldScrollIntoView
      };
      var menuElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.M, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps), function (_ref4) {
        var ref = _ref4.ref,
          _ref4$placerProps = _ref4.placerProps,
          placement = _ref4$placerProps.placement,
          maxHeight = _ref4$placerProps.maxHeight;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Menu, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps, {
          innerRef: ref,
          innerProps: {
            onMouseDown: _this4.onMenuMouseDown,
            onMouseMove: _this4.onMenuMouseMove
          },
          isLoading: isLoading,
          placement: placement
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ScrollManager, {
          captureEnabled: captureMenuScroll,
          onTopArrive: onMenuScrollToTop,
          onBottomArrive: onMenuScrollToBottom,
          lockEnabled: menuShouldBlockScroll
        }, function (scrollTargetRef) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MenuList, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            innerRef: function innerRef(instance) {
              _this4.getMenuListRef(instance);
              scrollTargetRef(instance);
            },
            innerProps: {
              role: 'listbox',
              'aria-multiselectable': commonProps.isMulti,
              id: _this4.getElementId('listbox')
            },
            isLoading: isLoading,
            maxHeight: maxHeight,
            focusedOption: focusedOption
          }), menuUI);
        }));
      });

      // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`
      return menuPortalTarget || menuPosition === 'fixed' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MenuPortal, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        appendTo: menuPortalTarget,
        controlElement: this.controlRef,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition
      }), menuElement) : menuElement;
    }
  }, {
    key: "renderFormField",
    value: function renderFormField() {
      var _this5 = this;
      var _this$props13 = this.props,
        delimiter = _this$props13.delimiter,
        isDisabled = _this$props13.isDisabled,
        isMulti = _this$props13.isMulti,
        name = _this$props13.name,
        required = _this$props13.required;
      var selectValue = this.state.selectValue;
      if (required && !this.hasValue() && !isDisabled) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(RequiredInput$1, {
          name: name,
          onFocus: this.onValueInputFocus
        });
      }
      if (!name || isDisabled) return;
      if (isMulti) {
        if (delimiter) {
          var value = selectValue.map(function (opt) {
            return _this5.getOptionValue(opt);
          }).join(delimiter);
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
            name: name,
            type: "hidden",
            value: value
          });
        } else {
          var input = selectValue.length > 0 ? selectValue.map(function (opt, i) {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
              key: "i-".concat(i),
              name: name,
              type: "hidden",
              value: _this5.getOptionValue(opt)
            });
          }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
            name: name,
            type: "hidden",
            value: ""
          });
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, input);
        }
      } else {
        var _value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
          name: name,
          type: "hidden",
          value: _value
        });
      }
    }
  }, {
    key: "renderLiveRegion",
    value: function renderLiveRegion() {
      var commonProps = this.commonProps;
      var _this$state6 = this.state,
        ariaSelection = _this$state6.ariaSelection,
        focusedOption = _this$state6.focusedOption,
        focusedValue = _this$state6.focusedValue,
        isFocused = _this$state6.isFocused,
        selectValue = _this$state6.selectValue;
      var focusableOptions = this.getFocusableOptions();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LiveRegion$1, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        id: this.getElementId('live-region'),
        ariaSelection: ariaSelection,
        focusedOption: focusedOption,
        focusedValue: focusedValue,
        isFocused: isFocused,
        selectValue: selectValue,
        focusableOptions: focusableOptions,
        isAppleDevice: this.state.isAppleDevice
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$getComponents8 = this.getComponents(),
        Control = _this$getComponents8.Control,
        IndicatorsContainer = _this$getComponents8.IndicatorsContainer,
        SelectContainer = _this$getComponents8.SelectContainer,
        ValueContainer = _this$getComponents8.ValueContainer;
      var _this$props14 = this.props,
        className = _this$props14.className,
        id = _this$props14.id,
        isDisabled = _this$props14.isDisabled,
        menuIsOpen = _this$props14.menuIsOpen;
      var isFocused = this.state.isFocused;
      var commonProps = this.commonProps = this.getCommonProps();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(SelectContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        className: className,
        innerProps: {
          id: id,
          onKeyDown: this.onKeyDown
        },
        isDisabled: isDisabled,
        isFocused: isFocused
      }), this.renderLiveRegion(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Control, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerRef: this.getControlRef,
        innerProps: {
          onMouseDown: this.onControlMouseDown,
          onTouchEnd: this.onControlTouchEnd
        },
        isDisabled: isDisabled,
        isFocused: isFocused,
        menuIsOpen: menuIsOpen
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ValueContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderPlaceholderOrValue(), this.renderInput()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(IndicatorsContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())), this.renderMenu(), this.renderFormField());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var prevProps = state.prevProps,
        clearFocusValueOnUpdate = state.clearFocusValueOnUpdate,
        inputIsHiddenAfterUpdate = state.inputIsHiddenAfterUpdate,
        ariaSelection = state.ariaSelection,
        isFocused = state.isFocused,
        prevWasFocused = state.prevWasFocused,
        instancePrefix = state.instancePrefix;
      var options = props.options,
        value = props.value,
        menuIsOpen = props.menuIsOpen,
        inputValue = props.inputValue,
        isMulti = props.isMulti;
      var selectValue = (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.H)(value);
      var newMenuOptionsState = {};
      if (prevProps && (value !== prevProps.value || options !== prevProps.options || menuIsOpen !== prevProps.menuIsOpen || inputValue !== prevProps.inputValue)) {
        var focusableOptions = menuIsOpen ? buildFocusableOptions(props, selectValue) : [];
        var focusableOptionsWithIds = menuIsOpen ? buildFocusableOptionsWithIds(buildCategorizedOptions(props, selectValue), "".concat(instancePrefix, "-option")) : [];
        var focusedValue = clearFocusValueOnUpdate ? getNextFocusedValue(state, selectValue) : null;
        var focusedOption = getNextFocusedOption(state, focusableOptions);
        var focusedOptionId = getFocusedOptionId(focusableOptionsWithIds, focusedOption);
        newMenuOptionsState = {
          selectValue: selectValue,
          focusedOption: focusedOption,
          focusedOptionId: focusedOptionId,
          focusableOptionsWithIds: focusableOptionsWithIds,
          focusedValue: focusedValue,
          clearFocusValueOnUpdate: false
        };
      }
      // some updates should toggle the state of the input visibility
      var newInputIsHiddenState = inputIsHiddenAfterUpdate != null && props !== prevProps ? {
        inputIsHidden: inputIsHiddenAfterUpdate,
        inputIsHiddenAfterUpdate: undefined
      } : {};
      var newAriaSelection = ariaSelection;
      var hasKeptFocus = isFocused && prevWasFocused;
      if (isFocused && !hasKeptFocus) {
        // If `value` or `defaultValue` props are not empty then announce them
        // when the Select is initially focused
        newAriaSelection = {
          value: (0,_index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(isMulti, selectValue, selectValue[0] || null),
          options: selectValue,
          action: 'initial-input-focus'
        };
        hasKeptFocus = !prevWasFocused;
      }

      // If the 'initial-input-focus' action has been set already
      // then reset the ariaSelection to null
      if ((ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus') {
        newAriaSelection = null;
      }
      return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, newMenuOptionsState), newInputIsHiddenState), {}, {
        prevProps: props,
        ariaSelection: newAriaSelection,
        prevWasFocused: hasKeptFocus
      });
    }
  }]);
  return Select;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
Select.defaultProps = defaultProps;




/***/ },

/***/ "./node_modules/react-select/dist/index-641ee5b8.esm.js"
/*!**************************************************************!*\
  !*** ./node_modules/react-select/dist/index-641ee5b8.esm.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isMobileDevice),
/* harmony export */   B: () => (/* binding */ multiValueAsValue),
/* harmony export */   C: () => (/* binding */ singleValueAsValue),
/* harmony export */   D: () => (/* binding */ valueTernary),
/* harmony export */   E: () => (/* binding */ classNames),
/* harmony export */   F: () => (/* binding */ defaultComponents),
/* harmony export */   G: () => (/* binding */ isDocumentElement),
/* harmony export */   H: () => (/* binding */ cleanValue),
/* harmony export */   I: () => (/* binding */ scrollIntoView),
/* harmony export */   J: () => (/* binding */ noop),
/* harmony export */   K: () => (/* binding */ notNullish),
/* harmony export */   L: () => (/* binding */ handleInputChange),
/* harmony export */   M: () => (/* binding */ MenuPlacer),
/* harmony export */   a: () => (/* binding */ clearIndicatorCSS),
/* harmony export */   b: () => (/* binding */ containerCSS),
/* harmony export */   c: () => (/* binding */ components),
/* harmony export */   d: () => (/* binding */ css$1),
/* harmony export */   e: () => (/* binding */ dropdownIndicatorCSS),
/* harmony export */   f: () => (/* binding */ groupHeadingCSS),
/* harmony export */   g: () => (/* binding */ groupCSS),
/* harmony export */   h: () => (/* binding */ indicatorSeparatorCSS),
/* harmony export */   i: () => (/* binding */ indicatorsContainerCSS),
/* harmony export */   j: () => (/* binding */ inputCSS),
/* harmony export */   k: () => (/* binding */ loadingMessageCSS),
/* harmony export */   l: () => (/* binding */ loadingIndicatorCSS),
/* harmony export */   m: () => (/* binding */ menuCSS),
/* harmony export */   n: () => (/* binding */ menuListCSS),
/* harmony export */   o: () => (/* binding */ menuPortalCSS),
/* harmony export */   p: () => (/* binding */ multiValueCSS),
/* harmony export */   q: () => (/* binding */ multiValueLabelCSS),
/* harmony export */   r: () => (/* binding */ removeProps),
/* harmony export */   s: () => (/* binding */ supportsPassiveEvents),
/* harmony export */   t: () => (/* binding */ multiValueRemoveCSS),
/* harmony export */   u: () => (/* binding */ noOptionsMessageCSS),
/* harmony export */   v: () => (/* binding */ optionCSS),
/* harmony export */   w: () => (/* binding */ placeholderCSS),
/* harmony export */   x: () => (/* binding */ css),
/* harmony export */   y: () => (/* binding */ valueContainerCSS),
/* harmony export */   z: () => (/* binding */ isTouchCapable)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");













var _excluded$4 = ["className", "clearValue", "cx", "getStyles", "getClassNames", "getValue", "hasValue", "isMulti", "isRtl", "options", "selectOption", "selectProps", "setValue", "theme"];
// ==============================
// NO OP
// ==============================

var noop = function noop() {};

// ==============================
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/
function applyPrefixToName(prefix, name) {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}
function classNames(prefix, state) {
  for (var _len = arguments.length, classNameList = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    classNameList[_key - 2] = arguments[_key];
  }
  var arr = [].concat(classNameList);
  if (state && prefix) {
    for (var key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push("".concat(applyPrefixToName(prefix, key)));
      }
    }
  }
  return arr.filter(function (i) {
    return i;
  }).map(function (i) {
    return String(i).trim();
  }).join(' ');
}
// ==============================
// Clean Value
// ==============================

var cleanValue = function cleanValue(value) {
  if (isArray(value)) return value.filter(Boolean);
  if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_5__["default"])(value) === 'object' && value !== null) return [value];
  return [];
};

// ==============================
// Clean Common Props
// ==============================

var cleanCommonProps = function cleanCommonProps(props) {
  //className
  props.className;
    props.clearValue;
    props.cx;
    props.getStyles;
    props.getClassNames;
    props.getValue;
    props.hasValue;
    props.isMulti;
    props.isRtl;
    props.options;
    props.selectOption;
    props.selectProps;
    props.setValue;
    props.theme;
    var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(props, _excluded$4);
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, innerProps);
};

// ==============================
// Get Style Props
// ==============================

var getStyleProps = function getStyleProps(props, name, classNamesState) {
  var cx = props.cx,
    getStyles = props.getStyles,
    getClassNames = props.getClassNames,
    className = props.className;
  return {
    css: getStyles(name, props),
    className: cx(classNamesState !== null && classNamesState !== void 0 ? classNamesState : {}, getClassNames(name, props), className)
  };
};

// ==============================
// Handle Input Change
// ==============================

function handleInputChange(inputValue, actionMeta, onInputChange) {
  if (onInputChange) {
    var _newValue = onInputChange(inputValue, actionMeta);
    if (typeof _newValue === 'string') return _newValue;
  }
  return inputValue;
}

// ==============================
// Scroll Helpers
// ==============================

function isDocumentElement(el) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

// Normalized Scroll Top
// ------------------------------

function normalizedHeight(el) {
  if (isDocumentElement(el)) {
    return window.innerHeight;
  }
  return el.clientHeight;
}

// Normalized scrollTo & scrollTop
// ------------------------------

function getScrollTop(el) {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }
  return el.scrollTop;
}
function scrollTo(el, top) {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }
  el.scrollTop = top;
}

// Get Scroll Parent
// ------------------------------

function getScrollParent(element) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRx = /(auto|scroll)/;
  if (style.position === 'fixed') return document.documentElement;
  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }
  return document.documentElement;
}

// Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/
function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}
function animatedScrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var start = getScrollTop(element);
  var change = to - start;
  var increment = 10;
  var currentTime = 0;
  function animateScroll() {
    currentTime += increment;
    var val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);
    if (currentTime < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      callback(element);
    }
  }
  animateScroll();
}

// Scroll Into View
// ------------------------------

function scrollIntoView(menuEl, focusedEl) {
  var menuRect = menuEl.getBoundingClientRect();
  var focusedRect = focusedEl.getBoundingClientRect();
  var overScroll = focusedEl.offsetHeight / 3;
  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(menuEl, Math.min(focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll, menuEl.scrollHeight));
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
}

// ==============================
// Get bounding client object
// ==============================

// cannot get keys using array notation with DOMRect
function getBoundingClientObj(element) {
  var rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
}

// ==============================
// Touch Capability Detector
// ==============================

function isTouchCapable() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

// ==============================
// Mobile Device Detector
// ==============================

function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

// ==============================
// Passive Event Detector
// ==============================

// https://github.com/rafgraph/detect-it/blob/main/src/index.ts#L19-L36
var passiveOptionAccessed = false;
var options = {
  get passive() {
    return passiveOptionAccessed = true;
  }
};
// check for SSR
var w = typeof window !== 'undefined' ? window : {};
if (w.addEventListener && w.removeEventListener) {
  w.addEventListener('p', noop, options);
  w.removeEventListener('p', noop, false);
}
var supportsPassiveEvents = passiveOptionAccessed;
function notNullish(item) {
  return item != null;
}
function isArray(arg) {
  return Array.isArray(arg);
}
function valueTernary(isMulti, multiValue, singleValue) {
  return isMulti ? multiValue : singleValue;
}
function singleValueAsValue(singleValue) {
  return singleValue;
}
function multiValueAsValue(multiValue) {
  return multiValue;
}
var removeProps = function removeProps(propsObj) {
  for (var _len2 = arguments.length, properties = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    properties[_key2 - 1] = arguments[_key2];
  }
  var propsMap = Object.entries(propsObj).filter(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, 1),
      key = _ref2[0];
    return !properties.includes(key);
  });
  return propsMap.reduce(function (newProps, _ref3) {
    var _ref4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref3, 2),
      key = _ref4[0],
      val = _ref4[1];
    newProps[key] = val;
    return newProps;
  }, {});
};

var _excluded$3 = ["children", "innerProps"],
  _excluded2$1 = ["children", "innerProps"];
function getMenuPlacement(_ref) {
  var preferredMaxHeight = _ref.maxHeight,
    menuEl = _ref.menuEl,
    minHeight = _ref.minHeight,
    preferredPlacement = _ref.placement,
    shouldScroll = _ref.shouldScroll,
    isFixedPosition = _ref.isFixedPosition,
    controlHeight = _ref.controlHeight;
  var scrollParent = getScrollParent(menuEl);
  var defaultState = {
    placement: 'bottom',
    maxHeight: preferredMaxHeight
  };

  // something went wrong, return default state
  if (!menuEl || !menuEl.offsetParent) return defaultState;

  // we can't trust `scrollParent.scrollHeight` --> it may increase when
  // the menu is rendered
  var _scrollParent$getBoun = scrollParent.getBoundingClientRect(),
    scrollHeight = _scrollParent$getBoun.height;
  var _menuEl$getBoundingCl = menuEl.getBoundingClientRect(),
    menuBottom = _menuEl$getBoundingCl.bottom,
    menuHeight = _menuEl$getBoundingCl.height,
    menuTop = _menuEl$getBoundingCl.top;
  var _menuEl$offsetParent$ = menuEl.offsetParent.getBoundingClientRect(),
    containerTop = _menuEl$offsetParent$.top;
  var viewHeight = isFixedPosition ? window.innerHeight : normalizedHeight(scrollParent);
  var scrollTop = getScrollTop(scrollParent);
  var marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
  var marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
  var viewSpaceAbove = containerTop - marginTop;
  var viewSpaceBelow = viewHeight - menuTop;
  var scrollSpaceAbove = viewSpaceAbove + scrollTop;
  var scrollSpaceBelow = scrollHeight - scrollTop - menuTop;
  var scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
  var scrollUp = scrollTop + menuTop - marginTop;
  var scrollDuration = 160;
  switch (preferredPlacement) {
    case 'auto':
    case 'bottom':
      // 1: the menu will fit, do nothing
      if (viewSpaceBelow >= menuHeight) {
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceBelow >= minHeight || isFixedPosition && viewSpaceBelow >= minHeight) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        var constrainedHeight = isFixedPosition ? viewSpaceBelow - marginBottom : scrollSpaceBelow - marginBottom;
        return {
          placement: 'bottom',
          maxHeight: constrainedHeight
        };
      }

      // 4. Forked beviour when there isn't enough space below

      // AUTO: flip the menu, render above
      if (preferredPlacement === 'auto' || isFixedPosition) {
        // may need to be constrained after flipping
        var _constrainedHeight = preferredMaxHeight;
        var spaceAbove = isFixedPosition ? viewSpaceAbove : scrollSpaceAbove;
        if (spaceAbove >= minHeight) {
          _constrainedHeight = Math.min(spaceAbove - marginBottom - controlHeight, preferredMaxHeight);
        }
        return {
          placement: 'top',
          maxHeight: _constrainedHeight
        };
      }

      // BOTTOM: allow browser to increase scrollable area and immediately set scroll
      if (preferredPlacement === 'bottom') {
        if (shouldScroll) {
          scrollTo(scrollParent, scrollDown);
        }
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }
      break;
    case 'top':
      // 1: the menu will fit, do nothing
      if (viewSpaceAbove >= menuHeight) {
        return {
          placement: 'top',
          maxHeight: preferredMaxHeight
        };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }
        return {
          placement: 'top',
          maxHeight: preferredMaxHeight
        };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
        var _constrainedHeight2 = preferredMaxHeight;

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight2 = isFixedPosition ? viewSpaceAbove - marginTop : scrollSpaceAbove - marginTop;
        }
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }
        return {
          placement: 'top',
          maxHeight: _constrainedHeight2
        };
      }

      // 4. not enough space, the browser WILL NOT increase scrollable area when
      // absolutely positioned element rendered above the viewport (only below).
      // Flip the menu, render below
      return {
        placement: 'bottom',
        maxHeight: preferredMaxHeight
      };
    default:
      throw new Error("Invalid placement provided \"".concat(preferredPlacement, "\"."));
  }
  return defaultState;
}

// Menu Component
// ------------------------------

function alignToControl(placement) {
  var placementToCSSProp = {
    bottom: 'top',
    top: 'bottom'
  };
  return placement ? placementToCSSProp[placement] : 'bottom';
}
var coercePlacement = function coercePlacement(p) {
  return p === 'auto' ? 'bottom' : p;
};
var menuCSS = function menuCSS(_ref2, unstyled) {
  var _objectSpread2;
  var placement = _ref2.placement,
    _ref2$theme = _ref2.theme,
    borderRadius = _ref2$theme.borderRadius,
    spacing = _ref2$theme.spacing,
    colors = _ref2$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((_objectSpread2 = {
    label: 'menu'
  }, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(_objectSpread2, alignToControl(placement), '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(_objectSpread2, "position", 'absolute'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(_objectSpread2, "width", '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(_objectSpread2, "zIndex", 1), _objectSpread2), unstyled ? {} : {
    backgroundColor: colors.neutral0,
    borderRadius: borderRadius,
    boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)',
    marginBottom: spacing.menuGutter,
    marginTop: spacing.menuGutter
  });
};
var PortalPlacementContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_8__.createContext)(null);

// NOTE: internal only
var MenuPlacer = function MenuPlacer(props) {
  var children = props.children,
    minMenuHeight = props.minMenuHeight,
    maxMenuHeight = props.maxMenuHeight,
    menuPlacement = props.menuPlacement,
    menuPosition = props.menuPosition,
    menuShouldScrollIntoView = props.menuShouldScrollIntoView,
    theme = props.theme;
  var _ref3 = (0,react__WEBPACK_IMPORTED_MODULE_8__.useContext)(PortalPlacementContext) || {},
    setPortalPlacement = _ref3.setPortalPlacement;
  var ref = (0,react__WEBPACK_IMPORTED_MODULE_8__.useRef)(null);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(maxMenuHeight),
    _useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState, 2),
    maxHeight = _useState2[0],
    setMaxHeight = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(null),
    _useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState3, 2),
    placement = _useState4[0],
    setPlacement = _useState4[1];
  var controlHeight = theme.spacing.controlHeight;
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_11__["default"])(function () {
    var menuEl = ref.current;
    if (!menuEl) return;

    // DO NOT scroll if position is fixed
    var isFixedPosition = menuPosition === 'fixed';
    var shouldScroll = menuShouldScrollIntoView && !isFixedPosition;
    var state = getMenuPlacement({
      maxHeight: maxMenuHeight,
      menuEl: menuEl,
      minHeight: minMenuHeight,
      placement: menuPlacement,
      shouldScroll: shouldScroll,
      isFixedPosition: isFixedPosition,
      controlHeight: controlHeight
    });
    setMaxHeight(state.maxHeight);
    setPlacement(state.placement);
    setPortalPlacement === null || setPortalPlacement === void 0 ? void 0 : setPortalPlacement(state.placement);
  }, [maxMenuHeight, menuPlacement, menuPosition, menuShouldScrollIntoView, minMenuHeight, setPortalPlacement, controlHeight]);
  return children({
    ref: ref,
    placerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
      placement: placement || coercePlacement(menuPlacement),
      maxHeight: maxHeight
    })
  });
};
var Menu = function Menu(props) {
  var children = props.children,
    innerRef = props.innerRef,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'menu', {
    menu: true
  }), {
    ref: innerRef
  }, innerProps), children);
};
var Menu$1 = Menu;

// ==============================
// Menu List
// ==============================

var menuListCSS = function menuListCSS(_ref4, unstyled) {
  var maxHeight = _ref4.maxHeight,
    baseUnit = _ref4.theme.spacing.baseUnit;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    maxHeight: maxHeight,
    overflowY: 'auto',
    position: 'relative',
    // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: 'touch'
  }, unstyled ? {} : {
    paddingBottom: baseUnit,
    paddingTop: baseUnit
  });
};
var MenuList = function MenuList(props) {
  var children = props.children,
    innerProps = props.innerProps,
    innerRef = props.innerRef,
    isMulti = props.isMulti;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'menuList', {
    'menu-list': true,
    'menu-list--is-multi': isMulti
  }), {
    ref: innerRef
  }, innerProps), children);
};

// ==============================
// Menu Notices
// ==============================

var noticeCSS = function noticeCSS(_ref5, unstyled) {
  var _ref5$theme = _ref5.theme,
    baseUnit = _ref5$theme.spacing.baseUnit,
    colors = _ref5$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    textAlign: 'center'
  }, unstyled ? {} : {
    color: colors.neutral40,
    padding: "".concat(baseUnit * 2, "px ").concat(baseUnit * 3, "px")
  });
};
var noOptionsMessageCSS = noticeCSS;
var loadingMessageCSS = noticeCSS;
var NoOptionsMessage = function NoOptionsMessage(_ref6) {
  var _ref6$children = _ref6.children,
    children = _ref6$children === void 0 ? 'No options' : _ref6$children,
    innerProps = _ref6.innerProps,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref6, _excluded$3);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    children: children,
    innerProps: innerProps
  }), 'noOptionsMessage', {
    'menu-notice': true,
    'menu-notice--no-options': true
  }), innerProps), children);
};
var LoadingMessage = function LoadingMessage(_ref7) {
  var _ref7$children = _ref7.children,
    children = _ref7$children === void 0 ? 'Loading...' : _ref7$children,
    innerProps = _ref7.innerProps,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref7, _excluded2$1);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    children: children,
    innerProps: innerProps
  }), 'loadingMessage', {
    'menu-notice': true,
    'menu-notice--loading': true
  }), innerProps), children);
};

// ==============================
// Menu Portal
// ==============================

var menuPortalCSS = function menuPortalCSS(_ref8) {
  var rect = _ref8.rect,
    offset = _ref8.offset,
    position = _ref8.position;
  return {
    left: rect.left,
    position: position,
    top: offset,
    width: rect.width,
    zIndex: 1
  };
};
var MenuPortal = function MenuPortal(props) {
  var appendTo = props.appendTo,
    children = props.children,
    controlElement = props.controlElement,
    innerProps = props.innerProps,
    menuPlacement = props.menuPlacement,
    menuPosition = props.menuPosition;
  var menuPortalRef = (0,react__WEBPACK_IMPORTED_MODULE_8__.useRef)(null);
  var cleanupRef = (0,react__WEBPACK_IMPORTED_MODULE_8__.useRef)(null);
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(coercePlacement(menuPlacement)),
    _useState6 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState5, 2),
    placement = _useState6[0],
    setPortalPlacement = _useState6[1];
  var portalPlacementContext = (0,react__WEBPACK_IMPORTED_MODULE_8__.useMemo)(function () {
    return {
      setPortalPlacement: setPortalPlacement
    };
  }, []);
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(null),
    _useState8 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState7, 2),
    computedPosition = _useState8[0],
    setComputedPosition = _useState8[1];
  var updateComputedPosition = (0,react__WEBPACK_IMPORTED_MODULE_8__.useCallback)(function () {
    if (!controlElement) return;
    var rect = getBoundingClientObj(controlElement);
    var scrollDistance = menuPosition === 'fixed' ? 0 : window.pageYOffset;
    var offset = rect[placement] + scrollDistance;
    if (offset !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.offset) || rect.left !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.left) || rect.width !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.width)) {
      setComputedPosition({
        offset: offset,
        rect: rect
      });
    }
  }, [controlElement, menuPosition, placement, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.offset, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.left, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.width]);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_11__["default"])(function () {
    updateComputedPosition();
  }, [updateComputedPosition]);
  var runAutoUpdate = (0,react__WEBPACK_IMPORTED_MODULE_8__.useCallback)(function () {
    if (typeof cleanupRef.current === 'function') {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (controlElement && menuPortalRef.current) {
      cleanupRef.current = (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_10__.autoUpdate)(controlElement, menuPortalRef.current, updateComputedPosition, {
        elementResize: 'ResizeObserver' in window
      });
    }
  }, [controlElement, updateComputedPosition]);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_11__["default"])(function () {
    runAutoUpdate();
  }, [runAutoUpdate]);
  var setMenuPortalElement = (0,react__WEBPACK_IMPORTED_MODULE_8__.useCallback)(function (menuPortalElement) {
    menuPortalRef.current = menuPortalElement;
    runAutoUpdate();
  }, [runAutoUpdate]);

  // bail early if required elements aren't present
  if (!appendTo && menuPosition !== 'fixed' || !computedPosition) return null;

  // same wrapper element whether fixed or portalled
  var menuWrapper = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: setMenuPortalElement
  }, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
    offset: computedPosition.offset,
    position: menuPosition,
    rect: computedPosition.rect
  }), 'menuPortal', {
    'menu-portal': true
  }), innerProps), children);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(PortalPlacementContext.Provider, {
    value: portalPlacementContext
  }, appendTo ? /*#__PURE__*/(0,react_dom__WEBPACK_IMPORTED_MODULE_9__.createPortal)(menuWrapper, appendTo) : menuWrapper);
};

// ==============================
// Root Container
// ==============================

var containerCSS = function containerCSS(_ref) {
  var isDisabled = _ref.isDisabled,
    isRtl = _ref.isRtl;
  return {
    label: 'container',
    direction: isRtl ? 'rtl' : undefined,
    pointerEvents: isDisabled ? 'none' : undefined,
    // cancel mouse events when disabled
    position: 'relative'
  };
};
var SelectContainer = function SelectContainer(props) {
  var children = props.children,
    innerProps = props.innerProps,
    isDisabled = props.isDisabled,
    isRtl = props.isRtl;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'container', {
    '--is-disabled': isDisabled,
    '--is-rtl': isRtl
  }), innerProps), children);
};

// ==============================
// Value Container
// ==============================

var valueContainerCSS = function valueContainerCSS(_ref2, unstyled) {
  var spacing = _ref2.theme.spacing,
    isMulti = _ref2.isMulti,
    hasValue = _ref2.hasValue,
    controlShouldRenderValue = _ref2.selectProps.controlShouldRenderValue;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    alignItems: 'center',
    display: isMulti && hasValue && controlShouldRenderValue ? 'flex' : 'grid',
    flex: 1,
    flexWrap: 'wrap',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overflow: 'hidden'
  }, unstyled ? {} : {
    padding: "".concat(spacing.baseUnit / 2, "px ").concat(spacing.baseUnit * 2, "px")
  });
};
var ValueContainer = function ValueContainer(props) {
  var children = props.children,
    innerProps = props.innerProps,
    isMulti = props.isMulti,
    hasValue = props.hasValue;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'valueContainer', {
    'value-container': true,
    'value-container--is-multi': isMulti,
    'value-container--has-value': hasValue
  }), innerProps), children);
};

// ==============================
// Indicator Container
// ==============================

var indicatorsContainerCSS = function indicatorsContainerCSS() {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 0
  };
};
var IndicatorsContainer = function IndicatorsContainer(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'indicatorsContainer', {
    indicators: true
  }), innerProps), children);
};

var _templateObject;
var _excluded$2 = ["size"],
  _excluded2 = ["innerProps", "isRtl", "size"];
function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

// ==============================
// Dropdown & Clear Icons
// ==============================
var _ref2 =  false ? 0 : {
  name: "tj5bde-Svg",
  styles: "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0;label:Svg;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgSlNYLCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBqc3gsIGtleWZyYW1lcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWUsXG4gIENTU09iamVjdFdpdGhMYWJlbCxcbiAgR3JvdXBCYXNlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRTdHlsZVByb3BzIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoe1xuICBzaXplLFxuICAuLi5wcm9wc1xufTogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZTogbnVtYmVyIH0pID0+IChcbiAgPHN2Z1xuICAgIGhlaWdodD17c2l6ZX1cbiAgICB3aWR0aD17c2l6ZX1cbiAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICBjc3M9e3tcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgc3Ryb2tlOiAnY3VycmVudENvbG9yJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IHR5cGUgQ3Jvc3NJY29uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgQ3Jvc3NJY29uID0gKHByb3BzOiBDcm9zc0ljb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNMTQuMzQ4IDE0Ljg0OWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMGwtMi42NTEtMy4wMzAtMi42NTEgMy4wMjljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDAtMC40NjktMC40NjktMC40NjktMS4yMjkgMC0xLjY5N2wyLjc1OC0zLjE1LTIuNzU5LTMuMTUyYy0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOCAwLTEuNjk3czEuMjI4LTAuNDY5IDEuNjk3IDBsMi42NTIgMy4wMzEgMi42NTEtMy4wMzFjMC40NjktMC40NjkgMS4yMjgtMC40NjkgMS42OTcgMHMwLjQ2OSAxLjIyOSAwIDEuNjk3bC0yLjc1OCAzLjE1MiAyLjc1OCAzLjE1YzAuNDY5IDAuNDY5IDAuNDY5IDEuMjI5IDAgMS42OTh6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuZXhwb3J0IHR5cGUgRG93bkNoZXZyb25Qcm9wcyA9IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU/OiBudW1iZXIgfTtcbmV4cG9ydCBjb25zdCBEb3duQ2hldnJvbiA9IChwcm9wczogRG93bkNoZXZyb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snZGl2J107XG4gIC8qKiBUaGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0LiAqL1xuICBpc0ZvY3VzZWQ6IGJvb2xlYW47XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJhc2VDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0ZvY3VzZWQsXG4gICAgdGhlbWU6IHtcbiAgICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICAgIGNvbG9ycyxcbiAgICB9LFxuICB9OlxuICAgIHwgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuICAgIHwgQ2xlYXJJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPixcbiAgdW5zdHlsZWQ6IGJvb2xlYW5cbik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2luZGljYXRvckNvbnRhaW5lcicsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcbiAgLi4uKHVuc3R5bGVkXG4gICAgPyB7fVxuICAgIDoge1xuICAgICAgICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gICAgICAgIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgICAgICAgJzpob3Zlcic6IHtcbiAgICAgICAgICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsNDAsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnZHJvcGRvd25JbmRpY2F0b3InLCB7XG4gICAgICAgIGluZGljYXRvcjogdHJ1ZSxcbiAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8RG93bkNoZXZyb24gLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIENsZWFySW5kaWNhdG9yUHJvcHM8XG4gIE9wdGlvbiA9IHVua25vd24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuID0gYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPiA9IEdyb3VwQmFzZTxPcHRpb24+XG4+IGV4dGVuZHMgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWU8T3B0aW9uLCBJc011bHRpLCBHcm91cD4ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkIGluc2lkZSB0aGUgaW5kaWNhdG9yLiAqL1xuICBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgY2xlYXJJbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IENsZWFySW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogQ2xlYXJJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnY2xlYXJJbmRpY2F0b3InLCB7XG4gICAgICAgIGluZGljYXRvcjogdHJ1ZSxcbiAgICAgICAgJ2NsZWFyLWluZGljYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8Q3Jvc3NJY29uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTZXBhcmF0b3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGljYXRvclNlcGFyYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpbm5lclByb3BzPzogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ107XG59XG5cbmV4cG9ydCBjb25zdCBpbmRpY2F0b3JTZXBhcmF0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0Rpc2FibGVkLFxuICAgIHRoZW1lOiB7XG4gICAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gICAgICBjb2xvcnMsXG4gICAgfSxcbiAgfTogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JTZXBhcmF0b3InLFxuICBhbGlnblNlbGY6ICdzdHJldGNoJyxcbiAgd2lkdGg6IDEsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpc0Rpc2FibGVkID8gY29sb3JzLm5ldXRyYWwxMCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogYmFzZVVuaXQgKiAyLFxuICAgICAgICBtYXJnaW5Ub3A6IGJhc2VVbml0ICogMixcbiAgICAgIH0pLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHNwYW5cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgey4uLmdldFN0eWxlUHJvcHMocHJvcHMsICdpbmRpY2F0b3JTZXBhcmF0b3InLCB7XG4gICAgICAgICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSxcbiAgICAgIH0pfVxuICAgIC8+XG4gICk7XG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIExvYWRpbmdcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBsb2FkaW5nRG90QW5pbWF0aW9ucyA9IGtleWZyYW1lc2BcbiAgMCUsIDgwJSwgMTAwJSB7IG9wYWNpdHk6IDA7IH1cbiAgNDAlIHsgb3BhY2l0eTogMTsgfVxuYDtcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0ZvY3VzZWQsXG4gICAgc2l6ZSxcbiAgICB0aGVtZToge1xuICAgICAgY29sb3JzLFxuICAgICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgIH0sXG4gIH06IExvYWRpbmdJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPixcbiAgdW5zdHlsZWQ6IGJvb2xlYW5cbik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2xvYWRpbmdJbmRpY2F0b3InLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHRyYW5zaXRpb246ICdjb2xvciAxNTBtcycsXG4gIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gIGZvbnRTaXplOiBzaXplLFxuICBsaW5lSGVpZ2h0OiAxLFxuICBtYXJnaW5SaWdodDogc2l6ZSxcbiAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBwYWRkaW5nOiBiYXNlVW5pdCAqIDIsXG4gICAgICB9KSxcbn0pO1xuXG5pbnRlcmZhY2UgTG9hZGluZ0RvdFByb3BzIHtcbiAgZGVsYXk6IG51bWJlcjtcbiAgb2Zmc2V0OiBib29sZWFuO1xufVxuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGRlbGF5LCBvZmZzZXQgfTogTG9hZGluZ0RvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb246IGAke2xvYWRpbmdEb3RBbmltYXRpb25zfSAxcyBlYXNlLWluLW91dCAke2RlbGF5fW1zIGluZmluaXRlO2AsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjdXJyZW50Q29sb3InLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgbWFyZ2luTGVmdDogb2Zmc2V0ID8gJzFlbScgOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZGluZ0luZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyO1xufVxuZXhwb3J0IGNvbnN0IExvYWRpbmdJbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpbm5lclByb3BzLFxuICBpc1J0bCxcbiAgc2l6ZSA9IDQsXG4gIC4uLnJlc3RQcm9wc1xufTogTG9hZGluZ0luZGljYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgey4uLmdldFN0eWxlUHJvcHMoXG4gICAgICAgIHsgLi4ucmVzdFByb3BzLCBpbm5lclByb3BzLCBpc1J0bCwgc2l6ZSB9LFxuICAgICAgICAnbG9hZGluZ0luZGljYXRvcicsXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXswfSBvZmZzZXQ9e2lzUnRsfSAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezE2MH0gb2Zmc2V0IC8+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};
var Svg = function Svg(_ref) {
  var size = _ref.size,
    props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref, _excluded$2);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    height: size,
    width: size,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
    css: _ref2
  }, props));
};
var CrossIcon = function CrossIcon(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
    d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
  }));
};
var DownChevron = function DownChevron(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
    d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
  }));
};

// ==============================
// Dropdown & Clear Buttons
// ==============================

var baseCSS = function baseCSS(_ref3, unstyled) {
  var isFocused = _ref3.isFocused,
    _ref3$theme = _ref3.theme,
    baseUnit = _ref3$theme.spacing.baseUnit,
    colors = _ref3$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'indicatorContainer',
    display: 'flex',
    transition: 'color 150ms'
  }, unstyled ? {} : {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    padding: baseUnit * 2,
    ':hover': {
      color: isFocused ? colors.neutral80 : colors.neutral40
    }
  });
};
var dropdownIndicatorCSS = baseCSS;
var DropdownIndicator = function DropdownIndicator(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'dropdownIndicator', {
    indicator: true,
    'dropdown-indicator': true
  }), innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(DownChevron, null));
};
var clearIndicatorCSS = baseCSS;
var ClearIndicator = function ClearIndicator(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'clearIndicator', {
    indicator: true,
    'clear-indicator': true
  }), innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(CrossIcon, null));
};

// ==============================
// Separator
// ==============================

var indicatorSeparatorCSS = function indicatorSeparatorCSS(_ref4, unstyled) {
  var isDisabled = _ref4.isDisabled,
    _ref4$theme = _ref4.theme,
    baseUnit = _ref4$theme.spacing.baseUnit,
    colors = _ref4$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'indicatorSeparator',
    alignSelf: 'stretch',
    width: 1
  }, unstyled ? {} : {
    backgroundColor: isDisabled ? colors.neutral10 : colors.neutral20,
    marginBottom: baseUnit * 2,
    marginTop: baseUnit * 2
  });
};
var IndicatorSeparator = function IndicatorSeparator(props) {
  var innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, innerProps, getStyleProps(props, 'indicatorSeparator', {
    'indicator-separator': true
  })));
};

// ==============================
// Loading
// ==============================

var loadingDotAnimations = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.keyframes)(_templateObject || (_templateObject = (0,_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__["default"])(["\n  0%, 80%, 100% { opacity: 0; }\n  40% { opacity: 1; }\n"])));
var loadingIndicatorCSS = function loadingIndicatorCSS(_ref5, unstyled) {
  var isFocused = _ref5.isFocused,
    size = _ref5.size,
    _ref5$theme = _ref5.theme,
    colors = _ref5$theme.colors,
    baseUnit = _ref5$theme.spacing.baseUnit;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'loadingIndicator',
    display: 'flex',
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: size,
    lineHeight: 1,
    marginRight: size,
    textAlign: 'center',
    verticalAlign: 'middle'
  }, unstyled ? {} : {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    padding: baseUnit * 2
  });
};
var LoadingDot = function LoadingDot(_ref6) {
  var delay = _ref6.delay,
    offset = _ref6.offset;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.css)({
      animation: "".concat(loadingDotAnimations, " 1s ease-in-out ").concat(delay, "ms infinite;"),
      backgroundColor: 'currentColor',
      borderRadius: '1em',
      display: 'inline-block',
      marginLeft: offset ? '1em' : undefined,
      height: '1em',
      verticalAlign: 'top',
      width: '1em'
    },  false ? 0 : ";label:LoadingDot;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1RSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgSlNYLCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBqc3gsIGtleWZyYW1lcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWUsXG4gIENTU09iamVjdFdpdGhMYWJlbCxcbiAgR3JvdXBCYXNlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRTdHlsZVByb3BzIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoe1xuICBzaXplLFxuICAuLi5wcm9wc1xufTogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZTogbnVtYmVyIH0pID0+IChcbiAgPHN2Z1xuICAgIGhlaWdodD17c2l6ZX1cbiAgICB3aWR0aD17c2l6ZX1cbiAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICBjc3M9e3tcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgc3Ryb2tlOiAnY3VycmVudENvbG9yJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IHR5cGUgQ3Jvc3NJY29uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgQ3Jvc3NJY29uID0gKHByb3BzOiBDcm9zc0ljb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNMTQuMzQ4IDE0Ljg0OWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMGwtMi42NTEtMy4wMzAtMi42NTEgMy4wMjljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDAtMC40NjktMC40NjktMC40NjktMS4yMjkgMC0xLjY5N2wyLjc1OC0zLjE1LTIuNzU5LTMuMTUyYy0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOCAwLTEuNjk3czEuMjI4LTAuNDY5IDEuNjk3IDBsMi42NTIgMy4wMzEgMi42NTEtMy4wMzFjMC40NjktMC40NjkgMS4yMjgtMC40NjkgMS42OTcgMHMwLjQ2OSAxLjIyOSAwIDEuNjk3bC0yLjc1OCAzLjE1MiAyLjc1OCAzLjE1YzAuNDY5IDAuNDY5IDAuNDY5IDEuMjI5IDAgMS42OTh6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuZXhwb3J0IHR5cGUgRG93bkNoZXZyb25Qcm9wcyA9IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU/OiBudW1iZXIgfTtcbmV4cG9ydCBjb25zdCBEb3duQ2hldnJvbiA9IChwcm9wczogRG93bkNoZXZyb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snZGl2J107XG4gIC8qKiBUaGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0LiAqL1xuICBpc0ZvY3VzZWQ6IGJvb2xlYW47XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJhc2VDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0ZvY3VzZWQsXG4gICAgdGhlbWU6IHtcbiAgICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICAgIGNvbG9ycyxcbiAgICB9LFxuICB9OlxuICAgIHwgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuICAgIHwgQ2xlYXJJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPixcbiAgdW5zdHlsZWQ6IGJvb2xlYW5cbik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2luZGljYXRvckNvbnRhaW5lcicsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcbiAgLi4uKHVuc3R5bGVkXG4gICAgPyB7fVxuICAgIDoge1xuICAgICAgICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gICAgICAgIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgICAgICAgJzpob3Zlcic6IHtcbiAgICAgICAgICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsNDAsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnZHJvcGRvd25JbmRpY2F0b3InLCB7XG4gICAgICAgIGluZGljYXRvcjogdHJ1ZSxcbiAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8RG93bkNoZXZyb24gLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIENsZWFySW5kaWNhdG9yUHJvcHM8XG4gIE9wdGlvbiA9IHVua25vd24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuID0gYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPiA9IEdyb3VwQmFzZTxPcHRpb24+XG4+IGV4dGVuZHMgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWU8T3B0aW9uLCBJc011bHRpLCBHcm91cD4ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkIGluc2lkZSB0aGUgaW5kaWNhdG9yLiAqL1xuICBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgY2xlYXJJbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IENsZWFySW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogQ2xlYXJJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnY2xlYXJJbmRpY2F0b3InLCB7XG4gICAgICAgIGluZGljYXRvcjogdHJ1ZSxcbiAgICAgICAgJ2NsZWFyLWluZGljYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8Q3Jvc3NJY29uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTZXBhcmF0b3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGljYXRvclNlcGFyYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpbm5lclByb3BzPzogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ107XG59XG5cbmV4cG9ydCBjb25zdCBpbmRpY2F0b3JTZXBhcmF0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0Rpc2FibGVkLFxuICAgIHRoZW1lOiB7XG4gICAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gICAgICBjb2xvcnMsXG4gICAgfSxcbiAgfTogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JTZXBhcmF0b3InLFxuICBhbGlnblNlbGY6ICdzdHJldGNoJyxcbiAgd2lkdGg6IDEsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpc0Rpc2FibGVkID8gY29sb3JzLm5ldXRyYWwxMCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogYmFzZVVuaXQgKiAyLFxuICAgICAgICBtYXJnaW5Ub3A6IGJhc2VVbml0ICogMixcbiAgICAgIH0pLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuKSA9PiB7XG4gIGNvbnN0IHsgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHNwYW5cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgey4uLmdldFN0eWxlUHJvcHMocHJvcHMsICdpbmRpY2F0b3JTZXBhcmF0b3InLCB7XG4gICAgICAgICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSxcbiAgICAgIH0pfVxuICAgIC8+XG4gICk7XG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIExvYWRpbmdcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBsb2FkaW5nRG90QW5pbWF0aW9ucyA9IGtleWZyYW1lc2BcbiAgMCUsIDgwJSwgMTAwJSB7IG9wYWNpdHk6IDA7IH1cbiAgNDAlIHsgb3BhY2l0eTogMTsgfVxuYDtcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHtcbiAgICBpc0ZvY3VzZWQsXG4gICAgc2l6ZSxcbiAgICB0aGVtZToge1xuICAgICAgY29sb3JzLFxuICAgICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgIH0sXG4gIH06IExvYWRpbmdJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPixcbiAgdW5zdHlsZWQ6IGJvb2xlYW5cbik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2xvYWRpbmdJbmRpY2F0b3InLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHRyYW5zaXRpb246ICdjb2xvciAxNTBtcycsXG4gIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gIGZvbnRTaXplOiBzaXplLFxuICBsaW5lSGVpZ2h0OiAxLFxuICBtYXJnaW5SaWdodDogc2l6ZSxcbiAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBwYWRkaW5nOiBiYXNlVW5pdCAqIDIsXG4gICAgICB9KSxcbn0pO1xuXG5pbnRlcmZhY2UgTG9hZGluZ0RvdFByb3BzIHtcbiAgZGVsYXk6IG51bWJlcjtcbiAgb2Zmc2V0OiBib29sZWFuO1xufVxuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGRlbGF5LCBvZmZzZXQgfTogTG9hZGluZ0RvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb246IGAke2xvYWRpbmdEb3RBbmltYXRpb25zfSAxcyBlYXNlLWluLW91dCAke2RlbGF5fW1zIGluZmluaXRlO2AsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjdXJyZW50Q29sb3InLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgbWFyZ2luTGVmdDogb2Zmc2V0ID8gJzFlbScgOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZGluZ0luZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyO1xufVxuZXhwb3J0IGNvbnN0IExvYWRpbmdJbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpbm5lclByb3BzLFxuICBpc1J0bCxcbiAgc2l6ZSA9IDQsXG4gIC4uLnJlc3RQcm9wc1xufTogTG9hZGluZ0luZGljYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgey4uLmdldFN0eWxlUHJvcHMoXG4gICAgICAgIHsgLi4ucmVzdFByb3BzLCBpbm5lclByb3BzLCBpc1J0bCwgc2l6ZSB9LFxuICAgICAgICAnbG9hZGluZ0luZGljYXRvcicsXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXswfSBvZmZzZXQ9e2lzUnRsfSAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezE2MH0gb2Zmc2V0IC8+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0= */")
  });
};
var LoadingIndicator = function LoadingIndicator(_ref7) {
  var innerProps = _ref7.innerProps,
    isRtl = _ref7.isRtl,
    _ref7$size = _ref7.size,
    size = _ref7$size === void 0 ? 4 : _ref7$size,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref7, _excluded2);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    innerProps: innerProps,
    isRtl: isRtl,
    size: size
  }), 'loadingIndicator', {
    indicator: true,
    'loading-indicator': true
  }), innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(LoadingDot, {
    delay: 0,
    offset: isRtl
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(LoadingDot, {
    delay: 160,
    offset: true
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(LoadingDot, {
    delay: 320,
    offset: !isRtl
  }));
};

var css$1 = function css(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    isFocused = _ref.isFocused,
    _ref$theme = _ref.theme,
    colors = _ref$theme.colors,
    borderRadius = _ref$theme.borderRadius,
    spacing = _ref$theme.spacing;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'control',
    alignItems: 'center',
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: spacing.controlHeight,
    outline: '0 !important',
    position: 'relative',
    transition: 'all 100ms'
  }, unstyled ? {} : {
    backgroundColor: isDisabled ? colors.neutral5 : colors.neutral0,
    borderColor: isDisabled ? colors.neutral10 : isFocused ? colors.primary : colors.neutral20,
    borderRadius: borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: isFocused ? "0 0 0 1px ".concat(colors.primary) : undefined,
    '&:hover': {
      borderColor: isFocused ? colors.primary : colors.neutral30
    }
  });
};
var Control = function Control(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    isFocused = props.isFocused,
    innerRef = props.innerRef,
    innerProps = props.innerProps,
    menuIsOpen = props.menuIsOpen;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: innerRef
  }, getStyleProps(props, 'control', {
    control: true,
    'control--is-disabled': isDisabled,
    'control--is-focused': isFocused,
    'control--menu-is-open': menuIsOpen
  }), innerProps, {
    "aria-disabled": isDisabled || undefined
  }), children);
};
var Control$1 = Control;

var _excluded$1 = ["data"];
var groupCSS = function groupCSS(_ref, unstyled) {
  var spacing = _ref.theme.spacing;
  return unstyled ? {} : {
    paddingBottom: spacing.baseUnit * 2,
    paddingTop: spacing.baseUnit * 2
  };
};
var Group = function Group(props) {
  var children = props.children,
    cx = props.cx,
    getStyles = props.getStyles,
    getClassNames = props.getClassNames,
    Heading = props.Heading,
    headingProps = props.headingProps,
    innerProps = props.innerProps,
    label = props.label,
    theme = props.theme,
    selectProps = props.selectProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'group', {
    group: true
  }), innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Heading, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, headingProps, {
    selectProps: selectProps,
    theme: theme,
    getStyles: getStyles,
    getClassNames: getClassNames,
    cx: cx
  }), label), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", null, children));
};
var groupHeadingCSS = function groupHeadingCSS(_ref2, unstyled) {
  var _ref2$theme = _ref2.theme,
    colors = _ref2$theme.colors,
    spacing = _ref2$theme.spacing;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'group',
    cursor: 'default',
    display: 'block'
  }, unstyled ? {} : {
    color: colors.neutral40,
    fontSize: '75%',
    fontWeight: 500,
    marginBottom: '0.25em',
    paddingLeft: spacing.baseUnit * 3,
    paddingRight: spacing.baseUnit * 3,
    textTransform: 'uppercase'
  });
};
var GroupHeading = function GroupHeading(props) {
  var _cleanCommonProps = cleanCommonProps(props);
    _cleanCommonProps.data;
    var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_cleanCommonProps, _excluded$1);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'groupHeading', {
    'group-heading': true
  }), innerProps));
};
var Group$1 = Group;

var _excluded = ["innerRef", "isDisabled", "isHidden", "inputClassName"];
var inputCSS = function inputCSS(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    value = _ref.value,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    visibility: isDisabled ? 'hidden' : 'visible',
    // force css to recompute when value change due to @emotion bug.
    // We can remove it whenever the bug is fixed.
    transform: value ? 'translateZ(0)' : ''
  }, containerStyle), unstyled ? {} : {
    margin: spacing.baseUnit / 2,
    paddingBottom: spacing.baseUnit / 2,
    paddingTop: spacing.baseUnit / 2,
    color: colors.neutral80
  });
};
var spacingStyle = {
  gridArea: '1 / 2',
  font: 'inherit',
  minWidth: '2px',
  border: 0,
  margin: 0,
  outline: 0,
  padding: 0
};
var containerStyle = {
  flex: '1 1 auto',
  display: 'inline-grid',
  gridArea: '1 / 1 / 2 / 3',
  gridTemplateColumns: '0 min-content',
  '&:after': (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    content: 'attr(data-value) " "',
    visibility: 'hidden',
    whiteSpace: 'pre'
  }, spacingStyle)
};
var inputStyle = function inputStyle(isHidden) {
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'input',
    color: 'inherit',
    background: 0,
    opacity: isHidden ? 0 : 1,
    width: '100%'
  }, spacingStyle);
};
var Input = function Input(props) {
  var cx = props.cx,
    value = props.value;
  var _cleanCommonProps = cleanCommonProps(props),
    innerRef = _cleanCommonProps.innerRef,
    isDisabled = _cleanCommonProps.isDisabled,
    isHidden = _cleanCommonProps.isHidden,
    inputClassName = _cleanCommonProps.inputClassName,
    innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__["default"])(_cleanCommonProps, _excluded);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'input', {
    'input-container': true
  }), {
    "data-value": value || ''
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    className: cx({
      input: true
    }, inputClassName),
    ref: innerRef,
    style: inputStyle(isHidden),
    disabled: isDisabled
  }, innerProps)));
};
var Input$1 = Input;

var multiValueCSS = function multiValueCSS(_ref, unstyled) {
  var _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    borderRadius = _ref$theme.borderRadius,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'multiValue',
    display: 'flex',
    minWidth: 0
  }, unstyled ? {} : {
    backgroundColor: colors.neutral10,
    borderRadius: borderRadius / 2,
    margin: spacing.baseUnit / 2
  });
};
var multiValueLabelCSS = function multiValueLabelCSS(_ref2, unstyled) {
  var _ref2$theme = _ref2.theme,
    borderRadius = _ref2$theme.borderRadius,
    colors = _ref2$theme.colors,
    cropWithEllipsis = _ref2.cropWithEllipsis;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    overflow: 'hidden',
    textOverflow: cropWithEllipsis || cropWithEllipsis === undefined ? 'ellipsis' : undefined,
    whiteSpace: 'nowrap'
  }, unstyled ? {} : {
    borderRadius: borderRadius / 2,
    color: colors.neutral80,
    fontSize: '85%',
    padding: 3,
    paddingLeft: 6
  });
};
var multiValueRemoveCSS = function multiValueRemoveCSS(_ref3, unstyled) {
  var _ref3$theme = _ref3.theme,
    spacing = _ref3$theme.spacing,
    borderRadius = _ref3$theme.borderRadius,
    colors = _ref3$theme.colors,
    isFocused = _ref3.isFocused;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    alignItems: 'center',
    display: 'flex'
  }, unstyled ? {} : {
    borderRadius: borderRadius / 2,
    backgroundColor: isFocused ? colors.dangerLight : undefined,
    paddingLeft: spacing.baseUnit,
    paddingRight: spacing.baseUnit,
    ':hover': {
      backgroundColor: colors.dangerLight,
      color: colors.danger
    }
  });
};
var MultiValueGeneric = function MultiValueGeneric(_ref4) {
  var children = _ref4.children,
    innerProps = _ref4.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", innerProps, children);
};
var MultiValueContainer = MultiValueGeneric;
var MultiValueLabel = MultiValueGeneric;
function MultiValueRemove(_ref5) {
  var children = _ref5.children,
    innerProps = _ref5.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    role: "button"
  }, innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(CrossIcon, {
    size: 14
  }));
}
var MultiValue = function MultiValue(props) {
  var children = props.children,
    components = props.components,
    data = props.data,
    innerProps = props.innerProps,
    isDisabled = props.isDisabled,
    removeProps = props.removeProps,
    selectProps = props.selectProps;
  var Container = components.Container,
    Label = components.Label,
    Remove = components.Remove;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValue', {
      'multi-value': true,
      'multi-value--is-disabled': isDisabled
    })), innerProps),
    selectProps: selectProps
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Label, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValueLabel', {
      'multi-value__label': true
    })),
    selectProps: selectProps
  }, children), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(Remove, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValueRemove', {
      'multi-value__remove': true
    })), {}, {
      'aria-label': "Remove ".concat(children || 'option')
    }, removeProps),
    selectProps: selectProps
  }));
};
var MultiValue$1 = MultiValue;

var optionCSS = function optionCSS(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    isFocused = _ref.isFocused,
    isSelected = _ref.isSelected,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'option',
    cursor: 'default',
    display: 'block',
    fontSize: 'inherit',
    width: '100%',
    userSelect: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  }, unstyled ? {} : {
    backgroundColor: isSelected ? colors.primary : isFocused ? colors.primary25 : 'transparent',
    color: isDisabled ? colors.neutral20 : isSelected ? colors.neutral0 : 'inherit',
    padding: "".concat(spacing.baseUnit * 2, "px ").concat(spacing.baseUnit * 3, "px"),
    // provide some affordance on touch devices
    ':active': {
      backgroundColor: !isDisabled ? isSelected ? colors.primary : colors.primary50 : undefined
    }
  });
};
var Option = function Option(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    isFocused = props.isFocused,
    isSelected = props.isSelected,
    innerRef = props.innerRef,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'option', {
    option: true,
    'option--is-disabled': isDisabled,
    'option--is-focused': isFocused,
    'option--is-selected': isSelected
  }), {
    ref: innerRef,
    "aria-disabled": isDisabled
  }, innerProps), children);
};
var Option$1 = Option;

var placeholderCSS = function placeholderCSS(_ref, unstyled) {
  var _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'placeholder',
    gridArea: '1 / 1 / 2 / 3'
  }, unstyled ? {} : {
    color: colors.neutral50,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2
  });
};
var Placeholder = function Placeholder(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'placeholder', {
    placeholder: true
  }), innerProps), children);
};
var Placeholder$1 = Placeholder;

var css = function css(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'singleValue',
    gridArea: '1 / 1 / 2 / 3',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }, unstyled ? {} : {
    color: isDisabled ? colors.neutral40 : colors.neutral80,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2
  });
};
var SingleValue = function SingleValue(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'singleValue', {
    'single-value': true,
    'single-value--is-disabled': isDisabled
  }), innerProps), children);
};
var SingleValue$1 = SingleValue;

var components = {
  ClearIndicator: ClearIndicator,
  Control: Control$1,
  DropdownIndicator: DropdownIndicator,
  DownChevron: DownChevron,
  CrossIcon: CrossIcon,
  Group: Group$1,
  GroupHeading: GroupHeading,
  IndicatorsContainer: IndicatorsContainer,
  IndicatorSeparator: IndicatorSeparator,
  Input: Input$1,
  LoadingIndicator: LoadingIndicator,
  Menu: Menu$1,
  MenuList: MenuList,
  MenuPortal: MenuPortal,
  LoadingMessage: LoadingMessage,
  NoOptionsMessage: NoOptionsMessage,
  MultiValue: MultiValue$1,
  MultiValueContainer: MultiValueContainer,
  MultiValueLabel: MultiValueLabel,
  MultiValueRemove: MultiValueRemove,
  Option: Option$1,
  Placeholder: Placeholder$1,
  SelectContainer: SelectContainer,
  SingleValue: SingleValue$1,
  ValueContainer: ValueContainer
};
var defaultComponents = function defaultComponents(props) {
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, components), props.components);
};




/***/ },

/***/ "./node_modules/react-select/dist/react-select.esm.js"
/*!************************************************************!*\
  !*** ./node_modules/react-select/dist/react-select.esm.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NonceProvider: () => (/* binding */ NonceProvider),
/* harmony export */   components: () => (/* reexport safe */ _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_6__.c),
/* harmony export */   createFilter: () => (/* reexport safe */ _Select_ef7c0426_esm_js__WEBPACK_IMPORTED_MODULE_3__.c),
/* harmony export */   "default": () => (/* binding */ StateManagedSelect$1),
/* harmony export */   defaultTheme: () => (/* reexport safe */ _Select_ef7c0426_esm_js__WEBPACK_IMPORTED_MODULE_3__.d),
/* harmony export */   mergeStyles: () => (/* reexport safe */ _Select_ef7c0426_esm_js__WEBPACK_IMPORTED_MODULE_3__.m),
/* harmony export */   useStateManager: () => (/* reexport safe */ _useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__.u)
/* harmony export */ });
/* harmony import */ var _useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useStateManager-7e1e8489.esm.js */ "./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Select_ef7c0426_esm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Select-ef7c0426.esm.js */ "./node_modules/react-select/dist/Select-ef7c0426.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js");
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js");
/* harmony import */ var _index_641ee5b8_esm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./index-641ee5b8.esm.js */ "./node_modules/react-select/dist/index-641ee5b8.esm.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_createSuper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @babel/runtime/helpers/createSuper */ "./node_modules/@babel/runtime/helpers/esm/createSuper.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");


























var StateManagedSelect = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function (props, ref) {
  var baseSelectProps = (0,_useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__.u)(props);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_Select_ef7c0426_esm_js__WEBPACK_IMPORTED_MODULE_3__.S, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: ref
  }, baseSelectProps));
});
var StateManagedSelect$1 = StateManagedSelect;

var NonceProvider = (function (_ref) {
  var nonce = _ref.nonce,
    children = _ref.children,
    cacheKey = _ref.cacheKey;
  var emotionCache = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(function () {
    return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_5__["default"])({
      key: cacheKey,
      nonce: nonce
    });
  }, [cacheKey, nonce]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_emotion_react__WEBPACK_IMPORTED_MODULE_4__.C, {
    value: emotionCache
  }, children);
});




/***/ },

/***/ "./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js"
/*!************************************************************************!*\
  !*** ./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ useStateManager)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);





var _excluded = ["defaultInputValue", "defaultMenuIsOpen", "defaultValue", "inputValue", "menuIsOpen", "onChange", "onInputChange", "onMenuClose", "onMenuOpen", "value"];
function useStateManager(_ref) {
  var _ref$defaultInputValu = _ref.defaultInputValue,
    defaultInputValue = _ref$defaultInputValu === void 0 ? '' : _ref$defaultInputValu,
    _ref$defaultMenuIsOpe = _ref.defaultMenuIsOpen,
    defaultMenuIsOpen = _ref$defaultMenuIsOpe === void 0 ? false : _ref$defaultMenuIsOpe,
    _ref$defaultValue = _ref.defaultValue,
    defaultValue = _ref$defaultValue === void 0 ? null : _ref$defaultValue,
    propsInputValue = _ref.inputValue,
    propsMenuIsOpen = _ref.menuIsOpen,
    propsOnChange = _ref.onChange,
    propsOnInputChange = _ref.onInputChange,
    propsOnMenuClose = _ref.onMenuClose,
    propsOnMenuOpen = _ref.onMenuOpen,
    propsValue = _ref.value,
    restSelectProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, _excluded);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsInputValue !== undefined ? propsInputValue : defaultInputValue),
    _useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    stateInputValue = _useState2[0],
    setStateInputValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsMenuIsOpen !== undefined ? propsMenuIsOpen : defaultMenuIsOpen),
    _useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
    stateMenuIsOpen = _useState4[0],
    setStateMenuIsOpen = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsValue !== undefined ? propsValue : defaultValue),
    _useState6 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState5, 2),
    stateValue = _useState6[0],
    setStateValue = _useState6[1];
  var onChange = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function (value, actionMeta) {
    if (typeof propsOnChange === 'function') {
      propsOnChange(value, actionMeta);
    }
    setStateValue(value);
  }, [propsOnChange]);
  var onInputChange = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function (value, actionMeta) {
    var newValue;
    if (typeof propsOnInputChange === 'function') {
      newValue = propsOnInputChange(value, actionMeta);
    }
    setStateInputValue(newValue !== undefined ? newValue : value);
  }, [propsOnInputChange]);
  var onMenuOpen = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function () {
    if (typeof propsOnMenuOpen === 'function') {
      propsOnMenuOpen();
    }
    setStateMenuIsOpen(true);
  }, [propsOnMenuOpen]);
  var onMenuClose = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function () {
    if (typeof propsOnMenuClose === 'function') {
      propsOnMenuClose();
    }
    setStateMenuIsOpen(false);
  }, [propsOnMenuClose]);
  var inputValue = propsInputValue !== undefined ? propsInputValue : stateInputValue;
  var menuIsOpen = propsMenuIsOpen !== undefined ? propsMenuIsOpen : stateMenuIsOpen;
  var value = propsValue !== undefined ? propsValue : stateValue;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restSelectProps), {}, {
    inputValue: inputValue,
    menuIsOpen: menuIsOpen,
    onChange: onChange,
    onInputChange: onInputChange,
    onMenuClose: onMenuClose,
    onMenuOpen: onMenuOpen,
    value: value
  });
}




/***/ },

/***/ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js"
/*!****************************************************************************************************!*\
  !*** ./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js ***!
  \****************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ index)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var index = react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect ;




/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

"use strict";
module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

"use strict";
module.exports = window["ReactDOM"];

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

"use strict";
module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

"use strict";
module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/core-data"
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
(module) {

"use strict";
module.exports = window["wp"]["coreData"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/hooks"
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
(module) {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./node_modules/classnames/index.js"
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js"
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js"
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js"
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/createSuper.js"
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createSuper.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createSuper)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNativeReflectConstruct.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js");
/* harmony import */ var _possibleConstructorReturn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./possibleConstructorReturn.js */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");



function _createSuper(t) {
  var r = (0,_isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return function () {
    var e,
      o = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t);
    if (r) {
      var s = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor;
      e = Reflect.construct(o, arguments, s);
    } else e = o.apply(this, arguments);
    return (0,_possibleConstructorReturn_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, e);
  };
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(e, r, t) {
  return (r = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js"
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js"
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, e);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeReflectConstruct)
/* harmony export */ });
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js"
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js"
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArrayLimit)
/* harmony export */ });
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js"
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectSpread2)
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutProperties)
/* harmony export */ });
/* harmony import */ var _objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectWithoutPropertiesLoose.js */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");

function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = (0,_objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(t, e) {
  if (e && ("object" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _slicedToArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(r, e) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r, e) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r, e) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js"
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _taggedTemplateLiteral)
/* harmony export */ });
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(r) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js"
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js"
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js"
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a) : void 0;
  }
}


/***/ },

/***/ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs"
/*!******************************************************************!*\
  !*** ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : {
    ...platform,
    detectOverflow
  };
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ },

/***/ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"
/*!****************************************************************!*\
  !*** ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // <html> `overflow: hidden` + `scrollbar-gutter: stable` reduces the
  // visual width of the <html> but this is not considered in the size
  // of `html.clientWidth`.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    // If the <body> scrollbar is on the left, the width needs to be extended
    // by the scrollbar amount so there isn't extra space on the right.
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === 'absolute' || currentContainingBlockComputedStyle.position === 'fixed') || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, top);
    right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, right);
    bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, bottom);
    left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(floating ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating) : [])] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ },

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs"
/*!************************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ },

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ },

/***/ "./node_modules/stylis/src/Enum.js"
/*!*****************************************!*\
  !*** ./node_modules/stylis/src/Enum.js ***!
  \*****************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARSET: () => (/* binding */ CHARSET),
/* harmony export */   COMMENT: () => (/* binding */ COMMENT),
/* harmony export */   COUNTER_STYLE: () => (/* binding */ COUNTER_STYLE),
/* harmony export */   DECLARATION: () => (/* binding */ DECLARATION),
/* harmony export */   DOCUMENT: () => (/* binding */ DOCUMENT),
/* harmony export */   FONT_FACE: () => (/* binding */ FONT_FACE),
/* harmony export */   FONT_FEATURE_VALUES: () => (/* binding */ FONT_FEATURE_VALUES),
/* harmony export */   IMPORT: () => (/* binding */ IMPORT),
/* harmony export */   KEYFRAMES: () => (/* binding */ KEYFRAMES),
/* harmony export */   LAYER: () => (/* binding */ LAYER),
/* harmony export */   MEDIA: () => (/* binding */ MEDIA),
/* harmony export */   MOZ: () => (/* binding */ MOZ),
/* harmony export */   MS: () => (/* binding */ MS),
/* harmony export */   NAMESPACE: () => (/* binding */ NAMESPACE),
/* harmony export */   PAGE: () => (/* binding */ PAGE),
/* harmony export */   RULESET: () => (/* binding */ RULESET),
/* harmony export */   SUPPORTS: () => (/* binding */ SUPPORTS),
/* harmony export */   VIEWPORT: () => (/* binding */ VIEWPORT),
/* harmony export */   WEBKIT: () => (/* binding */ WEBKIT)
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'
var LAYER = '@layer'


/***/ },

/***/ "./node_modules/stylis/src/Middleware.js"
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Middleware.js ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   middleware: () => (/* binding */ middleware),
/* harmony export */   namespace: () => (/* binding */ namespace),
/* harmony export */   prefixer: () => (/* binding */ prefixer),
/* harmony export */   rulesheet: () => (/* binding */ rulesheet)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Prefixer.js */ "./node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_4__.prefix)(element.value, element.length, children)
					return
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.combine)(element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + '$1')]})], callback)
								// :placeholder
								case '::placeholder':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'input-$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + '$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'input-$1')]})
									], callback)
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ },

/***/ "./node_modules/stylis/src/Parser.js"
/*!*******************************************!*\
  !*** ./node_modules/stylis/src/Parser.js ***!
  \*******************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comment: () => (/* binding */ comment),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   declaration: () => (/* binding */ declaration),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   ruleset: () => (/* binding */ ruleset)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)()) {
			// (
			case 40:
				if (previous != 108 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)()), root, parent), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset: if (ampersand == -1) characters = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, /\f/g, '')
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule === 99 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length)
}


/***/ },

/***/ "./node_modules/stylis/src/Prefixer.js"
/*!*********************************************!*\
  !*** ./node_modules/stylis/src/Prefixer.js ***!
  \*********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + value
		// tab-size
		case 4789:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + value + value
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /flex-|-self/g, '') + (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /flex-|baseline/) ? _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-row-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + value
		// justify-self
		case 4200:
			if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /flex-|baseline/)) return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-column-align' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(element.props, /grid-\w+-end/) })) {
				return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(value + (children = children[length].value), 'span') ? value : (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-start', '') + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-row-span:' + (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(children, 'span') ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(children, /\d+/) : +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(children, /\d+/) - +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /\d+/)) + ';')
			}
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(element.props, /grid-\w+-start/) })) ? value : _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(value, 'stretch') ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + a + ':' + b + f) + (c ? (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 6) === 121)
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}


/***/ },

/***/ "./node_modules/stylis/src/Serializer.js"
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Serializer.js ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children)

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.LAYER: if (element.children.length) break
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET: element.value = element.props.join(',')
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ },

/***/ "./node_modules/stylis/src/Tokenizer.js"
/*!**********************************************!*\
  !*** ./node_modules/stylis/src/Tokenizer.js ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alloc: () => (/* binding */ alloc),
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   char: () => (/* binding */ char),
/* harmony export */   character: () => (/* binding */ character),
/* harmony export */   characters: () => (/* binding */ characters),
/* harmony export */   column: () => (/* binding */ column),
/* harmony export */   commenter: () => (/* binding */ commenter),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dealloc: () => (/* binding */ dealloc),
/* harmony export */   delimit: () => (/* binding */ delimit),
/* harmony export */   delimiter: () => (/* binding */ delimiter),
/* harmony export */   escaping: () => (/* binding */ escaping),
/* harmony export */   identifier: () => (/* binding */ identifier),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   next: () => (/* binding */ next),
/* harmony export */   node: () => (/* binding */ node),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   prev: () => (/* binding */ prev),
/* harmony export */   slice: () => (/* binding */ slice),
/* harmony export */   token: () => (/* binding */ token),
/* harmony export */   tokenize: () => (/* binding */ tokenize),
/* harmony export */   tokenizer: () => (/* binding */ tokenizer),
/* harmony export */   whitespace: () => (/* binding */ whitespace)
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ },

/***/ "./node_modules/stylis/src/Utility.js"
/*!********************************************!*\
  !*** ./node_modules/stylis/src/Utility.js ***!
  \********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   charat: () => (/* binding */ charat),
/* harmony export */   combine: () => (/* binding */ combine),
/* harmony export */   from: () => (/* binding */ from),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   indexof: () => (/* binding */ indexof),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   strlen: () => (/* binding */ strlen),
/* harmony export */   substr: () => (/* binding */ substr),
/* harmony export */   trim: () => (/* binding */ trim)
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _custom_blocks_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./custom-blocks/index */ "./src/custom-blocks/index.js");
/* harmony import */ var _extended_core_blocks_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extended-core-blocks/index */ "./src/extended-core-blocks/index.js");
/**
 * Import all JS from modules
 */



})();

/******/ })()
;
//# sourceMappingURL=index.js.map