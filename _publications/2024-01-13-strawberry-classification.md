---
title: "Accelerating Strawberry Ripeness Classification Using a Convolution‑Based Feature Extractor along with an Edge AI Processor"
collection: publications
category: manuscripts
permalink: /publication/2024-01-13-strawberry-classification
excerpt: 'Joungmin Park, Jinyoung Shin, Raehyeong Kim, Seongmo An, Sangho Lee, Jinyeol Kim, Jongwon Oh, <b>Youngwoo Jeong</b>, Soohee Kim, Yue Ri Jeong, Seung Eun Lee. &quot;Accelerating Strawberry Ripeness Classification Using a Convolution‑Based Feature Extractor along with an Edge AI Processor.&quot; <i>Electronics</i>, 2024.'
date: 2024-01-13
venue: 'Electronics'
paperurl: 'http://yw-ray.github.io/files/paper/2024-01-13-Electronics.pdf'
link: https://www.mdpi.com/2079-9292/13/2/344
---
Image analysis-based artificial intelligence (AI) models leveraging convolutional neural networks (CNN) take a significant role in evaluating the ripeness of strawberry, contributing to the maximization of productivity. However, the convolution, which constitutes the majority of the CNN models, imposes significant computational burdens. Additionally, the dense operations in the fully connected (FC) layer necessitate a vast number of parameters and entail extensive external memory access. Therefore, reducing the computational burden of convolution operations and alleviating memory overhead is essential in embedded environment. In this paper, we propose a strawberry ripeness classification system utilizing a convolution-based feature extractor (CoFEx) for accelerating convolution operations and an edge AI processor, Intellino, for replacing FC layer operations. We accelerated feature map extraction utilizing the CoFEx constructed with systolic array (SA) and alleviated the computational burden and memory overhead associated with the FC layer operations by replacing them with the k-nearest neighbors (k-NN) algorithm. The CoFEx and the Intellino both were designed with Verilog HDL and implemented on a field-programmable gate array (FPGA). The proposed system achieved a high precision of 93.4%, recall of 93.3%, and F1 score of 0.933. Therefore, we demonstrated a feasibility of the strawberry ripeness classification system operating in an embedded environment.

<a href='http://yw-ray.github.io/files/paper/2024-01-13-Electronics.pdf'>Download paper here</a>

Joungmin Park, Jinyoung Shin, Raehyeong Kim, Seongmo An, Sangho Lee, Jinyeol Kim, Jongwon Oh, <b>Youngwoo Jeong</b>, Soohee Kim, Yue Ri Jeong, Seung Eun Lee. &quot;Accelerating Strawberry Ripeness Classification Using a Convolution‑Based Feature Extractor along with an Edge AI Processor.&quot; <i>Electronics</i>, 2024.
