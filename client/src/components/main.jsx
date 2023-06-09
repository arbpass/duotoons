import React from "react";
import jwt_decode from "jwt-decode";

const Home = () => {
  let email = localStorage.getItem('_token') ? jwt_decode(localStorage.getItem('_token'))['email'] : "";
  
  const onAdd = (e) => {
    const token = localStorage.getItem('_token');
    const response = fetch("http://localhost:4000/addProduct", {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify({
        product: e.target[0].value,
        description: e.target[1].value,
        price: e.target[2].value,
        size: e.target[3].value,
        color: e.target[4].value,
        image: e.target[5].value,
        category: e.target[6].value,
        stock: e.target[7].value
      })
    }).then((response) => response.json());
    // e.preventDefault();
  }


  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-white border-0 mx-3">
          <img
            className="card-img img-fluid"
            src="./assets/main.png.jpg"
            alt="Card"
            height={500}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div className="container">
              <h5 className="card-title fs-1 text fw-lighter">New Season Arrivals</h5>
              <p className="card-text fs-5 d-none d-sm-block ">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </p>
              <button type="button" class="btn btn-light" data-toggle="modal" data-target="#exampleModal" hidden={email === 'admin@gmail.com' ? false : true}>Add product</button>
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={(e)=> onAdd(e)}>
              <div class="modal-body">
                <input name="product" type="text" className="form-control mb-1" placeholder="Product name" />
                <input name="description" type="text" className="form-control mb-1" placeholder="Description" />
                <input name="price" type="text" className="form-control mb-1" placeholder="Price" />
                <input name="size" type="text" className="form-control mb-1" placeholder="Size" />
                <input name="color" type="text" className="form-control mb-1" placeholder="Color" />
                <input name="image" type="text" className="form-control mb-1" placeholder="Image" />
                <select name="category" class="form-select mb-1" aria-label="Default select example">
                  <option selected>Category</option>
                  <option value="men's clothing">men's clothing</option>
                  <option value="women's clothing">women's clothing</option>
                </select>
                <select name="stock" class="form-select mb-1" aria-label="Default select example">
                  <option selected>Stock</option>
                  <option value="true">Available</option>
                  <option value="false">Out of stock</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-outline-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </>
  );
};

export default Home;
