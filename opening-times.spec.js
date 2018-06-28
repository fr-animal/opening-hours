import openingTimes from './'

import MockDate from 'mockdate'
import moment from 'moment'

describe('Opening times', () => {
  describe('Daily opening times', () => {
    it.each([
      [['16:19', '16:21'], '16:18', false],
      [['16:19', '16:21'], '16:19', true],
      [['16:19', '16:21'], '16:20', true],
      [['16:19', '16:21'], '16:21', false],
      [['16:19', '16:21'], '16:22', false]
    ])(
      'Calls open() when times are %j at %s should be %s',
      (times, currentTime, shouldBeOpen) => {
        const [ hours, minutes ] = currentTime.split(':')
        MockDate.set(moment().hours(hours).minutes(minutes))
        const open = jest.fn()
        openingTimes(times, open)
        expect(open).toHaveBeenCalledTimes(shouldBeOpen ? 1 : 0)
      }
    )

    it.each([
      [['16:19', '16:21'], 1000 * 60, '16:18', true],
      [['16:19', '16:21'], (1000 * 60) * 2, '16:17', true]
    ])(
      'Calls open() when times are %j at %sms after %s should be %s',
      (times, advanceBy, currentTime, shouldBeOpen) => {
        jest.useFakeTimers()
        const [ hours, minutes ] = currentTime.split(':')
        MockDate.set(moment().hours(hours).minutes(minutes))
        const open = jest.fn()
        openingTimes(times, open)
        MockDate.set(moment().hours(hours).minutes(minutes).add(advanceBy, 'ms'))
        jest.advanceTimersByTime(advanceBy)
        expect(open).toHaveBeenCalledTimes(shouldBeOpen ? 1 : 0)
      }
    )
  })
})
