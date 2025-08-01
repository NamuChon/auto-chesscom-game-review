// ==UserScript==
// @name         Auto Chess.com Game Review
// @namespace    http://tampermonkey.net/
// @version      2025-08-01
// @description  Automatically reviews Chess.com games from the game archive page.
// @author       Im_chess_noob
// @match        https://www.chess.com/games/archive*
// @match        https://www.chess.com/analysis/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let url;

(function() {
    window.addEventListener('load', function() {
        url = window.location.href;
        if (url.includes('archive')) {
            if (!url.match(/page=\d+/)) {
                url += (url.endsWith('archive') ? '?' : '&') + 'page=1';
            }
            archive();
        } else {
            review();
        }
    });
})();

function archive() {
    const trs = document.querySelector('table.table-component.table-hover.archive-games-table')
    .querySelector('tbody')
    .getElementsByTagName('tr');

    let analyzeLinks = [];
    for (const tr of trs) {
        const a = tr.querySelector('td.table-text-center.archive-games-analyze-cell')
        .querySelector('a.archive-games-link');
        if (a) analyzeLinks.push(a.getAttribute('href'));
    }

    localStorage.setItem('archiveUrl', url);
    localStorage.setItem('analyzeLinks', JSON.stringify(analyzeLinks));
    review();
}

function review() {
    const interval = setInterval(() => {
        const loading = document.querySelector("div.loading-chart-component.game-arc-loader");
        if (!loading) {
            clearInterval(interval);
            callback();
        }
    }, 300);

    function callback() {
        let analyzeLinks = JSON.parse(localStorage.getItem('analyzeLinks'));

        if (analyzeLinks.length === 0) {
            const archiveUrlSplit = localStorage.getItem('archiveUrl').split('page=');
            window.location.href = archiveUrlSplit[0] + 'page=' + (parseInt(archiveUrlSplit[1], 10) + 1);
        } else {
            const nextLink = analyzeLinks.shift();
            localStorage.setItem('analyzeLinks', JSON.stringify(analyzeLinks));
            window.location.href = nextLink;
        }
    }
}