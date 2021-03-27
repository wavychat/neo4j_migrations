import {expect, test} from '@oclif/test'

describe('undo-last', () => {
  test
  .stdout()
  .command(['undo-last'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['undo-last', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
