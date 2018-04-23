const Base = {
    type: 'base',
    width: 150,
    height: 60,
    rx:10,ry:10,
    color:'#000000',
    dColor:'#000000',
    padding:4,
    r:6
}


const DataSource = {
    ...Base,
    color:'#3E90EC',
    dColor:'#2A5F9B',
    type: 'DataSource',
}

const Calc = {
    ...Base,
    color:'#78bf69',
    dColor:'#589f49',
    type: 'Calc',
}

const Union = {
    ...Base,
    color:'yellow',
    dColor:'#ef7224',
    type: 'Union',
    r:0,
    outR:30,
    width:60,
    height:60,
}

// exports.DataSource = DataSource
// exports.Calc = Calc

export default {Calc, DataSource, Union}
