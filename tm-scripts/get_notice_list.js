// ==UserScript==
// @name         TM of notice list
// @namespace    www.caogo.cn
// @version      0.8
// @description  scrapy notice info from DOM
// @author       sj0225@icloud.com
// @match        https://b2b.10086.cn/b2b/main/listVendorNotice.html?noticeType=*
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @connect      www.caogo.cn
// ==/UserScript==

(function() {
    'use strict';

    // Func: 用于从指定页面开始爬取数据
    async function gotoPage(pageNumber){
        await waitForSelector(window, 'a.current'); // 等待‘当前页码’元素出现
        document.querySelector('#pageNumber').value = pageNumber; // 模拟输入‘页码’
        document.querySelector('#pageid2 > table > tbody > tr > td:nth-child(8) > input[type=button]').onclick(); //模拟点击‘GO’按钮
        await waitForSelector(window, 'a.current');

        let x = document.querySelector('a.current').innerText;
        if (Number(x) == pageNumber) {
            console.log('Test: 成功调转到断点页码， 当前页码=', x );
            await sleep(3000);
        }
        else {
            alert('严重错误: 无法调转到断点页码， 当前页码=' + x );
        }
    }

    // main主程序入口
    (async function main() {
        const active_page_selector = 'a.current';
        // 可能的初始化环节：填写页码数字，并模拟点击GO按钮，就可以跳转到指定页面
        //gotoPage(18);

        do {
            await waitForSelector(window, active_page_selector); // 提取当前活跃焦点的Page序号
            let page_now = Number(document.querySelector(active_page_selector).textContent);
            console.log('Info(main): page_now=', page_now, '，爬取&发送数据');

            const notice_type_id = window.location.search.split('=')[1]; // 取出url的参数值 [1,2,3,7,8,16]
            const post_url = 'http://www.caogo.cn/notices';
            await getNoticeList(document, 'TM', notice_type_id).then( // 分析页面获得公告列表的数据
                noticeList => postNoticeList(noticeList, post_url)).then( // 通过XHR发送爬取结果数据
                response => console.log(response), // #TODO: 分析XHR结果，如果全部数据重复，说明页面无更新，需要想办法退出main()
                error => console.error(error)
            );

            const next_page_button_selector = '#pageid2 > table > tbody > tr > td:nth-child(4) > a';
            let next_page_btn = document.querySelector(next_page_button_selector); // 寻找‘下一页’按钮
            if (next_page_btn) {
                console.log('Info(main): Pause 5 seconds, then start to scrapy next page');
                next_page_btn.onclick(); // 模拟click动作
                await sleep(5000);
            }
            else { // 找不到‘下一页’的按钮，说明页面已全部提取
                console.log('Info(main): Scrapy data compeleted !!!');
                return;
            }
        } while(1);
    })();

    // Func: 分析list页面，返回公告列表
    function getNoticeList(listDoc, spider, type_id){
        return new Promise((resolve, reject)=> {
            const first_notice_selector = '#searchResult > table > tbody > tr:nth-child(3)';
            const content_base_url = 'https://b2b.10086.cn/b2b/main/viewNoticeContent.html?noticeBean.id=';

            let notices = [];
            let line = listDoc.querySelector(first_notice_selector); // 提取第一行notice
            while (line) {
                notices.push({
                    spider: spider,
                    type_id: type_id,
                    nid: line.getAttribute('onclick').split("'")[1],
                    source_ch: line.children[0].textContent,
                    notice_type: line.children[1].textContent,
                    title: line.children[2].children[0].textContent,
                    published_date: line.children[3].textContent,
                }); // 获得公告列表的基础信息
                line = line.nextElementSibling; // 循环提取下一行
            };

            // 新开窗口提取公告内容文本等数据
            (async () => {
                const ctw = window.open('', ''); // 打开一个临时窗口，用于提取内容文本，循环使用以节约资源
                if (ctw == null) { // 新开窗口可能被拦截
                    console.error('Info(getContentList): open new winodw failed, maybe blocked by chrome setting!');
                    reject('Open new window failed');
                }

                for (let x of notices) {
                    const url = content_base_url + x.nid;
                    await getNoticeContent(ctw, url).then(
                        content => {
                            Object.assign(x, {notice_url: url});
                            Object.assign(x, {notice_content : content}); // 追加公告内容，后续增加附件下载功能
                            console.log('Info(getContentList): nid=', x.nid, ', title=',x.title, ',length=', x.notice_content.length);
                        }
                    );
                };
                ctw.close();
                resolve(notices);
            })(); //定义异步、匿名、包裹函数，并立即执行
        })
    }

    function getNoticeContent(page, url) {
        return new Promise((resolve,reject)=> {
           (async function (){
               const selector_id = '#container';

               page.location.assign(url); // 打开内容网页
               console.log('Info(getContent): Open window with url=', url);
               await waitForSelector(page, selector_id).then( //异步等待指定内容出现
                   doc => resolve(doc.body.innerText.trim()),
                   error => reject(error)
               );
           })(); // 定义异步函数并立即执行
        });
    }

    // Func: 向XHR发送公告数据
    function postNoticeList(noticeList, url){
        return new Promise((resolve, reject)=>{
            console.log('Debug(postNoticeList): Start...');
            //console.log('cnt=', noticeList.length, ', ex=', noticeList[0].notice_content);
            //debugger;

            for (let x of noticeList) { // 逐条post公告数据
                GM_xmlhttpRequest ({
                method:     "POST",
                url:        url,
                data:       JSON.stringify(x),
                onload:     function (response){
                    console.log('XHR onload:', response.responseText);
                    resolve(response); // 如果全部数据重复，要想办法自动退出
                },
                onerror: function(error){
                    reject('XHR onerror: network error!'); // POST网络故障时退出
                }
            });
            }

            resolve('Test: post records=' + noticeList.length); //Debug
        });
    }

    function waitForSelector(page, id){
        return new Promise((resolve, reject)=> {
            const retry_delay = 500;
            const retry_limits = 5;

            // console.log('Debug(waitforNode): start looking for node with ', selector_id);
            let retry_cnt = 0;
            setInterval(function myVar(){
                if (page.document.querySelector(id)) {
                    clearInterval(myVar);
                    resolve(page.document);
                } else if (retry_cnt >= retry_limits) {
                    clearInterval(myVar);
                    reject('Error(waitForSelector->myTimer): Failed searching for node=', id);
                } else retry_cnt++;
            }, retry_delay);
        })
    }

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
})();