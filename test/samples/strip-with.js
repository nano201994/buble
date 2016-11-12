module.exports = [
  {
    description: 'strip with from Vue render functions',
    options: {
      transforms: { stripWith: true },
      objectAssign: 'Object.assign'
    },
    input: `
function render () {
  with (this) {
    return _h('div', items.map(function (item) {
      return _h('p', {
        class: [a, b + 'c', c ? d : item.e],
        style: { color, item, [prop]: true },
        inlineTemplate: {
          render: function () {
            with (this) {
              return _h('span', 'hi')
}
          }
        }
      }, item.tags.map(function (tag) {
        return _h('span', [item.id, tag.text, foo, a[b]])
      }))
    }))
}
}
`,
    output: `
function render () {
  var _vm=this;
    return _vm._h('div', _vm.items.map(function (item) {
      var _obj;
      return _vm._h('p', {
        class: [_vm.a, _vm.b + 'c', _vm.c ? _vm.d : item.e],
        style: ( _obj = { color: _vm.color, item: item }, _obj[_vm.prop] = true, _obj ),
        inlineTemplate: {
          render: function () {
            var _vm=this;
              return _vm._h('span', 'hi')

          }
        }
      }, item.tags.map(function (tag) {
        return _vm._h('span', [item.id, tag.text, _vm.foo, _vm.a[_vm.b]])
      }))
    }))

}
`
  }
]
