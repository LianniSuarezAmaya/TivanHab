import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import type { Event } from '../store/types/events.types.ts.js'
import EventStore from '../store/stores/events.store.js'
import {MAX_LOCAL_STORAGE_BYTES,emptyPrunedInformation} from '../store/utils/event.store.pruneEvents.utils.js'

describe('eventStore.pruneEvents', () => {

  beforeEach(() => {
    vi.useFakeTimers()

    vi.setSystemTime(
      new Date('2026-08-22T12:00:00')
    )

    localStorage.clear()

    EventStore.setState({
      events: [],
      prunedInformation:
        emptyPrunedInformation(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })


  const createEvent = (
    overrides: Partial<Event> = {},
  ): Event => ({
    id: Date.now() + Math.random(),

    type: 'Task',

    action: 'completed',

    eventKey: 1,

    date:
      new Date(
        '2026-08-01T12:00:00'
      ).getTime(),

    duration: 60,  })



  const fillStorage = (
    size: number,
  ) => {
    const chunk = 'x'.repeat(size)

    localStorage.setItem(
      'large-entry',
      chunk,
    )
  }


  describe('basic behaviour', () => {

    it('should do nothing when localStorage is below the limit', () => {

      const events = [
        createEvent(),
      ]

      EventStore.setState({
        events,
      })

      const before =
        EventStore.getState()

      EventStore.getState().pruneEvents()

      const after =
        EventStore.getState()

      expect(after.events)
        .toEqual(events)


      expect(
        before.events,
      ).toEqual(after.events)
    })


    it('should do nothing when there are no events', () => {

      fillStorage(
        Math.ceil(
          MAX_LOCAL_STORAGE_BYTES
        ),
      )

      EventStore.setState({
        events: [],
        prunedInformation:
          emptyPrunedInformation(),
      })

      EventStore.getState().pruneEvents()

      expect(
        EventStore.getState().events,
      ).toEqual([])
    })


    it('should not prune twice within PRUNE_CHECK_INTERVAL', () => {

      const events = [
        createEvent({
          id: 1,
        }),
      ]

      EventStore.setState({
        events,
        prunedInformation: {
          ...emptyPrunedInformation(),
          lastPruneCheckAt:
            Date.now(),
        },
      })

      fillStorage(
        Math.ceil(
          MAX_LOCAL_STORAGE_BYTES
        ),
      )

      EventStore.getState().pruneEvents()

      expect(
        EventStore.getState().events,
      ).toEqual(events)
    })


    it('should update lastPruneCheckAt when pruning is checked', () => {

      const before =
        EventStore.getState()
          .prunedInformation
          .lastPruneCheckAt

      expect(before).toBe(0)

      EventStore.getState().pruneEvents(true)

      const after =
        EventStore.getState()
          .prunedInformation
          .lastPruneCheckAt

      expect(after).toBe(
        Date.now(),
      )
    })

  })






  


  describe('preservation', () => {



    it('should not mutate the original events array', () => {

      const events: Event[] = [
        createEvent({
          id: 1,
          action: 'added',
          date:
            new Date(
              '2026-08-20'
            ).getTime(),
        }),

        createEvent({
          id: 2,
          action: 'completed',
          date:
            new Date(
              '2026-07-01'
            ).getTime(),
        }),
      ]

      const original = [...events]

      EventStore.setState({
        events,
      })

      fillStorage(
        Math.ceil(
          MAX_LOCAL_STORAGE_BYTES
        ),
      )

      EventStore.getState().pruneEvents()

      expect(events).toEqual(original)
    })

  })


  describe('storage behaviour', () => {

    it('should actually reduce the number of events when storage is too large', () => {

      const events: Event[] = Array.from(
        { length: 20 },
        (_, index) =>
          createEvent({
            id: index + 1,
            action: 'added',
            date:
              new Date(
                '2026-07-01'
              ).getTime() +
              index * 24 * 60 * 60 * 1000,
          }),
      )

      EventStore.setState({
        events,
      })

      fillStorage(
        Math.ceil(
          MAX_LOCAL_STORAGE_BYTES
        ),
      )

      const before =
        EventStore.getState().events.length

      EventStore.getState().pruneEvents()

      const after =
        EventStore.getState().events.length

      expect(after).toBeLessThan(before)
    })


    it('should keep events when the storage does not exceed the limit', () => {

      const events = [
        createEvent({
          id: 1,
        }),
        createEvent({
          id: 2,
        }),
      ]

      EventStore.setState({
        events,
      })

      EventStore.getState().pruneEvents()

      expect(
        EventStore.getState().events,
      ).toEqual(events)
    })

  })


  describe('result ordering', () => {

    it('should keep resulting events chronologically ordered', () => {

      const events: Event[] = [
        createEvent({
          id: 1,
          action: 'added',
          date:
            new Date(
              '2026-08-01'
            ).getTime(),
        }),

        createEvent({
          id: 2,
          action: 'added',
          date:
            new Date(
              '2026-08-20'
            ).getTime(),
        }),

        createEvent({
          id: 3,
          action: 'added',
          date:
            new Date(
              '2026-07-01'
            ).getTime(),
        }),
      ]

      EventStore.setState({
        events,
      })

      fillStorage(
        Math.ceil(
          MAX_LOCAL_STORAGE_BYTES
        ),
      )

      EventStore.getState().pruneEvents()

      const result =
        EventStore.getState().events

      for (
        let i = 1;
        i < result.length;
        i++
      ) {
        expect(
          result[i].date,
        ).toBeGreaterThanOrEqual(
          result[i - 1].date,
        )
      }
    })

  })




 describe('pruning strategy', () => {
  it('should remove disposable events before normal events', () => {
    const normal = createEvent({
      id: 1,
      action: 'added',
      date: new Date('2026-07-01').getTime(),
    })

    const disposable = createEvent({
      id: 2,
      action: 'completed',
      date: new Date('2026-07-02').getTime(),
    })

    EventStore.setState({
      events: [normal, disposable],
    })

    fillStorage(
      Math.ceil(MAX_LOCAL_STORAGE_BYTES)
    )

    EventStore.getState().pruneEvents()

    const result = EventStore.getState().events

    expect(
      result.some(event => event.id === 2)
    ).toBe(false)
  })
})
})