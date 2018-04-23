const ApiBase = 'http://server001:8080/'
const ApiAuthBase = ApiBase + 'ACRUD/'

const api = {
    account: {
        login: ApiBase + 'account/login/',
        listAll: ApiBase + 'mul/db1'
    },
    auth: {
        hasRole: ApiBase + 'auth/has/role/', //判断是否有某个角色【ui权限控制】
        hasPermission: ApiBase + 'auth/has/permission/', //判断是否有某个权限【ui权限控制】
        hasPermissions: ApiBase + 'auth/has/permissions/', //判断是否有所有权限【ui权限控制】

        createUser: ApiAuthBase + 'create/user/',
        deleteUser: ApiAuthBase + 'delete/user/',
        createRole: ApiAuthBase + 'create/role/',
        deleteRole: ApiAuthBase + 'delete/role/',
        createPermission: ApiAuthBase + 'create/permission/',
        deletePermission: ApiAuthBase + 'delete/permission/',

        userAddRole: ApiAuthBase + 'create/uar/',
        userDeleteRole: ApiAuthBase + 'delete/uar/',
        roleAddPermission: ApiAuthBase + 'create/rap/',
        roleDeletePermission: ApiAuthBase + 'delete/rap/',


        listUser: ApiAuthBase + 'user/list/',
        listRole: ApiAuthBase + 'role/list/',
        listPermission: ApiAuthBase + 'permission/list/',

        check: ApiBase + 'ViewPath',
    },
    user: {
        login: ApiBase + 'sysUser/login/',
        addRole: ApiAuthBase + 'create/uar/',
        deleteRole: ApiAuthBase + 'delete/uar/',
    },
    role: {
        addPermission: ApiAuthBase + 'create/rap/',
        deletePermission: ApiAuthBase + 'delete/rap/',
        listAll: ApiAuthBase + 'role/listAll/',
    },
    permission: {
        listAll: ApiAuthBase + 'permission/listAll/'
    },
    filter: {
        listAll: ApiAuthBase + 'filter/list/',
        delete: ApiAuthBase + 'delete/',
        create: ApiAuthBase + 'create/',
    },
    topic: {
        listTree: ApiBase + 'topic/listTree',
        addTopic: ApiBase + 'topic/addTopic/',
        addSubTopic: ApiBase + 'topic/addSubTopic/',
    },
    model: {
        create: ApiBase + 'hcModel/model/create',
        update: ApiBase + 'hcModel/model/update',
        find: ApiBase + 'hcModel/model/find/',
    },
    dbMeta: {
        // 返回某数据库的所有数据表
        listTables: ApiBase + 'dbMeta/tables/',
        // 列出某数据表的所有column信息
        listColumns: ApiBase + 'dbMeta/columns/',
    },
    table: {
        list: ApiBase + 'hcTable/table/list',
        update: ApiBase + 'hcTable/table/update',
        delete: ApiBase + 'hcTable/table/delete/',
        insert: ApiBase + 'hcTable/table/insert/',
        addRole: ApiBase + 'hcTable/table/role/',
        addTopic: ApiBase + 'hcTable/table/topic/',
        deleteRoleTable:  ApiBase + 'hcTable/delete/rat/',
    },
    task: {
        pre: {
            listTableData: ApiBase + 'task/pre/table/list/'
        },
        core: {
            execPart: ApiBase + 'task/core/part/exec'
        }
    }
}

export default api