import React, { Component } from 'react';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class TopNavbarCategories extends Component {
  state = {
    categories: [],
  };

  async componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories() {
    fetch(base + '/api/getTopNavbarCategory', {
      method: 'GET',
    })
      .then(res => {
        return res.json();
      })
      .then(categories => {
        this.setState({
          categories: categories.data,
        });
        return false;
      });
  }

  redenderCategories(categories) {
    return categories.map(el => (
      <div className="p-2" key={el.id}>
        <a className="headerCat" href={'/productList/' + el.id}>
          {el.category_name}
        </a>
      </div>
    ));
  }

  render() {
    return (
      <div
        className="medium-6 columns d-flex justify-content-between"
        style={{ float: 'left' }}
      >
        {this.redenderCategories(this.state.categories)}
      </div>
    );
  }
}

export default TopNavbarCategories;
