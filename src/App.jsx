import { useState, useEffect } from "react";
import "bootstrap/scss/bootstrap.scss";

const data = [
  {
    id: 1,
    name: "珍珠奶茶",
    description: "香濃奶茶搭配QQ珍珠",
    price: 50,
  },
  {
    id: 2,
    name: "冬瓜檸檬",
    description: "清新冬瓜配上新鮮檸檬",
    price: 45,
  },
  {
    id: 3,
    name: "翡翠檸檬",
    description: "綠茶與檸檬的完美結合",
    price: 55,
  },
  {
    id: 4,
    name: "四季春茶",
    description: "香醇四季春茶，回甘無比",
    price: 45,
  },
  {
    id: 5,
    name: "阿薩姆奶茶",
    description: "阿薩姆紅茶搭配香醇鮮奶",
    price: 50,
  },
  {
    id: 6,
    name: "檸檬冰茶",
    description: "檸檬與冰茶的清新組合",
    price: 45,
  },
  {
    id: 7,
    name: "芒果綠茶",
    description: "芒果與綠茶的獨特風味",
    price: 55,
  },
  {
    id: 8,
    name: "抹茶拿鐵",
    description: "抹茶與鮮奶的絕配",
    price: 60,
  },
];

function App() {
  // 建立飲料訂單
  const [drinks] = useState(data);
  // 加入購物車
  const [cart, setCart] = useState([]);
  // 購物車總計function，搭配useEffect當cart變動時即執行
  const [sum, setSum] = useState(0);

  const [description, setDescription] = useState("");
  const [order, setOrder] = useState({});

  const addToCart = (drink) => {
    setCart([
      // 購物車原有內容
      ...cart,
      {
        ...drink,
        id: new Date().getTime(),
        quantity: 1,
        subtotal: drink.price,
      },
    ]);
  };

  // 購物車更改數量功能，當購物車數量更新時使用，更新該品項的『數量＆小計』
  const updateCart = (item, value) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: parseInt(value),
          subtotal: cartItem.price * parseInt(value),
        };
      }
      return cartItem;
    });
    // 套用newCart參數至setCart function更新購物車資料
    setCart(newCart);
  };

  // 送出訂單功能（購物車有品項時使用）
  const createOrder = () => {
    setOrder({
      id: new Date().getTime(),
      cart,
      description,
      sum,
    });
    setCart([]);
    setDescription("");
  };

  //購物車品項總價更新功能
  useEffect(() => {
    const total = cart.reduce((acc, cur) => {
      // sum會參考各項subtotal數值，得出總計
      return acc + cur.subtotal;
    }, 0);
    setSum(total);
  }, [cart]);

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="list-group">
              {drinks.map((drink) => {
                return (
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                    key={drink.id}
                    onClick={(e) => {
                      e.preventDefault();
                      // 增設加入購物車功能，點擊anchor tag即加入購物車
                      addToCart(drink);
                    }}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{drink.name}</h5>
                      <small>${drink.price}</small>
                    </div>
                    <p className="mb-1">{drink.description}</p>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="col-md-8">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" width="70">
                    操作
                  </th>
                  <th scope="col">品項</th>
                  <th scope="col">描述</th>
                  <th scope="col">數量</th>
                  <th scope="col">單價</th>
                  <th scope="col">小計</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            const newCart = cart.filter((cartItem) => {
                              return cartItem.id !== item.id;
                            });
                            setCart(newCart);
                          }}
                        >
                          x
                        </button>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>
                        <select
                          className="form-select"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            updateCart(item, value);
                          }}
                        >
                          {
                            // 建立一個1~10的
                            [...Array(10).keys()].map((item) => {
                              return (
                                <option value={item + 1} key={item}>
                                  {item + 1}
                                </option>
                              );
                            })
                          }
                        </select>
                      </td>
                      <td>{item.price}</td>
                      <td>{item.subtotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {
              //當購物車(cart)有選取物件時，表格顯示所選品項，需有『送出』購物車功能
              cart.length === 0 ? (
                <div className="alert alert-primary text-center" role="alert">
                  請選擇商品
                </div>
              ) : (
                <>
                  <div className="text-end mb-3">
                    <h5>
                      總計：<span>${sum}</span>
                    </h5>
                  </div>
                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    placeholder="備註"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  ></textarea>
                  <div className="text-end">
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        // 建立訂單功能
                        createOrder();
                      }}
                    >
                      送出
                    </button>
                  </div>
                </>
              )
            }
          </div>
        </div>
        <hr />
        <div className="row justify-content-center">
          <div className="col-8">
            {!order.id ? (
              <div className="alert-secondary text-center" role="alert">
                尚未建立訂單
              </div>
            ) : (
              <div className="card">
                <div className="card-title">
                  <h5>訂單</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">品項</th>
                        <th scope="col">數量</th>
                        <th scope="col">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.cart.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.subtotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="text-end">
                    備註： <span>{order.description}</span>
                  </div>
                  <div className="text-end">
                    <h5>
                      總計：<span> {order.sum}</span>
                    </h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
