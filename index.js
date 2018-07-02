import moment from 'moment'
import { allPass, compose, gt, ifElse, lt, or, split, tap } from 'ramda'

const secondsOr = ifElse(
  or,
  () => 1000
)

const minutesOr = ifElse(
  or,
  () => 1000 * 60
)

const hours = () => 1000 * 60 * 60

const getInterval = (oS, cS, oM, cM) => secondsOr(() => minutesOr(hours)(oM, oM))(oS, cS)

export default (openingHours, open, close) => {
  let isOpen = false

  const [ openTime, closeTime ] = openingHours
  const [ oHours, oMinutes, oSeconds ] = split(':', openTime)
  const [ cHours, cMinutes, cSeconds ] = split(':', closeTime)

  const initial = moment()

  const openAt = moment()
    .hours(oHours)
    .minutes(oMinutes || 0)
    .seconds(oSeconds || 0)

  const closeAt = moment()
    .hours(cHours)
    .minutes(cMinutes || 0)
    .seconds(cSeconds || 0)

  const shouldOpen = allPass([ lt(openAt), gt(closeAt) ])

  if (shouldOpen(initial)) {
    open()
    isOpen = true
  }

  const intervalToCheck = getInterval(oSeconds, cSeconds, oMinutes, cMinutes)

  setInterval(() => {
    const now = moment()
    if (!isOpen && shouldOpen(now)) {
      open()
      isOpen = true
    }
  }, intervalToCheck)
}
