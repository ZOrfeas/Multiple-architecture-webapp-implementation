<div align="center">

# Microservices architecture
</div>

Run `docker compose up` in this directory to create and setup a working version of the application.

# Component architecture
![Microservices_Components_v3](https://user-images.githubusercontent.com/65095699/125166082-94109b80-e1a2-11eb-8f84-0994a134b634.jpg)

## Website
[Link]()

## Auth
[Documentation](http://saas-15.ddns.net:40000/spec/)

## Question Manager
[Documentation](http://saas-15.ddns.net:40001/spec/)

## Answer Manager
[Documentation](http://saas-15.ddns.net:40002/spec/)

## Keyword Manager
[Documentation](http://saas-15.ddns.net:40003/spec/)

## Browsing
Docs not complete (most probably), basically simply combines some other microservices for more complete info  
and caches the results to ease load off the app.  
[Documentation](http://saas-15.ddns.net:40004/spec/)


# Utilities
## \_\_DataCreation\_\_
Generate and insert random dummy data into database  
See sub-directory `README` for further details

## \_\_kubernetesResources\_\_
`.yaml` Kubernetes resource files to deploy the application  
See sub-directory `README` for further details
