import tensorflow as tf
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.models import Sequential
from tensorflow.keras.datasets import mnist
import numpy as np
import matplotlib.pyplot as plt

# Import mixed precision from Keras to use mixed-precision training
from tensorflow.keras import mixed_precision
policy = mixed_precision.Policy('mixed_float16')
mixed_precision.set_global_policy(policy)

# Load the dataset and split into training and testing sets
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Normalize the data to scale pixel values between 0 and 1
x_train = x_train / 255
x_test = x_test / 255

# Add a channel dimension to the images (required for CNN)
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

# Convert data to binary format (0 or 1) for web app usage
threshold = 0.5
x_train = (x_train > threshold).astype(np.int8)
x_test = (x_test > threshold).astype(np.int8)

# Create the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')  # 10 classes for digits 0 to 9
])

# Compile the model with appropriate loss function and optimizer
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model for 5 epochs and validate on the test set
model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))

# Save the trained model in TensorFlow SavedModel format for TensorFlowJS conversion
tf.saved_model.save(model, "mnist_model")
