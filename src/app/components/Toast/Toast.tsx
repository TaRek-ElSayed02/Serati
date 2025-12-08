'use client';
import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// أنواع الرسائل
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// خصائص المكون
interface ToastProps {
  position?: ToastOptions['position'];
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: 'light' | 'dark' | 'colored';
}

const Toast: React.FC<ToastProps> = ({
  position = "top-right",
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  rtl = true,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = "colored"
}) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
    />
  );
};

// دالة لعرض الرسائل من أي مكون
export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: Partial<ToastOptions>
) => {
  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    rtl: true,
    ...options
  };

  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warn(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

// دالة للتحقق من الحقول وإظهار التوست عند الخطأ
export const validateFormWithToast = (
  fields: Record<string, string>,
  fieldNames: Record<string, string> = {}
): boolean => {
  const missingFields: string[] = [];

  // التحقق من كل حقل
  Object.entries(fields).forEach(([key, value]) => {
    if (!value.trim()) {
      const fieldName = fieldNames[key] || key;
      missingFields.push(fieldName);
    }
  });

  // إذا كان هناك حقول مفقودة
  if (missingFields.length > 0) {
    const message = `الرجاء ملء الحقول التالية : ${missingFields.join('، ')}`;
    showToast(message, 'error', {
      autoClose: 6000
    });
    return false;
  }

  return true;
};

export default Toast;