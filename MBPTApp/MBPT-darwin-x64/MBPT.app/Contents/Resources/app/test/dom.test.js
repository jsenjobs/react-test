import React from 'react';
// import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import RefTest from '../src/Refs/RefTest'

import ShallowRenderer from 'react-test-renderer/shallow'; 
import TestRenderer from 'react-test-renderer';

  
describe('Dom测试 RefTest', function () {
    const app = TestRenderer.create(<RefTest/>)
    const instance = app.root
    it('RefTest\'s input shoult be text', function () {
      expect(instance.findByType('input').props.type).to.eq('text')
    });
    it('RefTest\'s h1 shoult be Refs test', function () {
        expect(instance.findAllByType('h1')[0].props.children).to.eq('Refs test')
        expect(instance.findAllByType('h1')[1].props.children).to.eq('Refs test1')
    });
    it('RefTest\'s button value should be getValue', function () {
        expect(instance.findByType('button').props.children).to.eq('getValue')
    });
  });
