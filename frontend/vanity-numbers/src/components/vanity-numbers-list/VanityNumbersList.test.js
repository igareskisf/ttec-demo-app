import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { shallow, configure } from 'enzyme'
import VanityNumbersList from './VanityNumbersList'

configure({ adapter: new Adapter() })

let wrapper = null
  
beforeEach(() => {
  wrapper = shallow(<VanityNumbersList />)
})

describe('VanityNumbersList Component', () => {
  it('renders correctly', () => {
    shallow(<VanityNumbersList />)
  })

  it('should render one h3 element', () => {
    const element = wrapper.find('h3')
    expect(element).toHaveLength(1)
    
    const text = element.text()
    expect(text).toEqual('React - Vanity numbers of the last 5 callers')
  })

  it('should render one table element', () => {
    wrapper.setState({
      isLoading: false,
      vanityNumbers: [
        {
          'customer-number': '+38976111111',
          'vanity-numbers': ['+3897611ABCD', '+3897611EFGH', '+3897611IJKL', '+3897611MNOP', '+3897611QRST' ]
        },
        {
          'customer-number': '+38976222222',
          'vanity-numbers': ['+3897622ABCD', '+3897622EFGH', '+3897622IJKL', '+3897622MNOP', '+3897622QRST' ]
        },
        {
          'customer-number': '+38976333333',
          'vanity-numbers': ['+3897633ABCD', '+3897633EFGH', '+3897633IJKL', '+3897633MNOP', '+3897633QRST' ]
        },
        {
          'customer-number': '+38976444444',
          'vanity-numbers': ['+3897644ABCD', '+3897644EFGH', '+3897644IJKL', '+3897644MNOP', '+3897644QRST' ]
        },
        {
          'customer-number': '+38976555555',
          'vanity-numbers': ['+3897655ABCD', '+3897655EFGH', '+3897655IJKL', '+3897655MNOP', '+3897655QRST' ]
        }
      ]
    })

    const table = wrapper.find('table')
    expect(table).toHaveLength(1)

    const row = table.find('tr')
    expect(row).toHaveLength(6)

    const tableHead = table.find('th')
    expect(tableHead).toHaveLength(2)
  })

  it('should render one empty table element when no data', () => {
    wrapper.setState({
      isLoading: false
    })

    const table = wrapper.find('table')
    expect(table).toHaveLength(1)

    const row = table.find('tr')
    expect(row).toHaveLength(1)

    const tableHead = table.find('th')
    expect(tableHead).toHaveLength(2)
  })

  it('should render one empty table element on load', () => {
    wrapper.setState({
      isLoading: true
    })

    const table = wrapper.find('table')
    expect(table).toHaveLength(1)

    const row = table.find('tr')
    expect(row).toHaveLength(2)

    const tableHead = table.find('th')
    expect(tableHead).toHaveLength(2)
  })
})