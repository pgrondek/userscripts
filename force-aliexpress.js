// ==UserScript==
// @name         Force aliexpress settings.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When visiting aliexpress it's likes to change user settings based on user data (probably ip/accept-language header) with item listings poorly translated to local language. This script overrides locale, currency, region, and site then after 1s redirects to global site. Based on work of Зальотне дитя мемарні 🇺🇦✌️
// @author       Зальотне дитя мемарні 🇺🇦✌️
// @author       Przemek Grondek
// @match        *://*.aliexpress.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// ==/UserScript==

const FORCE_SITE = 'glo'
const FORCE_REGION = 'PL'
const FORCE_LOCALE = 'en_US'
const FORCE_CURRENCY = 'PLN'

let refreshNeeded = false;
let newLocation = window.location.href;

function getCookie(cName) {
    const match = document.cookie.match(new RegExp('(^| )' + cName + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return '';
    }
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
}

const cookie = getCookie('aep_usuc_f');
const isCookieOkay = (cookie.includes(`site=${FORCE_SITE}`)
    && cookie.includes(`region=${FORCE_REGION}`)
    && cookie.includes(`b_locale=${FORCE_LOCALE}`)
    && cookie.includes(`c_tp=${FORCE_CURRENCY}`)
);

if (!isCookieOkay) {
    const newCookie = `site=${FORCE_SITE}&c_tp=${FORCE_CURRENCY}&region=${FORCE_REGION}&b_locale=${FORCE_LOCALE}`;
    setCookie('aep_usuc_f', newCookie, 9999);
    refreshNeeded = true;
}

if (!window.location.href.includes('www.aliexpress.com') && !window.location.href.includes('wp.aliexpress.com')) {
    window.stop();
    const oldLocation = window.location.href;
    newLocation = oldLocation.replace(/gatewayAdapt=glo2[a-z]+/, '')
        .replace(/[^\/]*\.aliexpress.com/g,'www.aliexpress.com')
    refreshNeeded = true;
}

if (refreshNeeded) {
    setTimeout(function() {window.location = newLocation;} , 1000);
}