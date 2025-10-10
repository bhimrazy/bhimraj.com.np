---
title: "Covidologist : A Disease Detection Web App to assist radiologists to detect the presence of COVID-19."
publishedAt: "2022-08-06"
description: "The main purpose of this project is to automate the process of COVID-19 diagnosis and help radiologists, doctors and patients in their process by saving their precious time. So, by using a trained model on COVID chest-X-ray images, It assists medical staff and radiologists to detect the presence/sign of COVID in the chest-x-ray images reducing the workloads and speeding up the diagnosis."
tags: [Deep Learning, PyTorch, FastAPI]
image: "/projects/covidologist-detect-presence-of-covid-19.png"
githubLink: "https://github.com/bhimrazy/covidologist"
---

<p align="center">
  <img src="https://user-images.githubusercontent.com/46085301/183135654-42cb6a4b-bf27-4e10-b2de-e6be196b2b96.png" height="150"/>
  <br/>
A Disease Detection Web App to assist radiologists to detect the presence of COVID-19.
</p>

## Description

> This project is a part of **KU HackFest 2022**

The main purpose of this project is to automate the process of COVID-19 diagnosis
and help radiologists, doctors and patients in their process by saving their precious time.
So, by using a trained model on COVID chest-X-ray images, It assists medical staff and radiologists
to detect the presence/sign of COVID in the chest-x-ray images reducing the workloads and speeding up the
diagnosis.

## Installation

Run my Project

```shell
    # clone the repo and check into the dir
    git clone https://github.com/bhimrazy/covidologist
    cd covidologist

    # Setup environment and install all the requirements
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

    # Setup kaggle key or download kaggle.json key file and place it in "~/.kaggle"
    export KAGGLE_USERNAME="your kaggle username"
    export KAGGLE_KEY="your kaggle api key"

    # Download Datasets from kaggle (https://www.kaggle.com/datasets/andyczhao/covidx-cxr2)
    kaggle datasets download -d andyczhao/covidx-cxr2

    # unzip to temp folder
    unzip covidx-cxr2.zip -d temp

    # remove zip file
    rm -rf covidx-cxr2.zip


    # prepare dataset folder
    python main.py prepare

    # train model
    python main.py train

    # generate metrics
    # python main.py generate


    # Run fast api app
    cd app && uvicorn main:app --reload
```

## Deployment Architecture

![image](https://user-images.githubusercontent.com/46085301/183252817-43d5a542-4f0f-4f11-ba62-d6b26cd0a816.png)

<p align="center">
Figure : Deployment Architeture of Covidologist
</p>

## Sample images

<table>
  <tr>
    <td>COVID Positive</td>
     <td>COVID Positive</td>
     <td>COVID Negative</td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/46085301/183252884-12c123bb-4611-4fd4-9a98-6d69389c5650.jpg" width="300" height="300"></td>
    <td><img src="https://user-images.githubusercontent.com/46085301/183252895-b60d4106-2f55-46cd-93fd-673bae34b9f6.jpg" width="300" height="300"></td>
    <td><img src="https://user-images.githubusercontent.com/46085301/183252943-c429de0f-bf21-4551-bbd8-ea7afbb1c76c.png" width="300" height="300"></td>
  </tr>
 </table>

## Preview

[![covid 19 disease detection](https://user-images.githubusercontent.com/46085301/183138564-bdaaa457-5f31-47e5-889d-f7331a8ffebb.png)](https://covidologist.herokuapp.com/)

## 📚 RESOURCES

◆ PyTorch: [https://pytorch.org](https://pytorch.org) <br/>
◆ FastAPI: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com) <br/>
◆ COVIDx CXR-2 Dataset: [https://www.kaggle.com/datasets/andyczhao/covidx-cxr2](https://www.kaggle.com/datasets/andyczhao/covidx-cxr2)

## Author

- [@bhimrazy](https://www.github.com/bhimrazy)
