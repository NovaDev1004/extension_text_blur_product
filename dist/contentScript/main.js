"use strict";
(() => {
    function Q(i) {
        return i.replace(/([\(\)\{\}\+\*\?\[\]\.\^\$\|\\])/g, "\\$1")
    }
    var L = "tb-blurred",
        j = "tb-keep-this",
        F = "tb-ignore";

    function B() {}
    B.prototype = {
        diff: function(e, t) {
            var n, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
                r = o.callback;
            typeof o == "function" && (r = o, o = {}), this.options = o;
            var s = this;

            function l(x) {
                return r ? (setTimeout(function() {
                    r(void 0, x)
                }, 0), !0) : x
            }
            e = this.castInput(e), t = this.castInput(t), e = this.removeEmpty(this.tokenize(e)), t = this.removeEmpty(this.tokenize(t));
            var d = t.length,
                a = e.length,
                m = 1,
                c = d + a;
            o.maxEditLength && (c = Math.min(c, o.maxEditLength));
            var b = (n = o.timeout) !== null && n !== void 0 ? n : 1 / 0,
                p = Date.now() + b,
                f = [{
                    oldPos: -1,
                    lastComponent: void 0
                }],
                y = this.extractCommon(f[0], t, e, 0);
            if (f[0].oldPos + 1 >= a && y + 1 >= d) return l([{
                value: this.join(t),
                count: t.length
            }]);
            var u = -1 / 0,
                h = 1 / 0;

            function C() {
                for (var x = Math.max(u, -m); x <= Math.min(h, m); x += 2) {
                    var E = void 0,
                        O = f[x - 1],
                        S = f[x + 1];
                    O && (f[x - 1] = void 0);
                    var A = !1;
                    if (S) {
                        var _ = S.oldPos - x;
                        A = S && 0 <= _ && _ < d
                    }
                    var $ = O && O.oldPos + 1 < a;
                    if (!A && !$) {
                        f[x] = void 0;
                        continue
                    }
                    if (!$ || A && O.oldPos + 1 < S.oldPos ? E = s.addToPath(S, !0, void 0, 0) : E = s.addToPath(O, void 0, !0, 1), y = s.extractCommon(E, t, e, x), E.oldPos + 1 >= a && y + 1 >= d) return l(de(s, E.lastComponent, t, e, s.useLongestToken));
                    f[x] = E, E.oldPos + 1 >= a && (h = Math.min(h, x - 1)), y + 1 >= d && (u = Math.max(u, x + 1))
                }
                m++
            }
            if (r)(function x() {
                setTimeout(function() {
                    if (m > c || Date.now() > p) return r();
                    C() || x()
                }, 0)
            })();
            else
                for (; m <= c && Date.now() <= p;) {
                    var v = C();
                    if (v) return v
                }
        },
        addToPath: function(e, t, n, o) {
            var r = e.lastComponent;
            return r && r.added === t && r.removed === n ? {
                oldPos: e.oldPos + o,
                lastComponent: {
                    count: r.count + 1,
                    added: t,
                    removed: n,
                    previousComponent: r.previousComponent
                }
            } : {
                oldPos: e.oldPos + o,
                lastComponent: {
                    count: 1,
                    added: t,
                    removed: n,
                    previousComponent: r
                }
            }
        },
        extractCommon: function(e, t, n, o) {
            for (var r = t.length, s = n.length, l = e.oldPos, d = l - o, a = 0; d + 1 < r && l + 1 < s && this.equals(t[d + 1], n[l + 1]);) d++, l++, a++;
            return a && (e.lastComponent = {
                count: a,
                previousComponent: e.lastComponent
            }), e.oldPos = l, d
        },
        equals: function(e, t) {
            return this.options.comparator ? this.options.comparator(e, t) : e === t || this.options.ignoreCase && e.toLowerCase() === t.toLowerCase()
        },
        removeEmpty: function(e) {
            for (var t = [], n = 0; n < e.length; n++) e[n] && t.push(e[n]);
            return t
        },
        castInput: function(e) {
            return e
        },
        tokenize: function(e) {
            return e.split("")
        },
        join: function(e) {
            return e.join("")
        }
    };

    function de(i, e, t, n, o) {
        for (var r = [], s; e;) r.push(e), s = e.previousComponent, delete e.previousComponent, e = s;
        r.reverse();
        for (var l = 0, d = r.length, a = 0, m = 0; l < d; l++) {
            var c = r[l];
            if (c.removed) {
                if (c.value = i.join(n.slice(m, m + c.count)), m += c.count, l && r[l - 1].added) {
                    var p = r[l - 1];
                    r[l - 1] = r[l], r[l] = p
                }
            } else {
                if (!c.added && o) {
                    var b = t.slice(a, a + c.count);
                    b = b.map(function(y, u) {
                        var h = n[m + u];
                        return h.length > y.length ? h : y
                    }), c.value = i.join(b)
                } else c.value = i.join(t.slice(a, a + c.count));
                a += c.count, c.added || (m += c.count)
            }
        }
        var f = r[d - 1];
        return d > 1 && typeof f.value == "string" && (f.added || f.removed) && i.equals("", f.value) && (r[d - 2].value += f.value, r.pop()), r
    }
    var ae = new B;

    function J(i, e, t) {
        return ae.diff(i, e, t)
    }
    var Z = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,
        ee = /\S/,
        te = new B;
    te.equals = function(i, e) {
        return this.options.ignoreCase && (i = i.toLowerCase(), e = e.toLowerCase()), i === e || this.options.ignoreWhitespace && !ee.test(i) && !ee.test(e)
    };
    te.tokenize = function(i) {
        for (var e = i.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/), t = 0; t < e.length - 1; t++) !e[t + 1] && e[t + 2] && Z.test(e[t]) && Z.test(e[t + 2]) && (e[t] += e[t + 2], e.splice(t + 1, 2), t--);
        return e
    };
    var ne = new B;
    ne.tokenize = function(i) {
        this.options.stripTrailingCr && (i = i.replace(/\r\n/g, `
`));
        var e = [],
            t = i.split(/(\n|\r\n)/);
        t[t.length - 1] || t.pop();
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            n % 2 && !this.options.newlineIsToken ? e[e.length - 1] += o : (this.options.ignoreWhitespace && (o = o.trim()), e.push(o))
        }
        return e
    };
    var ue = new B;
    ue.tokenize = function(i) {
        return i.split(/(\S.+?[.!?])(?=\s+|$)/)
    };
    var fe = new B;
    fe.tokenize = function(i) {
        return i.split(/([{}:;,]|\s+)/)
    };

    function W(i) {
        "@babel/helpers - typeof";
        return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? W = function(e) {
            return typeof e
        } : W = function(e) {
            return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }, W(i)
    }
    var ce = Object.prototype.toString,
        V = new B;
    V.useLongestToken = !0;
    V.tokenize = ne.tokenize;
    V.castInput = function(i) {
        var e = this.options,
            t = e.undefinedReplacement,
            n = e.stringifyReplacer,
            o = n === void 0 ? function(r, s) {
                return typeof s > "u" ? t : s
            } : n;
        return typeof i == "string" ? i : JSON.stringify(Y(i, null, null, o), o, "  ")
    };
    V.equals = function(i, e) {
        return B.prototype.equals.call(V, i.replace(/,([\r\n])/g, "$1"), e.replace(/,([\r\n])/g, "$1"))
    };

    function Y(i, e, t, n, o) {
        e = e || [], t = t || [], n && (i = n(o, i));
        var r;
        for (r = 0; r < e.length; r += 1)
            if (e[r] === i) return t[r];
        var s;
        if (ce.call(i) === "[object Array]") {
            for (e.push(i), s = new Array(i.length), t.push(s), r = 0; r < i.length; r += 1) s[r] = Y(i[r], e, t, n, o);
            return e.pop(), t.pop(), s
        }
        if (i && i.toJSON && (i = i.toJSON()), W(i) === "object" && i !== null) {
            e.push(i), s = {}, t.push(s);
            var l = [],
                d;
            for (d in i) i.hasOwnProperty(d) && l.push(d);
            for (l.sort(), r = 0; r < l.length; r += 1) d = l[r], s[d] = Y(i[d], e, t, n, d);
            e.pop(), t.pop()
        } else s = i;
        return s
    }
    var K = new B;
    K.tokenize = function(i) {
        return i.slice()
    };
    K.join = K.removeEmpty = function(i) {
        return i
    };
    var X = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "BODY", "CANVAS", "DD", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN", "NAV", "NOSCRIPT", "OL", "P", "PRE", "SCRIPT", "SECTION", "TABLE", "TFOOT", "UL", "VIDEO"],
        D = ["SCRIPT", "STYLE", "NOSCRIPT", "HEAD", "META", "LINK", "HTML", "TEXTAREA", "TITLE", "#comment"],
        z = "tb-blurred-group-",
        re = "data-tb-original-title",
        pe = "cm-editor",
        oe = "tb-common-style",
        he = `.${L} {
  filter: blur(5px)!important;
}`,
        P = class {
            observer;
            observedNodes = [];
            startBlurring(e, t) {
                this.blur(e, t, document.body)
            }
            stopBlurring() {
                if (!this.observer) return;
                this.observer.disconnect(), delete this.observer;
                let e = this.observedNodes.reduce((n, o) => {
                    let r = o.querySelector(`#${oe}`);
                    return r && r.parentNode.removeChild(r), n.push(...Array.from(o.querySelectorAll(`.${L}:not([class~="${F}"]`))), n
                }, []);
                if (this.observedNodes.length = 0, e.length === 0) return;
                let t = Date.now();
                e.forEach(n => {
                    this.unblurCore(n)
                }), console.debug(`Took ${Date.now()-t} ms`)
            }
            blur(e, t, n) {
                let o = n || document.body,
                    r = document.createElement("style");
                r.innerHTML = he, r.id = oe, !o.querySelector(`#${r.id}`) && (o == document.body ? document.head : o).appendChild(r), this.observedNodes.push(o), this.observer || (this.observer = new MutationObserver(s => {
                    if (!s.some(d => ["characterData", "attributes"].includes(d.type) || d.removedNodes.length > 0 || Array.from(d.addedNodes).some(a => !D.includes(a.nodeName)))) return;
                    let l = s.reduce((d, a) => {
                        if (D.includes(a.target.nodeName) || d.some(p => p.contains(a.target))) return d;
                        let c = a.target;
                        for (; c && !X.includes(c.nodeName) && c.parentNode;) c = c.parentNode;
                        if (!c) return d;
                        let b = d.reduce((p, f) => (!c.contains(f) && f != c && p.push(f), p), []);
                        return b.push(c), b
                    }, []);
                    this.observer.disconnect(), l.forEach(d => this.blurByRegExpPattern(e, t, d)), this.observedNodes.forEach(d => {
                        this.observer.observe(d, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0,
                            characterData: !0
                        })
                    })
                })), this.blurByRegExpPattern(e, t, o), this.observer.observe(o, {
                    childList: !0,
                    subtree: !0,
                    attributes: !0,
                    characterData: !0
                })
            }
            blurByRegExpPattern(e, t, n) {
                let o = Date.now();
                if (n instanceof Element) {
                    if (n.classList && n.classList.contains(L) && !e.test(n.textContent))
                        if (!Array.from(n.classList).some(r => r.startsWith(z))) this.unblurCore(n);
                        else {
                            let r = Array.from(n.classList).filter(l => l.startsWith(z))[0],
                                s = document.querySelectorAll(`.${r}`);
                            !e.test(Array.from(s).map(l => l.textContent).join("")) && s.forEach(l => {
                                this.unblurCore(l)
                            })
                        } n.querySelectorAll(`.${L}:not([class~="${F}"])`).forEach(r => {
                        this.unblurCore(r)
                    })
                }
                this.blockAndBlur(e, n || document.body, t), this.blurInShadowRoot(e, t, n), console.debug(`Took ${Date.now()-o} ms`)
            }
            blurInShadowRoot(e, t, n) {
                n.shadowRoot && this.blur(e, t, n.shadowRoot), Array.from(n.childNodes).filter(o => !D.includes(o.nodeName)).forEach(o => {
                    o.nodeName !== "#text" && this.blurInShadowRoot(e, t, o)
                })
            }
            blockAndBlur(e, t, n) {
                let o = this.getNextTextNode(t, t),
                    r = 0;
                if (!o) return;
                let s = 0,
                    l = this.blockContents(t).map((a, m) => {
                        let c = s;
                        return s += a.length, {
                            index: m,
                            contents: a,
                            startsFrom: c
                        }
                    });
                s = 0;
                let d = l.map(a => {
                    let m = this.inlineFormatting(a.contents),
                        c = s,
                        b = [],
                        p = 0;
                    for (;;) {
                        let f = m.slice(p).match(e);
                        if (!f || f[0].length == 0) break;
                        b.push({
                            keyword: f[0],
                            index: p + f.index
                        }), p += f.index + f[0].length
                    }
                    return s += m.length, {
                        index: a.index,
                        contents: m,
                        matches: b.length > 0 ? b : null,
                        startsFrom: c
                    }
                });
                o = t, d.filter(a => !!a.matches).forEach(a => {
                    let m = a.contents,
                        c = l[a.index].contents,
                        b = J(c, m);
                    a.matches && a.matches.forEach(p => {
                        let f = this.getPositionFromDiff(b, [p.index, p.index + p.keyword.length - 1]),
                            y = l[a.index].startsFrom + f[0];
                        for (; r <= y;) o = this.getNextTextNode(o, t), r += o.textContent.length;
                        let u = {
                                node: o,
                                index: 0
                            },
                            h = [o],
                            C = l[a.index].startsFrom + f[1];
                        for (; r <= C;) o = this.getNextTextNode(o, t), h.push(o), r += o.textContent.length;
                        let v = {
                                node: o,
                                index: 0
                            },
                            x = h.map(N => N.textContent).join(""),
                            E = this.inlineFormatting(x),
                            O = J(x, E),
                            S = E.match(e) || E.match(p.keyword),
                            A = this.getPositionFromDiff(O, [S.index, S.index + S[0].length - 1]);
                        u.index = A[0], v.index = v.node.textContent.length - (x.length - A[1]);
                        let _ = document.createTextNode(u.node.textContent.slice(0, u.index)),
                            $ = document.createTextNode(v.node.textContent.slice(v.index + 1)),
                            T = [],
                            H = [];
                        if (!u.node.parentNode || !v.node.parentNode || this.shouldBeSkipped(u.node) || this.shouldBeSkipped(v.node)) return;
                        let I = this.getCuretPosition(u.node);
                        if (u.node == v.node) {
                            let N = getComputedStyle(u.node.parentNode),
                                g = Math.floor(parseFloat(N.fontSize) / 4);
                            if (u.node.textContent === p.keyword && u.node.parentNode.childNodes.length == 1 && N.filter === "none") {
                                if (u.node.parentNode.classList.add(L), u.node.parentNode.classList.add(j), n?.showValue) {
                                    let R = u.node.parentNode.getAttribute("title");
                                    R && u.node.parentNode.setAttribute("data-tb-original-title", R), u.node.parentNode.setAttribute("title", p.keyword)
                                }
                                g > 5 && (u.node.parentNode.style.filter += ` blur(${g}px)`);
                                return
                            }
                            let w = document.createElement("span");
                            w.classList.add(L), w.textContent = u.node.textContent.slice(u.index, v.index + 1), n?.showValue && w.setAttribute("title", p.keyword), T.push({
                                node: _,
                                refNode: u.node,
                                target: u.node.parentNode
                            }), T.push({
                                node: w,
                                refNode: u.node,
                                target: u.node.parentNode
                            }), T.push({
                                node: $,
                                refNode: u.node,
                                target: u.node.parentNode
                            }), H.push(u.node)
                        } else {
                            let N = Date.now(),
                                g = document.createElement("span");
                            g.classList.add(L), g.classList.add(`${z}${N}`), g.textContent = u.node.textContent.slice(u.index), T.push({
                                node: _,
                                refNode: u.node,
                                target: u.node.parentNode
                            }), T.push({
                                node: g,
                                refNode: u.node,
                                target: u.node.parentNode
                            });
                            let w = this.getNextTextNode(u.node, t);
                            for (H.push(u.node); w != v.node;) {
                                let M = document.createElement("span");
                                M.textContent = w.textContent, M.classList.add(L), M.classList.add(`${z}${N}`), T.push({
                                    node: M,
                                    refNode: w,
                                    target: w.parentNode
                                }), H.push(w), w = this.getNextTextNode(w, t)
                            }
                            let R = document.createElement("span");
                            R.classList.add(L), R.classList.add(`${z}${N}`), R.textContent = v.node.textContent.slice(0, v.index + 1), T.push({
                                node: R,
                                refNode: v.node,
                                target: v.node.parentNode
                            }), T.push({
                                node: $,
                                refNode: v.node,
                                target: v.node.parentNode
                            }), H.push(v.node)
                        }
                        T.reduce((N, g) => {
                            if (g.target.insertBefore(g.node, g.refNode), I?.endContainer && H.includes(I.endContainer) && g.node.textContent && N + g.node.textContent.length >= I.endOffset && (I.startOffset = I.endOffset = I.endOffset - N, I.endContainer = I.startContainer = g.node.nodeName === "#text" ? g.node : Array.from(g.node.childNodes).findLast(le => le.nodeName === "#text"), this.setCuretPosition(I)), !this.isBlurred(g.node)) return g.node.textContent ? N + g.node.textContent.length : N;
                            let w = g.node.nodeName === "#text" ? g.node.parentNode : g.node;
                            n?.showValue && w.setAttribute("title", p.keyword);
                            let R = getComputedStyle(w),
                                M = Math.floor(parseFloat(R.fontSize) / 4);
                            return M > 5 && (w.style.filter += ` blur(${M}px)`), g.node.textContent ? N + g.node.textContent.length : N
                        }, 0), H.forEach(N => {
                            N.parentNode?.removeChild(N)
                        }), o = $
                    })
                })
            }
            getNextTextNode(e, t) {
                if (!e) return null;
                if (e.firstChild && !D.includes(e.nodeName)) return e.firstChild.nodeName === "#text" ? e.firstChild : this.getNextTextNode(e.firstChild, t);
                if (e.nextSibling) return e.nextSibling.nodeName === "#text" ? e.nextSibling : this.getNextTextNode(e.nextSibling, t);
                let n = e.parentNode;
                for (; n != t && n;) {
                    if (n.nextSibling) return n.nextSibling.nodeName === "#text" ? n.nextSibling : this.getNextTextNode(n.nextSibling, t);
                    n = n.parentNode
                }
                return null
            }
            blockContents(e) {
                return Array.from(e.childNodes).reduce((t, n) => {
                    if (D.includes(n.nodeName)) return t;
                    if (n.nodeType >= 3) t[t.length - 1] += n.textContent;
                    else {
                        let o = this.blockContents(n);
                        !X.includes(n.nodeName) && (t[t.length - 1] += o.shift()), t.push(...o), X.includes(n.nodeName) && t.push("")
                    }
                    return t
                }, [""])
            }
            inlineFormatting(e) {
                return e ? e.replace(/ *\n */g, `
`).replace(/[\n\t]/g, " ").replace(/ +/g, " ").trim().replace(/\u00a0/g, " ") : ""
            }
            getPositionFromDiff(e, t) {
                let n = 0,
                    o = 0,
                    r = 0,
                    s = [];
                return e.some(l => {
                    for (l.added || (n += l.count), l.removed || (o += l.count); !(o <= t[r] - 1 || r >= t.length);) s.push(n - o + t[r]), r++;
                    return r >= t.length
                }), s
            }
            shouldBeSkipped(e) {
                return e.nodeType !== 1 ? this.shouldBeSkipped(e.parentNode) : this.isBlurred(e) ? (console.debug("Skipped. Reason: Already blurred"), !0) : D.includes(e.nodeName) ? (console.debug(`Skipped. Reason: The nodeName is ${e.nodeName}`), !0) : e.closest(`.${pe}`) ? (console.debug("Skipped. Reason: CodeMirror"), !0) : getComputedStyle(e).visibility === "hidden" || e.offsetWidth === 0 || e.offsetHeight === 0 || e.getClientRects().length === 0 ? (console.debug("Skipped. Reason: The node is invisible"), !0) : !1
            }
            isBlurred(e) {
                return !!(e.nodeType == 1 ? e : e.parentNode).closest(`.${L}`)
            }
            unblurCore(e) {
                if (e.classList.contains(L) && e.classList.contains(j)) {
                    let o = e.getAttribute(re);
                    o ? (e.setAttribute("title", o), e.removeAttribute(re)) : e.removeAttribute("title"), e.classList.remove(L), e.classList.remove(j), e.classList.length == 0 && e.removeAttribute("class"), e.style.filter = e.style.filter.replace(/blur\([^\)]+\)/, "").trim(), e.style.length == 0 && e.removeAttribute("style");
                    return
                }
                let t = this.getCuretPosition(e),
                    n = e.parentNode;
                e.childNodes.forEach(o => {
                    if (o.nodeName !== "#text") {
                        n.insertBefore(o, e);
                        return
                    }
                    let r = e.previousSibling;
                    do {
                        if (!r || r.nodeName !== "#text") {
                            n.insertBefore(o, e);
                            break
                        }
                        if (r.previousSibling && r.textContent === "") {
                            r = r.previousSibling;
                            continue
                        }
                        if (r.textContent += o.textContent, t) switch (t.endContainer) {
                            case o:
                                t.endContainer = t.startContainer = r, t.startOffset += r.textContent.length - o.textContent.length, t.endOffset += r.textContent.length - o.textContent.length;
                            case r:
                                this.setCuretPosition(t)
                        }
                        if (e.nextSibling?.nodeName === "#text") {
                            if (e.previousSibling.textContent += e.nextSibling.textContent, t) switch (t.endContainer) {
                                case e.nextSibling:
                                    t.endContainer = t.startContainer = e.previousSibling, t.endOffset = t.startOffset = e.previousSibling.textContent.length - e.nextSibling.textContent.length + t.startOffset;
                                case e.previousSibling:
                                    this.setCuretPosition(t)
                            }
                            n.removeChild(e.nextSibling)
                        }
                        break
                    } while (!0)
                }), n.removeChild(e)
            }
            getCuretPosition(e) {
                let t = window.getSelection();
                return !t || !e.isContentEditable && (!e.parentNode || !e.parentNode.isContentEditable) || t.rangeCount == 0 ? null : {
                    startContainer: t.anchorNode,
                    startOffset: t.anchorOffset,
                    endContainer: t.focusNode,
                    endOffset: t.focusOffset
                }
            }
            setCuretPosition(e) {
                let t = window.getSelection();
                if (!t) return;
                let n = document.createRange();
                n.setStart(e.startContainer, e.startOffset), n.setEnd(e.endContainer, e.endOffset), t.removeAllRanges(), t.addRange(n)
            }
        };
    var U = class {
        ATTR_NAME_ORIGINAL_TITLE = "data-original-title";
        observer = null;
        startBlurring(e, t) {
            this.observer || (this.observer = new MutationObserver(o => {
                o.some(r => Array.from(r.addedNodes).some(s => s.nodeName === "TITLE" ? (this.blur(e, t, s), !0) : s.nodeName === "#text" && s.parentNode && s.parentNode.nodeName === "TITLE" ? (this.blur(e, t, s.parentNode), !0) : !1))
            }));
            let n = document.querySelector("title");
            n && this.blur(e, t, n), this.observer.observe(document.head, {
                childList: !0,
                subtree: !0,
                characterData: !0
            })
        }
        stopBlurring() {
            let e = document.querySelector("title");
            e && (e.getAttribute(this.ATTR_NAME_ORIGINAL_TITLE) && (e.textContent = e.getAttribute(this.ATTR_NAME_ORIGINAL_TITLE), e.removeAttribute(this.ATTR_NAME_ORIGINAL_TITLE)), this.observer && (this.observer.disconnect(), this.observer = null))
        }
        blur(e, t, n) {
            let o = n.textContent,
                r = o.match(e),
                s = 0;
            for (; r && r[0].length > 0;) {
                let l = new Array(r[0].length).fill("*").join("");
                n.textContent = n.textContent.replace(r[0], l), s += r.index + l.length, r = n.textContent.slice(s).match(e), n.getAttribute(this.ATTR_NAME_ORIGINAL_TITLE) || n.setAttribute(this.ATTR_NAME_ORIGINAL_TITLE, o)
            }
        }
    };
    var G = "tb-mask-container",
        se = "tb-mask-text-layer",
        q = "tb-input-clone",
        ie = "tb-input-style",
        me = `.${G} {
  border: none !important;
  overflow: hidden !important;
}

#${q}, .${G}, .${se} {
  position: absolute !important;
  border: none !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}

#${q} {
  visibility: hidden !important;
  white-space-collapse: preserve !important;
}`,
        k = class i extends P {
            inputObjects = [];
            blur(e, t, n) {
                let o = n || document.body,
                    r = document.createElement("style");
                r.innerHTML = me, r.id = ie, !o.querySelector(`#${r.id}`) && (o == document.body ? document.head : o).appendChild(r), this.observedNodes.push(o), this.observer || (this.observer = new MutationObserver(s => {
                    this.blurInput(e, t, n)
                })), this.blurInput(e, t, n), this.observer.observe(o, {
                    childList: !0,
                    subtree: !0,
                    characterData: !0
                })
            }
            stopBlurring() {
                if (!this.observer) return;
                this.observer.disconnect(), delete this.observer, this.inputObjects.forEach(n => {
                    n.element.removeEventListener("input", this.inputOnInput), n.element.removeEventListener("focus", this.inputOnFocus), n.element.removeEventListener("blur", this.inputOnBlur)
                }), this.inputObjects.length = 0;
                let e = this.observedNodes.reduce((n, o) => {
                    let r = o.querySelector(`#${ie}`);
                    return r && r.parentNode.removeChild(r), n.push(...Array.from(o.querySelectorAll(`.${G}`))), n.push(...Array.from(o.querySelectorAll(`#${q}`))), n
                }, []);
                if (this.observedNodes.length = 0, e.length === 0) return;
                let t = Date.now();
                e.forEach(n => {
                    n.parentNode && n.parentNode.removeChild(n)
                }), console.debug(`Took ${Date.now()-t} ms`)
            }
            static getBackgroundColorAlongDOMTree(e) {
                if (e == document) return "";
                let t = getComputedStyle(e);
                return /(?:^| )rgba *\( *\d+ *, *\d+ *, *\d+ *, *0 *\)(?:$| )/.test(t.getPropertyValue("background-color")) ? i.getBackgroundColorAlongDOMTree(e.parentNode) : t.getPropertyValue("background-color").replace(/rgba *\( *(\d+) *, *(\d+) *, *(\d+) *, *[^)]+ *\)/, "rgb($1, $2, $3)")
            }
            blurInput(e, t, n) {
                ["HTMLBodyElement", "ShadowRoot"].includes(Object.prototype.toString.call(n).slice(8, -1)) && (this.inputObjects = [...Array.from(n.querySelectorAll("input"))].reduce((o, r) => {
                    let s = (() => {
                        let l = o.filter(d => d.element == r);
                        return l.length > 0 ? l[0] : (o.push({
                            element: r,
                            masks: {},
                            isObserved: !1,
                            root: n,
                            pattern: e,
                            options: t
                        }), o[o.length - 1])
                    })();
                    return s.isObserved || (s.isObserved = !0, s.element.addEventListener("input", this.inputOnInput.bind(s)), s.element.addEventListener("focus", this.inputOnFocus.bind(this)), s.element.addEventListener("blur", this.inputOnBlur.bind(this)), s.element.dispatchEvent(new InputEvent("input", {
                        data: s.element.value
                    }))), o
                }, this.inputObjects), this.blurInShadowRoot(e, t, n))
            }
            inputOnInput(e) {
                let t = e.target,
                    n = this;
                if (!n) return;
                let {
                    options: o,
                    pattern: r,
                    root: s
                } = n, l = `/${r.source}/${r.flags}`;
                for (n.masks[l] || (n.masks[l] = []); n.masks[l].length > 0;) n.masks[l][0].parentNode && n.masks[l][0].parentNode.removeChild(n.masks[l][0]), n.masks[l].shift();
                if (n.masks[l].length = 0, !r.test(t.value)) return;
                let d = s.querySelector(`#${q}`) || document.createElement("div");
                d.parentNode || (d.id = q, d.classList.add(F), s.appendChild(d)), d.textContent = "";
                let a = getComputedStyle(t);
                for (; d.firstChild;) d.removeChild(d.firstChild);
                for (let y in a) isNaN(parseInt(y)) && (["display", "position", "visibility", "top", "left", "overflow", "white-space"].includes(y) || d.style.setProperty(y, a.getPropertyValue(y)));
                let m = t.getBoundingClientRect(),
                    c = Math.floor(parseFloat(a.fontSize) / 4),
                    b = t.value.split(r),
                    p = t.value.match(new RegExp(r.source, `g${r.flags}`));
                d.appendChild(document.createTextNode(b.shift()));
                let f = d.lastChild.nextSibling;
                b.forEach(y => {
                    let u = document.createElement("span");
                    u.classList.add(L), u.classList.add(F), u.textContent = p.shift(), c > 5 && (u.style.filter = `blur(${c}px)`), d.insertBefore(u, f), d.insertBefore(document.createTextNode(y), f);
                    let h = document.createElement("div");
                    h.classList.add(G), h.classList.add(F);
                    let C = document.createElement("div");
                    C.classList.add(se), C.classList.add(L), C.classList.add(F), C.textContent = u.textContent, C.style.setProperty("width", "100%"), C.style.setProperty("height", "100%"), o?.showValue && C.setAttribute("title", u.textContent), h.addEventListener("click", () => {
                        t.focus()
                    }), t.parentNode.appendChild(h), h.appendChild(C);
                    let v = u.getBoundingClientRect();
                    for (let A in a) isNaN(parseInt(A)) && (["position", "filter", "margin", "padding", "border", "top", "left", "overflow", "height", "width", "outline"].includes(A) || h.style.setProperty(A, a.getPropertyValue(A)));
                    let x = parseFloat(a.getPropertyValue("height")) - parseFloat(a.getPropertyValue("font-size")),
                        E = a.getPropertyValue("box-sizing") === "border-box";
                    h.style.setProperty("left", `${u.offsetLeft+t.offsetLeft+(E?0:parseFloat(a.getPropertyValue("border-left-width")))}px`), h.style.setProperty("top", `${t.offsetTop+t.offsetHeight-u.offsetHeight-(x>0?x/2:0)-(E?-parseFloat(a.getPropertyValue("border-top-width")):parseFloat(a.getPropertyValue("border-bottom-width")))-parseFloat(a.getPropertyValue("padding-bottom"))}px`);
                    let O = h.getBoundingClientRect(),
                        S = m.width + m.left - O.left - parseFloat(a.getPropertyValue("border-left-width"));
                    h.style.setProperty("width", `${S>v.width?v.width:S>0?S:0}px`), h.style.setProperty("height", `${v.height}px`), h.style.setProperty("z-index", `${parseInt(a.getPropertyValue("z-index"))+1}`), h.style.setProperty("border", "none"), h.style.setProperty("background-color", i.getBackgroundColorAlongDOMTree(t)), e.isTrusted && h.style.setProperty("display", "none"), n.masks[l].push(h)
                })
            }
            inputOnFocus(e) {
                let t = e.target,
                    n = this.inputObjects.filter(o => o.element == t)[0];
                if (n)
                    for (let o in n.masks) n.masks[o].forEach(r => r.style.setProperty("display", "none"))
            }
            inputOnBlur(e) {
                let t = e.target,
                    n = this.inputObjects.filter(o => o.element == t)[0];
                if (n)
                    for (let o in n.masks) n.masks[o].forEach(r => r.style.setProperty("display", ""))
            }
        };
    (async () => {
        let i = [new P, new U, new k],
            e = (o, r, s) => new RegExp((o || "").split(/\n/).filter(l => !!l.trim() && (r !== "regexp" || !new RegExp(l).test(""))).map(l => `(?:${r==="regexp"?l.trim():Q(l.trim())})`).join("|"), s ? "" : "i"),
            t = async () => {
                try {
                    const configUrl = chrome.runtime.getURL("config.json");
                    const response = await fetch(configUrl);
                    const configData = await response.json();
                    let key_data = configData["keywords"];
                    await chrome.storage.local.set({
                        status: "",
                        keywords: key_data.replace(/\u00a0/g, " "),
                        exclusionUrls: "",
                        mode: "text",
                        matchCase: true,
                        showValue: true,
                        blurInput: true,
                        blurTitle: true
                    });
        
                    let {
                        status: o,
                        keywords: r,
                        mode: s,
                        matchCase: l,
                        showValue: d,
                        blurInput: a,
                        blurTitle: m,
                        exclusionUrls: c
                    } = await chrome.storage.local.get(["status", "keywords", "mode", "matchCase", "showValue", "blurInput", "blurTitle", "exclusionUrls"]);
                    let b = c ? c.split(/\n/).filter(f => !!f) : [];
                    if (b.length > 0 && new RegExp(b.map(f => `(?:${f})`).join("|")).test(location.href)) return;
                    let p = e(r, s, !!l);
                    try {
                        i.find(f => f instanceof P)?.startBlurring(p, {
                            showValue: true
                            // showValue: !!d
                        })
                    } catch (f) {
                        console.error(f)
                    }
                    try {
                        a && i.find(f => f instanceof k)?.startBlurring(p, {
                            showValue: true
                            // showValue: !!d
                        })
                    } catch (f) {
                        console.error(f)
                    }
                    try {
                        m && i.find(f => f instanceof U)?.startBlurring(p, {
                            showValue: true
                            // showValue: !!d
                        })
                    } catch (f) {
                        console.error(f)
                    }
                } catch (error) {
                    console.error("Failed to load config:", error);
                }
            }, n = async o => {
                chrome.runtime.sendMessage(o)
            };
        chrome.runtime.onMessage.addListener(async (o, r) => {
            o.method === "getUrl" && await n({
                method: "getUrlResponse",
                isTop: window.top === window,
                numOfChildren: Array.from(document.querySelectorAll("iframe,frame")).filter(s => /^https?:\/\//.test(s.getAttribute("src"))).length,
                url: location.href
            })
        }), chrome.storage.onChanged.addListener(async (o, r) => {
            r === "local" && await t()
        }), await t()
    })();
})();