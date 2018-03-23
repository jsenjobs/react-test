import React from 'react';
// import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import RefTest from '../src/Refs/RefTest'

import ShallowRenderer from 'react-test-renderer/shallow'; 

function shallowRender(Component) {
    const renderer = new ShallowRenderer();
    renderer.render(<Component/>);
    return renderer.getRenderOutput();
}
  
describe('VDom测试 RefTest', function () {
  it('RefTest\'s title should be Refs test', function () {
    const app = shallowRender(RefTest);
    expect(app.props.children[0].type).to.equal('h1');
    expect(app.props.children[0].props.children).to.equal('Refs test');
  });
});