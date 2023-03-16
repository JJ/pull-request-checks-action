# Get results of a checklist from the body of a pull request [![build-test](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml/badge.svg)](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml)

Pull request templates sometimes contain checklists, like this one.

```markdown
- [X] ONE: Checks this.
- [x] Check that.
- [ ] Does not check this.
```

This will be exported to Github Action variables, and also set as step output.

## Use

Check  [the used workflow](.github/workflows/get-pr-checks.html) for
an example

## History

* `v1`: first real release
