<h1 align="center">
 👨‍🏫 Survey API
</h1>
<p align="center">🚀NodeJS, Typescript, TDD, DDD, Clean architecture and SOLID course</p>
  
## Description

API to manage surveys developed in the Manguinho's Udemy course.

Course link: https://www.udemy.com/course/tdd-com-mango/

Course certificate: https://www.udemy.com/certificate/UC-7e8f6953-3623-464d-aeea-5f240d4df9ed/


## 🎲 Runing development server.

```bash

# install the dependencies:
$ yarn
# or 
$ npm install

# Run the application in development mode:
$ yarn dev
# or
$ npm run dev

# Access Rest api on: http://localhost:5050/api
# Access Swagger documentation on: http://localhost:5050/api-docs
# Access GraphQl Playground on: http://localhost:5050/graphql

```



## 🎲 Runing tests.

```bash

# Integration tests:
$ yarn test:integration

# Unit tests:
$ yarn test:unit

# All tests:
$ yarn test


```

## Principles

* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance
* Small Commits

## Patterns

* Factory
* Adapter
* Composite
* Decorator
* Proxy
* Dependency Injection
* Abstract Server
* Composition Root
* Builder
* Singleton

## Methodologies and Architectures

* TDD
* Clean Architecture
* DDD
* Conventional Commits
* GitFlow
* Modular Design
* Dependency Diagrams
* Use Cases
* Continuous Integration
* Continuous Delivery
* Continuous Deployment
* RestAPI
* GraphQL

## Tools

* Travis CI
* Coveralls
* Supertest
* @shelf/jest-mongodb
* Swagger
* Husky
* Lint staged

## Improviments

search by "Improviment:" in the code

* Refactory mongo helper (class 17)
* Refactory test using Http-hellpers
* Return user from authentication, inside login controller.
* Refactory makeValidation factory ./src/main/fatories
* Change tests from sut folder to ./__test folder.
* Adjust files to be coveraged in tests
* Change stub to spy, use faker on tests mock

## Test patterns

* .spec.ts -> unit
* .test.ts -> integration

## Docker helpful commands

* docker container prune - clean all containers
* docker run -it container-name sh

## Debug api

* Set sourceMap on tsconfig.
* Create debug script
* Create lauch.json on layer debug vscode

## Tips

search by "Tip:" in the code

jest --passWithNoTests --silent --noStackTrace

--noTrackTrace -> only show expected and returned

--runInBand -> run test sequetial 

Join commits -> git commit --amend --no-edit

Revert commit -> git revert "hash"

git tag -> class: 26

Sut -> system under test.

Stub -> Type of mock wheren you return a static value from the mock.
