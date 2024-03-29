/* eslint-disable */
(function (e, r) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? r(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], r)
    : ((e = e || self), r((e.stylis = {})));
})(this, function (e) {
  'use strict';
  var r = '-ms-';
  var a = '-moz-';
  var c = '-webkit-';
  var t = 'comm';
  var n = 'rule';
  var s = 'decl';
  var i = '@page';
  var u = '@media';
  var o = '@import';
  var f = '@charset';
  var l = '@viewport';
  var h = '@supports';
  var p = '@document';
  var v = '@namespace';
  var b = '@keyframes';
  var m = '@font-face';
  var w = '@counter-style';
  var d = '@font-feature-values';
  var $ = Math.abs;
  var k = String.fromCharCode;
  function g(e, r) {
    return (
      (((((((r << 2) ^ A(e, 0)) << 2) ^ A(e, 1)) << 2) ^ A(e, 2)) << 2) ^
      A(e, 3)
    );
  }
  function x(e) {
    return e.trim();
  }
  function E(e, r) {
    return (e = r.exec(e)) ? e[0] : e;
  }
  function y(e, r, a) {
    return e.replace(r, a);
  }
  function T(e, r) {
    return e.indexOf(r);
  }
  function A(e, r) {
    return e.charCodeAt(r) | 0;
  }
  function O(e, r, a) {
    return e.slice(r, a);
  }
  function M(e) {
    return e.length;
  }
  function C(e) {
    return e.length;
  }
  function S(e, r) {
    return r.push(e), e;
  }
  function R(e, r) {
    return e.map(r).join('');
  }
  e.line = 1;
  e.column = 1;
  e.length = 0;
  e.position = 0;
  e.character = 0;
  e.characters = '';
  function z(r, a, c, t, n, s, i) {
    return {
      value: r,
      root: a,
      parent: c,
      type: t,
      props: n,
      children: s,
      line: e.line,
      column: e.column,
      length: i,
      return: '',
    };
  }
  function N(e, r, a) {
    return z(e, r.root, r.parent, a, r.props, r.children, 0);
  }
  function P() {
    return e.character;
  }
  function U() {
    e.character = e.position > 0 ? A(e.characters, --e.position) : 0;
    if ((e.column--, e.character === 10)) (e.column = 1), e.line--;
    return e.character;
  }
  function _() {
    e.character = e.position < e.length ? A(e.characters, e.position++) : 0;
    if ((e.column++, e.character === 10)) (e.column = 1), e.line++;
    return e.character;
  }
  function j() {
    return A(e.characters, e.position);
  }
  function F() {
    return e.position;
  }
  function I(r, a) {
    return O(e.characters, r, a);
  }
  function L(e) {
    switch (e) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function D(r) {
    return (
      (e.line = e.column = 1),
      (e.length = M((e.characters = r))),
      (e.position = 0),
      []
    );
  }
  function K(r) {
    return (e.characters = ''), r;
  }
  function V(r) {
    return x(I(e.position - 1, H(r === 91 ? r + 2 : r === 40 ? r + 1 : r)));
  }
  function W(e) {
    return K(B(D(e)));
  }
  function Y(r) {
    while ((e.character = j()))
      if (e.character < 33) _();
      else break;
    return L(r) > 2 || L(e.character) > 3 ? '' : ' ';
  }
  function B(r) {
    while (_())
      switch (L(e.character)) {
        case 0:
          S(q(e.position - 1), r);
          break;
        case 2:
          S(V(e.character), r);
          break;
        default:
          S(k(e.character), r);
      }
    return r;
  }
  function G(r, a) {
    while (--a && _())
      if (
        e.character < 48 ||
        e.character > 102 ||
        (e.character > 57 && e.character < 65) ||
        (e.character > 70 && e.character < 97)
      )
        break;
    return I(r, F() + (a < 6 && j() == 32 && _() == 32));
  }
  function H(r) {
    while (_())
      switch (e.character) {
        case r:
          return e.position;
        case 34:
        case 39:
          return H(r === 34 || r === 39 ? r : e.character);
        case 40:
          if (r === 41) H(r);
          break;
        case 92:
          _();
          break;
      }
    return e.position;
  }
  function Z(r, a) {
    while (_())
      if (r + e.character === 47 + 10) break;
      else if (r + e.character === 42 + 42 && j() === 47) break;
    return '/*' + I(a, e.position - 1) + '*' + k(r === 47 ? r : _());
  }
  function q(r) {
    while (!L(j())) _();
    return I(r, e.position);
  }
  function J(e) {
    return K(Q('', null, null, null, [''], (e = D(e)), 0, [0], e));
  }
  function Q(e, r, a, c, t, n, s, i, u) {
    var o = 0;
    var f = 0;
    var l = s;
    var h = 0;
    var p = 0;
    var v = 0;
    var b = 1;
    var m = 1;
    var w = 1;
    var d = 0;
    var $ = '';
    var g = t;
    var x = n;
    var E = c;
    var T = $;
    while (m)
      switch (((v = d), (d = _()))) {
        case 34:
        case 39:
        case 91:
        case 40:
          T += V(d);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          T += Y(v);
          break;
        case 92:
          T += G(F() - 1, 7);
          continue;
        case 47:
          switch (j()) {
            case 42:
            case 47:
              S(ee(Z(_(), F()), r, a), u);
              break;
            default:
              T += '/';
          }
          break;
        case 123 * b:
          i[o++] = M(T) * w;
        case 125 * b:
        case 59:
        case 0:
          switch (d) {
            case 0:
            case 125:
              m = 0;
            case 59 + f:
              if (p > 0 && M(T) - l)
                S(
                  p > 32
                    ? re(T + ';', c, a, l - 1)
                    : re(y(T, ' ', '') + ';', c, a, l - 2),
                  u,
                );
              break;
            case 59:
              T += ';';
            default:
              S((E = X(T, r, a, o, f, t, i, $, (g = []), (x = []), l)), n);
              if (d === 123)
                if (f === 0) Q(T, r, E, E, g, n, l, i, x);
                else
                  switch (h) {
                    case 100:
                    case 109:
                    case 115:
                      Q(
                        e,
                        E,
                        E,
                        c && S(X(e, E, E, 0, 0, t, i, $, t, (g = []), l), x),
                        t,
                        x,
                        l,
                        i,
                        c ? g : x,
                      );
                      break;
                    default:
                      Q(T, E, E, E, [''], x, l, i, x);
                  }
          }
          (o = f = p = 0), (b = w = 1), ($ = T = ''), (l = s);
          break;
        case 58:
          (l = 1 + M(T)), (p = v);
        default:
          if (b < 1)
            if (d == 123) --b;
            else if (d == 125 && b++ == 0 && U() == 125) continue;
          switch (((T += k(d)), d * b)) {
            case 38:
              w = f > 0 ? 1 : ((T += '\f'), -1);
              break;
            case 44:
              (i[o++] = (M(T) - 1) * w), (w = 1);
              break;
            case 64:
              if (j() === 45) T += V(_());
              (h = j()), (f = M(($ = T += q(F())))), d++;
              break;
            case 45:
              if (v === 45 && M(T) == 2) b = 0;
          }
      }
    return n;
  }
  function X(e, r, a, c, t, s, i, u, o, f, l) {
    var h = t - 1;
    var p = t === 0 ? s : [''];
    var v = C(p);
    for (var b = 0, m = 0, w = 0; b < c; ++b)
      for (var d = 0, k = O(e, h + 1, (h = $((m = i[b])))), g = e; d < v; ++d)
        if ((g = x(m > 0 ? p[d] + ' ' + k : y(k, /&\f/g, p[d])))) o[w++] = g;
    return z(e, r, a, t === 0 ? n : u, o, f, l);
  }
  function ee(e, r, a) {
    return z(e, r, a, t, k(P()), O(e, 2, -2), 0);
  }
  function re(e, r, a, c) {
    return z(e, r, a, s, O(e, 0, c), O(e, c + 1, -1), c);
  }
  function ae(e, t) {
    switch (g(e, t)) {
      case 5103:
        return c + 'print-' + e + e;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return c + e + e;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return c + e + a + e + r + e + e;
      case 6828:
      case 4268:
        return c + e + r + e + e;
      case 6165:
        return c + e + r + 'flex-' + e + e;
      case 5187:
        return (
          c + e + y(e, /(\w+).+(:[^]+)/, c + 'box-$1$2' + r + 'flex-$1$2') + e
        );
      case 5443:
        return c + e + r + 'flex-item-' + y(e, /flex-|-self/, '') + e;
      case 4675:
        return (
          c +
          e +
          r +
          'flex-line-pack' +
          y(e, /align-content|flex-|-self/, '') +
          e
        );
      case 5548:
        return c + e + r + y(e, 'shrink', 'negative') + e;
      case 5292:
        return c + e + r + y(e, 'basis', 'preferred-size') + e;
      case 6060:
        return (
          c +
          'box-' +
          y(e, '-grow', '') +
          c +
          e +
          r +
          y(e, 'grow', 'positive') +
          e
        );
      case 4554:
        return c + y(e, /([^-])(transform)/g, '$1' + c + '$2') + e;
      case 6187:
        return (
          y(y(y(e, /(zoom-|grab)/, c + '$1'), /(image-set)/, c + '$1'), e, '') +
          e
        );
      case 5495:
      case 3959:
        return y(e, /(image-set\([^]*)/, c + '$1' + '$`$1');
      case 4968:
        return (
          y(
            y(e, /(.+:)(flex-)?(.*)/, c + 'box-pack:$3' + r + 'flex-pack:$3'),
            /s.+-b[^;]+/,
            'justify',
          ) +
          c +
          e +
          e
        );
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return y(e, /(.+)-inline(.+)/, c + '$1$2') + e;
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
        if (M(e) - 1 - t > 6)
          switch (A(e, t + 1)) {
            case 109:
              if (A(e, t + 4) !== 45) break;
            case 102:
              return (
                y(
                  e,
                  /(.+:)(.+)-([^]+)/,
                  '$1' +
                    c +
                    '$2-$3' +
                    '$1' +
                    a +
                    (A(e, t + 3) == 108 ? '$3' : '$2-$3'),
                ) + e
              );
            case 115:
              return ~T(e, 'stretch')
                ? ae(y(e, 'stretch', 'fill-available'), t) + e
                : e;
          }
        break;
      case 4949:
        if (A(e, t + 1) !== 115) break;
      case 6444:
        switch (A(e, M(e) - 3 - (~T(e, '!important') && 10))) {
          case 107:
            return y(e, ':', ':' + c) + e;
          case 101:
            return (
              y(
                e,
                /(.+:)([^;!]+)(;|!.+)?/,
                '$1' +
                  c +
                  (A(e, 14) === 45 ? 'inline-' : '') +
                  'box$3' +
                  '$1' +
                  c +
                  '$2$3' +
                  '$1' +
                  r +
                  '$2box$3',
              ) + e
            );
        }
        break;
      case 5936:
        switch (A(e, t + 11)) {
          case 114:
            return c + e + r + y(e, /[svh]\w+-[tblr]{2}/, 'tb') + e;
          case 108:
            return c + e + r + y(e, /[svh]\w+-[tblr]{2}/, 'tb-rl') + e;
          case 45:
            return c + e + r + y(e, /[svh]\w+-[tblr]{2}/, 'lr') + e;
        }
        return c + e + r + e + e;
    }
    return e;
  }
  function ce(e, r) {
    var a = '';
    var c = C(e);
    for (var t = 0; t < c; t++) a += r(e[t], t, e, r) || '';
    return a;
  }
  function te(e, r, a, c) {
    switch (e.type) {
      case o:
      case s:
        return (e.return = e.return || e.value);
      case t:
        return '';
      case n:
        e.value = e.props.join(',');
    }
    return M((a = ce(e.children, c)))
      ? (e.return = e.value + '{' + a + '}')
      : '';
  }
  function ne(e) {
    var r = C(e);
    return function (a, c, t, n) {
      var s = '';
      for (var i = 0; i < r; i++) s += e[i](a, c, t, n) || '';
      return s;
    };
  }
  function se(e) {
    return function (r) {
      if (!r.root) if ((r = r.return)) e(r);
    };
  }
  function ie(e, t, i, u) {
    if (!e.return)
      switch (e.type) {
        case s:
          e.return = ae(e.value, e.length);
          break;
        case b:
          return ce([N(y(e.value, '@', '@' + c), e, '')], u);
        case n:
          if (e.length)
            return R(e.props, function (t) {
              switch (E(t, /(::plac\w+|:read-\w+)/)) {
                case ':read-only':
                case ':read-write':
                  return ce([N(y(t, /:(read-\w+)/, ':' + a + '$1'), e, '')], u);
                case '::placeholder':
                  return ce(
                    [
                      N(y(t, /:(plac\w+)/, ':' + c + 'input-$1'), e, ''),
                      N(y(t, /:(plac\w+)/, ':' + a + '$1'), e, ''),
                      N(y(t, /:(plac\w+)/, r + 'input-$1'), e, ''),
                    ],
                    u,
                  );
              }
              return '';
            });
      }
  }
  function ue(e) {
    switch (e.type) {
      case n:
        e.props = e.props.map(function (r) {
          return R(W(r), function (r, a, c) {
            switch (A(r, 0)) {
              case 12:
                return O(r, 1, M(r));
              case 0:
              case 40:
              case 43:
              case 62:
              case 126:
                return r;
              case 58:
                if (c[++a] === 'global')
                  (c[a] = ''), (c[++a] = '\f' + O(c[a], (a = 1), -1));
              case 32:
                return a === 1 ? '' : r;
              default:
                switch (a) {
                  case 0:
                    e = r;
                    return C(c) > 1 ? '' : r;
                  case (a = C(c) - 1):
                  case 2:
                    return a === 2 ? r + e + e : r + e;
                  default:
                    return r;
                }
            }
          });
        });
    }
  }
  e.CHARSET = f;
  e.COMMENT = t;
  e.COUNTER_STYLE = w;
  e.DECLARATION = s;
  e.DOCUMENT = p;
  e.FONT_FACE = m;
  e.FONT_FEATURE_VALUES = d;
  e.IMPORT = o;
  e.KEYFRAMES = b;
  e.MEDIA = u;
  e.MOZ = a;
  e.MS = r;
  e.NAMESPACE = v;
  e.PAGE = i;
  e.RULESET = n;
  e.SUPPORTS = h;
  e.VIEWPORT = l;
  e.WEBKIT = c;
  e.abs = $;
  e.alloc = D;
  e.append = S;
  e.caret = F;
  e.char = P;
  e.charat = A;
  e.combine = R;
  e.comment = ee;
  e.commenter = Z;
  e.compile = J;
  e.copy = N;
  e.dealloc = K;
  e.declaration = re;
  e.delimit = V;
  e.delimiter = H;
  e.escaping = G;
  e.from = k;
  e.hash = g;
  e.identifier = q;
  e.indexof = T;
  e.match = E;
  e.middleware = ne;
  e.namespace = ue;
  e.next = _;
  e.node = z;
  e.parse = Q;
  e.peek = j;
  e.prefix = ae;
  e.prefixer = ie;
  e.prev = U;
  e.replace = y;
  e.ruleset = X;
  e.rulesheet = se;
  e.serialize = ce;
  e.sizeof = C;
  e.slice = I;
  e.stringify = te;
  e.strlen = M;
  e.substr = O;
  e.token = L;
  e.tokenize = W;
  e.tokenizer = B;
  e.trim = x;
  e.whitespace = Y;
  Object.defineProperty(e, '__esModule', { value: true });
});
//# sourceMappingURL=stylis.js.map
