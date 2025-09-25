// Mock the @actions/core module with explicit jest.fn implementations
jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  setOutput: jest.fn(),
  exportVariable: jest.fn(),
  getInput: jest.fn(),
  info: jest.fn(),
  setFailed: jest.fn()
}))

// Mock the @actions/github module and expose a mutable context
jest.mock('@actions/github', () => ({
  context: {}
}))

// Import the mocked modules (they will receive the mocks above)
import * as core from '@actions/core'
import * as github from '@actions/github'
const mockCore = core as jest.Mocked<typeof core>
type MockContext = {
  payload?: {
    pull_request: {
      user?: {login?: string}
      body?: string
    }
  }
}
const mockGithub = github as unknown as {context: MockContext}

describe('Checks for all checked', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Ensure no crash when reading excluded-users input
    mockCore.getInput.mockReturnValue('')
    // Reset payload between tests
    mockGithub.context.payload = undefined
  })

  test('Fails when one is not checked', async () => {
    // Mock the GitHub context with a PR body containing a checked and an unchecked item
    mockGithub.context.payload = {
      pull_request: {
        user: {login: 'mock'},
        body: '- [x] TEST: Some check\n- [ ] ANOTHER: Another check'
      }
    }

    const {run} = await import('../src/main')
    run()

    expect(mockCore.setOutput).toHaveBeenCalledWith('allChecked', false)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('allChecked', false)

  })

  test('Succeeds when all are checked', async () => {
    // Mock the GitHub context with a PR body where all items are checked
    mockGithub.context.payload = {
      pull_request: {
        user: {login: 'mock'},
        body: '- [x] TEST: Some check\n- [x] ANOTHER: Another check'
      }
    }

    const {run} = await import('../src/main')
    run()

    expect(mockCore.setOutput).toHaveBeenCalledWith('allChecked', true)
    expect(mockCore.exportVariable).toHaveBeenCalledWith('allChecked', true)

  })
})