import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../services/api";
import { Country, State, City } from "country-state-city";
import { useCart } from "../hooks/useCart";
import notify from "../components/ui/notify";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

function Checkout() {

    const {
        cart,
        cartTotal,
        clearCart,
    } = useCart();

    const [form, setForm] = useState({
        shippingAddress: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
        },
        customerNote: "",
    });

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const countries = Country.getAllCountries();
    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
    const cities = selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const countryName = Country.getCountryByCode(countryCode)?.name || "";

        setSelectedCountry(countryCode);
        setSelectedState("");
        setSelectedCity("");

        setForm((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                country: countryName,
                state: "",
                city: "",
            },
        }));
    }

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        const stateName = State.getStateByCodeAndCountry(stateCode, selectedCountry)?.name || "";

        setSelectedState(stateCode);
        setSelectedCity("");

        setForm((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                state: stateName,
                city: "",
            },
        }));
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;

        setSelectedCity(cityName);

        setForm((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                city: cityName,
            },
        }));
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                [name]: value,
            },
        }));
    };

    const handleCustomerNoteChange = (e) => {
        setForm((prev) => ({
            ...prev,
            customerNote: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${BASE_URL}/orders/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await response.json(); 

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || "Unable to place your order."
                );
            }

            notify.success("Order created successfully!");
            clearCart();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <header
                className="flex flex-col items-center justify-center bg-cover bg-center h-80"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <img src={logo} alt="Logo" />

                <h2 className="text-3xl sm:text-5xl font-medium -translate-y-2">
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
                    <form onSubmit={handleSubmit}>
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
                            <label htmlFor="country">Country / Region</label>

                            <select id="country"
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                required>
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="state">State</label>

                            <select id="state"
                                value={selectedState}
                                onChange={handleStateChange}
                                disabled={!selectedCountry || states.length === 0}
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                required>
                                <option value="">
                                    {!selectedCountry ? "Select a country first" : states.length === 0 ? "No states available" : "Select a state"}
                                </option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="townCity">Town / City</label>

                            <select id="townCity"
                                value={selectedCity}
                                onChange={handleCityChange}
                                disabled={!selectedState || cities.length === 0}
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                required>
                                <option value="">Select a city</option>
                                {cities.map((city, index) => (
                                    <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label htmlFor="streetAddress">Street Address</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text"
                                id="streetAddress"
                                name="street"
                                value={form.shippingAddress.street}
                                onChange={handleInputChange} />
                        </div>

                        <div>
                            <label htmlFor="zipCode">Zip Code</label>
                            <input
                                className="border border-secondary-text p-3 w-full my-4 rounded"
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={form.shippingAddress.zipCode}
                                onChange={handleInputChange} required />
                        </div>

                        <div>
                            <input
                                className="border border-secondary-text p-3 w-full mt-4 rounded"
                                type="text"
                                name="customerNote"
                                value={form.customerNote}
                                onChange={handleCustomerNoteChange}
                                placeholder="Additional information" />
                        </div>

                        <button type="submit" className="border p-2 mt-3 rounded cursor-pointer">Checkout</button>

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