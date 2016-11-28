import numpy as np
import pandas as pd

input_file = "Pokemon.csv"

df = pd.read_csv(input_file, header=0)

original_headers = list(df.columns.values)

df = df._get_numeric_data()

numpy_array = df.as_matrix()
numpy_array = np.delete(numpy_array, 0, 1)
numpy_array = np.delete(numpy_array, 0, 1)
numpy_array = np.delete(numpy_array, 7, 1)
X = numpy_array

#Get PCA Coordinates
pca = PCA()
pca.fit(X)
Xco = np.dot(X, pca.components_[0])
Yco = np.dot(X, pca.components_[1])

pcaPlotCo = np.column_stack((Xco, Yco))

# np.savetxt("pca.csv", pcaPlotCo, delimiter=",")

#Get Data for scree plot
eig = pca.explained_variance_

np.savetxt("eigenvalues.csv", eig, delimiter=",")


print(eig)