import React, { Component } from "react";
import "./App.css";
import loader from "./loader.gif";
import { Button } from "reactstrap";
import Pagination from "./components/Pagination";
import { data } from './the_object.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      input: "",
      currentPage: null,
      itemsPerPage: 9,
      filteredCoins: []
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.sortByName = this.sortByName.bind(this);
    this.sortByPrice = this.sortByPrice.bind(this);
    this.sortByRank = this.sortByRank.bind(this);
    this.itemsFilter = this.itemsFilter.bind(this);
  }
  componentDidMount() {
    this.setState.loading = true;
    this.setState({
      loading: false,
      items: data,
      filteredCoins: data
    });
  }


  // Searching
  onChangeHandler(e) {
    this.setState({
      input: e.target.value,
      filteredCoins: this.itemsFilter(e.target.value),
      currentPage: 0
    });
    let myInput = this.state.input;
    this.itemsFilter(myInput);
  }
  // Filtering the new Items list
  itemsFilter(input) {
    return input
      ? this.state.items.filter(item =>
        item.name.toLowerCase().includes(input.toLowerCase())
      )
      : this.state.items;
  }
  // Sorting
  sortByName(gallery) {
    this.setState({
      items: gallery.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
    });
  }
  sortByPrice(gallery) {
    this.setState({
      items: gallery.sort(function (a, b) {
        return a.price_btc - b.price_btc;
      })
    });
  }
  sortByRank(gallery) {
    this.setState({
      items: gallery.sort(function (a, b) {
        return a.rank - b.rank;
      })
    });
  }
  // Pagination
  // Previous Page
  showPreviousPage = () => {
    const { currentPage } = this.state;
    if (currentPage >= 1) {
      this.setState(() => ({
        // limit the page number to no less than 0
        currentPage: currentPage - 1
      }));
    }
  };

  // Next Page
  showNextPage = () => {
    const { currentPage, itemsPerPage } = this.state;
    let numberOfPages;
    numberOfPages = Math.floor(this.state.items.length / itemsPerPage);
    if (currentPage <= numberOfPages) {
      this.setState(() => ({
        // limit the page number to no greater than 2
        currentPage: currentPage + 1
      }));
    }
  };

  render() {
    let filteredCoins = this.state.filteredCoins;
    let { input, items, currentPage, itemsPerPage } = this.state;

    let numberOfPages;
    numberOfPages =
      input !== ""
        ? Math.floor(filteredCoins.length / itemsPerPage)
        : Math.floor(items.length / itemsPerPage);

    // Start Page
    const firstItemIndex = currentPage * itemsPerPage;

    // Items displayed per Page
    const visibleItems =
      input !== "" && items.length !== 0
        ? filteredCoins.slice(firstItemIndex, firstItemIndex + itemsPerPage)
        : input !== "" && items.length === 0
          ? []
          : items.slice(firstItemIndex, firstItemIndex + itemsPerPage);

    return (
      <div className="App">
        <h1 className="title">Cryptocurrency Coins Visualizing Application</h1>
        <div className="my-search">
          {/* Search */}
          <input
            value={this.state.input}
            placeholder="Search..."
            className="my-input"
            type="text"
            onChange={this.onChangeHandler}
          />
        </div>
        {/* Counter */}
        <div className="coin-counter"> {filteredCoins.length} Coins</div>
        {/* Sorting */}
        <div className="sort">
          <div className="sort-box">
            <Button
              className="sort-by-name"
              onClick={() => this.sortByName(filteredCoins)}
            >
              Sort By Name
            </Button>
            <Button
              className="sort-by-price"
              onClick={() => this.sortByPrice(filteredCoins)}
            >
              Sort By Price
            </Button>
            <Button
              className="sort-by-rank"
              onClick={() => this.sortByRank(filteredCoins)}
            >
              Sort By Rank
            </Button>
          </div>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          showPreviousPage={this.showPreviousPage}
          showNextPage={this.showNextPage}
        />
        {this.state.loading && (
          <div className="loader">
            <img src={loader} alt="" />
          </div>
        )}
        <div className="my-gallery">
          {visibleItems.map(item => (
            <div className="my-coin-card" key={item.id}>
              <h4>{item.name}</h4>
              <p>Price: {item.price_usd}</p>
              <p>Rank: {item.rank}</p>
              <p>Change: {item.percent_change_24h}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
