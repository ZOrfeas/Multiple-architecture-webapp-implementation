<div align="center">

# Service-Oriented-Architecture (SOA)
</div>

Run `docker compose up` in this directory to create and setup a working version of the application. (Might need to re-build frontend image due to REACT_APP environment variables being baked into the image :) )

# Component architecture
![SOA_Component_diagram_v2](https://user-images.githubusercontent.com/65095699/125166053-72afaf80-e1a2-11eb-83e2-3bf93ee1fdba.jpg)

## Website
[Link](http://saas-15.ddns.net)

## Data-Layer
Swagger documentation not public for implementation reasons
contact us to give a temporary public url

## Service Bus
[Documentation](http://saas-15.ddns.net:3003/spec)

## Auth
For documentation see Service-Bus

## Services
For documentation see Service-Bus

# Utilities
## \_\_DataCreation\_\_
Generate and insert random dummy data into database  
See sub-directory `README` for further details

## \_\_kubernetesResources\_\_
`.yaml` Kubernetes resource files to deploy the application  
See sub-directory `README` for further details
