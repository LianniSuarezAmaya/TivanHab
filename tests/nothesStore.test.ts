import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NothesStore } from '../store/stores/nothes.store'
import { AddEvent } from '../store/utils/itemsStore.utils'
import EventStore from '../store/stores/events.store'

import type { Nothe, NotheFormType } from '../ui/nothes/types/nothes.types'

vi.mock('../store/utils/itemsStore.utils', () => ({
  AddEvent: vi.fn(),
}))

vi.mock('../store/stores/events.store', () => ({
  default: {
    getState: vi.fn(),
  },
}))

describe('NothesStore', () => {
  const nothe: NotheFormType = {
    title: 'My note',
    content: 'My note content',
  }

  const existingNothe: Nothe = {
    key: 123,
    title: 'Existing note',
    content: 'Existing content',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    NothesStore.setState({
      selectedNothe: null,
      error: null,
    })

    vi.mocked(EventStore.getState).mockReturnValue({
      getNothes: vi.fn().mockReturnValue([]),
    } as any)

    vi.spyOn(Date, 'now').mockReturnValue(1000)
  })

  describe('addNothe', () => {
    it('should create an added Nothe event', () => {
      NothesStore.getState().addNothe(nothe)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      expect(AddEvent).toHaveBeenCalledWith({
        type: 'Nothe',
        action: 'added',
        eventKey: 1000,
        date: 1000,
        newData: {
          Nothe: {
            key: 1000,
            title: 'My note',
            content: 'My note content',
          },
        },
      })
    })

    it('should use the form data when creating the Nothe', () => {
      const newNothe: NotheFormType = {
        title: 'Another title',
        content: 'Another content',
      }

      NothesStore.getState().addNothe(newNothe)

      const event = vi.mocked(AddEvent).mock.calls[0][0]

      expect(event.newData).toEqual({
        Nothe: {
          key: 1000,
          title: 'Another title',
          content: 'Another content',
        },
      })
    })
  })

  describe('editNothe', () => {
    it('should set an error when there is no selected Nothe', () => {
      NothesStore.setState({
        selectedNothe: null,
        error: null,
      })

      NothesStore.getState().editNothe(nothe)

      expect(NothesStore.getState().error)
        .toBe('An error ocurred . Please try again')

      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should set an error when the selected Nothe does not exist', () => {
      NothesStore.setState({
        selectedNothe: existingNothe,
        error: null,
      })

      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([]),
      } as any)

      NothesStore.getState().editNothe(nothe)

      expect(NothesStore.getState().error)
        .toBe('An error ocurred . Please try again')

      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should create an edited Nothe event', () => {
      NothesStore.setState({
        selectedNothe: existingNothe,
        error: null,
      })

      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([
          existingNothe,
        ]),
      } as any)

      NothesStore.getState().editNothe(nothe)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      expect(AddEvent).toHaveBeenCalledWith({
        eventKey: 123,
        type: 'Nothe',
        action: 'edited',
        date: 1000,
        newData: {
          Nothe: {
            key: 123,
            title: 'My note',
            content: 'My note content',
          },
        },
      })
    })

    it('should preserve the selected Nothe key when editing', () => {
      NothesStore.setState({
        selectedNothe: existingNothe,
        error: null,
      })

      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([
          existingNothe,
        ]),
      } as any)

      const editedNothe: NotheFormType = {
        title: 'Updated',
        content: 'Updated content',
      }

      NothesStore.getState().editNothe(editedNothe)

      const event = vi.mocked(AddEvent).mock.calls[0][0]

      expect(event.eventKey).toBe(123)

      expect(event.newData).toEqual({
        Nothe: {
          key: 123,
          title: 'Updated',
          content: 'Updated content',
        },
      })
    })
  })

  describe('deleteNothe', () => {
    it('should create a deleted event for an existing Nothe', () => {
      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([
          existingNothe,
        ]),
      } as any)

      NothesStore.getState().deleteNothe(123)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      expect(AddEvent).toHaveBeenCalledWith({
        eventKey: 123,
        type: 'Nothe',
        action: 'deleted',
        date: 1000,
      })
    })

    it('should set an error when the Nothe does not exist', () => {
      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([]),
      } as any)

      NothesStore.getState().deleteNothe(123)

      expect(NothesStore.getState().error)
        .toBe('An error ocurred . Please try again')
    })

    it('should not create an event when the Nothe does not exist', () => {
      vi.mocked(EventStore.getState).mockReturnValue({
        getNothes: vi.fn().mockReturnValue([]),
      } as any)

      NothesStore.getState().deleteNothe(123)

      expect(AddEvent).not.toHaveBeenCalled()
    })
  })

  describe('setSelectedNothe', () => {
    it('should select a Nothe', () => {
      NothesStore.getState().setSelectedNothe(existingNothe)

      expect(NothesStore.getState().selectedNothe)
        .toEqual(existingNothe)
    })

    it('should clear the selected Nothe', () => {
      NothesStore.setState({
        selectedNothe: existingNothe,
      })

      NothesStore.getState().setSelectedNothe(null)

      expect(NothesStore.getState().selectedNothe)
        .toBeNull()
    })
  })
})