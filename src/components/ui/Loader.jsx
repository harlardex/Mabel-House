import logo from "../../assets/logo.png"

const Loader = ({message}) => {
  return (
    <>
            <div className=" fixed flex flex-col bg-white gap-5 items-center justify-center z-50 h-full w-full">
                <div className="flex flex-col justify-center items-center">
                    <img src={logo} alt="Logo" className="animate-pulse translate-y-5"/>
                    <h3 className="text-4xl font-medium">Mabel House</h3>
                </div>
                <p>{message}</p>
            </div>
    </>
  )
}

export default Loader;