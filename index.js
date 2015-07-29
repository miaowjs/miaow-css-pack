var _ = require('lodash');
var async = require('async');
var mutil = require('miaow-util');
var postcss = require('postcss');

var pkg = require('./package.json');

function pack(option, cb) {
  var root = postcss.parse(this.contents, {from: this.srcAbsPath});
  var reg = /^\s*(?:url)?\s*\(?\s*?['"]([\w\_\/\.\-]+)['"]\s*\)?\s*$/;
  var importInfoList = [];

  // 查找所有需要打包的路径和索引值
  root.nodes.forEach(function (node, index) {
    var srcPathInfo;
    if (node.type === 'atrule' && node.name === 'import' && (srcPathInfo = node.params.match(reg))) {
      importInfoList.push({
        srcPath: srcPathInfo[1],
        index: index
      });
    }
  });

  var module = this;
  async.mapSeries(importInfoList, function (importInfo, cb) {
    module.getModule(importInfo.srcPath, function (err, importModule) {
      if (err) {
        return cb(err);
      }

      return cb(null, {
        root: postcss.parse(importModule.contents, {from: importModule.srcAbsPath}),
        index: importInfo.index
      });
    });
  }, function (err, importRootList) {
    if (err) {
      return cb(err);
    }

    // 修改节点信息
    var nodes = [];
    root.nodes.forEach(function (node, index) {
      var importRoot = _.find(importRootList, 'index', index);

      if (importRoot) {
        nodes.push.apply(nodes, importRoot.root.nodes);
      } else {
        nodes.push(node);
      }
    });

    root.nodes = nodes;

    module.contents = new Buffer(root.toResult().css);
    cb();
  });
}

module.exports = mutil.plugin(pkg.name, pkg.version, pack);
