import React, {Component} from 'react';
import './Trend.css';
import Chart from '../Chart';

class Trend extends Component { 

  constructor(){
    super();
    this.state = {
      stocks : [],
      currentStock : 1,
      currentUser : 2,
      gain : 0,
      userStocks : []

    }
  }
 
  componentDidMount() {
    fetch(`/api/user/${this.state.currentUser}`)
    .then(res => res.json())
    .then(data => {
      this.setState({stocks : data.stocks});
      this.setState({userStocks : data.userStocks});
      this.setState({gain : data.gain});
    });

  }

   updateStockId = (id) => {
      this.setState({
        currentStock : id.target.getAttribute('data-key')
      });
  }

  getCount = (stockId) => {
      const data = this.state.userStocks.find(us => us.stockId === stockId);
      return data ? data.count : 0;
  }

  getValue = (stockId) => {
      const data = this.state.userStocks.find(us => us.stockId === stockId);
      return data ? data.purchase_price : 0;
  }

  render() {
    return (
      <div>
        <div>
        <h2>Current User : Steve Smith</h2>
        <h2> Total profit : {this.state.gain}</h2>
        </div>
        <div>
        <table>
          <thead>
          <tr>
            <th>Stock Name</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
            {this.state.stocks.map(stock => 
              <tr key={stock.id} data-key={stock.id} onClick={this.updateStockId}> 
                <td>
                  {stock.company}
                </td>
                <td>
                  {stock.name}
                </td>
                <td>
                  {this.getCount(stock.id)}
                </td>
                <td>
                  {this.getValue(stock.id)}
                </td>
              </tr>
            )}
          </tbody>
          
        </table>
        </div>
        
        <Chart stockId={this.state.currentStock}/>
        
      </div>
    );
  
  }
}

export default Trend;
