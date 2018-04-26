import {getTransformXY} from './Utils'
import {setLinks, setDatas, setUnionDatas, getDatas} from '../ModelConf'
import {clearSelect} from '../Change/AttributeUpdate'


var d3 = require('d3')

// 将svg铺满 workbench， 尽管可能会有些模型不在内部， 但保证了界面铺满，在加载用户已有的编辑模型时，会加载其宽度，重新调整，以把所有模型都显示在svg内部
// holdWidth holdHeight表示从服务器的到的配置文件里，工作区的大小，如果比这里默认计算出来的大，则应该用此参数
function expandSvgToFullWorkBench(svg, outContainer, defaultAttrPanelWidth, holdWidth, holdHeight) {
    let cc = getTransformXY(svg)
    let containerH = outContainer.clientHeight - cc.y
    let containerW = outContainer.clientWidth - cc.x + defaultAttrPanelWidth
    if(containerW < holdWidth) containerW = holdWidth
    if(containerH < holdHeight) containerH = holdHeight
    svg.attr('width', containerW)
    svg.attr('height', containerH)
}
let containerW = 0,containerH = 0
export function initEvent(target, outContainer, oW=0, oH=0) {
    let svg = d3.select(".work-bench")

    let initResizeLine = () => {
        target.domResizeLine.onmouseenter = e => {
            target.setState({isRightTogglet:true})
            
        }
        target.domResizeLine.onmouseout = e => {
            target.setState({isRightTogglet:false})
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
                target.setState({isRightTogglet:false})
                target.domResizeLine.onmouseout = e => {
                    target.setState({isRightTogglet:false})
                }
            }
        }



        target.domResizeLineLeft.onmouseenter = e => {
            target.setState({isLeftTogglet:true})
        }
        target.domResizeLineLeft.onmouseout = e => {
            target.setState({isLeftTogglet:false})
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
                target.setState({isLeftTogglet:false})
                target.domResizeLineLeft.onmouseout = e => {
                    target.setState({isLeftTogglet:false})
                }
            }
        }
    }

    
    window.onload = _ => {
        expandSvgToFullWorkBench(svg, outContainer, target.state.defaultAttrPanelWidth)
        initResizeLine()
    }
    // 如果不是refresh 则不会调用onload[单页应用]
    window.onload()
    
    window.onresize = _ => {
        containerH = outContainer.offsetHeight
        containerW = outContainer.offsetWidth
        // target.setState({
        //     defaultEditorPanelWidth: 'calc(100% - ' + target.state.defaultAttrPanelWidth + 'px)',
        // })

        let cc = getTransformXY(svg)
        if(parseFloat(svg.attr('width')) + cc.x < containerW) {
            svg.attr('width', containerW - cc.x)
        }
        if(parseFloat(svg.attr('height')) + cc.y < containerH) {
            svg.attr('height', containerH - cc.y)
        }
    }

    function mouseWheel(event) {
        mouse(0, 2 * event.detail)
    }
    target.domOutContainer.onmouseover = _ => {
        containerH = outContainer.clientHeight
        containerW = outContainer.clientWidth
        document.body.addEventListener("DOMMouseScroll", mouseWheel)
        document.body.addEventListener.onmousewheel = mouseWheel
    }
    target.domOutContainer.onmouseout = _ => {
        document.body.removeEventListener('DOMMouseScroll', mouseWheel)
        document.body.addEventListener.onmousewheel = null
    }

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

    let isMove = false
    function dragStart() {
        target.setState({WorkMove:true})
        containerH = outContainer.offsetHeight
        containerW = outContainer.offsetWidth
        isMove = false
    }
    function drag() {
        mouse(d3.event.dx, d3.event.dy)
        isMove = true
    }
    function dragEnd() {
        let isEdited = target.state.isEdited
        if(isMove) {
            isEdited = true
        } else {
            clearSelect(target)
        }
        target.setState({WorkMove:false, isEdited})
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
        currentModelId: data.id,
        defaultAttrPanelWidth: conf.defaultAttrPanelWidth,
        defaultEditorPanelWidth: conf.defaultEditorPanelWidth,
        defaultTreePanelWidth: conf.defaultTreePanelWidth,
        tableFilters: conf.tableFilters,
        lastSaveTime: conf.lastSaveTime,
    })
    svg.attr('transform', conf.transform)
    setTimeout(_ => {
        expandSvgToFullWorkBench(svg, target.domOutContainer, conf.defaultAttrPanelWidth, parseFloat(conf.width), parseFloat(conf.height))
    }, 0)
    target.renderD3()
}

export function resetDatas(target) {
    let svg = d3.select(".work-bench")
    setDatas([])
    setUnionDatas([])
    setLinks([])
    target.setState({
        // conf
        currentFileName:'未命名',
        intro:'',
        lastSaveTime:new Date().toLocaleString(),
        isEdited:false,

        // ui
        defaultAttrPanelWidth: 360,
        defaultEditorPanelWidth: 'calc(100% - 360px)',
        defaultTreePanelWidth: 300,

        currentModelId:-1, // 当前编辑模型的ID，数据库中

        currentSelectedNode:null, // 当前点击选中的节点
        currentSelectedNodeConf:null, // 当前点击选中的节点
        // attr 面板
        tableFilters:{}, // 保存对table的Filer设置
        attrActivePanel: ['1','2','3','4'],
        execResult:{}, //保存从服务器返回的执行结果
    })
    svg.attr('transform', 'translate(0,0)')
    setTimeout(_ => {
        expandSvgToFullWorkBench(svg, target.domOutContainer, 360, 0, 0)
    }, 0)
    target.renderD3()
}