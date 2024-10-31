(() => {
    function W(V) {
        return V.replace(/([\(\)\{\}\+\*\?\[\]\.\^\$\|\\])/g, "\\$1")
    }
    document.addEventListener("DOMContentLoaded", async V => {
        let {
            status: D,
            keywords: _,
            mode: N,
            matchCase: j,
            showValue: G,
            blurInput: Y,
            blurTitle: z,
            exclusionUrls: J
        } = await chrome.storage.local.get(["status", "keywords", "mode", "matchCase", "showValue", "blurInput", "blurTitle", "exclusionUrls"]), h = document.querySelector("#applyButton"), t = document.querySelector("#patternInput"), p = document.querySelector("#statusCheckbox"), f = document.querySelector("#caseCheckbox"), u = document.querySelector("#regexpCheckbox"), m = document.querySelector("#showValueCheckbox"), y = document.querySelector("#blurInputCheckbox"), b = document.querySelector("#blurTitleCheckbox"), g = document.querySelector("#_bufferTextArea"), w = document.querySelector("#addUrlsInCurrentTab"), r = document.querySelector("#exclusionTextArea");
        if (!h || !t || !p || !f || !u || !m || !y || !b || !g || !w || !r) throw new Error("Element not found");
        let x = getComputedStyle(g).getPropertyValue("background-color"),
            Q = "#FFA500",
            X = "#FF4500",
            H = 10,
            L = getComputedStyle(t),
            Z = parseInt(L.getPropertyValue("padding-left")),
            E = parseInt(L.getPropertyValue("padding-top")),
            ee = parseInt(L.getPropertyValue("line-height")),
            T = "",
            v = "",
            C = !1,
            S = !1,
            $ = !1,
            I = !1,
            M = !1,
            k = {};
        window.addEventListener("keydown", e => {
            if (e.key === "s" && (e.ctrlKey && !e.metaKey || !e.ctrlKey && e.metaKey)) {
                e.preventDefault(), h.click();
                return
            }
            if (e.key === "F" && e.altKey && e.shiftKey) {
                let a = document.querySelector("#tab-exclusion:checked~#tab-panel-exclusion textarea") || document.querySelector("#tab-keywords:checked~#tab-panel-keywords textarea");
                if (!a) {
                    e.preventDefault();
                    return
                }
                a.focus(), a.value = a.value.split(/\n/).filter(l => l.trim() !== "").join(`
`), e.preventDefault();
                return
            }
        }), chrome.runtime.onMessage.addListener((e, a, l) => {
            e.method === "reload" && window.location.reload()
        });
        let te = async (e, a, l) => {
            if (e.method !== "getUrlResponse") return;
            let s = W(e.url),
                d = r.value.split(/\n/);
            d.includes(s) || d.filter(n => !!n).some(n => new RegExp(n).test(e.url)) || (r.value = `${r.value.trimEnd()}
^${s}$`, await o({
                target: r
            }), h.disabled = !1, r.focus())
        };
        chrome.runtime.onMessage.addListener(te), w.addEventListener("click", async e => {
            // if (!p.checked) return;
            let l = (await chrome.tabs.query({
                active: !0,
                currentWindow: !0
            }))?.[0]?.id;
            l && await chrome.tabs.sendMessage(l, {
                method: "getUrl"
            })
        });
        let ae = e => new Promise(a => {
                e === "" && a(!1);
                try {
                    let l = new RegExp(e).source.replace(/\\.|\[[^\]]*\]/g, "x");
                    a(/\((?:[^?]|(?=\?<[^!>]+>))/.test(l))
                } catch {
                    a(!0)
                }
            }),
            ne = e => new Promise(a => {
                e === "" && a(!0);
                try {
                    new RegExp(e), a(!0)
                } catch {
                    a(!1)
                }
            }),
            re = (e, a) => new Promise(l => {
                let s = window.getComputedStyle(e),
                    d = parseInt(s.paddingLeft),
                    n = parseInt(s.paddingRight),
                    i = parseInt(s.lineHeight);
                isNaN(i) && (i = parseInt(s.fontSize)), g.style.width = e.clientWidth - d - n + "px", g.style.font = s.font, g.style.letterSpacing = s.letterSpacing, g.style.whiteSpace = s.whiteSpace, g.style.wordBreak = s.wordBreak, g.style.wordSpacing = s.wordSpacing, g.style.wordWrap = s.wordWrap, g.value = a;
                let c = Math.floor(g.scrollHeight / i);
                l(c == 0 ? 1 : c)
            }),
            R = async (e, a) => await e.value.split(/\n/).reduce(async (s, d) => {
                let n = await re(e, d),
                    i = await s,
                    c = {
                        numOfLine: n,
                        isValid: !0,
                        reason: ""
                    };
                return a || (await ne(d) ? await ae(d) ? (c.isValid = !1, c.reason = "Error:\n  This string might contain capture-group that should be non-capture-group.\n  Replace a pair of `(` and `)` to `(?:` and `)`.") : /^(?:\.|(?:\\[^\\])|(?:\[[^\]]+\]))(?:\?|\*|\+|\{,?1\}|\{1,(?:\d+)?\})?$/.test(d) ? c.reason = `Warning:
  One character matching might cause performance issue.` : d !== "" && new RegExp(d).test("") && (c.isValid = !1, c.reason = `Error:
  This pattern matches an empty string.`) : (c.isValid = !1, c.reason = `Error:
  Failed to create RegExp object.
  Check if this is a valid regular expression string.`)), i.push(c), i
            }, []), o = async e => {
                if (e.target.value.split(/\n/).length == 0) {
                    h.disabled = !1;
                    return
                }
                u.checked && (h.disabled = !1), k[e.target.id] = await R(e.target, !u.checked), h.disabled = !k[e.target.id].every(n => n.isValid) || t.value === T && r.value === v && f.checked === C && m.checked === $ && u.checked === S && y.checked === I && b.checked === M;
                let l = /\*(\d+)( - [\d.]+px\))$/,
                    s = k[e.target.id].reduce((n, i, c, F) => {
                        let K = i.isValid ? i.reason ? Q : x : X;
                        if (c == 0) return n.push(`${K} calc(var(--l)*0 - ${e.target.scrollTop}px) calc(var(--l)*${i.numOfLine} - ${e.target.scrollTop}px)`), n;
                        let A = parseInt(n[n.length - 1].match(l)[1]);
                        return i.isValid == F[c - 1].isValid && !!i.reason == !!F[c - 1].reason ? (n[n.length - 1] = n[n.length - 1].replace(l, `*${A+i.numOfLine}$2`), n) : (n.push(`${K} calc(var(--l)*${A} - ${e.target.scrollTop}px) calc(var(--l)*${A+i.numOfLine} - ${e.target.scrollTop}px)`), n)
                    }, []);
                if (s.length > 0) {
                    let n = parseInt(s[s.length - 1].match(l)[1]);
                    s.push(`${x} calc(var(--l)*${n} - ${e.target.scrollTop}px) calc(var(--l)*${n+1} - ${e.target.scrollTop}px)`), e.target.setAttribute("rows", n > H ? n : H)
                }
                let d = document.querySelector(`head > style#style-${e.target.id}`);
                d && (d.innerHTML = `
textarea#${e.target.id} {
  background: linear-gradient(
  ${s.join(`,
  `)}
  ) 0 8px no-repeat, ${x};
}`)
            };
        h.addEventListener("click", async e => {
            await chrome.storage.local.set({
                status: p.checked ? "" : "disabled",
                keywords: t.value.replace(/\u00a0/g, " "),
                exclusionUrls: r.value,
                mode: u.checked ? "regexp" : "text",
                matchCase: f.checked,
                showValue: m.checked,
                blurInput: y.checked,
                blurTitle: b.checked
            }), t.focus(), T = t.value, v = r.value, S = u.checked, C = f.checked, $ = m.checked, I = y.checked, M = b.checked, e.target && e.target instanceof HTMLButtonElement && (e.target.disabled = !0)
        }), p.addEventListener("change", async e => {
            if (!(!e.target || !(e.target instanceof HTMLInputElement))) {
                if (f.disabled = m.disabled = y.disabled = b.disabled = u.disabled = t.disabled = r.disabled = !e.target.checked, k[t.id] = await R(t, !u.checked), k[r.id] = await R(r, !u.checked), w.style.cursor = e.target.checked ? "" : "auto", h.disabled = !e.target.checked || !k[t.id].every(a => a.isValid) || !k[r.id].every(a => a.isValid), await chrome.storage.local.set({
                        status: e.target.checked ? "" : "disabled"
                    }), !e.target.checked) {
                    let a = document.querySelector(`head > style#style-${t.id}`);
                    a && (a.innerHTML = "");
                    let l = document.querySelector(`head > style#style-${r.id}`);
                    l && (l.innerHTML = "");
                    return
                }
                await o({
                    target: t
                }), await o({
                    target: r
                }), t.focus()
            }
        }), u.addEventListener("change", async e => {
            t.focus(), t.style.background = x, t.style.background = "", await o({
                target: t
            })
        }), f.addEventListener("change", async e => {
            await o({
                target: t
            })
        }), m.addEventListener("change", async e => {
            await o({
                target: t
            }), t.focus()
        }), y.addEventListener("change", async e => {
            await o({
                target: t
            }), t.focus()
        }), b.addEventListener("change", async e => {
            await o({
                target: t
            }), t.focus()
        });
        let q = e => {
                e.target.scrollLeft < Z && (e.target.scrollLeft = 0), e.target.scrollTop < E && (e.target.scrollTop = 0)
            },
            O = e => {
                if (e.offsetY + e.target.scrollTop - E < 0) return;
                let a = parseInt(`${(e.offsetY+e.target.scrollTop-E)/ee}`) + 1;
                e.target.pointedRow != a && (e.target.pointedRow = a, k[e.target.id]?.reduce((l, s) => l < 0 ? -1 : (l -= s.numOfLine, l > 0 ? (e.target.title = "", l) : (e.target.setAttribute("title", s.reason || ""), -1)), a))
            },
            U = e => {
                e.target.pointedRow = -1
            },
            B = document.createElement("style");
        document.head.appendChild(B), B.setAttribute("id", `style-${t.id}`), t.addEventListener("scroll", o), t.addEventListener("scroll", q), t.addEventListener("input", o), t.addEventListener("mousemove", O, !1), t.addEventListener("mouseout", U);
        let P = document.createElement("style");
        document.head.appendChild(P), P.setAttribute("id", `style-${r.id}`), r.addEventListener("scroll", o), r.addEventListener("scroll", q), r.addEventListener("input", o), r.addEventListener("mousemove", O, !1), r.addEventListener("mouseout", U), p.checked = D !== "disabled", C = f.checked = j, $ = m.checked = G, I = y.checked = Y, M = b.checked = z, S = u.checked = N === "regexp", T = t.value = _ || "", v = r.value = J || "", f.disabled = y.disabled = b.disabled = m.disabled = u.disabled = t.disabled = r.disabled = h.disabled = !p.checked, w.style.cursor = p.checked ? "" : "auto", t.focus(), p.checked && (await o({
            target: t
        }), await o({
            target: r
        })), h.disabled = !0
    });
})();