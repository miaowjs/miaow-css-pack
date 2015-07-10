var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-css-pack', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures'),
      output: path.resolve(__dirname, './output'),
      pack: false,
      module: {
        tasks: [
          {
            test: /\.css/,
            plugins: [parse]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('导入', function () {
    assert.equal(log.modules['foo.css'].hash, 'dd1334d53c8a2af552a68da3a44107c3');
    assert.equal(log.modules['baz.css'].hash, 'e2ec5b9e16b840287fa65209d3f71082');
  });

  it('添加依赖信息', function () {
    var dependencies = log.modules['foo.css'].dependencies;

    assert.equal(dependencies.length, 1);
    [
      'bar.css'
    ].forEach(function (srcPath) {
        assert.notEqual(dependencies.indexOf(srcPath), -1);
      });
  });
});
