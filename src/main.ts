import * as core from '@actions/core'
import * as github from '@actions/github'
import {checks} from './checks'

export function run(): void {
  const context = github.context
  try {
    if (
      context.payload.pull_request !== null &&
      context.payload.pull_request !== undefined
    ) {
      // Check if the PR author should be excluded
      const excludedUsersInput = core.getInput('excluded-users')
      const excludedUsers = excludedUsersInput
        .split(',')
        .map(user => user.trim())
      const prAuthor = context.payload.pull_request.user?.login

      if (prAuthor && excludedUsers.includes(prAuthor)) {
        core.info(`Skipping checks for excluded user: ${prAuthor}`)
        core.exportVariable('isExcludedUser', true)
        core.setOutput('isExcludedUser', true)
        return
      }

      if (
        'body' in context.payload.pull_request &&
        context.payload.pull_request.body !== null &&
        context.payload.pull_request.body !== undefined
      ) {
        const body: string = context.payload.pull_request.body
        const checked: {[id: string]: boolean} = checks(body)
        let all_checked = true
        for (const i in checked) {
          const is_checked: boolean = checked[i]
          core.info(`${i} → ${is_checked}`)
          core.exportVariable(i, is_checked)
          core.setOutput(i, is_checked)
          all_checked = all_checked && is_checked
        }
        core.exportVariable('allChecked', all_checked)
        core.setOutput('allChecked', all_checked)
      } else {
        core.setFailed('No body to check or anything else')
      }
    } else {
      core.setFailed('Only available for pull requests')
    }
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      core.setFailed(error?.message)
    } else {
      core.setFailed(String(error))
    }
  }
}

// Only run if this module is executed directly (not imported for testing)
if (require.main === module) {
  run()
}
