import React, {Component} from 'react';
import {Line as LineChart} from 'react-chartjs-2';

const options = {
    scaleShowGridLines: true,
    scaleGridLineColor: 'rgba(0,128,0,.0)',
    scaleGridLineWidth: 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    bezierCurve: true,
    bezierCurveTension: 0.4,
    pointDot: true,
    pointDotRadius: 4,
    pointDotStrokeWidth: 1,
    pointHitDetectionRadius: 20,
    datasetStroke: true,
    datasetStrokeWidth: 2,
    datasetFill: true,
  };

class Chart extends Component {

    componentDidMount() {
       
        fetch(`/api/stock/${this.props.stockId}`)
        .then(res => res.json())
        .then(prices => {
            const numbers = prices.map(p => p.price); 
            const datasetsCopy = this.state.data.datasets.slice(0);
            datasetsCopy[0].data = numbers;
        
            this.setState({
                data: Object.assign({}, this.state.data, {
                    datasets: datasetsCopy
                })
            });

        this.setState( { data : {
            ...this.state.data,
            labels : prices.map(p => p.timestamp)
            }
        });
    });
}
      

    constructor(props){
        super(props);
        this.state = { 
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Stock Trend Chart',
                    data: [],
                    borderWidth: 1
                }]
            }
        }
     } 



    render() { 
        return (  
            <div className="chart">
                  <LineChart data={this.state.data}
                    options={options}
                     width={200}
                     height={40} />
            </div>

        );
    }
}
 
export default Chart;