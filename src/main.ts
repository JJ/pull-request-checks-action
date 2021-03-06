import * as core from '@actions/core'
import * as github from '@actions/github'
import {checks} from './checks'

async function run(): Promise<void> {
    const context = github.context
    try {
        if ( !context.payload.pull_request ) {
            core.setFailed("Only available for pull requests")
        }
        console.log( context.payload.pull_request 
        let body: string = context.payload.pull_request.body!
        core.debug(`Got ${body}`)
        const checked = await checks( body )
        core.exportVariable('checked', checked )
        core.setOutput('checked',checked)
  } catch (error) {
      core.setFailed(error.message)
  }
}

run()
