import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = elVal instanceof String && [elVal] || elVal

    // TODO - Roles is Array: Fixed
    let permissions = []
    if (roles && Object.prototype.toString.call(roles) === '[object Array]') {
      roles.map(role => {
        permissions = permissions.concat(role.permissions)
      })
    } else if (roles.permissions && roles.permissions.length > 0) {
      // permissions = permissions.concat(roles.permissions)
      permissions = roles.permissions
    }

    // TODO - Fixed : 当多个  Role 具有相同的 PermissionId, 但 该PermissionId 中的 actionList 不同， 则会有 BUG 出现
    // 另一个方法: 相同的 permissionId 的 actionList 需要合并
    let hasActionPermission = false
    permissions.forEach(p => {
      if (hasActionPermission || !permissionId.includes(p.permissionId)) {
        return
      }
      // if (p.actionList && !p.actionList.includes(actionName)) {
      //   el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      // }

      if (permissionId.includes(p.permissionId) && p.actionList && p.actionList.includes(actionName)) {
        hasActionPermission = true
      }
    })

    if (!hasActionPermission) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default action
