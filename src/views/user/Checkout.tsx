import React, { useState, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Define TypeScript interfaces for the state and props
interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: string;
    ratings?: number;
    quantity: number;
}

const Order: React.FC = () => {
    const location = useLocation();
    const item = location.state?.item as CartItem;

    if (!item) {
        return <div>No item details available.</div>;
    }

    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false); // success state will be used
    const navigate = useNavigate();

    const handlePlaceOrder = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('userId') || '';

        if (!address) {
            alert("Please provide a delivery address.");
            return;
        }

        if (!name || !address || !mobile) {
            alert("Please fill in all required fields.");
            return;
        }

        const orderData = {
            name,
            address,
            mobile,
            totalAmount: Number(item.price),
            userId,
            items: item.name,
        };

        console.log(orderData);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/place-order`, orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Order placed successfully");
            alert('Order added successfully!');

            const inventoryUpdateData = {
                quantity: -1,
            };

            await axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/update-inventory/${item._id}`, inventoryUpdateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Inventory updated successfully");

            localStorage.removeItem("cart");

            setSuccess(true); // Set success to true when order is placed
            setTimeout(() => {
                setSuccess(false);
                navigate("/"); // Redirect after the success message is shown
            }, 3000);

        } catch (error) {
            console.error("Error placing order:", error);
            alert("There was an error placing your order. Please try again.");
        }
    };

    return (
        <div className="py-6 px-4 md:px-6 2xl:px-20 2xl:container mx-auto max-w-screen-xl">
            <div className="mt-10 flex w-full flex-col xl:flex-row justify-center items-stretch xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="grid md:flex mx-auto md:flex-row justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="grid w-full">
                        <div className="flex flex-col justify-start items-start px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full bg-grey-light rounded-2xl drop-shadow-md mx-auto">
                            <p className="text-lg md:text-xl dark:text-black font-semibold leading-6 xl:leading-5 text-black">Customer’s Cart</p>
                            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="pb-4 md:pb-8 w-20 md:w-40">
                                    <img className="w-96 hidden md:block" src={`/images/${item.image}`} alt={item.name} />
                                    <img className="w-96 md:hidden" src={item.image} alt={item.name} />
                                </div>
                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                                        <h3 className="text-md dark:text-black xl:text-md font-semibold leading-6 text-black">{item.name}</h3>
                                    </div>
                                    <div className="flex justify-between space-x-8 items-start w-full">
                                        <p className="text-base dark:text-black xl:text-lg font-semibold leading-6 text-gray-800">${Number(item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 md:p-6 xl:p-8 w-full py-4 bg-grey-light rounded-2xl drop-shadow-md space-y-2">
                            <h2 className="text-lg font-medium mb-4">Delivery Information</h2>
                            <div className="flex flex-col mb-4">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="123 Main St, Cityville, ST, 12345"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="123-456-7890"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid w-2/3">
                        <div className="flex flex-col px-4 md:p-6 xl:p-8 w-full mt-10 py-4 bg-gray-100 rounded-2xl drop-shadow-md space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium">Total Amount</h2>
                                <p className="text-lg font-semibold">${Number(item.price).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Place Order
                            </button>
                            {success && (
                                <p className="text-green-600 mt-4">Order placed successfully!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;