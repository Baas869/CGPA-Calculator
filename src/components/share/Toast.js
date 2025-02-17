import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize toast settings globally
export const showToast = (msg, type = "info") => {
  toast[type](msg, {
    position: "top-center",
    autoClose: 3000,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,


    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // theme: "colored",
  });
};
