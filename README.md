# bfx-svc-js

## Setup

The projects inherit code from this base repository.

Changes should be done here, and then merged back from the upstream.

### Setup for a child project

```
git clone git@github.com:bitfinexcom/$REPO.git REPO
git remote -v
git remote add upstream git@github.com:bitfinexcom/$PARENT.git
git remote -v
git push origin master
```

### Example

```
git clone git@github.com:bitfinexcom/bfx-report-query-js.git
git remote add upstream git@github.com:bitfinexcom/bfx-svc-js.git
bash upstream_merge.sh
```

## Conventions

### Repositories

All new repositories should inheritate from the closest parent: `bfx-coin-eth-js` inherits from `bfx-coin-js`; `bfx-coin-js` inheritates from `bfx-svc-js` (the root service repository)

### Namespace hierarchy

* File names: parent is rightmost (i.e `eth.api.coin.wrk.js` : wrk>coin>api>eth)
* Class names: parent is leftmost (i.e `WkrCoinApiEth`)

Example: [example.js](example.js)
