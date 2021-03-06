import React, { useState, useEffect } from 'react';
import Banking from 'banking'
import MyChart from './components/MyChart'

function TransItem({ data }) {
    return (
        <div>
            <p>Data: {data.DTPOSTED}</p>
            <p>Valor: {data.TRNAMT}</p>
            <p>Tipo: {data.TRNTYPE}</p>
            <p>Descrição: {data.MEMO}</p>
        </div>
    )
}

function App() {
    const [showChart, setShowChart] = useState(false)
    const [toChartOptions, setToChartOptions] = useState()
    const [toChartSeries, setTochartSeries] = useState()

    const [transactions, setTransactions] = useState([])

    const formatDate = (date) => {
        const year = date.slice(0, 4)
        const month = date.slice(4, 6)
        const day = date.slice(6, 8)

        return `${day}-${month}-${year}`
    }

    function justUnique(array) {

        let newArray = []

        for (let i = 0; i < array.length; i++) {
            let exists = true
            for (let j = 0; j <= newArray.length; j++) {
                if (array[i] == newArray[j]) {
                    exists = false
                    break
                }
            }
            if (exists) newArray.push(array[i])
        }

        return (newArray)
    }

    const showFile = async(e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async(e) => {
            const text = (e.target.result)

            Banking.parse(text, function(res) {
                // loading transactions
                let tempTransactions = res.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
                //formating dates
                tempTransactions = tempTransactions.map(x => {

                    x.DTPOSTED = formatDate(x.DTPOSTED)
                    return x
                })

                setTransactions(tempTransactions)

                // loading dates: data sctructure to populate chart
                let dates = tempTransactions.map(x => x.DTPOSTED)
                dates = justUnique(dates)
                dates = dates.map(x => {
                    return {
                        date: x,
                        series: []
                    }
                })

                let tempCategories = dates.map(x => x.date)

                //-setting chart options
                setToChartOptions({
                    chart: {
                        id: "basic-bar"
                    },
                    xaxis: {
                        categories: tempCategories
                    }
                })

                //loading types: series
                let types = tempTransactions.map(x => x.TRNTYPE)
                types = justUnique(types)

                for (let i = 0; i < types.length; i++) {
                    for (let j = 0; j < dates.length; j++) {
                        dates[j].series.push({
                            name: types[i],
                            data: []
                        })
                    }
                }
                console.log(dates)
                // itera cada transação
                for (let singleTransaction of tempTransactions) {
                    // identifica a data da transação
                    for (let datesX = 0; datesX < dates.length; datesX++) {
                        if (dates[datesX].date == singleTransaction.DTPOSTED) {
                            // identifica tipo
                            for (let seriesX = 0; seriesX < dates[datesX].series.length; seriesX++) {
                                if (dates[datesX].series[seriesX].name == singleTransaction.TRNTYPE) {
                                    dates[datesX].series[seriesX].data.push(Number(singleTransaction.TRNAMT))
                                }
                            }
                        }
                    }
                }
                //-setting chart series
                let series = []

                for (let type of types) {
                    series.push({
                        name: type,
                        data: []
                    })
                }


                for (let serieType of series) {
                    for (let day of dates) {
                        for (let x of day.series) {
                            if (serieType.name == x.name) {
                                let temp = 0
                                for (let i = 0; i < x.data.length; i++) {
                                    if (x.data[i] != undefined && x.data[i] != null) {
                                        temp += x.data[i]
                                    }
                                }
                                serieType.data.push(temp.toFixed(2) < 0 ? temp.toFixed(2) *-1:temp.toFixed(2))
                            }

                        }
                    }
                }
                console.log(series)
                setTochartSeries(series)

            });
        }

        reader.readAsText(e.target.files[0])
    }

    return (
        <div>
            <input type="file" onChange={showFile} />
            { toChartOptions && toChartSeries ? <MyChart options={toChartOptions} series={toChartSeries}/> : ''}
            {transactions.map(x => <TransItem key={x.FITID} data={x}/>)}
        </div>
    )

}
export default App;
