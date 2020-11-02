# Get checklist from the body of a PR

Sometimes, the body of a pull request contains things with this style:

```
- [X] Checks this.
- [x] Check that.
- [ ] Does not check this.
```

These sometimes imply checks on the code itself. It's then interesting to know which ones of these are checked, which ones are not. This action will return (and output) the result in an array called `checked`, which is probably better used directly instead of as an environment variable.


## Validate (from original)

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:


