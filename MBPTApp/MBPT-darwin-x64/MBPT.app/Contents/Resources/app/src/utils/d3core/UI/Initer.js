import {getTransformXY} from './Utils'
import {setLinks, setDatas, setUnionDatas, getDatas} from '../ModelConf'


var d3 = require('d3')

let containerW = 0,containerH = 0
export function initEvent(target, outContainer, oW=0, oH=0) {
    let svg = d3.select(".work-bench")

    // 如果不是refresh 则不会调用onload[单页应用]
    containerH = outContainer.offsetHeight
    containerW = outContainer.offsetWidth
    if(parseFloat(svg.attr('width')) < containerW) {
        if(oW > containerW) {
            svg.attr('width', oW)
        } else {
            svg.attr('width', containerW)
        }
    }
    if(parseFloat(svg.attr('height')) < containerH) {
        if(oH > containerH) {
            svg.attr('width', oH)
        } else {
            svg.attr('height', containerH)
        }
    }
    console.error(target.domResizeLine)
    let initResizeLine = () => {
        target.domResizeLine.onmouseenter = e => {
            target.setState({rightLineWidth:12})
        }
        target.domResizeLine.onmouseout = e => {
            target.setState({rightLineWidth:4})
        }
        target.domResizeLine.onmousedown = e => {
            let startX = e.clientX
            let originWidth = target.state.defaultAttrPanelWidth
            let editorWidth = target.domOutContainer.offsetWidth
            target.domResizeLine.onmouseout = null
            
            document.onmousemove = e => {
                let w = originWidth + (startX - e.clientX)
                if(w > 4 && w < 800) {
                    target.setState({
                        defaultAttrPanelWidth: w,
                        defaultEditorPanelWidth: 'calc(100% - ' + w + 'px)',
                    })
                    // window.onresize()
                }
            }
            document.onmouseup = e => {
                document.onmousemove = null
                document.onmouseup = null
                let w = originWidth + (startX - e.clientX)
                if(w < 250) {
                    w = 4
                    target.setState({
                        defaultAttrPanelWidth: w,
                        defaultEditorPanelWidth: 'calc(100% - ' + w + 'px)',
                    })
                }
                window.onresize()
                target.setState({rightLineWidth:4})
                target.domResizeLine.onmouseout = e => {
                    target.setState({rightLineWidth:4})
                }
            }
        }
        target.domResizeLineLeft.onmouseenter = e => {
            target.setState({leftLineWidth:12})
        }
        target.domResizeLineLeft.onmouseout = e => {
            target.setState({leftLineWidth:4})
        }
        target.domResizeLineLeft.onmousedown = e => {
            let startX = e.clientX
            let originWidth = target.state.defaultTreePanelWidth
            target.domResizeLineLeft.onmouseout = null
            document.onmousemove = e => {
                let w = originWidth - (startX - e.clientX)
                if(w > 4 && w < 400) {
                    target.setState({
                        defaultTreePanelWidth: w,
                    })
                    // window.onresize()
                }
            }
            document.onmouseup = e => {
                document.onmousemove = null
                document.onmouseup = null
                let w = originWidth - (startX - e.clientX)
                if(w < 150) {
                    w = 4
                    target.setState({
                        defaultTreePanelWidth: w,
                    })
                }
                window.onresize()
                target.setState({leftLineWidth:4})
                target.domResizeLineLeft.onmouseout = e => {
                    target.setState({leftLineWidth:4})
                }
            }
        }
    }
    initResizeLine()
    
    window.onload = _ => {
        containerH = outContainer.offsetHeight
        containerW = outContainer.offsetWidth
        if(oW > containerW) {
            svg.attr('width', oW)
        } else {
            svg.attr('width', containerW)
        }
        if(oH > containerH) {
            svg.attr('width', oH)
        } else {
            svg.attr('height', containerH)
        }

        initResizeLine()
    }
    window.onresize = _ => {
        containerH = outContainer.offsetHeight
        containerW = outContainer.offsetWidth
        console.log(containerW)
        target.setState({
            defaultEditorPanelWidth: 'calc(100% - ' + target.state.defaultAttrPanelWidth + 'px)',
        })

        let cc = getTransformXY(svg)
        if(parseFloat(svg.attr('width')) + cc.x < containerW) {
            svg.attr('width', containerW - cc.x)
        }
        if(parseFloat(svg.attr('height')) + cc.y < containerH) {
            svg.attr('height', containerH - cc.y)
        }
    }

    function dragStart() {
        target.setState({WorkMove:true})
        containerH = outContainer.offsetHeight
        containerW = outContainer.offsetWidth
    }
    function drag() {
        mouse(d3.event.dx, d3.event.dy)
    }

    var canWheel = false
    target.domOutContainer.onmouseover = _ => {
        canWheel = true
    }
    target.domOutContainer.onmouseout = _ => {
        canWheel = false
    }
    document.body.onmousewheel = function(event) {
        if(!canWheel) return
        event = event || window.event;
        mouse(0, 2 * event.detail)
    }
    document.body.addEventListener("DOMMouseScroll", function(event) {
        if(!canWheel) return
        mouse(0, 2 * event.detail)
    })

    function mouse(dx, dy) {

        let tran = svg.attr('transform')
        let w = parseFloat(svg.attr('width')) 
        let h = parseFloat(svg.attr('height'))
        let x=0,y=0
        if(tran) {
            tran = tran.split(/,|\(|\)/)
            x = parseFloat(tran[1]) + dx
            y = parseFloat(tran[2]) + dy
        } else {
            x = dx
            y = dy
        }
        if(x > 0) x = 0
        if(y > 0) y = 0
        if(-x + containerW > w) {
            x = containerW - w
        }
        if(-y + containerH > h) {
            y = containerH - h
        }
        svg.attr('transform', 'translate(' + x + ',' + y + ')')
    }
    function dragEnd() {
        target.setState({WorkMove:false})
    }
    svg
    .call(d3.drag()
        .on('start', dragStart)
        .on('drag', drag)
        .on('end', dragEnd)
    )

}

export function initDatas(target, data) {
    let svg = d3.select(".work-bench")
    let conf = data.modelData
    setDatas(conf.datas)
    setUnionDatas(conf.unionDatas)
    setLinks(conf.links)
    target.setState({
        currentFileName: data.name,
        intro:data.intro,
        isEdited:false,
        lastSaveTime:new Date().toLocaleDateString(),
        currentModelId: data.id,
        defaultAttrPanelWidth: conf.defaultAttrPanelWidth,
        defaultEditorPanelWidth: conf.defaultEditorPanelWidth,
        defaultTreePanelWidth: conf.defaultTreePanelWidth,
        tableFilters: conf.tableFilters,
        lastSaveTime: conf.lastSaveTime,
    })
    if(conf.transform) {
        svg.attr('transform', conf.transform)
    }
    target.renderD3()
}
