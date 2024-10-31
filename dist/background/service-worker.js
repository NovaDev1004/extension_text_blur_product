
"use strict"; (() => {
    function r(t) { return t.replace(/([\(\)\{\}\+\*\?\[\]\.\^\$\|\\])/g, "\\$1") } chrome.runtime.onInstalled.addListener(() => { chrome.contextMenus.create({ id: "add_keyword", title: "Add this as blurry keyword", contexts: ["selection"] }) }); chrome.contextMenus.onClicked.addListener(async (t, s) => {
        if (t.menuItemId === "add_keyword") {
            let e = (await chrome.storage.local.get(["keywords"])).keywords?.split(/\n/) || []; e.length === 1 && e[0] === "" && e.pop(); let o = (await chrome.storage.local.get(["mode"]))?.mode === "regexp" ? r(t.selectionText) : t.selectionText; o && !e.includes(o) && e.push(o), await chrome.storage.local.set({
                keywords: e.join(`
`).replace(/\u00a0/g, " ")
            }), chrome.runtime.sendMessage({ method: "reload" })
        }
    });
})();
