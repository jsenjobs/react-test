import React, {Component} from 'react'
import {Card, Row, Col, Popover} from 'antd'
import './ModelShare.css'

const data = [
    {
        name:'模型1', intro:'Card content Card content Card content Card content Card content Card content Card content Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型2', intro:'Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型3', intro:'Card content'
    },
    {
        name:'模型1', intro:'Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型2', intro:'Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型3', intro:'Card content'
    },
    {
        name:'模型1', intro:'Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型2', intro:'Card contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard contentCard content'
    },
    {
        name:'模型3', intro:'Card content'
    },
]

function Cards(props) {
    let {data} = props


    let i = 0
    let pc = 'bottom'
    let n = data.map(d => {
        if(i++ <= 4) {
            pc = 'bottom'
        } else {
            pc = 'top'
        }
        return <Popover title='介绍' placement={pc} content={<div style={{ width: 300}}>{d.intro}</div>}>
            <Col style={{marginBottom:'20px'}} span={4}>
                <Card title={d.name} className=''>
                    <p  style={{ overflow:'hidden' }}>{d.intro}</p>
                </Card>
            </Col>
        </Popover>
    })
    let need = 5 - n.length % 5
    for(let i = 0; i < need; i++) {
        n.push(<Col style={{marginBottom:'20px'}} span={4}></Col>)
    }
    let group = []
    for(let j = 0; j < n.length; j+=5) {
        if(j + 4 < n.length) {
            group.push(<Row  type="flex" justify="space-around" align="middle" gutter={16}>{n[j]}{n[j+1]}{n[j+2]}{n[j+3]}{n[j+4]}</Row>)
        }
    }

    return <div>{group}</div>
}

class ModelShare extends Component {
    render() {
        return (<div id='model-share-container'>
            <Cards data={data} />
      </div>)
    }
}

export default ModelShare