var _ = require('lodash');
var async = require('async');
var path = require('path');
var postcss = require('postcss');

var pkg = require('./package.json');

module.exports = function(options, callback) {
  var context = this;
  var contents = context.contents.toString();

  if (!contents.trim()) {
    return callback();
  }

  var root;
  try {
    root = postcss.parse(contents, {from: this.srcAbsPath});
  } catch (err) {
    return callback(err);
  }

  var reg = /^\s*(?:url)?\s*\(?\s*?['"]([\w\_\/\.\-]+)['"]\s*\)?\s*$/;
  var importInfoList = [];

  // 查找所有需要打包的路径和索引值
  root.nodes.forEach(function(node, index) {
    var srcPathInfo;
    if (node.type === 'atrule' && node.name === 'import') {
      srcPathInfo = node.params.match(reg);

      if (srcPathInfo) {
        importInfoList.push({
          src: srcPathInfo[1],
          index: index
        });
      }
    }
  });

  async.mapSeries(
    importInfoList,
    function(importInfo, callback) {
      context.resolveModule(importInfo.src, function(err, module) {
        if (err) {
          return callback(err);
        }

        var root;
        try {
          root = postcss.parse(module.contents, {from: path.join(context.context, module.src)});
        } catch (err) {
          return callback(err);
        }

        return callback(null, {
          root: root,
          index: importInfo.index
        });
      });
    },

    function(err, importRootList) {
      if (err) {
        return callback(err);
      }

      // 修改节点信息
      var nodes = [];
      root.nodes.forEach(function(node, index) {
        var importRoot = _.find(importRootList, {index: index});

        if (importRoot) {
          nodes.push.apply(nodes, importRoot.root.nodes);
        } else {
          nodes.push(node);
        }
      });

      root.nodes = nodes;

      try {
        context.contents = new Buffer(root.toResult().css);
      } catch (err) {
        return callback(err);
      }

      callback();
    });
};

module.exports.toString = function() {
  return [pkg.name, pkg.version].join('@');
};
