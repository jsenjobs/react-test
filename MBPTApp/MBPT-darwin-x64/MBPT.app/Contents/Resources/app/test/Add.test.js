// let assert = require('assert')
// let add = require('./Add').add
// let expect = require('chai').expect
import assert from 'assert'
import {add} from './Add'
import {expect} from 'chai'


// only skip
describe('Add ', () => {

before(() => {
  console.log('before')
})
after(() => {
  console.log('after')
})
beforeEach(() => {
  console.log('beforeEach')
})
afterEach(() => {
  console.log('afterEach')
})
  // it 一个测试用例
  it('1+1=2', () => {
    expect(add(1, 1)).to.be.equal(2);
  })
})
