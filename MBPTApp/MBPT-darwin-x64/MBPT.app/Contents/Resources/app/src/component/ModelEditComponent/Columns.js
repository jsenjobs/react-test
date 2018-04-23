import React, {Component} from 'react'
import { Table, Icon } from 'antd'

const columns = [{
    title: '字段名字',
    dataIndex: 'field',
    key: 'field',
  }, {
    title: '字段类型',
    dataIndex: 'type',
    key: 'type',
  }, {
    title: '是否为空',
    dataIndex: '_null',
    key: '_null',
  }, {
    title: '主键',
    dataIndex: '_key',
    key: '_key',
  }, {
    title: '默认值',
    dataIndex: '_default',
    key: '_default',
  }, {
    title: '更多信息',
    dataIndex: 'extra',
    key: 'extra',
  }]

export function ColumnsShow(props) {
    const {data} = props
    if(!data) return null
    let index = 1
    const ds = data.map(d => {
      return {
        ...d,
        _key: d.key,
        key: index ++
      }
    })
    return <Table pagination={false} size='small' columns={columns} dataSource={ds} />
}