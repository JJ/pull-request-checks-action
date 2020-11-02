# Get checklist from the body of a pull request
 
Sometimes, the body of a pull request contains things like

```
- [X] Checks this.
- [x] Check that.
- [ ] Does not check this.
```

These sometimes imply checks on the code itself. It's then interesting to know which ones of these are checked, which ones are not. This action will return (and output) the result in an array called `checked`, which is probably better used directly instead of as an environment variable. 

This is probably useless since it's almost impossible to get it right. Well.   


