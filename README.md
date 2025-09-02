# Get results of a checklist from the body of a pull request [![build-test](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml/badge.svg)](https://github.com/JJ/pull-request-checks-action/actions/workflows/test.yml)

In order to focus the attention of whoever is doing a pull request, sometimes a
checklist is included, along the lines of this one

```markdown
- [x] ONE: Checks this.
- [x] Check that.
- [ ] Does not check this.
```

The first one has a tag, `ONE`; what this Github action does is to export the
results of that checklist as GitHub action variables, and also set as step
output. The outputs will have the name of the tag if it exists (`ONE`, in this
case) or `checks`+ index (starting with 0) otherwise.

> The `check#` variable will not be set in the case it has a specific name.

This one, for instance, will create the variables `ONE`, `checks1` and
`checks2`; the first two of them will be set to `true`, the last one to `false`.

You can use any list format

```markdown
- [x] Agree to the CoC

* [x] CONTRIBUTING: Read the contribution agreement

- [ ] Agree on license
```

## Use

This action works with both `pull_request` and `pull_request_target` events, as both provide the same `pull_request` payload structure that contains the PR body.

Check [the used workflow](.github/workflows/get-pr-checks.html) for
an example; or this:

```yaml
name: Obtain values for checklist
on: [pull_request, pull_request_target]

jobs:
  get-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Verifies checklist in PR body
        id: pr_body_checks
        uses: JJ/pull-request-checks-action@v5.1.1
      - name: Shows result
        run: echo $CONTRIBUTING && echo $check0
```

### Excluding users

By default, this action skips processing for `dependabot[bot]` PRs to
avoid failing checks on automated dependency updates. You can
customize which users to exclude. If the excluded user is the one that
has triggered the pull request, the variable `isExcludedUser` will be
set to `true`.

> Please note that the variable will not be defined otherwise, so you need to explicitly check for that value.

```yaml
- name: Verifies checklist in PR body
  id: pr_body_checks
  uses: JJ/pull-request-checks-action@v5.1.1
  with:
    excluded-users: 'dependabot[bot],renovate[bot],myself-dont-want-to-be-bothered-with-this'
- name: Checking CONTRIBUTING is compulsory
  if: ${{ ! steps.pr_body_checks.outputs.isExcludedUser == 'true' && steps.pr_body_checks.outputs.CONTRIBUTING == 'false'}}
  run: echo "Please read CONTRIBUTING.md" && exit 1
```

You will need to check the output of that variable yourself, before
issuing an error, as shown above. These outputs are also defined as
environment variables, just in case you prefer that.

## Setting up pull request templates

This would act on this [pull request
template](.github/PULL_REQUEST_TEMPLATE.md):

```markdown
- [ ] This PR refers to issue <!-- insert #issue here -->
- [ ] CONTRIBUTING: I have checked out the [guide for contributors](CONTRIBUTING.md).
```

and create an output and environment variable `check0` for the first item,
another `CONTRIBUTING` for the second item. The action just prints the values of
the environment variables, you can also use it to fail the flow like this:

```yaml
- name: Fails if not checked
  if: ${{ steps.pr_body_checks.outputs.CONTRIBUTING == 'false'}}
  run: echo "Please read CONTRIBUTING.md" && exit 1
```

## History

- `release/v1`: first real release.
- `v1`: starting to work again.
- `v2`: uses labels for checks, works.
- `v3`: branding and documentation improvements, releasing for real.
- `v4`: use any list format.
  - `v4.1`: :arrow_up: to latest runner and workflow versions
  - `v4.2`: Updates in dependencies, added doc support for `pull_request_target`
- `v5`: Adds `excluded-users` input, which allows to exclude bots and others from raising an error.
  - `v5.1`: :arrow_up: to latest runner and workflow versions, fix
    some dependency errors, adds `isExcludedUser` output and
    environment variable.
  - `v5.1.1`: Basically documentation improvements.

## Aclnowledgements

Thanks to [Marcos Martín](https://github.com/marcosrmartin) for his contribution
to v4 release.

## LICENSE

This is released under the [MIT license](LICENSE). Check out [the
`licenses.txt`](dist/licenses.txt) file for additional licenses from dependencies.
