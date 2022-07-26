import axios from "axios";
// https://service.onbakul.gallery-umkm.id/
// http://192.168.34.204/onbakul-server/
const DevelopmentServerUrl = 'http://192.168.78.95/onbakul-server/'

export default {
  ServerUrl: DevelopmentServerUrl,
  FakeImageUrl: 'https://source.unsplash.com/100x100/?nature',
  Months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  Colors: {
    Black: '#000',
    White: '#fff',
    SecondaryWhite: '#f2f4f8',
    ThirtyWhite: '#e3e9f5',
    MainColor: '#5354d7',
    SecondaryColor: '#453cce',
    ModalBackground: 'rgba(100, 100, 100, 0.3)',
    Success: '#00b813',
    SuccessBg: '#19ff3040',
    Warning: 'red',
    WarningBg: 'rgba(255, 0, 0, 0.1)'
  },
  methods: ['Tunai', 'GoPay', 'Ovo', 'ShoppePay'],
  CallAPIPost: (url, data, cb) => {
    return fetch(DevelopmentServerUrl+url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (res.ok) {
        return res.json()
      } else {
        cb(false, 'Gagal Post Data');
      }
    }).then(data => {
      cb(data.response_code === 200, data.result.message)
      return data
    }).catch(err => {
      cb(false, err)
      console.log(err);
    })
  },
  CallAPIDelete: (query, cb) => {
    axios.delete(DevelopmentServerUrl+query)
    .then(res => {
      cb(res.data.response_code === 200, res.data.result.message)
      // console.log(res.data)
    }).catch(err => {
      cb(false, err)
      console.log(err)
    })
  },
  getDay: date => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[new Date(date).getDay()]
  },
  dateToInaFormat: date => {
    const split = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    return split[2]+' '+months[parseInt(split[1]) - 1]+' '+split[0]
  },
  formatRupiah: (bilangan, prefix = true) => {
    let number_string = bilangan.toString()
    let copyIntoArray = [...number_string]

    if (bilangan < 0) copyIntoArray.shift()

    let sisa 	= copyIntoArray.length % 3
    let rupiah 	= copyIntoArray.join('').substr(0, sisa)
    let ribuan 	= copyIntoArray.join('').substr(sisa).match(/\d{3}/g)

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.')
    }

    return prefix ? 'Rp'+ (bilangan < 0 ? '-'+rupiah : rupiah) : (bilangan < 0 ? '-'+rupiah : rupiah)
  }
}