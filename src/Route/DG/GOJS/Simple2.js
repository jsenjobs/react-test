import React, {Component} from 'react'

import go from 'gojs'

const $ = go.GraphObject.make

class Simple2 extends Component {

    componentDidMount() {
        this.goRender()
    }

    goRender = () => {
        var diagram = $(go.Diagram, 'myDiagramDiv', {}) // new go.Diagram("myDiagramDiv");
        diagram.model = new go.GraphLinksModel(
        [{ key: "Hello" },   // two node data, in an Array
        { key: "World!" }],
        [{ from: "Hello", to: "World!"}]  // one link, in an Array
        );
    }

    render() {
        return (<div id="myDiagramDiv" style={{border: 'solid 1px black',width:'100%' ,height:800}}></div>)
    }
}

export default Simple2