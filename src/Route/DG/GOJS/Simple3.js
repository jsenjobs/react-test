import React, {Component} from 'react'

import go from 'gojs'
const $ = go.GraphObject.make

const nodeDataArray = [
    {"key":0, "text":"Mind Map", "loc":"0 0"},
    {"key":1, "parent":0, "text":"Getting more time", "brush":"skyblue", "dir":"right", "loc":"77 -22"},
    {"key":11, "parent":1, "text":"Wake up early", "brush":"skyblue", "dir":"right", "loc":"200 -48"},
    {"key":12, "parent":1, "text":"Delegate", "brush":"skyblue", "dir":"right", "loc":"200 -22"},
    {"key":13, "parent":1, "text":"Simplify", "brush":"skyblue", "dir":"right", "loc":"200 4"},
    {"key":2, "parent":0, "text":"More effective use", "brush":"darkseagreen", "dir":"right", "loc":"77 43"},
    {"key":21, "parent":2, "text":"Planning", "brush":"darkseagreen", "dir":"right", "loc":"203 30"},
    {"key":211, "parent":21, "text":"Priorities", "brush":"darkseagreen", "dir":"right", "loc":"274 17"},
    {"key":212, "parent":21, "text":"Ways to focus", "brush":"darkseagreen", "dir":"right", "loc":"274 43"},
    {"key":22, "parent":2, "text":"Goals", "brush":"darkseagreen", "dir":"right", "loc":"203 56"},
    {"key":3, "parent":0, "text":"Time wasting", "brush":"palevioletred", "dir":"left", "loc":"-20 -31.75"},
    {"key":31, "parent":3, "text":"Too many meetings", "brush":"palevioletred", "dir":"left", "loc":"-117 -64.25"},
    {"key":32, "parent":3, "text":"Too much time spent on details", "brush":"palevioletred", "dir":"left", "loc":"-117 -25.25"},
    {"key":33, "parent":3, "text":"Message fatigue", "brush":"palevioletred", "dir":"left", "loc":"-117 0.75"},
    {"key":331, "parent":31, "text":"Check messages less", "brush":"palevioletred", "dir":"left", "loc":"-251 -77.25"},
    {"key":332, "parent":31, "text":"Message filters", "brush":"palevioletred", "dir":"left", "loc":"-251 -51.25"},
    {"key":4, "parent":0, "text":"Key issues", "brush":"coral", "dir":"left", "loc":"-20 52.75"},
    {"key":41, "parent":4, "text":"Methods", "brush":"coral", "dir":"left", "loc":"-103 26.75"},
    {"key":42, "parent":4, "text":"Deadlines", "brush":"coral", "dir":"left", "loc":"-103 52.75"},
    {"key":43, "parent":4, "text":"Checkpoints", "brush":"coral", "dir":"left", "loc":"-103 78.75"}
]
function spotConverter(dir, from) {
    if(dir === 'left') {
        return from ? go.Spot.Left : go.Spot.Right
    } else {
        return from ? go.Spot.Right : go.Spot.Left
    }
}

class Simple3 extends Component {

    componentDidMount() {
        this.graphInit()
    }
    render() {
        return (<div ref={div => this.goContainer = div} id='tttt' style={{border: 'solid 1px black',width:'100%' ,height:800}} > </div>)
    }

    graphInit = () => {
        var model = $(go.TreeModel)
        var diagram = $(go.Diagram, 'tttt', {
            padding:20,
            "commandHandler.copiesTree": true,
            "commandHandler.deletesTree": true,
            "draggingTool.dragsTree": true,
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": true
        })

        diagram.nodeTemlpate = $(go.Node, 'Vertical', 
        {selectionObjectName: 'TEXT'},
        $(go.TextBlock,
          {
            name: "TEXT",
            minSize: new go.Size(30, 15),
            editable: true
          },
          // remember not only the text string but the scale and the font in the node data
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("scale", "scale").makeTwoWay(),
          new go.Binding("font", "font").makeTwoWay()),
            $(go.Shape, "LineH",
            {
              stretch: go.GraphObject.Horizontal,
              strokeWidth: 3, height: 3,
              // this line shape is the port -- what links connect with
              portId: "", fromSpot: go.Spot.LeftRightSides, toSpot: go.Spot.LeftRightSides
            },
            new go.Binding("stroke", "brush"),
            // make sure links come in from the proper direction and go out appropriately
            new go.Binding("fromSpot", "dir", function(d) { return spotConverter(d, true); }),
            new go.Binding("toSpot", "dir", function(d) { return spotConverter(d, false); })),
            
            // remember the locations of each node in the node data
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // make sure text "grows" in the desired direction
            new go.Binding("locationSpot", "dir", function(d) { return spotConverter(d, false); })
        )
        diagram.linkTemplate = $(go.Link, {
            curve: go.Link.Bezier,
            fromShortLength: -2,
            toShortLength: -2,
            selectable: false
        } ,$(go.Shape, {strokeWidth:3}, new go.Binding('stroke', 'toNode', function(n) {
            if(n.data.brush) return n.data.brush
            return 'black'
        }).ofObject()))

        model.nodeDataArray = nodeDataArray

        diagram.model = model

    }


}

export default Simple3