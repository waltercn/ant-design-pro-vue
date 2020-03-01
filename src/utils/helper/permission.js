const PERMISSION_ENUM = {
  'add': { key: 'add', label: '新增' },
  'delete': { key: 'delete', label: '删除' },
  'edit': { key: 'edit', label: '修改' },
  'query': { key: 'query', label: '查询' },
  'get': { key: 'get', label: '详情' },
  'enable': { key: 'enable', label: '启用' },
  'disable': { key: 'disable', label: '禁用' },
  'import': { key: 'import', label: '导入' },
  'export': { key: 'export', label: '导出' }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (permissions) => {
          const [permission, action] = permissions.split('.')
          // TODO - Fixed
          const roles = _this.$store.getters.roles
          let permissionList = []
          if (roles && Object.prototype.toString.call(roles) === '[object Array]') {
            roles.map(role => {
              permissionList = permissionList.concat(role.permissions)
            })
          } else {
            permissionList = roles.permissions
          }

          // const permissionList = _this.$store.getters.roles.permissions
          // 用户有多个角色时有 BUG
          // return permissionList.find((val) => {
          //   return val.permissionId === permission
          // }).actionList.findIndex((val) => {
          //   return val === action
          // }) > -1

          // Fixed
          let hasActionPermission = false
          permissionList.map(per => {
            if (hasActionPermission || per.permissionId !== permission) {
              return
            }

            if (per.actionList.findIndex((val) => {
              return val === action
            }) > -1) {
              hasActionPermission = true
            }
          })
          return hasActionPermission
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}

export default plugin
