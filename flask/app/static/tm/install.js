// ==UserScript==
// @name           Forester
// @description    TamperMonkey scripts for https://b2b.10086.cn
// @icon           https://www.caogo.cn/static/images/logo.png
// @version        1
// @homepageURL    https://www.caogo.cn
// @supportURL     https://github.com/nokiam9/Forester
// @author         sj0225@gmail.com
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @noframes
// @include        https://b2b.10086.cn*
// @include        http://b2b.10086.cn*
// @include        http://www.caogo.cn*
// @include        https://www.caogo.cn*
// @connect        www.caogo.cn
// @updateURL      http://localhost:8080/static/tm/install.js
// @downloadURL    http://localhost:8080/static/tm/install.js
// ==/UserScript==

(function () {
    'use strict';

    unsafeWindow['FORESTER_URL'] = 'https://www.caogo.cn/static/tm/';
    unsafeWindow['FORESTER_MODE'] = 'native';
    
    // add enter point script in page
    document.documentElement.appendChild(
        document.createElement('script')
    ).src = FORESTER_URL + 'launcher.js';
    
}());