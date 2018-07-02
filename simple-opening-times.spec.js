import openingTimes from './'

import MockDate from 'mockdate'
import moment from 'moment'

const stringToMoment = string => {
  const [ hours, minutes, seconds, milliseconds ] = string.split(':')
  return moment()
    .hours(hours)
    .minutes(minutes || 0)
    .seconds(seconds || 0)
    .milliseconds(milliseconds || 0)
}

describe('Opening times', () => {
  describe('Daily opening times', () => {
    it.each([
      [['16', '17'], '16:22:0', true],
      [['16', '17'], '16:22:0', true],
      [['16', '17'], '15:59:59', false],
      [['16', '17'], '17:00:0', false],
      [['16', '17'], '16:59:59', true],
      [['16:19', '16:21'], '16:18:0', false],
      [['16:19', '16:21'], '16:18:999', false],
      [['16:19', '16:21'], '16:19:0', true],
      [['16:19', '16:21'], '16:20:0', true],
      [['16:19', '16:21'], '16:21:0', false],
      [['16:19', '16:21'], '16:22:0', false]
    ])(
      'Calls open() when times are %j at %s should be %s',
      (times, currentTime, shouldBeOpen) => {
        const current = stringToMoment(currentTime)
        MockDate.set(current)
        const open = jest.fn()
        openingTimes(times, open)
        expect(open).toHaveBeenCalledTimes(shouldBeOpen ? 1 : 0)
      }
    )

    it.each([
      [['16:19', '16:21'], 1000 * 60, '16:18', true],
      [['16:19', '16:21'], 1000 * 30, '16:18', false],
      [['16:19', '16:21'], (1000 * 60), '16:18:00', true],
      [['16:19', '16:21'], (1000 * 60) - 1, '16:18:00', false],
      [['16:19', '16:21'], (1000 * 60) * 2, '16:17:00', true],
      [['16:19', '16:21'], (1000 * 60) * 2, '16:17:00', true],
      [['16', '17'], (1000 * 60) + 1, '15:59:00', true]
    ])(
      'Calls open() when times are %j at %sms after %s should be %s',
      (times, advanceBy, currentTime, shouldBeOpen) => {
        jest.useFakeTimers()
        const current = stringToMoment(currentTime)
        MockDate.set(current)

        const open = jest.fn()
        openingTimes(times, open)

        const setDate = moment(current).add(advanceBy, 'ms')
        MockDate.set(setDate)

        jest.advanceTimersByTime(advanceBy)
        expect(open).toHaveBeenCalledTimes(shouldBeOpen ? 1 : 0)
      }
    )
  })

  describe('Closing  times', () => {
    describe('Daily closing times', () => {
      it.each([
        [['16:19', '16:21'], 1000 * 60, '16:20', true],
        [['16:19', '16:21'], 1000 * 60, '16:19', false],
        [['16:19', '16:21'], (1000 * 60) - 1, '16:20', false]
      ])(
        'Calls close() when times are %j at %sms after %s should be %s',
        (times, advanceBy, currentTime, shouldCallClose) => {
          jest.useFakeTimers()
          const current = stringToMoment(currentTime)
          MockDate.set(current)

          const open = () => {}
          const close = jest.fn()
          openingTimes(times, open, close)

          const setDate = moment(current).add(advanceBy, 'ms')
          MockDate.set(setDate)

          jest.advanceTimersByTime(advanceBy)
          expect(close).toHaveBeenCalledTimes(shouldCallClose ? 1 : 0)
        }
      )

      it.each([
        [['16:19', '16:21'], 1000 * 60, '16:21'],
        [['16:19', '16:21'], 1000 * 60 * 60, '16:21']
      ])(
        'Doesn\'t call close() if already closed when times are %j at %sms after %s should be %s',
        (times, advanceBy, currentTime) => {
          jest.useFakeTimers()
          const current = stringToMoment(currentTime)
          MockDate.set(current)

          const open = () => {}
          const close = jest.fn()
          openingTimes(times, open, close)

          const setDate = moment(current).add(advanceBy, 'ms')
          MockDate.set(setDate)

          jest.advanceTimersByTime(advanceBy)
          expect(close).toHaveBeenCalledTimes(0)
        }
      )
    })
  })
})
