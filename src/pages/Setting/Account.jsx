import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Account() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = () => {
    // Show the confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    console.log("Account can not delete");
    toast.error("Account can not delete");
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-xl text-gray-900">Danger zone</p>
        <small>
          This will permanently delete your entire account. All your forms,
          submissions and workspaces will be deleted.{" "}
          <span className="text-red-500"> This cannot be undone. </span>
        </small>
      </div>
      <div className="flex mt-4">
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={handleDeleteAccount}
          className="flex items-center justify-center p-2 rounded-xl hover-bg-blue-700 cursor-pointer bg-red-600 hover:bg-red-700"
        >
          <p className="text-xl text-white">Delete Account</p>
        </motion.div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <p className="text-red-500 text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer mr-2"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
