# Opening Times

A simple library for handling opening and closing times

(Currently only works on a daily basis, future features are intended to handle days of week, specific day/date exclusion etc...)

### Example
```js
import openingTimes from 'simple-opening-times'

const open = () => { console.log('Working nine to five') }
const close = () => { console.log('Whilst managing a healthy work/life balance') }

openingTimes(['09', '17'], open, close)
```

### Notes

```js
import openingTimes from 'simple-opening-times'

// Will check every hour if we need to run open or close
openingTimes(['09', '17'], open, close)

// Will check every minute
openingTimes(['09:30', '17:30'], open, close)

// Will check every second
openingTimes(['09:30:20', '17:30:20'], open, close)
```
