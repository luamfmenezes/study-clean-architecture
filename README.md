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

## Stub -

Stubs are used inside unit tests to represent the class that has been tested.
Type of mock wheren you return a static value from the mock.

## Improviments

search by "Improviment:" in the code

1. Create fakers - ex: EmailValidatorFake
2. Separate factories classes on SignUp.spec.ts

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

pattern:
.spec.ts -> unit
.test.ts -> integration
