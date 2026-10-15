import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { CircleUser, LogOut } from "lucide-react";

const ProfileButton = () => {
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) {
        return (
            <Link to="/account"
                  className="flex items-center gap-1">
                <CircleUser />!
            </Link>
        );
    }

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}><CircleUser /></button>

            {isModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 bg-black/40"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 w-full max-w-sm bg-white p-6 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                My Profile
                            </h2>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-4xl text-gray-500 cursor-pointer hover:text-black"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">
                                    {user.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">
                                    {user.phone}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                logout();
                                setIsModalOpen(false);
                            }}
                            className="mt-6 flex gap-2 border border-red-500 rounded-md px-4 py-2 transition cursor-pointer hover:bg-red-300/20"
                        >
                            <LogOut />Logout
                        </button>
                    </div>
                </div>
            , document.body
            )}

        </>
    )
}

export default ProfileButton;