document.getElementById('step-kmeans').addEventListener('click', stepThroughKMeans);
document.getElementById('run-convergence').addEventListener('click', runToConvergence);
document.getElementById('new-dataset').addEventListener('click', generateNewDataset);
document.getElementById('reset').addEventListener('click', resetAlgorithm);

function stepThroughKMeans() {
    let k = document.getElementById('num-clusters').value;
    let initMethod = document.getElementById('init-method').value;
    fetch('/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ init_method: initMethod, n_clusters: k })
    })
    .then(response => response.json())
    .then(result => {
        let centroids = result.centroids;
        let clusters = result.clusters;
        plotClusters(centroids, clusters);
    });
}

function runToConvergence() {
   
}

function generateNewDataset() {
    fetch('/get_data')
    .then(response => response.json())
    .then(data => {
        plotData(data);
    });
}

function resetAlgorithm() {
}

function plotClusters(centroids, clusters) {
    let traces = [
        {
            x: clusters.map(point => point[0]),
            y: clusters.map(point => point[1]),
            mode: 'markers',
            type: 'scatter',
            name: 'Data Points'
        },
        {
            x: centroids.map(centroid => centroid[0]),
            y: centroids.map(centroid => centroid[1]),
            mode: 'markers',
            marker: { color: 'red', symbol: 'x', size: 12 },
            name: 'Centroids'
        }
    ];
    let layout = { title: 'KMeans Clustering Animation' };
    Plotly.newPlot('plot', traces, layout);
}
