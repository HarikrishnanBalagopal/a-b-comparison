import { Graph } from './graph.js';

let resumes = [];
let resumeURLs = [];
let N = resumes.length;

let i = 0;
let j = 1;

const SCORES = [];
const GRAPH = new Graph();

let comparisonsDone = 0;

function totalComparisons(x) {
    const y = x - 1;
    return y * (y + 1) / 2;
    // 1, 2, 3, 4

    // 3, 4     2, 4     1, 4
    //          2, 3     1, 3
    //                   1, 2

    // 1, 2
    // 1, 3     2, 3
    // 1, 4     2, 4     3, 4

    // 2, 3
    // 2, 4

    // 3, 4
}

function getSortedByScores() {
    const idxs = [];
    for (let q = 0; q < N; q++)idxs.push(q);
    idxs.sort((ri, rj) => SCORES[ri] < SCORES[rj] ? -1 : 1);
    const rs = [];
    for (let q = 0; q < N; q++) rs.push({ name: resumes[idxs[q]], score: SCORES[idxs[q]] });
    return rs;
}

function done() {
    const sortedByScores = getSortedByScores().reverse();
    console.log(sortedByScores);
    document.querySelector('#sorted-output').textContent = JSON.stringify(sortedByScores, null, 2);
    alert('we are done! final SCORES are ' + JSON.stringify(SCORES));
    const dot = GRAPH.toDot();
    console.log(dot);
    document.querySelector('#graph-wrapper').classList.remove('hidden');
    d3.select("#graph").graphviz().renderDot(dot);
    document.querySelector('#graph-json-output').textContent = dot;
}

function getIframes() {
    return [
        document.querySelector('#panel-a>iframe'),
        document.querySelector('#panel-b>iframe'),
    ];
}

function updateComparisonCounter() {
    const t1 = document.querySelector('#compare-tab-header>#info');
    t1.textContent = `comparisons remaining: ${totalComparisons(N) - comparisonsDone}`;
}

function handleClick(isA) {
    if (i >= N) return done();
    comparisonsDone++;
    updateComparisonCounter();
    const idx = isA ? i : j;
    console.log('selected the resume at index', idx, 'using the button ', isA ? 'A' : 'B', 'and the filename is', resumes[idx]);
    SCORES[idx]++;
    console.log('SCORES', SCORES, 'comparisonsDone', comparisonsDone);
    // edge towards lesser item
    GRAPH.addVertex(i, resumes[i]);
    GRAPH.addVertex(j, resumes[j]);
    if (isA) GRAPH.addEdge(i, j); // idx i is better
    else GRAPH.addEdge(j, i); // idx j is better

    // update
    j++;
    if (i === j) j++;
    if (j >= N) {
        i++;
        j = i + 1;
        if (i >= N || j >= N) return done();
    }
    console.log('i', i, 'j', j);
    const r1 = resumeURLs[i];
    const r2 = resumeURLs[j];
    console.log('r1', r1, 'r2', r2);
    const [iframeA, iframeB] = getIframes();
    if (iframeA.src !== r1) iframeA.src = r1;
    if (iframeB.src !== r2) iframeB.src = r2;

    console.log('---------------------------------------');
}

function initCompare() {
    const buttonA = document.querySelector('#button-a');
    const buttonB = document.querySelector('#button-b');

    buttonA.addEventListener('click', () => handleClick(true));
    buttonB.addEventListener('click', () => handleClick(false));

    for (let r = 0; r < N; r++) {
        SCORES.push(0);
    }
    console.log('SCORES', SCORES);
    updateComparisonCounter();

    const uploadTab = document.querySelector('#upload-tab');
    const compareTab = document.querySelector('#compare-tab');
    uploadTab.classList.add('hidden');
    compareTab.classList.remove('hidden');

    const r1 = resumeURLs[i];
    const r2 = resumeURLs[j];
    console.log('r1', r1, 'r2', r2);
    const [iframeA, iframeB] = getIframes();
    if (iframeA.src !== r1) iframeA.src = r1;
    if (iframeB.src !== r2) iframeB.src = r2;

    console.log('done initializing the compare tab');
    console.log('---------------------------------------');
}

function main() {
    const uploadFiles = document.querySelector('#upload-files');
    uploadFiles.addEventListener('change', e => {
        const fs = e.target.files;
        if (!fs || fs.length === 0) return console.log('no files selected');
        console.log('fs.length', fs.length);
        console.log('fs', fs);
        const t1 = Array.from(fs);
        const t2 = t1.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        console.log('t2', t2);
        resumes = t2.map(t => t.name);
        resumeURLs = t2.map(t => t.url);
        N = resumes.length;
        console.log('switching to the compare tab');
        initCompare();
    });
    console.log('done');
}

main();
