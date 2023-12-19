import request from '@/utils/request'

export function getDepartment() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartment(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
