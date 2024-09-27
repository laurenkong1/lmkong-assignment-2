import numpy as np
import random

class KMeans:
    def __init__(self, n_clusters=3, init_method="random"):
        self.n_clusters = n_clusters
        self.init_method = init_method
        self.centroids = None

    def initialize_centroids(self, X):
        if self.init_method == "random":
            return X[np.random.choice(X.shape[0], self.n_clusters, replace=False)]
        elif self.init_method == "farthest_first":
            return self.farthest_first(X)
        elif self.init_method == "kmeans++":
            return self.kmeans_plus_plus(X)


    def farthest_first(self, X):
        centroids = [X[random.randint(0, len(X) - 1)]]
        for _ in range(1, self.n_clusters):
            distances = np.min(np.linalg.norm(X - centroids[-1], axis=1))
            next_centroid = X[np.argmax(distances)]
            centroids.append(next_centroid)
        return np.array(centroids)

    def kmeans_plus_plus(self, X):
        centroids = [X[random.randint(0, len(X) - 1)]]
        for _ in range(1, self.n_clusters):
            distances = np.min(np.linalg.norm(X[:, np.newaxis] - centroids, axis=2), axis=1)
            probabilities = distances ** 2
            probabilities /= np.sum(probabilities)
            next_centroid = X[np.random.choice(X.shape[0], p=probabilities)]
            centroids.append(next_centroid)
        return np.array(centroids)

    def fit(self, X):
        self.centroids = self.initialize_centroids(X)
        while True:
            clusters = self.assign_clusters(X)
            new_centroids = self.calculate_centroids(X, clusters)
            if np.all(new_centroids == self.centroids):
                break
            self.centroids = new_centroids
        return clusters

    def assign_clusters(self, X):
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)

    def calculate_centroids(self, X, clusters):
        return np.array([X[clusters == i].mean(axis=0) for i in range(self.n_clusters)])

    def predict(self, X):
        return self.assign_clusters(X)
