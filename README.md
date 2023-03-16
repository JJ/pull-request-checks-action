# Get results of a checklist from the body of a pull request [![build-test](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml/badge.svg)](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml)

Sometimes, the body of a pull request contains

```markdown
- [X] ONE: Checks this.
- [x] Check that.
- [ ] Does not check this.
```

This will be exported to github action variables, and also set as step output. The outputs will have the name of the label if it exists (`ONE`, in this case) or `check`+ index (starting with 0) otherwise. This one, for instance, will create the variables `ONE`, `checks1` and `checks2`; the first two of them will be set to `true`, the last one to `false`.

## Use

Check  [the used workflow](.github/workflows/get-pr-checks.html) for
an example; or this:

```yaml
name: Obtain values for checklist
on: [pull_request]

jobs:
  get-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Verifies checklist in PR body
        id: pr_body_checks
        uses: JJ/pull-request-checks-action@main
      - name: Shows result
        run: echo $CONTRIBUTING && echo $check0
```

This would act on this [pull request template](.github/PULL_REQUEST_TEMPLATE.md):

```markdown
- [ ] This PR refers to issue <!-- insert #issue here -->
- [ ] CONTRIBUTING: I have checked out the [guide for contributors](CONTRIBUTING.md).
```

And create an output and environment variable `check0` for the first item, another `CONTRIBUTING` for the second item. The action just prints the values of the environment variables, you can also use it to fail the flow like this:

```yaml
      - name: Stops if not checked
        if: ${{ steps.pr_body_checks.outputs.CONTRIBUTING == false}}
        run: echo "Please read CONTRIBUTING.md" && exit 1
```

## History

* `release/v1`: first real release
* `v1`:_ re-release, but barely working
* `v2`: uses labels for checks, works.
