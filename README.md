## Prettier

yarn add prettier eslint-config-prettier eslint-plugin-prettier -D

change CRLF -> LF in the bottom of visualCode

## Eslint

airbnb style-guide

## Husky

### lint staged

Run lint only in the files that are in the stage.

## Reminders

Join commits -> git commit --amend --no-edit

Test other commit -> git checkout "hash"

Revert -> git revert "hash"

git stash ->

git tag -> class: 26

## Sut

System under test.

## Stub -

Stubs are used inside unit tests to represent the class that has been tested.
Type of mock wheren you return a static value from the mock.

## Improviments

search by "Improviment:" in the code

1. Create fakers - ex: EmailValidatorFake
2. Separate factories classes on SignUp.spec.ts
3. Refactory mongo helper - class .17
4. change account-repository/account.spec.ts -> .test.ts
5. import routes
6. Factories on main/factories are creating one instance any time that is used (we can have emails been configurated again each).
7. Refactory test using Http-hellpers
8. Return user from authentication, inside login controller.
9. Refactory makeValidation factory ./src/main/fatories
10. Organize data/protocols in folders.

## Tips

search by "Tip:" in the code

save all when move a dependence.

## Jest

jest --passWithNoTests --silent --noStackTrace

--silent:
dont show the console.logs.
dont show information about the tests that are running, only the results.

--noTrackTrace
only show expected and returned

--runInBand
run tests sequencial

use @shelf/jest-mongodb

pattern:
.spec.ts -> unit
.test.ts -> integration

supertest

## Patterns

1. Factory
2. Decorator
3. Composite
4. Proxy - addapters

## Docker

docker container prune - clean all containers

docker run -it container-name sh

## Debug api

1. Set sourceMap on tsconfig.
2. Create debug script
3. Create lauch.json on layer debug vscode

## CI/CD

1. Travis CI
2. Coveralls
