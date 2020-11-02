import * as core from '@actions/core'
const {GitHub, context} = require('@actions/github')
import {checks} from './checks'

async function run(): Promise<void> {
  try {
      const body: string = context.payload.pull_request.body
      core.debug(`Got ${body}`)
      const checked = await checks( body )
      core.exportVariable('checked', checked )
      core.setOutput('checked',checked)
  } catch (error) {
      core.setFailed(error.message)
  }
}

run()
