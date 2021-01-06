import React, { Component } from 'react';
import Banking from 'banking'

const formatDate = (date) => {
    const year = date.slice(0, 4)
    const month = date.slice(4, 6)
    const day = date.slice(6, 8)

    return `${day}-${month}-${year}`
}

class App extends Component {



    showFile = async(e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async(e) => {
            const text = (e.target.result)

            Banking.parse(text, function(res) {
                let target = res.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN

                let transations = target
                console.log(transations)
                transations = transations.map(x => {
                    x.DTPOSTED = formatDate(x.DTPOSTED)
                    return x
                })
            });
        };
        reader.readAsText(e.target.files[0])
    }

    render = () => {

        return (<div>
      <input type="file" onChange={(e) => this.showFile(e)} />
    </div>)
    }
}

export default App;
