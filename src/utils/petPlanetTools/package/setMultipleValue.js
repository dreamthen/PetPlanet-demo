//定义多层处理对象属性值为null的函数
//在设置为父级底下多层属性值为null的情况下使用
function multipleToNull(state) {
  if (Object.prototype.toString.call(state) === '[object Object]') {
    for (let [key, value] of Object.entries(state)) {
      state[key] = multipleToNull(state[key]);
    }
  } else {
    state = null;
  }
  return state;
}

//定义多层处理对象属性值在不按照state模板的情况下,payload添加属性和属性值的情况下使用
//概括起来就是用于添加state属性使用
function compareAdd(state, newState) {
  for (let key of Object.keys(newState)) {
    state[key] = (state[key] === undefined) ? null : state[key];
  }
  return state;
}

export {
  multipleToNull,
  compareAdd
};
