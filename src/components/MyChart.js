import React, { useState } from "react";
import Chart from "react-apexcharts";

function MyChart(props) {
  const [options, setOptions] = useState(props.options)
  const [series, setSeries] = useState(props.series)
  
    return (
      <div className="mixed-chart">
            <Chart
              options={options}
              series={series}
              type="line"
              width="500"
            />
          </div>
    );

  }

  export default MyChart
