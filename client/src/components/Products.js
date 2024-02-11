  // name: "Bulgogi Beef Dish",
  // description: "Rib-eye beef 600 grams",
  // price: 1699 
  // quantity: 1

import {Helmet} from "react-helmet";

let Products = (props) => {

	let renderProducts=()=>(
        props.thisProducts.map((prod,idx)=>{
            let thisPrice = parseFloat(prod.price * .01).toFixed(2);
            return(
                <div key={idx} className="product">
                    <div className="top">
                        <img src={prod.image[0]} />
                        <div className="productTitle" ><b>{prod.name}</b></div>
                        <p style={{ fontSize: '14px'}}><b>{thisPrice}€</b></p>
                        <p className="description" >{prod.description}</p>
                        <p>Quantity: {prod.quantity}</p>
                        {/*<p key={idx}>Idx: {idx}</p>*/}
                    </div>
                    <div className="bottom">
                        <button onClick={() => props.AddToCart({idx})}>Add to cart</button>	
                    </div>
                </div>
            )
        })
    )
	
    return (
	<>

    <Helmet>
      <title>Amazing delivery app</title>
      <meta charSet="utf-8" />
      <meta name="description" content="Example delivery application with stripe checkout" />
      <meta name='keywords' content='stripe checkout, example payment implementation'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
    </Helmet>

    <h1>Dishes</h1>
	
    <div className="productGrid">
	{renderProducts()}
	</div>
	
    </>)
}

export default Products