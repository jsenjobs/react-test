import React, {Component} from 'react'
import './SelfCal.css'
import ModeAggregationForm from './part/ModeAggregation'
import AddColumnsForm from './part/AddColumns'
import TransForm from './part/Trans'
import LeftJoin from './part/LeftJoin'
import DistinctUnion from './part/DistinctUnion'
import './Agg.less'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader} from 'antd'
import unionAll from './svg/unionAll.svg'
import {listColumnInfoByTableName} from '../../Redux/PromiseTask/TableColumnInfo'
import {connect} from 'react-redux'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select


class App extends Component {
    state = {
        ColumnSelect:true,
        RightColumnSelect:true,
        DisableSelect:false,
        ShowSelect:true,
        selected: 0
    }
    render() {
        const { visible, onCancel, onCreate, triggerSourceConf, triggerTargetConf, httpData_TableColumnInfo, listColumnInfoByTableName } = this.props
        let dbColumns1 = []
        let dbColumns2 = []
        if(triggerSourceConf) {
            dbColumns1 = httpData_TableColumnInfo[triggerSourceConf._workConf.tableName]
        }
        if(triggerTargetConf) {
            dbColumns2 = httpData_TableColumnInfo[triggerTargetConf._workConf.tableName]
        }

        let columns1 = []
        let columns2 = []
        if(dbColumns1) {
            columns1 = dbColumns1.map(dc => dc.field)
        }
        if(dbColumns2) {
            columns2 = dbColumns2.map(dc => dc.field)
        }
        

        let type = 'AggJoin'
        if(this.state.selected === 1) {
            type='LeftJoin'
        } else if(this.state.selected === 2) {
            type='FullJoin'
        } else if(this.state.selected === 3) {
            type='LeftExclude'
        } else if(this.state.selected === 4) {
            type='DistinctUnion'
        } else if(this.state.selected === 5) {
            type='Union'
        }
        return (<Modal className='agg-modal' title="关联设置" visible={visible}
            onOk={onCreate} onCancel={onCancel}
            footer={null}
        >
        <Row >
            <Col span={8} onClick={this.onItemClick.bind(this, 0, true, true, true, false)} className={this.state.selected === 0 ? 'item-selected':''} style={{textAlign:'center'}}>
            内连接
            </Col>
            <Col span={8} onClick={this.onItemClick.bind(this, 1, true, true, true, false)} className={this.state.selected === 1 ? 'item-selected':''} style={{textAlign:'center'}}>
            左连接</Col>
            <Col span={8} onClick={this.onItemClick.bind(this, 2, true, true, true, false)} className={this.state.selected === 2 ? 'item-selected':''} style={{textAlign:'center'}}>
            全连接</Col>
        </Row><Row>
            <Col span={8} onClick={this.onItemClick.bind(this, 3, true, false, true, true)} className={this.state.selected === 3 ? 'item-selected':''} style={{textAlign:'center'}}>
            左排除</Col>
            <Col span={8} onClick={this.onItemClick.bind(this, 4, false, false, false, false)} className={this.state.selected === 4 ? 'item-selected':''} style={{textAlign:'center'}}>
            去重合并</Col>
            <Col span={8} onClick={this.onItemClick.bind(this, 5, false, false, false, false)} className={this.state.selected === 5 ? 'item-selected':''} style={{textAlign:'center'}}>
            全部合并</Col>
        </Row>
        
        <div className='content'>
            <LeftJoin ColumnSelect={this.state.ColumnSelect} 
                RightColumnSelect={this.state.RightColumnSelect} 
                DisableSelect={this.state.DisableSelect} 
                ShowSelect={this.state.ShowSelect}
                columns1={columns1}
                columns2={columns2}
                type={type}
                />
        </div>
        </Modal>)
    }

    onItemClick = (i, col, rcol, a, b) => {

        this.setState({
            ColumnSelect: col,
            RightColumnSelect: rcol,
            ShowSelect:a,
            DisableSelect:b,
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
        listColumnInfoByTableName: (tableName, force = false) => dispatch(listColumnInfoByTableName(dispatch, tableName, force))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App) 
