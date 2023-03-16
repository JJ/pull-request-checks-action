import * as core from '@actions/core'
import * as github from '@actions/github'
import {checks} from './checks'

function run(): void {
  const context = github.context
  try {
    if (
      context.payload.pull_request !== null &&
      context.payload.pull_request !== undefined
    ) {
      if (
        'body' in context.payload.pull_request &&
        context.payload.pull_request.body !== null &&
        context.payload.pull_request.body !== undefined
      ) {
        const body: string = context.payload.pull_request.body
        const checked: {[id: string]: boolean} = checks(body)
        for (const i in checked) {
          core.info(`${i} → ${checked[i]}`)
          core.exportVariable(i, checked[i])
          core.setOutput(i, checked[i])
        }
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

run()
