import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';

// import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, setCart ,removeProduct, updateProductAmount } = useCart();

  // const cartFormatted = cart.map(product => ({
  //   // TODO
  // }))
  // const total =
  //   formatPrice(
  //     cart.reduce((sumTotal, product) => {
  //       // TODO
  //     }, 0)
  //   )

  async function handleProductIncrement(product: Product) {
    const updatedCart = [...cart];

    const incrementingProduct = updatedCart.find(cartItem => cartItem.id === product.id);

    const stock = await api.get(`/stock/${product.id}`);

    const stockAmount = stock.data.amount;
    const currentAmount = incrementingProduct ? incrementingProduct.amount : 0;
    const amount = currentAmount + 1;

    if(amount > stockAmount) {
      toast.error('Quantidade solicitada fora de estoque')
      return;
    }

    if(incrementingProduct) {
      incrementingProduct.amount = amount;
    }

    setCart(updatedCart);
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
  }

  function handleProductDecrement(product: Product) {
    const updatedCart = [...cart];

    const decrementingProduct = updatedCart.find(cartItem => cartItem.id === product.id);

    const currentAmount = decrementingProduct ? decrementingProduct.amount : 0;
    const amount = currentAmount - 1;

    if(decrementingProduct) {
      decrementingProduct.amount = amount
    }

    setCart(updatedCart);
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))

  }

  function handleRemoveProduct(productId: number) {
    const updatedCart = [...cart];

    const newCart: any = updatedCart.map(cartItem => {
      if(cartItem.id !== productId) {
        return cartItem
      }
    })

    setCart(newCart);
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map(cartItem => (
            <tr key={cartItem.id} data-testid="product">
              <td>
                <img src={cartItem.image} alt="Tênis de Caminhada Leve Confortável" />
              </td>
              <td>
                <strong>{cartItem.title}</strong>
                <span>{formatPrice(cartItem.price)}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                  disabled={cartItem.amount <= 1}
                  onClick={() => handleProductDecrement(cartItem)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={cartItem.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(cartItem)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>R$ 359,80</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                // onClick={() => handleRemoveProduct(product.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>R$ 359,80</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
