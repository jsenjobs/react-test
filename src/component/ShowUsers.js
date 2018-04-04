import React, {Component} from 'react'
import Apis from '../Api/Apis'
import {Table} from 'antd'

function format(date, fmt)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

const columns = [
    {
        title:'ID', dataIndex:'id',key:'id',
        render: text => (<div>{text}</div>)
    },
    {
        title:'Name', dataIndex:'name',key:'names',
        render: text => (<a href='#'>{text}</a>)
    },
    {
        title:'Sex', dataIndex:'sex',key:'sex'
    },
    {
        title:'LastLogin', dataIndex:'lastlogin',key:'lastlogin'
    },
    {
        title:'Password', dataIndex:'password',key:'password'
    }
]
class ShowUsers extends Component {

    constructor(props) {
        super(props)
        this.state = {data: []}
    }



    componentDidMount() {
        fetch(Apis.account.listAll).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = json.data.map(d => {
                    return {
                        id:d.id,name:d.name,password:d.password,lastlogin:format(new Date(d.lastlogin), "yyyy-MM-dd hh:mm:ss"),sex:d.sex === 'nv' ? '女' : '男'
                    }
                })
                this.setState({data:data})
            } else {

            }
        })
    }
    render() {
        return (<Table dataSource={this.state.data} columns={columns} />)
    }
}

export default ShowUsers