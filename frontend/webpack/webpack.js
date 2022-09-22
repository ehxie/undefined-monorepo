const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let ID = 0;

/**
 *
 * @param {string} filename 文件名
 */
function createAssert(filename) {
  const content = fs.readFileSync(filename, 'utf-8');

  const ast = parser.parse(content, {
    sourceType: 'module',
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const { code } = babel.transformFromAstSync(ast, null, {
    // plugin 集合
    presets: ['@babel/preset-env'],
  });
  const id = ID++;

  return {
    id,
    filename,
    code,
    dependencies,
  };
}

function createGraph(entry) {
  const mainAssert = createAssert(entry);

  const queue = [mainAssert];

  for (const asset of queue) {
    const dirname = asset.filename;

    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, '../', relativePath);
      const child = createAssert(absolutePath);
      queue.push(child);

      asset.mapping[relativePath] = child.id;
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = '';
  graph.forEach(mod => {
    modules += `
      ${mod.id}:[
        function(require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)}
      ],
    `;
  });
  const result = `
    (function(modules) {
      function require(id){
        const [fn, mapping] = modules[id]

        function localRequire(relativePath){
          return require(mapping[relativePath])
        }

        const module = {
          exports: {}
        }

        fn(localRequire, module, module.exports)

        return module.exports
      }
      require(0)
    })({${modules}})
  `;
  return result;
}

const graph = createGraph('./src/index.js');
const result = bundle(graph);
console.log(result);
fs.writeFile('./dist/index.js', result, err => {
  console.log(err);
});
