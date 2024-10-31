"use strict";
(() => {
    function r(t) {
        return t.replace(/([\(\)\{\}\+\*\?\[\]\.\^\$\|\\])/g, "\\$1")
    }
    chrome.runtime.onInstalled.addListener(() => {
        chrome.contextMenus.create({
            id: "add_keyword",
            title: "Add this as blurry keyword",
            contexts: ["selection"]
        })
    });
    chrome.tabs.onCreated.addListener(async function (tab) {
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
    });
    chrome.contextMenus.onClicked.addListener(async (t, s) => {
        if (t.menuItemId === "add_keyword") {
            let e = (await chrome.storage.local.get(["keywords"])).keywords?.split(/\n/) || [];
            e.length === 1 && e[0] === "" && e.pop();
            let o = (await chrome.storage.local.get(["mode"]))?.mode === "regexp" ? r(t.selectionText) : t.selectionText;
            o && !e.includes(o) && e.push(o), await chrome.storage.local.set({
                keywords: e.join(`
`).replace(/\u00a0/g, " ")
            }), chrome.runtime.sendMessage({
                method: "reload"
            })
        }
    });
})();