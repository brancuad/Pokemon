import numpy as np
import pandas as pd

from sklearn import manifold
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import euclidean_distances

input_file = "Pokemon.csv"

df = pd.read_csv(input_file, header=0)

original_headers = list(df.columns.values)

df = df._get_numeric_data()

numpy_array = df.as_matrix()
numpy_array = np.delete(numpy_array, 0, 1)
numpy_array = np.delete(numpy_array, 0, 1)
numpy_array = np.delete(numpy_array, 7, 1)
X = numpy_array

pca = PCA(n_components=2)
pca.fit(X)
Xco = np.dot(X, pca.components_[0])
Yco = np.dot(X, pca.components_[1])

pcaPlotCo = np.column_stack((Xco, Yco))

euc = euclidean_distances(pcaPlotCo)

mds = manifold.MDS(n_components=2, dissimilarity='precomputed')
pos = mds.fit(euc)

np.savetxt("mds.csv", pos.embedding_, delimiter=",")
print(pos.embedding_)