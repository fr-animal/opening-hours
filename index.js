import moment from 'moment'
import { allPass, compose, gt, ifElse, lte, or, split, tap } from 'ramda'

const SECOND = 'second'
const MINUTE = 'minute'
const HOUR = 'hour'

const interval = i => ({ [SECOND]: 1000, [MINUTE]: 1000 * 60, [HOUR]: 1000 * 60 * 60 })[i]

const secondsOr = ifElse(
  or,
  () => SECOND
)

const minutesOr = ifElse(
  or,
  () => MINUTE
)

const hours = () => HOUR

const getSmallest = (oS, cS, oM, cM) => secondsOr(() => minutesOr(hours)(oM, cM))(oS, cS)

const tillNext = (unit, time) => moment(time).endOf(unit) - moment(time) + 1

const checkAndOpen = (open, shouldOpen) => (isOpen, now) => {
  if (!isOpen && shouldOpen(now)) {
    open()
    return true
  }
  return false
}

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
    .milliseconds(0)

  const closeAt = moment()
    .hours(cHours)
    .minutes(cMinutes || 0)
    .seconds(cSeconds || 0)
    .milliseconds(0)

  const shouldOpen = allPass([ lte(openAt), gt(closeAt) ])
  const maybeOpen = checkAndOpen(open, shouldOpen)

  isOpen = maybeOpen(isOpen, initial)

  const smallest = getSmallest(oSeconds, cSeconds, oMinutes, cMinutes)

  const intervalToCheck = interval(smallest)

  const timeToNextInterval = tillNext(smallest, initial)

  setTimeout(() => {
    isOpen = maybeOpen(isOpen, moment()) || isOpen
    setInterval(() => maybeOpen(isOpen, moment()), intervalToCheck)
  }, timeToNextInterval)
}
