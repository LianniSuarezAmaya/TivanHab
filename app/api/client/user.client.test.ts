import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userService } from './user.client'

describe('userService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  describe('getLocalUser', () => {
    it('should return null when there is no stored user', () => {
      expect(userService.getLocalUser()).toBeNull()
    })

    it('should return the stored user', () => {
      const user = {
        id: 1,
        name: 'John',
        lastTimeConnected: '2026-08-22T10:00:00.000Z',
      }

      localStorage.setItem(
        'app_user',
        JSON.stringify(user),
      )

      expect(userService.getLocalUser()).toEqual(user)
    })

    it('should return null when localStorage contains invalid JSON', () => {
      localStorage.setItem(
        'app_user',
        'invalid-json',
      )

      expect(userService.getLocalUser()).toBeNull()
    })
  })

  describe('saveLocalUser', () => {
    it('should save the user in localStorage', () => {
      const user = {
        id: 1,
        name: 'John',
        lastTimeConnected: '2026-08-22T10:00:00.000Z',
      }

      userService.saveLocalUser(user)

      expect(
        localStorage.getItem('app_user'),
      ).toBe(JSON.stringify(user))
    })
  })

  describe('createUser', () => {
    it('should create a user and save it locally', async () => {
      const dbUser = {
        id: 10,
        name: 'John',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(dbUser),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )

      const result =
        await userService.createUser('John')

      expect(fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'John',
          }),
        }),
      )

      expect(result).toEqual({
        id: 10,
        name: 'John',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      })

      expect(
        userService.getLocalUser(),
      ).toEqual(result)
    })

    it('should use "User" when name is empty', async () => {
      const dbUser = {
        id: 10,
        name: 'User',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(dbUser),
          { status: 200 },
        ),
      )

      await userService.createUser('')

      expect(fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          body: JSON.stringify({
            name: 'User',
          }),
        }),
      )
    })

    it('should throw the API error when creation fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'Name already exists',
          }),
          { status: 400 },
        ),
      )

      await expect(
        userService.createUser('John'),
      ).rejects.toThrow(
        'Name already exists',
      )
    })
  })

  describe('initUser', () => {
    it('should return the existing local user', async () => {
      const user = {
        id: 1,
        name: 'John',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      userService.saveLocalUser(user)

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(user),
          { status: 200 },
        ),
      )

      const result =
        await userService.initUser()

      expect(result).toEqual(user)

      expect(fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'PUT',
        }),
      )
    })

    it('should create a user when there is no local user', async () => {
      const dbUser = {
        id: 20,
        name: 'User',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(dbUser),
          { status: 200 },
        ),
      )

      const result =
        await userService.initUser()

      expect(result).toEqual({
        id: 20,
        name: 'User',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should still return the local user when updating connection fails', async () => {
      const user = {
        id: 1,
        name: 'John',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      userService.saveLocalUser(user)

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'Server unavailable',
          }),
          { status: 500 },
        ),
      )

      const result =
        await userService.initUser()

      expect(result).toEqual(user)
    })
  })

  describe('updateUserName', () => {
    it('should update the user name and save it locally', async () => {
      const dbUser = {
        id: 1,
        name: 'New name',
        lastTimeConnected:
          '2026-08-22T10:00:00.000Z',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(dbUser),
          { status: 200 },
        ),
      )

      const result =
        await userService.updateUserName(
          1,
          'New name',
        )

      expect(fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            id: 1,
            name: 'New name',
          }),
        }),
      )

      expect(result).toEqual(dbUser)
      expect(
        userService.getLocalUser(),
      ).toEqual(dbUser)
    })

    it('should throw when updating the name fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'User not found',
          }),
          { status: 404 },
        ),
      )

      await expect(
        userService.updateUserName(
          999,
          'John',
        ),
      ).rejects.toThrow('User not found')
    })
  })

  describe('updateLastConnected', () => {
    it('should update the last connection date', async () => {
      const dbUser = {
        id: 1,
        name: 'John',
        lastTimeConnected:
          '2026-08-22T12:00:00.000Z',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(dbUser),
          { status: 200 },
        ),
      )

      const result =
        await userService.updateLastConnected(1)

      expect(fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'PUT',
        }),
      )

      const request =
        vi.mocked(fetch).mock.calls[0][1]

      const body = JSON.parse(
        request?.body as string,
      )

      expect(body.id).toBe(1)
      expect(body.lastTimeConnected)
        .toEqual(expect.any(String))

      expect(result).toEqual(dbUser)
    })

    it('should throw when updating connection fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'Unauthorized',
          }),
          { status: 401 },
        ),
      )

      await expect(
        userService.updateLastConnected(1),
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('fetchWeeklyUsers', () => {
    it('should return mapped weekly statistics', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            totalUsers: 100,
            usersConnectedThisWeek: 35,
            activeNow: 7,
          }),
          { status: 200 },
        ),
      )

      const result =
        await userService.fetchWeeklyUsers()

      expect(fetch).toHaveBeenCalledWith(
        '/api/users/stats',
      )

      expect(result).toEqual({
        totalUsers: 100,
        activeThisWeek: 35,
        activeNow: 7,
      })
    })

    it('should use zero when statistics are missing', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({}),
          { status: 200 },
        ),
      )

      const result =
        await userService.fetchWeeklyUsers()

      expect(result).toEqual({
        totalUsers: 0,
        activeThisWeek: 0,
        activeNow: 0,
      })
    })

    it('should throw when fetching statistics fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'Database error',
          }),
          { status: 500 },
        ),
      )

      await expect(
        userService.fetchWeeklyUsers(),
      ).rejects.toThrow('Database error')
    })
  })

  describe('getStats', () => {
    it('should return the API response', async () => {
      const stats = {
        totalUsers: 100,
        usersConnectedThisWeek: 35,
        activeNow: 7,
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify(stats),
          { status: 200 },
        ),
      )

      const result =
        await userService.getStats()

      expect(fetch).toHaveBeenCalledWith(
        '/api/users/stats',
      )

      expect(result).toEqual(stats)
    })

    it('should throw when the request fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: 'Failed to fetch stats',
          }),
          { status: 500 },
        ),
      )

      await expect(
        userService.getStats(),
      ).rejects.toThrow(
        'Failed to fetch stats',
      )
    })
  })
})