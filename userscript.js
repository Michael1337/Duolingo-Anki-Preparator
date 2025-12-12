// ==UserScript==
// @name         Create CSV from Duolingo Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click load more repeatedly, then speaker buttons; exports Japanese and English pairs to CSV.
// @author       AI Assistant
// @match        https://www.duolingo.com/practice-hub/words
// @grant        GM_log
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Inject script into the page context to override fetch
    function injectFetchOverride() {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const originalFetch = window.fetch;
                window.fetch = async function(...args) {
                    try {
                        let url = args[0];
                        if (url instanceof Request) url = url.url;
                        if (typeof url === 'string' && url.includes('cloudfront.net') && /[a-f0-9]{32}/i.test(url)) {
                            console.log('Audio fetch detected (page context):', url);
                        }
                        return await originalFetch.apply(this, args);
                    } catch (e) {
                        console.error('Error in fetch override:', e);
                        throw e;
                    }
                };
            })();
        `;
        if (document.documentElement) {
            document.documentElement.appendChild(script);
            script.remove();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.documentElement.appendChild(script);
                script.remove();
            });
        }
    }

    injectFetchOverride();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    GM_log('UserScript loaded, AudioContext created');

    window.addEventListener('DOMContentLoaded', () => {

        function resumeAudioContextOnUserGesture() {
            function resume() {
                GM_log('User gesture detected, resuming AudioContext...');
                audioContext.resume().then(() => {
                    GM_log('AudioContext resumed after user gesture');
                    document.body.removeEventListener('click', resume);
                    document.body.removeEventListener('keydown', resume);
                    clickLoadMoreUntilGone(() => {
                        startClickingButtons();
                    });
                }).catch(e => {
                    GM_log('AudioContext resume failed:', e);
                });
            }
            document.body.addEventListener('click', resume);
            document.body.addEventListener('keydown', resume);
            GM_log('Waiting for user gesture to resume AudioContext...');
        }

        function clickLoadMoreUntilGone(callback, maxTries = 30, delay = 1000) {
            let tries = 0;
            function tryClick() {
                const loadMoreBtn = document.querySelector('li._2NNqw._2g-qq[role="button"] b');
                if (loadMoreBtn) {
                    GM_log('Clicking Load More button, try #' + (tries + 1));
                    loadMoreBtn.click();
                    tries++;
                    if (tries < maxTries) {
                        setTimeout(tryClick, delay);
                    } else {
                        GM_log('Max tries reached for Load More button.');
                        callback();
                    }
                } else {
                    GM_log('No Load More button found, proceeding...');
                    callback();
                }
            }
            tryClick();
        }

        function startClickingButtons() {
            try {
                GM_log('Starting speaker button clicks...');
                const items = document.querySelectorAll('div.m2Q7T');
                GM_log(`Found ${items.length} speaker/button items.`);

                let delay = 0;
                const rows = [['Japanese', 'English']]; // CSV header row

                items.forEach(item => {
                    setTimeout(() => {
                        try {
                            const button = item.querySelector('button._1GJVt');
                            const japaneseWord = item.querySelector('h3')?.textContent.trim() || 'N/A';
                            const englishWord = item.querySelector('p')?.textContent.trim() || 'N/A';

                            if (button) {
                                GM_log(`${japaneseWord};${englishWord}`);
                                rows.push([japaneseWord, englishWord]);
                                button.click();
                            } else {
                                GM_log('No button found in item:', item);
                            }

                            if (rows.length === items.length + 1) {
                                generateCSVDownload(rows);
                            }
                        } catch (innerEx) {
                            GM_log('Error clicking button or logging words:', innerEx);
                        }
                    }, delay);
                    delay += 100;
                });
            } catch (ex) {
                GM_log('Error in startClickingButtons:', ex);
            }
        }

        function generateCSVDownload(rows) {
            let csvContent = "";
            rows.forEach(row => {
                const escapedRow = row.map(field => {
                    if (field.includes(';') || field.includes('"') || field.includes('\n')) {
                        return '"' + field.replace(/"/g, '""') + '"';
                    } else {
                        return field;
                    }
                });
                csvContent += escapedRow.join(';') + "\r\n";
            });

            const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'words.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        resumeAudioContextOnUserGesture();
    });

})();
