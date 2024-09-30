import matplotlib
matplotlib.use('Agg') 

from flask import Flask, render_template, send_file, request, jsonify
import io
import random
import matplotlib.pyplot as plt

app = Flask(__name__)

data = [[random.uniform(-10, 10), random.uniform(-10, 10)] for _ in range(300)]

class KMeans:
    def __init__(self, k, init_method):
        self.k = k
        self.init_method = init_method
        self.centroids = []
        self.assignments = []

    def initialize_centroids(self):
        if self.init_method == 'Random':
            self.centroids = random.sample(data, self.k)
       

    def step(self):
        pass

    def full_convergence(self):
        pass


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/plot.png')
def plot_png():
    k = int(request.args.get('k', 3))
    init_method = request.args.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.initialize_centroids()

    x = [point[0] for point in data]
    y = [point[1] for point in data]

    fig, ax = plt.subplots()
    ax.scatter(x, y, color='blue', label='Data Points')

    for centroid in kmeans.centroids:
        ax.scatter(*centroid, color='red', marker='x', s=100, label='Centroid')

    ax.set_title(f'KMeans Clustering (k={k}, init={init_method})')
    ax.set_xlim([-10, 10])
    ax.set_ylim([-10, 10])
    ax.axhline(0, color='black', linewidth=1)
    ax.axvline(0, color='black', linewidth=1)

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

@app.route('/new_dataset', methods=['POST'])
def new_dataset():
    global data
    data = [[random.uniform(-10, 10), random.uniform(-10, 10)] for _ in range(300)]
    return jsonify({"status": "dataset_generated"})

@app.route('/step', methods=['POST'])
def step():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.step() 

    return jsonify({"status": "step_complete"})

@app.route('/converge', methods=['POST'])
def converge():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.full_convergence()

    return jsonify({"status": "converged"})

@app.route('/reset', methods=['POST'])
def reset():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.initialize_centroids()

    return jsonify({"status": "reset_complete"})


if __name__ == "__main__":
    app.run(debug=True)
