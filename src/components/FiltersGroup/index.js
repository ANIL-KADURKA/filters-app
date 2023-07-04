import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    searchInput,
    onChangeSearchField,
    onClickButtonField,
    onCategoryButtonClick,
    onRatingButtonClick,
    onClearButtonClick,
  } = props
  console.log(searchInput)

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      onClickButtonField()
    }
  }

  const onChangeSearchInputField = event => {
    onChangeSearchField(event.target.value)
  }

  const onCategoryButton = categoryId => {
    onCategoryButtonClick(categoryId)
  }

  const onRatingButton = ratingId => {
    onRatingButtonClick(ratingId)
  }

  const onClearButton = () => {
    onClearButtonClick()
  }

  return (
    <div className="filters-group-container">
      <div>
        <input
          type="search"
          className="search-input"
          value={searchInput}
          placeholder="Search"
          onKeyPress={handleKeyPress}
          onChange={onChangeSearchInputField}
        />
      </div>
      <h1 className="category-heading">Category</h1>
      <>
        {categoryOptions &&
          categoryOptions.map(each => (
            <li key={each.categoryId} className="li-element-op">
              <button
                type="button"
                className="category-button-element"
                onClick={() => onCategoryButton(each.categoryId)}
              >
                <p>{each.name}</p>
              </button>
            </li>
          ))}
      </>
      <h1 className="category-heading">Rating</h1>
      <>
        {ratingsList &&
          ratingsList.map(each => (
            <li className="r-flex" key={each.ratingId}>
              <button
                className="rating-button"
                type="button"
                onClick={() => onRatingButton(each.ratingId)}
              >
                <img
                  src={each.imageUrl}
                  className="rating-image"
                  alt={`rating ${each.ratingId}`}
                />
              </button>
              <p className="p-text">& up</p>
            </li>
          ))}
      </>
      <div>
        <button className="filter-button" type="button" onClick={onClearButton}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
