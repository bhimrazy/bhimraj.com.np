---
title: "6.5940: TinyML and Efficient AI Computing"
url: https://hanlab.mit.edu/courses/2026-fall-65940
kind: course
source: MIT Han Lab
people: [Song Han]
term: Fall 2026
tldr: Making models cheap to run, from pruning, quantization and distillation to distributed training, serving and acceleration for LLMs and diffusion models.
topics: [efficient-ai, ml-systems, llms]
added: 2026-10-15
video: true
playlist: PLH7PIPKvCm38
otherTerms:
  - term: Fall 2024
    url: https://www.youtube.com/playlist?list=PL80kAHvQbh-qGtNc54A6KW4i4bkTPjiRF
  - term: Fall 2023
    url: https://www.youtube.com/playlist?list=PL80kAHvQbh-pT4lCkDT53zT8DKmhE0idB
materials:
  - { kind: slides, lecture: 1, url: https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0 }
  - { kind: slides, lecture: 2, url: https://www.dropbox.com/scl/fi/42vwbruge0kz3yiuc5un4/Lec02-Basics-of-Neural-Networks.pdf?rlkey=r7o3vatbn8wv5o1n44n2dxizt&st=72q7v2zc&dl=0 }
  - { kind: lab, lecture: 2, label: "Lab 0", url: https://colab.research.google.com/drive/1PfVYxikSaVpCSD-cnmNLN4l7yx_4odmg }
  - { kind: slides, lecture: 3, url: https://www.dropbox.com/scl/fi/y5k1ipgvg919hykax33nu/Lec03-Pruning-I.pdf?rlkey=yg3v2oa8r8wfd7oez23b8azlg&st=ilwjkc8u&dl=0 }
  - { kind: slides, lecture: 4, url: https://www.dropbox.com/scl/fi/cmqhxgcml6gpks9khm2vm/Lec04-Pruning-II.pdf?rlkey=k7fb0eam3aiy8kl9gosx2qt78&st=d75bnpaw&dl=0 }
  - { kind: lab, lecture: 4, label: "Lab 1", url: https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=0 }
  - { kind: slides, lecture: 5, url: https://www.dropbox.com/scl/fi/1yvbg0dqcysee8hf61hjr/Lec05-Quantization-I.pdf?rlkey=kaxx0x1m67ruecnm07gtm6d78&st=xb9raxr5&dl=0 }
  - { kind: slides, lecture: 6, url: https://www.dropbox.com/scl/fi/4zry0dea0hrykoa2aoqp0/Lec06-Quantization-II.pdf?rlkey=cb7gol6t8jcrb8kyyxpxwjzfb&st=b4zqgq25&dl=0 }
  - { kind: slides, lecture: 7, url: https://www.dropbox.com/scl/fi/83nqzhj321vcm89dnyzyl/Lec07-Neural-Architecture-Search-I.pdf?rlkey=xwegts2hywmbhjvsic7ldn8d5&st=3py9v1w3&dl=0 }
  - { kind: lab, lecture: 7, label: "Lab 2", url: https://colab.research.google.com/drive/1-HEcO8qxlbOgccAg6TyuDTOqWt1Jx45W }
  - { kind: slides, lecture: 8, url: https://www.dropbox.com/scl/fi/160vx9fv5gbe3iwnivjp2/Lec08-Neural-Architecture-Search-II.pdf?rlkey=pf2lkthlwgnp5bwmcrnkgpvof&st=i9e4s8fg&dl=0 }
  - { kind: slides, lecture: 9, url: https://www.dropbox.com/scl/fi/5zo1lsfdv9ubhi77u9uzr/Lec09-Knowledge-Distillation.pdf?rlkey=sou2ljtdze8qx9ebojbhrg0nm&st=uuwfokyg&dl=0 }
  - { kind: slides, lecture: 10, url: https://www.dropbox.com/scl/fi/g790tbz469qm2ti4kxdpz/Lec10-MCUNet.pdf?rlkey=c1y3fowzr5fp4gcaw88l3pe92&st=qnjegxl2&dl=0 }
  - { kind: lab, lecture: 10, label: "Lab 3", url: https://colab.research.google.com/drive/1g_o6v2EErRJKZx5pmX3r8dCsInVkVC7h }
  - { kind: slides, lecture: 11, url: https://www.dropbox.com/scl/fi/0hxkjcbb55e4rjogrhzar/Lec11-TinyEngine.pdf?rlkey=i6lxuj0o2zspfvoppsi32slcy&st=o6wqeemo&dl=0 }
  - { kind: slides, lecture: 12, url: https://www.dropbox.com/scl/fi/3b709dzevqkz9a8f4qgam/Lec12-Transformers-and-LLM.pdf?rlkey=4f75xszl8h977mfnlipwo8rih&st=dn6gna9b&dl=0 }
  - { kind: slides, lecture: 13, url: https://www.dropbox.com/scl/fi/8rmem4bf234op7u2dslbr/Lec13-LLM-Deployment.pdf?rlkey=lezqxainquubpf0v603z1q6qs&st=g2brhqg8&dl=0 }
  - { kind: lab, lecture: 13, label: "Lab 4", url: https://colab.research.google.com/drive/1r26Togpim59OcHDCD2UInWYQZKz6_wSO }
  - { kind: slides, lecture: 14, url: https://www.dropbox.com/scl/fi/h3qyph2qu51qhsjnvwoxh/Lec14-LLM-Post-training.pdf?rlkey=654340muk6ss9qyx75lfpes6a&st=bujnnzjb&dl=0 }
  - { kind: slides, lecture: 15, url: https://www.dropbox.com/scl/fi/2m80agerzvq7vnl36r48a/Lec15-Long-Context-LLM.pdf?rlkey=iw8ajsaih4i6pjleut2i3j7ip&st=ei9rvfmi&dl=0 }
  - { kind: slides, lecture: 16, url: https://www.dropbox.com/scl/fi/g8nn84f1rjfyazgrcpp2l/Lec16-Vision-Transformers.pdf?rlkey=hpw1qczlprdx4xd4izdj7z44g&st=cx06257q&dl=0 }
  - { kind: lab, lecture: 16, label: "Lab 5", url: https://drive.google.com/drive/folders/1ZA9ZpLFHnEXr8sJ-e4lkJyMGvtoQ55A0 }
  - { kind: slides, lecture: 17, url: https://www.dropbox.com/scl/fi/kulmahhwimviwhgvlbssr/Lec17-Diffusion-Models-I.pdf?rlkey=w4ceeft32h2vhgja4aishi4rz&st=bqv383on&dl=0 }
  - { kind: slides, lecture: 18, url: https://www.dropbox.com/scl/fi/r3vfxrl73tbx2ggr3qg7d/Lec18-Diffusion-Models-II.pdf?rlkey=sjhevc2k7nufczowjpk3pzcvi&st=7dplh5tk&dl=0 }
  - { kind: slides, lecture: 19, url: https://www.dropbox.com/scl/fi/763e7fumkitmzs09y4ggz/Lec19-Distributed-Training-I.pdf?rlkey=vk2ztsk7n43r9vz78xf0c65l4&st=b3d4rjg1&dl=0 }
  - { kind: doc, label: "Project ideas", url: https://docs.google.com/document/d/12O5BBEaOZV8oaAoKZKy6RKig9xk2LRTVu2nYd3dWpSo/edit?usp=sharing }
---
