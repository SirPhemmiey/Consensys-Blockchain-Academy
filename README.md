# Consensys-Blockchain-Academy
Exercises I did to practises Ethereum dAPP dev while doing the Consensys Blockchain Developer Academy course in June 2018
Template created by Consensys Academy, but most of the code was written by me as a practise.

## Working with them
Install the directory, and cd into it
```
truffle develop
migrate
test
```

**Note:** files have already been compiled, hence no need to use the `truffle compile` command.


**Note:** to use ganache-cli, go to `/truffle-config.js` and change `port` to `8545`. Then on command-prompt:
`ganache-cli` and open another command-prompt, cd into the directory and 
```
truffle migrate --reset
truffle test
```

To link to front-end, one can use [ReactJS](https://levelup.gitconnected.com/https-medium-com-zubairnahmed-react-ethereum-getting-started-with-the-minimum-toolset-required-part-1-of-4-9562efa23d18) 
or [Drizzle](https://truffleframework.com/docs/drizzle/getting-started) easily.
## supply_chain
A supply chain constituiting of buying, selling, shipping and receiving an item. 


Although testing in sol is generally limited to unit tests, I had to do a bit of integration testing, 
to check my modifiers, since solidity modifiers are bested tested in solidity. 
It would have been lot easier to do these in JS, however this way I had a chance to practise my solidity skills.
I tried using the low-level call() approach instead of creating a proxy contract (which is hidden in comments of my Test file).
To use proxy contract [for testing throws, revert..](https://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests) 

##simple_bank
Basic `enroll(), deposit(), withdrawal()` etc.

I tweaked the testing provided to work with async and await functions (ES 7).
