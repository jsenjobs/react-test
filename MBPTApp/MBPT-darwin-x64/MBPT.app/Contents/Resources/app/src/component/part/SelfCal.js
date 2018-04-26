import React, {Component} from 'react'
import './SelfCal.css'
import ModeAggregationForm from './part/ModeAggregation'
import AddColumnsForm from './part/AddColumns'
import TransForm from './part/Trans'
import ChangeColumnForm from './part/ChangeColumn'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader} from 'antd'
import {listColumnInfoByTableName} from '../../Redux/PromiseTask/TableColumnInfo'
import {connect} from 'react-redux'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select

// 自运算 modal 页面
class App extends Component {
    state = {
        selected: 0,
    }
    componentDidMount() {
        let props = this.props
        this.setState({visible:props.visible})
    }
    render() {
        const { visible, onCreate, onCancel, currentSelectedNode, currentSelectedNodeConf,  httpData_TableColumnInfo } = this.props;
        let dbColumns = httpData_TableColumnInfo[currentSelectedNode]
        let columns = []
        if(dbColumns) {
            columns = dbColumns.map(dc => dc.field)
        }
        columns.splice(0, 0, '*')

        if(currentSelectedNodeConf && currentSelectedNodeConf._workConf) {
            let s
            if(this.state.selected === 1) {
                s = (<AddColumnsForm  visible={visible}/>)
            } else if(this.state.selected === 2) {
                s = (<TransForm />)
            } else if(this.state.selected === 3) {
                s = (<ChangeColumnForm dbColumns={dbColumns} />)
            } else {
                s = (<ModeAggregationForm visible={visible} columns={columns} />)
            }
            return (<Modal className={['sel-cal-modal']} title="自运算" visible={visible}
                onOk={onCreate} onCancel={onCancel}
                footer={null}
            >
            <Row >
                <Col span={6} onClick={this.onItemClick.bind(this, 0)} className={this.state.selected === 0 ? 'item-selected':''} style={{textAlign:'center'}}>数据聚合</Col>
                <Col span={6} onClick={this.onItemClick.bind(this, 1)} className={this.state.selected === 1 ? 'item-selected':''} style={{textAlign:'center'}}>新增字段</Col>
                <Col span={6} onClick={this.onItemClick.bind(this, 2)} className={this.state.selected === 2 ? 'item-selected':''} style={{textAlign:'center'}}>行列转换</Col>
                <Col span={6} onClick={this.onItemClick.bind(this, 3)} className={this.state.selected === 3 ? 'item-selected':''} style={{textAlign:'center'}}>修改字段名</Col>
            </Row>
            <div className={['content']}>
            {s}
            </div>
            </Modal>)

        } else {
            return <Modal className={['sel-cal-modal']} title="自运算" visible={visible}
            onCancel={onCancel}
            footer={null}
        ><p>无法获取数据</p></Modal>
        }
    }

    onItemClick = (i) => {
        this.setState({
            selected:i
        })
    }
}
function mapStateToProps(state) {
    return {
        httpData_TableColumnInfo: state.httpData_TableColumnInfo,
    }
  }
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App) 
