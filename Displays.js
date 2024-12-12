// ==UserScript==
// @name         VisNotes MPP (Builderman00 Version)
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Displays NPS, NoteQuota, Ping, FPS, Notes, and Play Time for Multiplayer Piano
// @author       Builderman00
// @match        *://mpp.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mppclone.com/*
// @match        *://mpp.8448.space/*
// @match        *://smp-meow.net/*
// @match        *://multiplayerpiano.net/*
// @match        *://multiplayerpiano.org/*
// @match        *://multiplayerpiano.com/*
// @match        *://ompp.daniel9046.tk/*
// @grant        none
// @license      MIT
// ==/UserScript==

window.addEventListener('load', () => {
    let notes = 0, nps = 0, fps = 0;
    let startTime = Date.now();

    async function ping() {
        let start = Date.now();
        try { await fetch(`${window.location.protocol}${MPP.client.uri.slice(4)}`); }
        catch (err) {}
        return (Date.now() - start);
    }

    function fpsCount() { fps += 1; requestAnimationFrame(fpsCount); }

    requestAnimationFrame(fpsCount);

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    const stat = document.createElement("div");
    stat.id = "stat_notes";
    stat.style.opacity = "1";
    stat.style.position = "fixed";
    stat.style["z-index"] = 150;
    stat.style.display = "block";
    stat.style.margin = "auto";
    stat.style.top = `${document.getElementById("piano").height}px`;
    stat.style["background-color"] = "rgba(137, 137, 137, 0.414)";
    stat.style["backdrop-filter"] = "blur(1px)";
    stat.style["font-size"] = "21px";
    stat.innerHTML = `Notes: <span id="notes">0</span> NPS: <span id="nps">0</span> NoteQuota: <span id="nquota">${MPP.noteQuota.points}</span> Ping: <span id="ping"></span> FPS: <span id="fps"></span> Time: <span id="playtime">0h 0m 0s</span>`;
    stat.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;

    document.body.append(stat);

    function stats() {
        document.getElementById("notes").innerText = notes;
        document.getElementById("nquota").innerText = MPP.noteQuota.points;
    }

    function grad(nq, nqmax) {
        document.getElementById("nquota").style.color = `rgb(255, ${Math.round((nq / nqmax) * 255)}, ${Math.round((nq / nqmax) * 255)})`;
    }

    setInterval(async () => {
        document.getElementById("nps").innerText = nps;
        document.getElementById("nquota").innerText = MPP.noteQuota.points;
        document.getElementById("ping").innerText = await ping();
        document.getElementById("fps").innerText = fps;
        document.getElementById("playtime").innerText = formatTime(Date.now() - startTime);
        fps = nps = 0;
        grad(MPP.noteQuota.points, MPP.noteQuota.max);
    }, 1000);

    MPP.piano.renderer.__proto__.vis = MPP.piano.renderer.__proto__.visualize;
    MPP.piano.renderer.__proto__.visualize = function (n, c, ch) {
        notes += 1;
        nps += 1;
        stats();
        grad(MPP.noteQuota.points, MPP.noteQuota.max);
        this.vis(n, c, ch);
    };
});
