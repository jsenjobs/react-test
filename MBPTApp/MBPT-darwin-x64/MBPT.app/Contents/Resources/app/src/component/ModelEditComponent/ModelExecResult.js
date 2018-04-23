import React, {Component} from 'react'
import { Table, Icon, Row, Col } from 'antd'

import EditableText from '../public/EditableText'

function genColumns(item) {

}

class App extends Component {
    render() {
        const {execResult, conf} = this.props
        if(!conf) {
            return <div style={{paddingLeft:12}}>没有选中的模型</div>
        } else {
            if(conf.type === 'DataSource') {
                if(!execResult || execResult.length === 0) return <div style={{paddingLeft:12}}>没有可显示的执行数据</div>
                let first = execResult[0]
                let cs = []
                for(let key in first) {
                    cs.push({
                        title: key,
                        dataIndex: key,
                        key: key,
                    })
                }

                return <Table style={{paddingBottom:12}} pagination={false} size='small' columns={cs} dataSource={execResult} />
            } else {
                return <div style={{paddingLeft:12}}>
                暂不支持的模型类型
                </div>
    
            }

        }
    }
}

export default App