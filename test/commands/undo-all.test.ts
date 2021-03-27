import {expect, test} from '@oclif/test'

describe('undo-all', () => {
  test
  .stdout()
  .command(['undo-all'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['undo-all', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
