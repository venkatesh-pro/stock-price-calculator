import { AutoComplete, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const StockMarketCalculator = () => {
  const [stocks, setStocks] = useState([{ quantity: 1, total: 0 }]);
  const [options, setOptions] = useState([]);
  const [overAllTotal, setOverAllTotal] = useState([]);

  const handleQuantityChange = (index, event) => {
    const newStocks = [...stocks];
    newStocks[index].quantity = event.target.value;
    setStocks(newStocks);

    // calculate total
    if (newStocks[index].price) calculateTotal(index);
  };

  const handleAddRow = () => {
    setStocks([...stocks, { quantity: 1, total: 0 }]);
  };

  const calculateTotal = (index) => {
    const newStocks = [...stocks];
    const quantity = parseInt(newStocks[index].quantity);
    // const price = parseInt(newStocks[index].price);

    let price = 0;
    if (String(newStocks[index].price).includes(",")) {
      price = parseFloat(newStocks[index].price.replace(/,/g, ""));
    } else {
      price = parseFloat(newStocks[index].price);
    }

    const total = quantity * price;
    newStocks[index].total = total;

    setStocks(newStocks);
  };

  const searchResult = async (value) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/getStockListByTyping",
      {
        companyName: value,
      }
    );

    // console.log(data);
    const val = data.map((d) => ({ value: d.name, link: d.url }));
    // console.log(val);
    setOptions(val);
  };
  const fetchThePriceByNameFunction = async (value, option, index) => {
    // console.log(option);
    const { data } = await axios.post(
      "http://localhost:5000/api/getStockListByTypingPrice",
      {
        url: option.link,
      }
    );

    const newStocks = [...stocks];
    newStocks[index].price = data;
    setStocks(newStocks);

    // calculate total
    if (newStocks[index].price) calculateTotal(index);
  };

  useEffect(() => {
    const total = stocks.reduce((acc, stock) => acc + stock.total, 0);
    setOverAllTotal(total);
  }, [stocks]);
  return (
    <div className="  w-screen justify-center flex flex-col items-center h-screen mt-10">
      <div className=" relative shadow overflow-scroll border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Name
              </th>
              <th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Of The Stock
              </th>
              <th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AutoComplete
                    style={{
                      width: 200,
                    }}
                    options={options}
                    placeholder="Enter The Company Name"
                    onSearch={searchResult}
                    onSelect={(value, option) => {
                      fetchThePriceByNameFunction(value, option, index);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Input
                    type="number"
                    value={stock.quantity}
                    onChange={(e) => handleQuantityChange(index, e)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Input
                    type="text"
                    placeholder="Stock Price"
                    value={stock.price}
                    disabled
                  />
                </td>
                <td>
                  <p>{stock.total}</p>
                </td>
                <td
                  className="cursor-pointer "
                  onClick={() => {
                    const newStocks = [...stocks];

                    const filteredArray = newStocks.filter(
                      (item, i) => i != index
                    );
                    setStocks(filteredArray);
                  }}
                >
                  <p>X</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">Total: {overAllTotal > 0 ? overAllTotal : "2"}</p>
      <div className="mt-10 mb-10">
        <button
          className="border-2 pl-2 pr-2 rounded-full text-3xl"
          onClick={handleAddRow}
        >
          +
        </button>
      </div>
      {/* <pre>{JSON.stringify(stocks, null, 4)}</pre> */}
    </div>
  );
};

export default StockMarketCalculator;
