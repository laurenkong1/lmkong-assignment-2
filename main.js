// Placeholder for KMeans algorithm implementation
class KMeans {
    constructor(k, data, initMethod) {
        this.k = k;
        this.data = data;
        this.initMethod = initMethod;
        this.centroids = [];
        this.assignments = new Array(data.length);
        this.initializeCentroids();
    }


    initializeCentroids() {
        if (this.initMethod === 'Random') {
            this.centroids = this.getRandomCentroids();
        } else if (this.initMethod === 'Farthest First') {
            this.centroids = this.getFarthestCentroids();
        } else if (this.initMethod === 'KMeans++') {
            this.centroids = this.getKMeansPlusCentroids();
        }
    }

    // Dummy functions to be implemented based on logic
    getRandomCentroids() {
        return this.data.slice(0, this.k); // Simple version, choose first k points
    }

    getFarthestCentroids() {
        // Implement Farthest First algorithm
        return [];
    }

    getKMeansPlusCentroids() {
        // Implement KMeans++ algorithm
        return [];
    }

    // Step through the clustering process
    step() {
        // Assign points to nearest centroids
        this.assignments = this.data.map(point => this.getNearestCentroid(point));

        // Recalculate centroids based on assignments
        this.centroids = this.recalculateCentroids();
    }

    getNearestCentroid(point) {
        let minDist = Infinity;
        let nearest = -1;
        this.centroids.forEach((centroid, index) => {
            const dist = this.euclideanDistance(point, centroid);
            if (dist < minDist) {
                minDist = dist;
                nearest = index;
            }
        });
        return nearest;
    }

    recalculateCentroids() {
        const sums = Array(this.k).fill([0, 0]);
        const counts = Array(this.k).fill(0);
        this.data.forEach((point, i) => {
            const centroidIdx = this.assignments[i];
            sums[centroidIdx] = [sums[centroidIdx][0] + point[0], sums[centroidIdx][1] + point[1]];
            counts[centroidIdx]++;
        });
        return sums.map((sum, i) => [sum[0] / counts[i], sum[1] / counts[i]]);
    }

    euclideanDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
    }

    converge() {
        let hasConverged = false;
        while (!hasConverged) {
            const prevCentroids = [...this.centroids];
            this.step();
            hasConverged = this.centroids.every((c, idx) => this.euclideanDistance(c, prevCentroids[idx]) < 1e-5);
        }
    }
}

// Event listeners for buttons
document.getElementById('step-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    // Send a request to the server to step through KMeans
    fetch('/step', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'step_complete') {
            // Update the plot with the new step
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&step=${Date.now()}`;
        }
    });
});
document.getElementById('converge-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    // Send a request to the server to run to convergence
    fetch('/converge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'converged') {
            // Update the plot with the final result
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&converge=${Date.now()}`;
        }
    });
});

document.getElementById('update-btn').addEventListener('click', function() {
    // Get the user's input
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    // Update the image source with new query parameters
    const img = document.getElementById('cluster-plot');
    img.src = `/plot.png?k=${k}&init=${initMethod}`;
});

document.getElementById('new-dataset-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    // Send a request to the server to generate a new dataset
    fetch('/new_dataset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json()).then(data => {
        if (data.status === 'dataset_generated') {
            // Update the plot with the new dataset
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&newdataset=${Date.now()}`;
        }
    });
});

document.getElementById('reset-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    // Send a request to the server to reset the KMeans algorithm
    fetch('/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'reset_complete') {
            // Update the plot with the reset algorithm
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&reset=${Date.now()}`;
        }
    });
});

// Placeholder for dataset generation and plotting
let data = generateNewDataset();
let kmeans = new KMeans(3, data, 'Random');

// Generate random dataset
function generateNewDataset() {
    data = [];
    for (let i = 0; i < 100; i++) {
        data.push([Math.random() * 20 - 10, Math.random() * 20 - 10]);
    }
    return data;
}

// Draw the plot with centroids and points
function drawPlot() {
    const canvas = document.getElementById('cluster-plot');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    data.forEach((point, i) => {
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(point[0] * 20 + 200, point[1] * -20 + 200, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw centroids
    kmeans.centroids.forEach(centroid => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centroid[0] * 20 + 200, centroid[1] * -20 + 200, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}
