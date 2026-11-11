// react-dom-19 is react-dom 19 installed under an alias next to React 18, for the
// React 19 tests. Its peer dependency on react would resolve to the root's React 18,
// so it depends on the matching React 19 release instead.
function readPackage(pkg) {
  if (pkg.name === 'react-dom' && pkg.version.startsWith('19.')) {
    delete pkg.peerDependencies.react;
    pkg.dependencies = { ...pkg.dependencies, react: pkg.version };
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
