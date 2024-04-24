// import React, { useState } from 'react';
// import { Button } from 'react-bootstrap';
// import Vnpay from 'vnpay-sdk';

// const PaymentPage = () => {
//     const [paymentUrl, setPaymentUrl] = useState('');

//     const handlePayment = async () => {
//         const vnpay = new Vnpay({
//             paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
//             merchant: 'Z1FMHL2N', // Thay YOUR_MERCHANT_ID bằng mã Merchant ID của bạn
//             accessCode: 'YOUR_ACCESS_KEY', // Thay YOUR_ACCESS_KEY bằng Access Key của bạn
//             secretKey: 'RGCDUCNFWHKGAWEFDUMTYUELCTJGNKHH',
//         });

//         const paymentData = {
//             amount: 10000, // Số tiền thanh toán (đơn vị là VNĐ)
//             orderInfo: 'Thanh toán đơn hàng',
//             returnUrl: 'YOUR_RETURN_URL', // URL để xử lý phản hồi từ VNPAY
//             ipAddr: '127.0.0.1', // Địa chỉ IP của người dùng
//         };

//         try {
//             const paymentResponse = await vnpay.createPayment(paymentData);
//             setPaymentUrl(paymentResponse.paymentUrl);
//         } catch (error) {
//             console.error('Lỗi khi tạo thanh toán:', error);
//         }
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault(); // Ngăn chặn hành vi mặc định của form

//         const postData = new FormData(event.target);
//         const submitUrl = event.target.action;

//         try {
//             const response = await fetch(submitUrl, {
//                 method: 'POST',
//                 body: postData,
//             });
//             const result = await response.json();

//             if (result.code === '00') {
//                 if (window.vnpay) {
//                     vnpay.open({ width: 768, height: 600, url: result.data });
//                 } else {
//                     window.location = result.data;
//                 }
//             } else {
//                 alert("Lỗi:" + result.Message);
//             }
//         } catch (error) {
//             console.error('Lỗi khi gửi dữ liệu:', error);
//         }
//     };

//     return (
//         <div style={{ fontSize: '0.9rem' }}>
//             <div className="container">
//                 {/* Navbar code */}
//                 <h3>Tạo mới đơn hàng</h3>
//                 <div className="table-responsive">
//                     <form onSubmit={handleSubmit} action="/tryitnow/Home/CreateOrder" id="frmCreateOrder" method="post">
//                         {/* Form inputs */}
//                         <button type="submit" className="btn btn-default">Thanh toán Redirect</button>
//                         <input name="__RequestVerificationToken" type="hidden" value="L7nfdfBpzdkeb7tHwUiSvNQ4ZDY6O2lRQ_X_NU2leQC5Vt3tF4CVrgHfk5eoucHU-Y2x_WjHsSfRFv0dZAII96dR7PyOa49CihaUgUv1F4E1" />
//                     </form>
//                 </div>
//                 <p>&nbsp;</p>
//                 <footer className="footer">
//                     <p>&copy; VNPAY 2024</p>
//                 </footer>
//             </div>
//             <link href="https://pay.vnpay.vn/lib/vnpay/vnpay.css" rel="stylesheet" />
//             <script src="https://pay.vnpay.vn/lib/vnpay/vnpay.js"></script>
//         </div>
//     );
// };

// export default PaymentPage;
