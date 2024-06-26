import numpy as np
import matplotlib.pyplot as plt

import matplotlib.colors as clr

# Constant variables
H, S, V = 0., 0., 1. # target color: white
CUTOFF = 0.75           # threshold for color extraction

# read image
img = plt.imread('/data/image.jpg').astype(np.float64)
img_hsv = img / 255
img_hsv = clr.rgb_to_hsv(img_hsv)
img_h, img_w = img.shape[0], img.shape[1]

# make image gray
# gray in hsv is [x, 0, 50%]
h_gray = img_hsv[..., 0]
s_gray = np.zeros((img_h, img_w, 1))
v_gray = np.full((img_h, img_w, 1), 0.5)

img_gray = np.dstack((h_gray, s_gray, v_gray))

# read each R G B values
h_channel, s_channel, v_channel = img_hsv[..., 0], img_hsv[..., 1], img_hsv[..., 2]

# Normed and Unit Vector
img_norm = np.sqrt(h_channel**2 + s_channel**2 + v_channel**2)
img_unit = img_hsv / img_norm.reshape((img_h, img_w, 1)) # create unit vector

# sets a target vector
color = np.array([H, S, V])
color_norm = np.sqrt(H**2 + S**2 + V**2)
color_unit = color / color_norm

# get similarity
img_dot = np.sum(img_unit * color_unit, axis=-1)

# select indices that passed the threshold by creating boolean list
indices_bool = img_dot > CUTOFF
n_indices_bool = img_dot <= CUTOFF

bg_img = np.zeros_like(img)
bg_img[indices_bool] = img[indices_bool] # for colors that passed the threshold, show the image
bg_img[n_indices_bool] = img_gray[n_indices_bool] # not passed, show gray image

fig, axes = plt.subplots(1, 2, figsize=(30, 10))
axes[0].imshow(img.astype(np.uint8)) # origimal image
axes[1].imshow(bg_img.astype(np.uint8)) # color extracted image
fig.tight_layout()
plt.show()