// src/sweetalertTheme.js
// Importa esto en cualquier archivo que necesite alertas
import Swal from 'sweetalert2';

// Toast pequeño en esquina superior derecha
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: '#171717',
  color: '#ffffff',
  iconColor: '#ef4444',
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// Alerta centrada para confirmaciones importantes
export const Alert = Swal.mixin({
  background: '#171717',
  color: '#ffffff',
  iconColor: '#ef4444',
  confirmButtonColor: '#b91c1c',
  cancelButtonColor: '#404040',
  customClass: {
    popup: 'swal-pricedrop',
    confirmButton: 'swal-btn-confirm',
    cancelButton: 'swal-btn-cancel',
  },
});
