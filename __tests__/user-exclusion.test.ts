import * as core from '@actions/core'
import * as github from '@actions/github'
import {run} from '../src/main'

// Mock the @actions/core module
jest.mock('@actions/core')
const mockCore = core as jest.Mocked<typeof core>

// Mock the @actions/github module
jest.mock('@actions/github')
const mockGithub = github as jest.Mocked<typeof github>

describe('User Exclusion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('skips checks for dependabot by default', () => {
    // Mock the GitHub context with a dependabot PR
    Object.defineProperty(mockGithub, 'context', {
      value: {
        payload: {
          pull_request: {
            user: {
              login: 'dependabot[bot]'
            },
            body: '- [x] TEST: Some check'
          }
        }
      },
      writable: true
    })

    // Mock core.getInput to return default (empty string, so it uses the default)
    mockCore.getInput.mockReturnValue('dependabot[bot]')

    run()

    // Should log that it's skipping
    expect(mockCore.info).toHaveBeenCalledWith(
      'Skipping checks for excluded user: dependabot[bot]'
    )

    expect(mockCore.setOutput).toHaveBeenCalledWith('isExcludedUser', true)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('isExcludedUser', true)

    expect(mockCore.setFailed).not.toHaveBeenCalled()
  })

  test('skips checks for custom excluded users', () => {
    // Mock the GitHub context with a custom user PR
    Object.defineProperty(mockGithub, 'context', {
      value: {
        payload: {
          pull_request: {
            user: {
              login: 'renovate[bot]'
            },
            body: '- [x] TEST: Some check'
          }
        }
      },
      writable: true
    })

    // Mock core.getInput to return custom excluded users
    mockCore.getInput.mockReturnValue('renovate[bot],custom-bot')

    run()

    // Should log that it's skipping
    expect(mockCore.info).toHaveBeenCalledWith(
      'Skipping checks for excluded user: renovate[bot]'
    )

    // Should not set any outputs or variables
    expect(mockCore.setOutput).toHaveBeenCalled()
    expect(mockCore.exportVariable).toHaveBeenCalled() // it sets a variable to indicate that it's the default user
    expect(mockCore.setFailed).not.toHaveBeenCalled()
  })

  test('processes checks for non-excluded users', () => {
    // Mock the GitHub context with a regular user PR
    Object.defineProperty(mockGithub, 'context', {
      value: {
        payload: {
          pull_request: {
            user: {
              login: 'regular-user'
            },
            body: '- [x] TEST: Some check\n- [ ] ANOTHER: Another check'
          }
        }
      },
      writable: true
    })

    // Mock core.getInput to return default
    mockCore.getInput.mockReturnValue('')

    run()

    // Should not skip
    expect(mockCore.info).not.toHaveBeenCalledWith(
      expect.stringContaining('Skipping checks for excluded user')
    )

    // Should process the checks and set outputs
    expect(mockCore.setOutput).toHaveBeenCalledWith('TEST', true)
    expect(mockCore.setOutput).toHaveBeenCalledWith('ANOTHER', false)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('TEST', true)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('ANOTHER', false)
  })

  test('handles PRs without user information gracefully', () => {
    // Mock the GitHub context with a PR without user info
    Object.defineProperty(mockGithub, 'context', {
      value: {
        payload: {
          pull_request: {
            body: '- [x] TEST: Some check'
          }
        }
      },
      writable: true
    })

    // Mock core.getInput to return default
    mockCore.getInput.mockReturnValue('')

    run()

    // Should not skip (no user to exclude)
    expect(mockCore.info).not.toHaveBeenCalledWith(
      expect.stringContaining('Skipping checks for excluded user')
    )

    // Should process the checks
    expect(mockCore.setOutput).toHaveBeenCalledWith('TEST', true)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('TEST', true)
  })

  test('handles whitespace in excluded users list', () => {
    // Mock the GitHub context with a user that has whitespace in the config
    Object.defineProperty(mockGithub, 'context', {
      value: {
        payload: {
          pull_request: {
            user: {
              login: 'renovate[bot]'
            },
            body: '- [x] TEST: Some check'
          }
        }
      },
      writable: true
    })

    // Mock core.getInput to return excluded users with extra whitespace
    mockCore.getInput.mockReturnValue(' renovate[bot] , custom-bot ')

    run()

    // Should log that it's skipping (whitespace should be trimmed)
    expect(mockCore.info).toHaveBeenCalledWith(
      'Skipping checks for excluded user: renovate[bot]'
    )

    // Should not set any outputs or variables
    expect(mockCore.setOutput).toHaveBeenCalled()
    expect(mockCore.exportVariable).toHaveBeenCalled() // Calls with "isExcludedUser", true
  })
})
