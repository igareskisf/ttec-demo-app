import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { shallow, configure } from 'enzyme'
import App from './App'
import VanityNumbersList from './components/vanity-numbers-list/VanityNumbersList'

configure({ adapter: new Adapter() })

let wrapper = null
  
beforeEach(() => {
  wrapper = shallow(<App />)
})

describe('App Component', () => {
  it('renders correctly', () => {
    shallow(<App />)
  })

  it('should render the VanityNumbersList component', () => {
    expect(wrapper.find(VanityNumbersList)).toHaveLength(1)
  })
})