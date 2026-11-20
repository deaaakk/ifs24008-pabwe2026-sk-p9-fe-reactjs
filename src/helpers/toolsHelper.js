import Swal from 'sweetalert2'

export const alertSuccess = (text) => Swal.fire({ icon: 'success', title: 'Berhasil', text, timer: 1800, showConfirmButton: false })

export const alertError = (text) => Swal.fire({ icon: 'error', title: 'Gagal', text })

export async function confirmDialog(text) {
  const r = await Swal.fire({ icon: 'warning', title: 'Konfirmasi', text, showCancelButton: true, confirmButtonText: 'Ya', cancelButtonText: 'Batal' })
  return r.isConfirmed
}

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
