var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-css-pack', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    miaow({
      context: path.resolve(__dirname, './fixtures')
    }, function(err) {
      if (err) {
        console.error(err.toString(), err.stack);
        process.exit(1);
      }

      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('导入', function() {
    assert.equal(_.find(log.modules, {src: 'foo.css'}).destHash, 'dd1334d53c8a2af552a68da3a44107c3');
    assert.equal(_.find(log.modules, {src: 'baz.css'}).destHash, 'e2ec5b9e16b840287fa65209d3f71082');
  });
});
