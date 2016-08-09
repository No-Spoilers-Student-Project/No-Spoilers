module.exports = function uniq(a) {
  let seen = {};
  let objs = [];
  for (let i = 0; i < a.length; i++) {
    let itemId = a[i]._id;
    if (seen.hasOwnProperty(a[i]._id)) {/*do nothing*/
    } else {
      seen[itemId] = true;
      objs.push(a[i]);
    }
  }
  return objs;
};
