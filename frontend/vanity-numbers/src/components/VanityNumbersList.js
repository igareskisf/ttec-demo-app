import React from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'

export default class vanityNumberList extends React.Component {
    state = {
        vanityNumbers: [],
        isLoading: true
    }

    endpoint = process.env.REACT_APP_ENDPOINT || 'http://localhost:3000/vanity-numbers'

    componentDidMount() {
        // Get the vanity numbers from the last 5 callers from the API Gateway endpoint
        axios.get(this.endpoint)
        .then(response => {
            const vanityNumbers = response.data
            this.setState({ vanityNumbers })
            // Hide the spinner
            this.setState({isLoading: false})
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <div className="container">
                <h3 className="p-3 text-center">React - Vanity numbers of the last 5 callers</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Customer Number</th>
                            <th>Vanity Numbers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.isLoading ? 
                            <tr>
                                <td colSpan={2}>Loading data...</td>
                            </tr> 
                            : 
                            this.state.vanityNumbers && this.state.vanityNumbers.map(item =>
                                <tr key={item['customer-number']}>
                                    <td><strong>{item['customer-number']}</strong></td>
                                    <td>
                                    <ul>
                                        {item['vanity-numbers'].map(number => 
                                        <li key={number} className="text-success">{number}</li>
                                        )}
                                    </ul>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}