
import assert from 'assert'
import {sqrt} from './Sqrt'
import {expect} from 'chai'


describe("sqrt", function() {

    it("参数为负值时应该报错", function() {
    expect(function(){ sqrt(-1); }).to.throw("负值没有平方根");
    });

    it("4的平方根应该等于2", function() {
    expect(sqrt(4)).to.equal(2);
    });

});
