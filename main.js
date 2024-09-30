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
getRandomCentroids() {
   
    const shuffledData = this.data.sort(() => Math.random() - 0.5);
    return shuffledData.slice(0, this.k);
}

getFarthestCentroids() {

    const centroids = [];
   
    centroids.push(this.data[Math.floor(Math.random() * this.data.length)]);
    
    while (centroids.length < this.k) {
        let farthestPoint = null;
        let maxDistance = -1;
        
        
        this.data.forEach(point => {
            const nearestDistance = Math.min(...centroids.map(centroid => this.getDistance(point, centroid)));
            
            if (nearestDistance > maxDistance) {
                maxDistance = nearestDistance;
                farthestPoint = point;
            }
        });
        
        if (farthestPoint) {
            centroids.push(farthestPoint);
        }
    }
    
    return centroids;
}

getKMeansPlusCentroids() {

    const centroids = [];
    

    centroids.push(this.data[Math.floor(Math.random() * this.data.length)]);
    
    while (centroids.length < this.k) {
        const distances = this.data.map(point => {
 
            const nearestDistance = Math.min(...centroids.map(centroid => this.getDistance(point, centroid)));
            return nearestDistance ** 2;
        });


        const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);
        const probabilities = distances.map(distance => distance / totalDistance);


        let cumulativeSum = 0;
        const randomValue = Math.random();
        for (let i = 0; i < this.data.length; i++) {
            cumulativeSum += probabilities[i];
            if (randomValue < cumulativeSum) {
                centroids.push(this.data[i]);
                break;
            }
        }
    }

    return centroids;
}

step() {

    this.assignments = this.data.map(point => this.getNearestCentroid(point));


    this.centroids = this.recalculateCentroids();
}



getNearestCentroid(point) {
    let nearest = null;
    let minDistance = Infinity;


    this.centroids.forEach((centroid, index) => {
        const distance = this.getDistance(point, centroid);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = index;
        }
    });

    return nearest;
}

recalculateCentroids() {
    const newCentroids = Array(this.k).fill(null).map(() => Array(this.data[0].length).fill(0));
    const counts = Array(this.k).fill(0);

    this.assignments.forEach((assignment, index) => {
        counts[assignment]++;
        this.data[index].forEach((val, dim) => {
            newCentroids[assignment][dim] += val;
        });
    });

    return newCentroids.map((centroid, i) => {
        if (counts[i] === 0) return centroid;
        return centroid.map(val => val / counts[i]);
    });
}

getDistance(point1, point2) {
    return Math.sqrt(point1.reduce((sum, value, index) => sum + Math.pow(value - point2[index], 2), 0));
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


document.getElementById('step-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

   
    fetch('/step', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'step_complete') {
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&step=${Date.now()}`;
        }
    });
});
document.getElementById('converge-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    fetch('/converge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'converged') {
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&converge=${Date.now()}`;
        }
    });
});

document.getElementById('update-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    const img = document.getElementById('cluster-plot');
    img.src = `/plot.png?k=${k}&init=${initMethod}`;
});

document.getElementById('new-dataset-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    fetch('/new_dataset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json()).then(data => {
        if (data.status === 'dataset_generated') {
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&newdataset=${Date.now()}`;
        }
    });
});

document.getElementById('reset-btn').addEventListener('click', function() {
    const k = document.getElementById('k-value').value;
    const initMethod = document.getElementById('init-method').value;

    fetch('/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ k: k, init: initMethod }),
    }).then(response => response.json()).then(data => {
        if (data.status === 'reset_complete') {
            document.getElementById('cluster-plot').src = `/plot.png?k=${k}&init=${initMethod}&reset=${Date.now()}`;
        }
    });
});

document.getElementById("initMethod").addEventListener("change", function() {
    updateClustering();
});

let data = generateNewDataset();
let kmeans = new KMeans(3, data, 'Random');

function generateNewDataset() {
    data = [];
    for (let i = 0; i < 100; i++) {
        data.push([Math.random() * 20 - 10, Math.random() * 20 - 10]);
    }
    return data;
}

function drawPlot() {
    const canvas = document.getElementById('cluster-plot');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((point, i) => {
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(point[0] * 20 + 200, point[1] * -20 + 200, 5, 0, Math.PI * 2);
        ctx.fill();
    });

function updateClustering() {
    const initMethod = document.getElementById("initMethod").value;
    const k = parseInt(document.getElementById("kValue").value);
        
    if (initMethod === 'random') {
        centroids = getRandomCentroids(k);
    } else if (initMethod === 'farthest') {
        centroids = getFarthestCentroids(k);
    } else if (initMethod === 'kmeans++') {
        centroids = getKMeansPlusCentroids(k);
    }
    drawVisualization(centroids);
    }

function drawVisualization(centroids) {
    const canvas = document.getElementById("clusteringCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    centroids.forEach(centroid => {
        ctx.beginPath();
        ctx.arc(centroid[0], centroid[1], 5, 0, 2 * Math.PI);
        ctx.fill();
        });
    }
function recalculateAndUpdate() {
    step();
    drawVisualization(centroids); 
    }
    
    
    
    kmeans.centroids.forEach(centroid => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centroid[0] * 20 + 200, centroid[1] * -20 + 200, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}
