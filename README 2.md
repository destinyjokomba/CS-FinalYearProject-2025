UK Election Predictor
Overview

This project delivers a comprehensive forecasting system that applies machine learning and statistical models to predict constituency-level outcomes in UK parliamentary elections. It integrates electoral history, polling data, and demographic features to generate probabilistic forecasts while emphasising transparency and interpretability.

The system has been developed as a full-stack web application, comprising:

A Python/Flask backend for data processing and prediction services

A React/TypeScript frontend for survey collection, dashboards, and results presentation

A PostgreSQL database for secure user and prediction data management

Features

Multi-source data ingestion and ETL pipeline
Consolidates datasets from UK general elections, census records, and polling sources into a structured format for modelling.

Machine learning experimentation
Implements and compares multiple classification models (e.g. Logistic Regression, Random Forest, XGBoost), balancing accuracy with explainability.

Explainability and interpretability
Provides SHAP values and feature importance visualisations, allowing users to understand the key drivers behind predictions.

RESTful API service
Exposes endpoints for prediction, enabling seamless integration with the web application and external systems.

Interactive web interface
Users can complete surveys, receive personalised forecasts, and explore national-level trends via a dashboard.

Key Contributions

Development of an end-to-end pipeline from raw data ingestion to deployment of live prediction services

Comparison of modelling approaches to balance performance, fairness, and interpretability

Integration of explainability frameworks (SHAP, feature importance) into user-facing outputs

Deployment of a RESTful prediction API supporting secure, scalable access

Ethical Design

The system is designed with fairness, transparency, and compliance in mind:

No personal identifiers are stored; survey responses remain anonymous

GDPR principles of data minimisation and purpose limitation are followed

Outputs include confidence intervals and interpretable feature explanations to encourage informed reflection rather than persuasion