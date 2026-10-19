import { Link } from "react-router-dom";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faClock,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";

function Contact() {
  return (
    <>
      <header
        className="flex flex-col items-center justify-center bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={logo} alt="Logo" />
        <h2 className="text-5xl font-medium -translate-y-2">Contact</h2>
        <p>
          <Link to="/" className="font-medium">
            Home
          </Link>{" "}
          ❯ Contact
        </p>
      </header>

      <div>
        <main className="text-center mx-auto my-15 w-[80%] sm:w-[40%]">
          <h2 className="font-medium text-4xl mb-4">Get In Touch With Us</h2>
          <p className="text-secondary-text">
            For More Information About Our Product And Services. Please Feel
            Free To Drop Us An Email. Our Staff Will Always Be There To Help You
            Out. Do Not Hesitate!
          </p>
        </main>

        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-20 my-15">
          <aside className="flex flex-col gap-10">
            <div>
              <h2 className="flex gap-4 items-center text-2xl font-medium mb-2">
                {" "}
                <FontAwesomeIcon className="text-xl" icon={faLocation} />{" "}
                Address
              </h2>
              <p>
                236 5th SE Avenue,
                <br /> New York NY10000,
                <br /> United States
              </p>
            </div>
            <div>
              <h2 className="flex gap-4 items-center text-2xl font-medium mb-2">
                {" "}
                <FontAwesomeIcon className="text-xl" icon={faPhone} /> Phone
              </h2>
              <p>Mobile: +(84) 546-6789</p>
              <p>Hotline: +(84) 546-6789</p>
            </div>
            <div>
              <h2 className="flex gap-4 items-center text-2xl font-medium mb-2">
                {" "}
                <FontAwesomeIcon className="text-xl" icon={faClock} /> Working
                Time
              </h2>
              <p>Monday - Friday: 09:00 - 22:00</p>
              <p>Saturday - Sunday: 09:00 - 21:00</p>
            </div>
          </aside>

          <aside>
            <form action="" className="flex flex-col gap-3">
              <label htmlFor="name">Your Name</label>
              <input
                className="border border-secondary-text p-3 w-75 sm:w-100 mb-5 rounded"
                type="text" required
                name="name"
                id="name"
                placeholder="abc"
              />

              <label htmlFor="email">Email address</label>
              <input
                className="border border-secondary-text p-3 w-75 sm:w-100 mb-5 rounded"
                type="email" required
                name="email"
                id="email"
                placeholder="abc@def.com"
              />

              <label htmlFor="subject">Subject</label>
              <input
                className="border border-secondary-text p-3 w-75 sm:w-100 mb-5 rounded"
                type="text"
                name="subject"
                id="sunject"
                placeholder="This is optional"
              />

              <label htmlFor="message">Message</label>
              <textarea
                className="border border-secondary-text p-3 w-75 sm:w-100 mb-5 rounded"
                name="message" required
                id="messaage"
                placeholder="Hi! I'd like to ask about..."
              ></textarea>

              <button className="border rounded-md p-3 w-50" type="submit">
                Submit
              </button>
            </form>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Contact;
