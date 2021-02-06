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

## Tips

search by "Tip:" in the code

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
