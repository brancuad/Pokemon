import numpy as np
import pandas as pd

input_file = "Pokemon.csv"

df = pd.read_csv(input_file, header=0)

original_headers = list(df.columns.values)

df = df._get_numeric_data()

numpy_array = df.as_matrix()
numpy_array = np.rot90(numpy_array, 1)
numpy_array = np.delete(numpy_array, 0, 0)
numpy_array = np.delete(numpy_array, 1, 0)
numpy_array = np.delete(numpy_array, 9, 0)

b = np.corrcoef(numpy_array.astype(float))
print(numpy_array)
#numpy.savetxt("correlation.csv", b, delimiter=",")