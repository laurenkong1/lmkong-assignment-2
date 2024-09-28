from flask import Flask, jsonify, request, render_template
import numpy as np
from kmeans import KMeans

app = Flask(__name__)

# Generate random dataset
def generate_random_data():
    np.random.seed(42)
    return np.random.randn(200, 2) * 10  # 200 random points in 2D

data = generate_random_data()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_data', methods=['GET'])
def get_data():
    return jsonify(data.tolist())

@app.route('/cluster', methods=['POST'])
def cluster():
    init_method = request.json.get('init_method', 'random')
    n_clusters = int(request.json.get('n_clusters', 3))
    kmeans = KMeans(n_clusters=n_clusters, init_method=init_method)
    clusters = kmeans.fit(data)
    return jsonify({
        'centroids': kmeans.centroids.tolist(),
        'clusters': clusters.tolist()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

