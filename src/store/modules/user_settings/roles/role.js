import Roles from '../../../../api/user_settings/roles/roles';

const role = new Roles();

const roleModule = {
    namespaced: true,
    state: {
        roles: [],
        flags: [],
        permissions: [],
        permissionsGroups: [],
        rolePermissions: [],
        rolesLoad: false,
        addLoad: false,
        newRole: null,
        userRoles: [],
        userPermission: [],
        userRolePermission: [],
        userAccessPermissions: null,
        authUserRoles: [],
        authUserPermission: [],
        authUserRolePermission: [],
    },
    getters: {
        roles(state) {
            // return Object.entries(state.roles).map(([key, value]) => {
            //     return {name: value, id: key}
            // });
            return state.roles;
        },
        flags(state) {
            return state.flags;
        },
        permissions(state) {
            return state.permissions;
        },
        permissionsGroups(state) {
            return state.permissionsGroups;
        },
        rolePermissions(state) {
            return Object.entries(state.rolePermissions).map(([key, value]) => {
                return key;
            });
        },
        rolesLoad(state) {
            return state.rolesLoad;
        },
        addLoad(state) {
            return state.addLoad;
        },
        newRole(state) {
            return state.newRole;
        },
        userRoles(state) {
            return Object.entries(state.userRoles).map(([key, value]) => {
                return value;
            });
        },
        userPermissions(state) {
            return Object.entries(state.userPermission).map(([key, value]) => {
                return key;
            });
        },
        userRolesPermissions(state) {
            return Object.entries(state.userRolePermission).map(([key, value]) => {
                return key;
            });
        },
        userAccessPermissions(state) {
            return state.userAccessPermissions;
        },
        userRolesPermissionsName(state) {
            return Object.entries(state.userRolePermission).map(([key, value]) => {
                return value;
            });
        },
        userPermissionsName(state) {
            return Object.entries(state.userPermission).map(([key, value]) => {
                return value;
            });
        },

        authUserRolesPermissionsName(state) {
            return Object.entries(state.authUserRolePermission).map(([key, value]) => {
                return value;
            });
        },
        authUserPermissionsName(state) {
            return Object.entries(state.authUserPermission).map(([key, value]) => {
                return value;
            });
        },
    },
    mutations: {
        SET_ROLES(state, roles) {
            state.roles = roles;
        },
        SET_FLAGS(state, flags) {
            state.flags = flags;
        },
        SET_PERMISSIONS(state, permissions) {
            state.permissions = permissions;
        },
        SET_PERMISSIONS_GROUPS(state, permissionsGroups) {
            state.permissionsGroups = permissionsGroups;
        },
        SET_ROLES_LOAD(state, load) {
            state.rolesLoad = load;
        },
        SET_ADD_LOAD(state, load) {
            state.addLoad = load;
        },
        SET_NEW_ROLE(state, role) {
            state.newRole = role;
        },
        SET_ROLE_PERMISSIONS(state, permissions) {
            state.rolePermissions = permissions;
        },
        SET_USER_ROLES(state, roles) {
            state.userRoles = roles;
        },
        SET_USER_PERMISSIONS(state, permissions) {
            state.userPermission = permissions;
        },
        SET_USER_ROLES_PERMISSIONS(state, rolesPermissions) {
            state.userRolePermission = rolesPermissions;
        },
        SET_USER_ACCESS_PERMISSIONS(state, permissions) {
            state.userAccessPermissions = permissions;
        },
        SET_AUTH_USER_ROLES(state, roles) {
            state.authUserRoles = roles;
        },
        SET_AUTH_USER_PERMISSIONS(state, permissions) {
            state.authUserPermission = permissions;
        },
        SET_AUTH_USER_ROLES_PERMISSIONS(state, rolesPermissions) {
            state.authUserRolePermission = rolesPermissions;
        },
    },
    actions: {
        getRoles({commit}) {
            return new Promise((resolve, reject) => {
                commit('SET_ROLES_LOAD', true);
                role.list()
                    .then(response => {
                        commit('SET_ROLES', response.data.roles);
                        commit('SET_FLAGS', response.data.flags);
                        commit('SET_PERMISSIONS', response.data.permissions);
                        commit('SET_PERMISSIONS_GROUPS', response.data.permissions_groups);
                        commit('SET_ROLES_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        getRolePermissions({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ROLES_LOAD', true);
                role.get(id)
                    .then(response => {
                        commit('SET_ROLE_PERMISSIONS', response.data.permissions);
                        commit('SET_ROLES_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        addRole({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ADD_LOAD', true);
                role.put(payload.id,  payload.data)
                    .then(response => {
                        commit('SET_NEW_ROLE', response.data);
                        commit('SET_ADD_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        commit('SET_ADD_LOAD', false);
                        reject(error);
                    });
            });
        },
        savePermission({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ADD_LOAD', true);
                role.updatePermission(payload.id,  payload.data)
                    .then(response => {
                        commit('SET_ADD_LOAD', false);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        },
        updateRole({commit}, payload) {
            commit('SET_ROLES_LOAD', true);
            return new Promise((resolve, reject) => {
                role.put(payload.id, payload.data)
                    .then(response => {
                        commit('SET_ROLES_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        deleteRole({commit}, id) {
            return new Promise((resolve, reject) => {
                role.remove(id)
                    .then(response => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        getUserRolesPermissions({commit}, user_id) {
            return new Promise((resolve, reject) => {
                role.userRoleAndPermissions(user_id)
                    .then(response => {
                        commit('SET_USER_ROLES', response.data.roles);
                        commit('SET_USER_PERMISSIONS', response.data.direct_permissions);
                        commit('SET_USER_ROLES_PERMISSIONS', response.data.role_permissions);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        getAuthUserRolesPermissions({commit}, user_id) {
            return new Promise((resolve, reject) => {
                role
                    .userRoleAndPermissions(user_id)
                    .then(response => {
                        commit('SET_AUTH_USER_ROLES', response.data.roles);
                        commit('SET_AUTH_USER_PERMISSIONS', response.data.direct_permissions);
                        commit('SET_AUTH_USER_ROLES_PERMISSIONS', response.data.role_permissions);

                        commit('SET_USER_ACCESS_PERMISSIONS', response.data.user_access_permissions);

                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        updateUserRolesPermissions({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ROLES_LOAD', true);
                role
                    .updateUserRoleAndPermissions(payload.data, payload.id)
                    .then(response => {
                        commit('SET_ROLES_LOAD', false);
                        // Message({
                        //   message: 'تمت العملية بنجاح',
                        //   type: 'success',
                        //   duration: 2 * 1000,
                        // });
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    },
};

export default roleModule;
