import React, {Component} from 'react'

import go from 'gojs'

const $ = go.GraphObject.make


var nodeDataArray = [
    { key: 1, text: "Sentence", fill: "#f68c06", stroke: "#4d90fe" },
    { key: 2, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
    { key: 3, text: "DT", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
    { key: 4, text: "A", fill: "#f8f8f8", stroke: "#4d90fe", parent: 3 },
    { key: 5, text: "JJ", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
    { key: 6, text: "rare", fill: "#f8f8f8", stroke: "#4d90fe", parent: 5 },
    { key: 7, text: "JJ", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
    { key: 8, text: "black", fill: "#f8f8f8", stroke: "#4d90fe", parent: 7 },
    { key: 9, text: "NN", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
    { key: 10, text: "squirrel", fill: "#f8f8f8", stroke: "#4d90fe", parent: 9 },
    { key: 11, text: "VP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
    { key: 12, text: "VBZ", fill: "#ccc", stroke: "#4d90fe", parent: 11 },
    { key: 13, text: "has", fill: "#f8f8f8", stroke: "#4d90fe", parent: 12 },
    { key: 14, text: "VP", fill: "#f68c06", stroke: "#4d90fe", parent: 11 },
    { key: 15, text: "VBN", fill: "#ccc", stroke: "#4d90fe", parent: 14 },
    { key: 16, text: "become", fill: "#f8f8f8", stroke: "#4d90fe", parent: 15 },
    { key: 17, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 14 },
    { key: 18, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 17 },
    { key: 19, text: "DT", fill: "#ccc", stroke: "#4d90fe", parent: 18 },
    { key: 20, text: "a", fill: "#f8f8f8", stroke: "#4d90fe", parent: 19 },
    { key: 21, text: "JJ", fill: "#ccc", stroke: "#4d90fe", parent: 18 },
    { key: 22, text: "regular", fill: "#f8f8f8", stroke: "#4d90fe", parent: 21 },
    { key: 23, text: "NN", fill: "#ccc", stroke: "#4d90fe", parent: 18 },
    { key: 24, text: "visitor", fill: "#f8f8f8", stroke: "#4d90fe", parent: 23 },
    { key: 25, text: "PP", fill: "#f68c06", stroke: "#4d90fe", parent: 17 },
    { key: 26, text: "TO", fill: "#ccc", stroke: "#4d90fe", parent: 25 },
    { key: 27, text: "to", fill: "#f8f8f8", stroke: "#4d90fe", parent: 26 },
    { key: 28, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 25 },
    { key: 29, text: "DT", fill: "#ccc", stroke: "#4d90fe", parent: 28 },
    { key: 30, text: "a", fill: "#f8f8f8", stroke: "#4d90fe", parent: 29 },
    { key: 31, text: "JJ", fill: "#ccc", stroke: "#4d90fe", parent: 28 },
    { key: 32, text: "suburban", fill: "#f8f8f8", stroke: "#4d90fe", parent: 31 },
    { key: 33, text: "NN", fill: "#ccc", stroke: "#4d90fe", parent: 28 },
    { key: 34, text: "garden", fill: "#f8f8f8", stroke: "#4d90fe", parent: 33 },
    { key: 35, text: ".", fill: "#ccc", stroke: "#4d90fe", parent: 1 },
    { key: 36, text: ".", fill: "#f8f8f8", stroke: "#4d90fe", parent: 35 }
  ]
class Simple1 extends Component {

    constructor(props) {
        super(props)

        // this.renderCanvas = this.renderCanvas.bind (this);

        this.state = {myModel: null, myDiagram: null}
    }

    renderCanvas = () => {
        function FlatTreeLayout() {
            go.TreeLayout.call(this)
        }
        go.Diagram.inherit(FlatTreeLayout, go.TreeLayout)

        FlatTreeLayout.prototype.commitLayout = function() {
            go.TreeLayout.prototype.commitLayout.call(this)

            var y = - Infinity
            this.network.vertexes.each(function(v) {
                y = Math.max(y, v.node.position.y)
            })
            this.network.vertexes.each(function(v) {
                var node = v.node
                if(node.isTreeLeaf) {
                    node.position = new go.Point(node.position.x, y)
                }
            })
        }

        let model = $(go.TreeModel)
        let diagram = $(go.Diagram, this.goJsDiv, {
            allowCopy: false,
            allowDelete: false,
            allowMove: true,
            initialContentAlignment: go.Spot.Center,
            initialAutoScale: go.Diagram.Uniform,
            layout: $(FlatTreeLayout, {
                angle:90,compaction:go.TreeLayout.CompactionNone
            }),
            "undoManager.isEnabled": true
        })

        diagram.nodeTemplate = $(go.Node, "Vertical", {selectionObjectName: 'BODY'},

            $(go.Panel, { name: "BODY" },
            
                $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "fill"),
                new go.Binding("stroke", 'stroke')),

                $(go.TextBlock,
                    { font: "bold 20pt Arial, sans-serif", margin: new go.Margin(40, 20, 20, 20) },
                    new go.Binding("text", 'text'))

            ),

            $(go.Panel,  // this is underneath the "BODY"
            { height: 15, width:15 },  // always this height, even if the TreeExpanderButton is not visible
            $("TreeExpanderButton"))
        )

        diagram.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 1.5 }))

        this.setState({myModel: model, myDiagram: diagram},
        () => {
            model.nodeDataArray = this.props.data;
            diagram.model = model;
            this.setState({myModel: model, myDiagram: diagram});
        })
    }

    componentDidMount () {
        this.renderCanvas ();
    }

    componentWillUpdate (prevProps) {
        if (this.props.data !== prevProps.data) {
            console.log ('Updating');
            const model = this.state.myModel;
            const diagram = this.state.myDiagram;
            model.nodeDataArray = this.props.data;
            diagram.model = model;
            this.setState({myModel: model, myDiagram: diagram});
        }
    }

    render() {
        return (<div ref={div => this.goJsDiv = div} style={{'width': '100%', 'height': '800px', 'backgroundColor': '#DAE4E4'}} />)
    }
}

// Simple1.propTypes = {data:React.propTypes.string.isRequired}
Simple1.defaultProps = {data:nodeDataArray}
export default Simple1