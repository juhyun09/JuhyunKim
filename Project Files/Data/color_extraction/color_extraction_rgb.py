import numpy as np
import matplotlib.pyplot as plt

# Constant variables
R, G, B = 255., 0., 0. # target color: red
CUTOFF = 0.5           # threshold for color extraction

# read image
img = plt.imread('/data/image.jpg').astype(np.float64)
img_h, img_w = img.shape[0], img.shape[1]

# make image gray
# unextracted pixels will be shown as gray
img_ch_mean = np.mean(img, axis=-1)
img_gray = np.dstack((img_ch_mean, img_ch_mean, img_ch_mean)) # stack the mean values 
                                                              # to the shape of the image

# read each R G B values
r_channel, g_channel, b_channel = img[..., 0], img[..., 1], img[..., 2]

# Normed and Unit Vector
img_norm = np.sqrt(r_channel**2 + g_channel**2 + b_channel**2)
img_unit = img / img_norm.reshape((img_h, img_w, 1)) # create unit vector

# sets a target vector
color = np.array([R, G, B])
color_norm = np.sqrt(R**2 + G**2 + B**2)
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