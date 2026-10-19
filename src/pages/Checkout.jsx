import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

function Checkout() {

    const {
        cart,
        cartTotal,
    } = useCart();

    return (
        <>
            <header
                className="flex flex-col items-center justify-center bg-cover bg-center h-80"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <img src={logo} alt="Logo" />

                <h2 className="text-5xl font-medium -translate-y-2">
                    Checkout
                </h2>

                <p>
                    <Link to="/" className="font-medium">
                        Home
                    </Link>{" "}
                    ❯ Checkout
                </p>
            </header>

            <main className="flex flex-col-reverse sm:flex-row gap-15 p-8 md:p-25">
                <aside className="flex-1">
                    <form>
                        <h2 className="text-4xl font-medium mb-5">Billing details</h2>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label htmlFor="firstName">
                                    First Name
                                </label>

                                <input
                                    className="border border-secondary-text p-3 w-full my-4 rounded"
                                    type="text"
                                    required
                                    name="firstName"
                                    id="firstName"
                                />
                            </div>

                            <div className="flex-1">
                                <label htmlFor="lastName">
                                    Last Name
                                </label>

                                <input
                                    className="border border-secondary-text p-3 w-full my-4 rounded"
                                    type="text"
                                    required
                                    name="lastName"
                                    id="lastName"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="companyName">Company Name (Optional)</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="companyName" />
                        </div>

                        <div>
                            <label htmlFor="countryRegion">Country / Region</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="countryRegion" />
                        </div>

                        <div>
                            <label htmlFor="streetAddress">Street Address</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="streetAddress" />
                        </div>

                        <div>
                            <label htmlFor="townCity">Town / City</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="townCity" />
                        </div>

                        <div>
                            <label htmlFor="province">Province</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="province" />
                        </div>

                        <div>
                            <label htmlFor="zipCode">Zip Code</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="zipCode" />
                        </div>

                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="number" id="phone" />
                        </div>

                        <div>
                            <label htmlFor="emailAddress">Email Address</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text" id="emailAddress" />
                        </div>

                        <div>
                            <input
                                className="border border-secondary-text p-3 w-full mt-4 rounded"
                                type="text" placeholder="Additional information" />
                        </div>

                    </form>
                </aside>

                <aside className="flex-1 pl-8">
                    <div>
                        {cart.length === 0 ? (
                            <p className="mt-10 text-center">
                                Nothing to checkout
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="text-2xl font-semibold text-left py-3">Product</th>
                                            <th className="text-2xl font-semibold text-left py-3">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.items.map((item) => (
                                        <tr key={item.cartItemId}>
                                            <td className="text-secondary-text">{item.productName} x {item.quantity}</td>
                                            <td className="text-center">${Number((item.quantity * item.unitPrice)).toFixed(2)}</td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <td className="text-xl py-3">Total</td>
                                            <td className="text-2xl text-primary-text font-medium">${cartTotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </>
    )
}

export default Checkout;