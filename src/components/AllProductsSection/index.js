import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const resultConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  no_response: 'NO_RESPONSE',
  in_progress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryId: '',
    ratingId: '',
    result: resultConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      result: resultConstants.in_progress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchInput, categoryId, ratingId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${categoryId}&rating=${ratingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      console.log(updatedData)
      console.log(updatedData.length)
      if (updatedData.length !== 0) {
        this.setState({
          productsList: updatedData,
          result: resultConstants.success,
        })
      } else {
        this.setState({
          result: resultConstants.no_response,
        })
      }
    } else {
      this.setState({
        result: resultConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeSearchField = searchInput => {
    this.setState({
      searchInput,
    })
  }

  onClickButtonField = () => {
    this.getProducts()
  }

  onCategoryButtonClick = categoryId => {
    this.setState(
      {
        categoryId,
      },
      this.getProducts,
    )
  }

  onRatingButtonClick = ratingId => {
    this.setState(
      {
        ratingId,
      },
      this.getProducts,
    )
  }

  onClearButtonClick = () => {
    this.setState(
      {
        categoryId: '',
        ratingId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderNoResponseView = () => (
    <div className="failure-container">
      <h1>No Products Found</h1>
      <p>We could not find any products. Try other filters.Clear Filters</p>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products "
        className="failure-image"
      />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
    </div>
  )

  render() {
    const {result, searchInput} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          onChangeSearchField={this.onChangeSearchField}
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          onCategoryButtonClick={this.onCategoryButtonClick}
          onRatingButtonClick={this.onRatingButtonClick}
          onClearButtonClick={this.onClearButtonClick}
          onClickButtonField={this.onClickButtonField}
          searchInput={searchInput}
        />
        {(() => {
          switch (result) {
            case resultConstants.success:
              return this.renderProductsList()
            case resultConstants.failure:
              return this.renderFailureView()
            case resultConstants.in_progress:
              return this.renderLoader()
            case resultConstants.no_response:
              return this.renderNoResponseView()
            default:
              return null
          }
        })()}
      </div>
    )
  }
}

export default AllProductsSection
