## Random data generation and insertion script for Microservices schemas

## Installation
* `pip3 install Faker` for data generation
* `pip3 install psycopg2-binary` for data insertion
* `pip3 install bcrypt` for password encryption 

## Run
First fill in the proper info in your own `config.prm` following the `config.prm.template` provided  
`index.py` is the program entrypoint, command line arguments:  
* `UserCount`
* `KeywordCount`
* `QuestionCount`
* `AnswerCount`  
In this particular order, specify the amount to be inserted of each kind
