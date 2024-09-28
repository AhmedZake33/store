import Resource from '../../../api/resource'
import request from '../../../utils/request'
import store from '@/store/index'
import {getToken} from '../../../utils/auth'

class Archive extends Resource {
  constructor() {
    super('archive')
  }

  list(query, id) {
    return request({
      url: `/archive`,
      method: 'post',
      params: query,
    })
  }

  getParents(id, locale, root_id = 0) {
    return request({
      url: `/archive/parents/${id}/${locale}/${root_id}`,
      method: 'get',
    })
  }

  download(id) {
    return request({
      url: `/archive/download/${id}`,
      method: 'get',
    })
  }

  downloadFiles(id) {
    return request({
      url: `/archive/zip/files/${id}?token=${getToken()}`,
      method: 'get',
    })
  }

  upload(resource, id) {
    return request({
      url: `/archive/upload${id}`,
      method: 'post',
      data: resource,
      onUploadProgress: function (progressEvent) {
        store.commit('app/SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
      }.bind(store),
    })
  }

  update(resource, id) {
    return request({
      url: `/archive/update/${id}`,
      method: 'post',
      data: resource,
      onUploadProgress: function (progressEvent) {
        store.commit('app/SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
      }.bind(store),
    })
  }

  import(resource, id) {
    return request({
      url: `/archive/import${id}`,
      method: 'post',
      data: resource,
    })
  }

  order(data) {
    return request({
      url: `/archive/order`,
      method: 'post',
      data: data,
    })
  }

  add(resource) {
    return request({
      url: `/archive`,
      method: 'put',
      data: resource,
    })
  }

  destroy(id) {
    return request({
      url: `/archive/${id}`,
      method: 'delete',
    })
  }

  rename(resource) {
    return request({
      url: `/archive/${resource.id}`,
      method: 'put',
      data: resource.resource,
    })
  }

  content(id, query) {
    return request({
      url: `/archive/${id}`,
      method: 'get',
      params: query,
    })
  }

  usersRoles(resource) {
    return request({
      url: `/archive/names/users_roles`,
      method: 'post',
      data: resource,
    })
  }

  setContent(payload) {
    return request({
      url: `/archive/update_page/${payload.id}`,
      method: 'post',
      data: {
        body: payload.body,
        language: payload.language
      },
    })
  }

  move(resource) {
    return request({
      url: `/archive/move_to/${resource.currentId}`,
      method: 'post',
      data: resource,
    })
  }

  checkShortName(name) {
    return request({
      url: `/archive/check_short_name/${name.id}/${name.name}`,
      method: 'post',
    })
  }

  paste(resource) {
    return request({
      url: `/archive/paste_to/${resource.currentId}`,
      method: 'post',
      data: resource,
    })
  }

  exportFiles(payload) {
    return request({
      url: `/archive/download_files/${payload.archive_id}`,
      method: 'post',
      responseType: "blob",
    })
  }
}

export {Archive as default}
