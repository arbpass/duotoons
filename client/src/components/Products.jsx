import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart, newCart, cartDone } from "../redux/action";
import jwt_decode from "jwt-decode";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;
  let email = localStorage.getItem('_token') ? jwt_decode(localStorage.getItem('_token'))['email'] : "";

  const dispatch = useDispatch();
  const stateCartDone = useSelector((stateCartDone) => stateCartDone.handleRender);

  const addProduct = (product) => {
    dispatch(addCart(product))
  }

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("getProducts/" + email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => response.json());

      if (componentMounted) {
        email ? setData(await response['allProducts']) : setData(await response);
        email ? setFilter(await response['allProducts']) : setFilter(await response);
        setLoading(false);
      }

      if (email && !stateCartDone) {
        response['allCart']['productId'].forEach(ele1 => {
          response['allProducts'].forEach(ele2 => {
            if (ele1 == ele2._id) dispatch(newCart(ele2));
          });
        });
        dispatch(cartDone());
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);


  function handleHide(id) {
    if (document.getElementById('editMode' + id).style.display === 'none') {
      document.getElementById(id).style.display = 'none';
      document.getElementById('editMode' + id).style.display = 'block';
    }
    else {
      document.getElementById(id).style.display = 'block';
      document.getElementById('editMode' + id).style.display = 'none';
    }
  }

  const onUpdate = (e) => {
    const token = localStorage.getItem('_token');
    const response = fetch("http://localhost:4000/updateProduct", {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify({
        productId: e.target[0].value,
        product: e.target[1].value,
        description: e.target[2].value,
        price: e.target[3].value,
        size: e.target[4].value,
        color: e.target[5].value,
        image: e.target[6].value,
        category: e.target[7].value,
        stock: e.target[8].value
      })
    }).then((response) => response.json());
    // e.preventDefault();
    handleHide(e.target[0].value);
  }

  const onDelete = (id) => {
    if (confirm("Are you sure!") == true) {
      const token = localStorage.getItem('_token');
      const response = fetch("http://localhost:4000/deleteProduct", {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token },
        body: JSON.stringify({ productId: id })
      }).then((response) => response.json());
    }
    window.location.href = '/';
  }

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  }
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(data)}>All</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>Men's Clothing</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>
            Women's Clothing
          </button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>Jewelery</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>Electronics</button>
        </div>

        {filter.map((product) => {
          return (
            <>
              <div id={product._id} key={product._id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                <div className="card text-center h-100" key={product._id}>
                  <img
                    className="card-img-top p-3"
                    src={product.image}
                    alt="Card"
                    height={400}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.product.substring(0, 12)}...
                    </h5>
                    <p className="card-text">
                      {product.description.substring(0, 90)}...
                    </p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">₹{product.price}</li>
                    {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                  </ul>
                  <div className="card-body" hidden={email === 'admin@gmail.com' ? true : false}>
                    <Link to={"/product/" + product._id} className="btn btn-dark m-1">
                      Buy Now
                    </Link>
                    <button className="btn btn-dark m-1" onClick={() => addProduct(product)} disabled={email ? false : true}>
                      Add to Cart
                    </button>
                  </div>

                  <div className="card-body" hidden={email === 'admin@gmail.com' ? false : true}>
                    <button className="btn btn-outline-primary m-1" onClick={() => handleHide(product._id)}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger m-1" onClick={() => onDelete(product._id)} >
                      Delete
                    </button>
                  </div>
                </div>
              </div>


              <form className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" id={"editMode" + product._id} style={{ display: 'none' }}
                onSubmit={(e) => onUpdate(e)}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={200}
                />
                <input name="productId" type="text" className="form-control mb-1" value={product._id} hidden />
                <input name="product" type="text" className="form-control mb-1" defaultValue={product.product} />
                <input name="description" type="text" className="form-control mb-1" defaultValue={product.description} />
                <input name="price" type="text" className="form-control mb-1" defaultValue={product.price} />
                <input name="size" type="text" className="form-control mb-1" defaultValue={product.size} />
                <input name="color" type="text" className="form-control mb-1" defaultValue={product.color} />
                <input name="image" type="text" className="form-control mb-1" defaultValue={product.image} />
                <input name="category" type="text" className="form-control mb-1" defaultValue={product.category} />
                <input name="stock" type="text" className="form-control mb-1" defaultValue={product.stock.toString()} />
                <button type="submit" className="btn btn-outline-primary mr-2">Update</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => handleHide(product._id)}>Close</button>
              </form>


            </>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
