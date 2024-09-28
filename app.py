import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-GUI environments

from flask import Flask, render_template, send_file, request, jsonify
import io
import random
import matplotlib.pyplot as plt

app = Flask(__name__)

# Global dataset
data = [[random.uniform(-10, 10), random.uniform(-10, 10)] for _ in range(300)]

# KMeans Algorithm - Skeleton Implementation
class KMeans:
    def __init__(self, k, init_method):
        self.k = k
        self.init_method = init_method
        self.centroids = []
        self.assignments = []

    def initialize_centroids(self):
        # Initialization logic based on the chosen method (Random, Farthest First, KMeans++, Manual)
        if self.init_method == 'Random':
            self.centroids = random.sample(data, self.k)
        # Implement other initialization methods here (Farthest First, KMeans++)

    def step(self):
        # Simulate a step in KMeans clustering
        pass

    def full_convergence(self):
        # Run KMeans to convergence
        pass

# Route to serve the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route to generate the KMeans plot
@app.route('/plot.png')
def plot_png():
    k = int(request.args.get('k', 3))
    init_method = request.args.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.initialize_centroids()

    x = [point[0] for point in data]
    y = [point[1] for point in data]

    # Create the plot
    fig, ax = plt.subplots()
    ax.scatter(x, y, color='blue', label='Data Points')

    # Plot centroids
    for centroid in kmeans.centroids:
        ax.scatter(*centroid, color='red', marker='x', s=100, label='Centroid')

    ax.set_title(f'KMeans Clustering (k={k}, init={init_method})')
    ax.set_xlim([-10, 10])
    ax.set_ylim([-10, 10])
    ax.axhline(0, color='black', linewidth=1)
    ax.axvline(0, color='black', linewidth=1)

    # Save the plot to a BytesIO object and return it as an image
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the figure after saving it to free resources
    return send_file(img, mimetype='image/png')

# Route to generate a new random dataset
@app.route('/new_dataset', methods=['POST'])
def new_dataset():
    global data
    data = [[random.uniform(-10, 10), random.uniform(-10, 10)] for _ in range(300)]
    return jsonify({"status": "dataset_generated"})

# Route to step through KMeans
@app.route('/step', methods=['POST'])
def step():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.step()  # Perform a step in the KMeans process

    return jsonify({"status": "step_complete"})

@app.route('/converge', methods=['POST'])
def converge():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.full_convergence()  # Run the KMeans to convergence

    return jsonify({"status": "converged"})

@app.route('/reset', methods=['POST'])
def reset():
    k = int(request.json.get('k', 3))
    init_method = request.json.get('init', 'Random')

    kmeans = KMeans(k, init_method)
    kmeans.initialize_centroids()  # Reset centroids

    return jsonify({"status": "reset_complete"})


if __name__ == "__main__":
    app.run(debug=True)
