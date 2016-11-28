import numpy as np
import pandas as pd

from sklearn import manifold
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import euclidean_distances

input_file = "correlations.csv"

df = pd.read_csv(input_file, header=0)

original_headers = list(df.columns.values)

df = df._get_numeric_data()

numpy_array = df.as_matrix()
X = numpy_array

for y in np.nditer(X, op_flags=['readwrite']):
	y[...] = 1 - abs(y)

(X.transpose() == X).all()

mds = manifold.MDS(n_components=2, dissimilarity='precomputed')
pos = mds.fit(X)

np.savetxt("mdscor.csv", pos.embedding_, delimiter=",")
print(pos.embedding_)